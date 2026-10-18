import type { Quiz } from '../domain/types.ts';
import type { QuizAction, QuizState } from '../domain/quiz-state.ts';
import { button, el, progress, title } from './dom.ts';

export function questionView(quiz: Quiz, state: QuizState, dispatch: (action: QuizAction) => void): HTMLElement {
  const question = quiz.questions[state.cursor]!;
  const screen = el('section', 'screen question-screen');
  const top = el('div', 'question-top');
  top.append(el('p', 'eyebrow', '凭第一反应，选最像你的那个'), el('span', 'question-count', `${state.cursor + 1} / ${quiz.questions.length}`));
  screen.append(top, progress(Object.keys(state.answers).length, quiz.questions.length));
  const group = el('fieldset', 'question-group');
  const legend = el('legend');
  legend.append(title(question.text));
  group.append(legend);
  const options = el('div', 'options');
  question.options.forEach((option, index) => {
    const label = el('label', 'option');
    const input = el('input');
    input.type = 'radio';
    input.name = question.id;
    input.value = option.id;
    input.checked = state.answers[question.id] === option.id;
    input.addEventListener('change', () => dispatch({ type: 'select', optionId: option.id }));
    const letter = el('span', 'option-letter', 'ABCD'[index]);
    letter.setAttribute('aria-hidden', 'true');
    label.append(input, letter, el('span', 'option-text', option.text));
    options.append(label);
  });
  group.append(options);
  screen.append(group);
  const footer = el('div', 'question-footer');
  const previous = button('上一题', () => dispatch({ type: 'previous' }), 'button button-secondary');
  previous.disabled = state.cursor === 0;
  const next = button(state.cursor === quiz.questions.length - 1 ? '查看结果' : '下一题', () => dispatch({ type: 'next' }));
  next.id = 'next-question';
  next.disabled = !state.answers[question.id];
  footer.append(previous, next);
  screen.append(footer, el('p', 'question-hint', '没有标准答案，选你更自然会做的事。'));
  return screen;
}

/** Keep the native radio group mounted so selection preserves keyboard focus. */
export function updateQuestionSelection(root: HTMLElement, quiz: Quiz, state: QuizState): void {
  const count = Object.keys(state.answers).length;
  const bar = root.querySelector<HTMLElement>('[role="progressbar"]')!;
  bar.setAttribute('aria-valuenow', String(count));
  root.querySelector<HTMLElement>('.progress-fill')!.style.width = `${count / quiz.questions.length * 100}%`;
  root.querySelector<HTMLButtonElement>('#next-question')!.disabled = !state.answers[quiz.questions[state.cursor]!.id];
}
