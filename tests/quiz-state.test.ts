import { describe, expect, it } from 'vitest';
import { quiz } from '../src/data/quiz.ts';
import { initialState, transition, type QuizState } from '../src/domain/quiz-state.ts';
import { scoreQuiz } from '../src/domain/scoring.ts';

const start = () => transition(quiz, initialState(), { type: 'start' });
const select = (state: QuizState, option = 0) => transition(quiz, state, { type: 'select', optionId: quiz.questions[state.cursor]!.options[option]!.id });

describe('quiz navigation', () => {
  it('requires an answer and bounds previous/invalid actions', () => {
    const state = start();
    expect(state.screen).toBe('question');
    expect(transition(quiz, state, { type: 'next' })).toEqual(state);
    expect(transition(quiz, state, { type: 'previous' })).toEqual(state);
    expect(transition(quiz, state, { type: 'select', optionId: 'missing' })).toEqual(state);
    expect(transition(quiz, initialState(), { type: 'next' })).toEqual(initialState());
  });

  it('preserves selections when going back and replaces an edited answer without accumulating scores', () => {
    const selected = select(start());
    const second = transition(quiz, selected, { type: 'next' });
    const previous = transition(quiz, second, { type: 'previous' });
    expect(previous.answers[quiz.questions[0]!.id]).toBe(quiz.questions[0]!.options[0]!.id);
    const changed = select(previous, 1);
    expect(changed.answers[quiz.questions[0]!.id]).toBe(quiz.questions[0]!.options[1]!.id);
    expect(selected.answers[quiz.questions[0]!.id]).toBe(quiz.questions[0]!.options[0]!.id);
    let state = transition(quiz, changed, { type: 'next' });
    while (state.screen !== 'result') state = transition(quiz, select(state), { type: 'next' });
    expect(state.answers[quiz.questions[0]!.id]).toBe(quiz.questions[0]!.options[1]!.id);
    expect(scoreQuiz(quiz, state.answers).total).toBe(30);
  });

  it('finishes once and resets every answer for a new attempt', () => {
    let state = start();
    for (let i = 0; i < quiz.questions.length; i++) state = transition(quiz, select(state), { type: 'next' });
    expect(state.screen).toBe('result');
    expect(transition(quiz, state, { type: 'next' })).toEqual(state);
    expect(transition(quiz, state, { type: 'previous' })).toEqual(state);
    expect(transition(quiz, state, { type: 'reset' })).toEqual(initialState());
    expect(transition(quiz, state, { type: 'start' }).answers).toEqual({});
  });
});
