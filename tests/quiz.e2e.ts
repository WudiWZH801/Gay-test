import { test, expect, type Page } from '@playwright/test';
import { quiz } from '../src/data/quiz.ts';
import { analyzeDistribution } from '../scripts/distribution.ts';
import { scoreQuiz } from '../src/domain/scoring.ts';
import { STORAGE_KEY } from '../src/storage.ts';
import type { Answers } from '../src/domain/types.ts';

const allFirst = Object.fromEntries(quiz.questions.map(q => [q.id, q.options[0]!.id]));
const distribution = analyzeDistribution(quiz);

async function finish(page: Page, answers: Answers = allFirst) {
  for (const question of quiz.questions) {
    const option = question.options.find(o => o.id === answers[question.id])!;
    await page.getByRole('radio', { name: option.text, exact: true }).check();
    await page.getByRole('button', { name: question === quiz.questions.at(-1) ? '查看结果' : '下一题', exact: true }).click();
  }
}

test('complete, revise before finishing and restart with a clean attempt', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await page.getByRole('button', { name: '开始测试', exact: true }).click();
  await expect(page.getByRole('button', { name: '下一题', exact: true })).toBeDisabled();
  await page.getByRole('radio').nth(0).check();
  await page.getByRole('button', { name: '下一题', exact: true }).click();
  await page.getByRole('button', { name: '上一题', exact: true }).click();
  await expect(page.getByRole('radio').nth(0)).toBeChecked();
  const changed = { ...allFirst, [quiz.questions[0]!.id]: quiz.questions[0]!.options[1]!.id };
  await finish(page, changed);
  for (const id of scoreQuiz(quiz, changed).leaders) await expect(page.getByRole('heading', { name: quiz.types.find(t => t.id === id)!.name, exact: true })).toBeVisible();
  await expect(page.getByRole('heading').first()).toBeFocused();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '10');
  await page.getByRole('button', { name: '重新测试', exact: true }).click();
  await page.getByRole('button', { name: '开始测试', exact: true }).click();
  await expect(page.locator('input[type="radio"]:checked')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '下一题', exact: true })).toBeDisabled();
  expect(errors).toEqual([]);
});

test('refresh offers a continuation, restores the choice, and allows a clean start', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: '开始测试', exact: true }).click();
  await page.getByRole('radio').nth(2).check();
  await page.getByRole('button', { name: '下一题', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: '继续上次测试', exact: true }).click();
  await expect(page.getByRole('heading', { name: quiz.questions[1]!.text, exact: true })).toBeFocused();
  await page.getByRole('button', { name: '上一题', exact: true }).click();
  await expect(page.getByRole('radio').nth(2)).toBeChecked();
  await page.reload();
  await page.getByRole('button', { name: '重新开始', exact: true }).click();
  await expect(page.getByRole('radio').nth(2)).not.toBeChecked();
});

test('invalid progress recovers with a readable notice', async ({ page }) => {
  await page.addInitScript(key => sessionStorage.setItem(key, '{invalid'), STORAGE_KEY);
  await page.goto('./');
  await expect(page.getByRole('status')).toContainText('进度已失效');
  await page.getByRole('button', { name: '开始测试', exact: true }).click();
  await expect(page.getByRole('radio')).toHaveCount(4);
});

test('blocked storage does not prevent completing the quiz', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } }); });
  await page.goto('./');
  await page.getByRole('button', { name: '开始测试', exact: true }).click();
  await finish(page);
  await expect(page.getByRole('button', { name: '重新测试', exact: true })).toBeVisible();
});

test('all tied leaders survive refresh and result rendering', async ({ page }) => {
  const answers = distribution.tiedExample!;
  await page.goto('./');
  await page.getByRole('button', { name: '开始测试', exact: true }).click();
  await finish(page, answers);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('你的复合型角色');
  for (const id of scoreQuiz(quiz, answers).leaders) await expect(page.getByRole('heading', { name: quiz.types.find(t => t.id === id)!.name, exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: '查看上次结果', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('你的复合型角色');
});

test('native keyboard selection and focus work without a mouse', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: '开始测试', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await expect(page.getByRole('radio').nth(0)).toBeChecked();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio').nth(1)).toBeChecked();
  await expect(page.getByRole('radio').nth(1)).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: '下一题', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: quiz.questions[1]!.text, exact: true })).toBeFocused();
});

for (const width of [320, 390, 768, 1280]) {
  test(`welcome, questions and longest result fit at ${width}px with reduced motion`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    const noOverflow = async () => expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await noOverflow();
    await page.screenshot({ path: `test-results/welcome-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: '开始测试', exact: true }).click();
    await noOverflow();
    const animation = await page.locator('.screen').evaluate(element => getComputedStyle(element).animationDuration);
    const transition = await page.locator('.progress-fill').evaluate(element => getComputedStyle(element).transitionDuration);
    expect(animation).toBe('0s');
    expect(transition).toBe('0s');
    await finish(page, distribution.mostTiedAnswers!);
    await expect(page.locator('.portrait')).toHaveCount(distribution.maxTiedTypes);
    await noOverflow();
    await page.screenshot({ path: `test-results/result-${width}.png`, fullPage: true });
  });
}
