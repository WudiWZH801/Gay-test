import { expect, it } from 'vitest';
import { quiz } from '../src/data/quiz.ts';
import { analyzeDistribution } from '../scripts/distribution.ts';
import { scoreQuiz } from '../src/domain/scoring.ts';

it('keeps every archetype reachable and avoids a built-in dominant result across all answers', () => {
  const report = analyzeDistribution(quiz);
  expect(report.combinations).toBe(1_048_576);
  expect(report.maxMinRatio).toBeLessThanOrEqual(2);
  expect(report.types).toHaveLength(8);
  expect(report.types.reduce((sum, t) => sum + t.expectedShare, 0)).toBeCloseTo(1, 8);
  for (const type of report.types) {
    expect(type.maximumScore).toBe(15);
    expect(type.soleWins).toBeGreaterThan(0);
    expect(scoreQuiz(quiz, type.exampleAnswers!).leaders).toEqual([type.id]);
  }
  expect(scoreQuiz(quiz, report.tiedExample!).leaders.length).toBeGreaterThan(1);
  expect(scoreQuiz(quiz, report.mostTiedAnswers!).leaders).toHaveLength(report.maxTiedTypes);
  expect(report.maxTiedTypes).toBeGreaterThanOrEqual(2);
});
