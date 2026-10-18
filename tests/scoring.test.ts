import { describe, expect, it } from 'vitest';
import { scoreQuiz } from '../src/domain/scoring.ts';
import { quiz } from '../src/data/quiz.ts';

const firstAnswers = () => Object.fromEntries(quiz.questions.map(q => [q.id, q.options[0]!.id]));

describe('scoring', () => {
  it('calculates each type from the chosen options with a fixed 2+1 budget', () => {
    const answers = firstAnswers();
    const result = scoreQuiz(quiz, answers);
    const expected = Object.fromEntries(quiz.types.map(t => [t.id, 0]));
    for (const q of quiz.questions) {
      expected[q.options[0]!.primary]! += 2;
      expected[q.options[0]!.secondary]! += 1;
    }
    expect(result.scores).toEqual(expected);
    expect(Object.values(result.scores).reduce((a, b) => a + b, 0)).toBe(30);
    expect(result.leaders).toEqual(quiz.types.filter(t => expected[t.id] === Math.max(...Object.values(expected))).map(t => t.id));
  });

  it('returns every tied leader in a stable order rather than drawing a winner', () => {
    const fixture = {
      ...quiz,
      questions: [
        { id: 'one', text: 'one', options: [{ id: 'a', text: 'a', primary: 'queen', secondary: 'puppy' }] },
        { id: 'two', text: 'two', options: [{ id: 'b', text: 'b', primary: 'puppy', secondary: 'queen' }] },
      ],
    } as typeof quiz;
    const result = scoreQuiz(fixture, { one: 'a', two: 'b' });
    expect(result.leaders).toEqual(['queen', 'puppy']);
    for (let i = 0; i < 20; i++) expect(scoreQuiz(fixture, { one: 'a', two: 'b' })).toEqual(result);
  });

  it('rejects incomplete answers, invalid option IDs and extra question IDs', () => {
    expect(() => scoreQuiz(quiz, {})).toThrow();
    expect(() => scoreQuiz(quiz, { ...firstAnswers(), [quiz.questions[0]!.id]: 'missing' })).toThrow();
    expect(() => scoreQuiz(quiz, { ...firstAnswers(), unknown: 'extra' })).toThrow();
  });
});
