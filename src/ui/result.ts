import type { Archetype, Quiz, QuizResult } from '../domain/types.ts';
import { button, el, progress, title } from './dom.ts';

function portrait(quiz: Quiz, type: Archetype, composite: boolean): HTMLElement {
  const card = el('article', 'portrait');
  const head = el('div', 'portrait-head');
  const icon = el('span', 'portrait-icon', type.icon);
  icon.setAttribute('aria-hidden', 'true');
  const titles = el('div');
  if (composite) titles.append(el('h2', '', type.name));
  titles.append(el('p', 'tagline', type.tagline));
  head.append(icon, titles);
  card.append(head);
  const sections = el('div', 'portrait-sections');
  for (const [label, content] of [['角色解读', type.description], ['相处时的你', type.relationship]]) {
    const section = el('section', 'portrait-section');
    section.append(el('h3', '', label), el('p', '', content));
    sections.append(section);
  }
  card.append(sections);
  for (const [label, traits, className] of [['闪光点', type.strengths, 'positive'], ['留意一下', type.pitfalls, 'gentle']] as const) {
    const block = el('section', 'trait-section');
    block.append(el('h3', '', label));
    const list = el('ul', 'trait-list');
    for (const trait of traits) list.append(el('li', `trait ${className}`, trait));
    block.append(list);
    card.append(block);
  }
  const matches = el('section', 'match-section');
  matches.append(el('h3', '', '互动搭配彩蛋'));
  for (const match of type.matches) {
    const other = quiz.types.find(t => t.id === match.typeId)!;
    const row = el('p', 'match-row');
    row.append(el('strong', '', `${other.icon} ${other.name}`), el('span', '', match.reason));
    matches.append(row);
  }
  card.append(matches);
  return card;
}

export function resultView(quiz: Quiz, result: QuizResult, restart: () => void): HTMLElement {
  const screen = el('section', 'screen result-screen');
  const composite = result.leaders.length > 1;
  const leaders = result.leaders.map(id => quiz.types.find(t => t.id === id)!);
  screen.append(el('p', 'eyebrow', '你的角色画像已解锁'), title(composite ? '你的复合型角色' : leaders[0]!.name));
  screen.append(el('p', 'result-intro', composite ? '有些特质，不必分出高下。以下角色在这次选择中并列，都是你的一部分。' : '这是你在这次选择里更突出的相处风格。换一个场景，也许还有不一样的你。'));
  if (composite) {
    const tags = el('div', 'leader-tags');
    for (const type of leaders) tags.append(el('span', 'type-chip', `${type.icon} ${type.name}`));
    screen.append(tags);
  }
  screen.append(progress(quiz.questions.length, quiz.questions.length));
  for (const type of leaders) screen.append(portrait(quiz, type, composite));
  const rules = el('details', 'rules');
  rules.append(el('summary', '', '这份结果是怎么来的？'));
  rules.append(el('p', '', '每个选项给一个主要角色 2 分、一个次要角色 1 分。各角色的得分机会相同；最高分并列时，所有并列角色一起展示。相同版本、相同答案，结果始终一致。'));
  rules.append(el('p', '', '下面是本次游戏偏好得分，每类最高可得 15 分；它不是性取向概率或专业测量结果。'));
  const scores = el('ul', 'score-list');
  for (const entry of result.ranking) {
    const type = quiz.types.find(t => t.id === entry.typeId)!;
    const row = el('li', 'score-row');
    row.append(el('span', '', type.name), el('strong', '', `${entry.score} 分`));
    const track = el('span', 'score-track');
    const fill = el('span', 'score-fill');
    fill.style.width = `${entry.score / 15 * 100}%`;
    track.setAttribute('aria-hidden', 'true');
    track.append(fill);
    row.append(track);
    scores.append(row);
  }
  rules.append(scores);
  screen.append(rules, button('重新测试', restart), el('p', 'disclaimer', '纯属娱乐。角色和互动搭配均为虚构，不代表对真实关系的判断。'));
  return screen;
}
