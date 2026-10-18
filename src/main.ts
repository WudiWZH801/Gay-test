import './styles.css';
import { quiz } from './data/quiz.ts';
import { initialState, transition, type QuizAction } from './domain/quiz-state.ts';
import { scoreQuiz } from './domain/scoring.ts';
import { validateQuiz } from './domain/validate-quiz.ts';
import { readProgress, saveProgress, type StoragePort } from './storage.ts';
import { welcomeView } from './ui/welcome.ts';
import { questionView, updateQuestionSelection } from './ui/question.ts';
import { resultView } from './ui/result.ts';
import { el, title } from './ui/dom.ts';

const root = document.querySelector<HTMLElement>('#app')!;
const notice = document.querySelector<HTMLElement>('#storage-notice')!;
const errors = validateQuiz(quiz);

if (errors.length) {
  root.replaceChildren(title('暂时无法开始测试'), el('p', '', '题目暂时没有准备好，请稍后刷新再试。'));
  console.error('Quiz validation failed', errors);
} else {
  let storage: StoragePort | null = null;
  try { storage = window.sessionStorage; } catch { /* Storage can be blocked without disabling the quiz. */ }
  const restored = storage ? readProgress(quiz, storage) : { state: null, status: 'unavailable' as const };
  let saved = restored.state;
  let state = initialState();
  if (restored.status === 'invalid') notice.textContent = '之前的进度已失效，已经清理，可以重新开始。';
  if (restored.status === 'unavailable') notice.textContent = '当前浏览器无法保存进度，你仍可正常完成测试。';

  function render(focus = true): void {
    const screen = state.screen === 'welcome'
      ? welcomeView(quiz, saved, () => dispatch({ type: 'start' }), () => {
        if (saved) { state = saved; saved = null; render(); }
      })
      : state.screen === 'question'
        ? questionView(quiz, state, dispatch)
        : resultView(quiz, scoreQuiz(quiz, state.answers), () => dispatch({ type: 'reset' }));
    root.replaceChildren(screen);
    if (focus) {
      root.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  function dispatch(action: QuizAction): void {
    const next = transition(quiz, state, action);
    if (next === state) return;
    state = next;
    saved = null;
    if (storage && !saveProgress(quiz, state, storage)) notice.textContent = '进度暂时无法保存，你仍可继续完成测试。';
    if (action.type === 'select') updateQuestionSelection(root, quiz, state);
    else render();
  }

  render(false);
}
