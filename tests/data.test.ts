import { describe, expect, it } from 'vitest';
import { quiz } from '../src/data/quiz.ts';
import { validateQuiz } from '../src/domain/validate-quiz.ts';

describe('quiz content contract', () => {
  it('contains ten questions, eight complete archetypes and equal scoring opportunities', () => {
    expect(validateQuiz(quiz)).toEqual([]);
    expect(quiz.questions).toHaveLength(10);
    expect(quiz.types).toHaveLength(8);
    for (const type of quiz.types) {
      expect(quiz.questions.flatMap(q => q.options).filter(o => o.primary === type.id)).toHaveLength(5);
      expect(quiz.questions.flatMap(q => q.options).filter(o => o.secondary === type.id)).toHaveLength(5);
    }
  });

  it('rejects duplicate IDs, unknown references, self-pairing and empty result text', () => {
    for (const mutate of [
      (q: typeof quiz) => { q.questions[1]!.id = q.questions[0]!.id; },
      (q: typeof quiz) => { q.questions[0]!.options[0]!.secondary = 'missing' as never; },
      (q: typeof quiz) => { q.questions[0]!.options[0]!.secondary = q.questions[0]!.options[0]!.primary; },
      (q: typeof quiz) => { q.types[0]!.description = ''; },
    ]) {
      const copy = structuredClone(quiz);
      mutate(copy);
      expect(validateQuiz(copy).length).toBeGreaterThan(0);
    }
  });
});
