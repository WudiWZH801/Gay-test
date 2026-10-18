import type { Quiz } from '../domain/types.ts';
import type { QuizState } from '../domain/quiz-state.ts';
import { button, el, title } from './dom.ts';

export function welcomeView(quiz: Quiz, saved: QuizState | null, start: () => void, resume: () => void): HTMLElement {
  const screen = el('section', 'screen welcome');
  screen.append(el('p', 'eyebrow', '一场关于相处方式的小脑洞'));
  const rainbow = el('div', 'hero-icon', '🌈');
  rainbow.setAttribute('aria-hidden', 'true');
  screen.append(rainbow, title('假如你是 Gay'), el('p', 'hero-subtitle', '你会是哪种相处主角？'));
  screen.append(el('p', 'intro', '跟着第一反应，选出最像你的日常。十个小场景，拼出你的专属角色画像。'));
  const facts = el('div', 'facts');
  for (const [number, label] of [[String(quiz.questions.length), '道小题'], [String(quiz.types.length), '种角色'], ['2', '分钟左右']]) {
    const fact = el('div', 'fact');
    fact.append(el('strong', '', number), el('span', '', label));
    facts.append(fact);
  }
  screen.append(facts);
  const actions = el('div', 'welcome-actions');
  if (saved) {
    actions.append(el('p', 'resume-note', saved.screen === 'result' ? '上次的角色画像还在，随时可以再看看。' : `找到你的上次进度 · 已选择 ${Object.keys(saved.answers).length} / ${quiz.questions.length} 题`));
    actions.append(button(saved.screen === 'result' ? '查看上次结果' : '继续上次测试', resume), button('重新开始', start, 'button button-quiet'));
  } else actions.append(button('开始测试', start));
  screen.append(actions);
  screen.append(el('p', 'disclaimer', '纯属娱乐，不用于判断性取向或专业心理评估。'));
  const preview = el('div', 'type-preview');
  preview.setAttribute('aria-label', '你可能遇到的角色');
  for (const type of quiz.types) preview.append(el('span', 'type-chip', `${type.icon} ${type.name}`));
  screen.append(preview);
  return screen;
}
