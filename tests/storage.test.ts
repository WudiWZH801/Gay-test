import { describe, expect, it } from 'vitest';
import { quiz } from '../src/data/quiz.ts';
import { initialState, transition } from '../src/domain/quiz-state.ts';
import { clearProgress, readProgress, saveProgress, STORAGE_KEY, type StoragePort } from '../src/storage.ts';

function memory(): StoragePort {
  const values = new Map<string, string>();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); }, removeItem: key => { values.delete(key); } };
}
const selected = () => transition(quiz, transition(quiz, initialState(), { type: 'start' }), { type: 'select', optionId: quiz.questions[0]!.options[0]!.id });

describe('tab progress storage', () => {
  it('round trips selected progress and clears it on reset', () => {
    const storage = memory();
    const state = selected();
    expect(saveProgress(quiz, state, storage)).toBe(true);
    expect(readProgress(quiz, storage)).toEqual({ state, status: 'ready' });
    expect(clearProgress(storage)).toBe(true);
    expect(readProgress(quiz, storage)).toEqual({ state: null, status: 'empty' });
  });

  it('rejects malformed, stale or inconsistent history without restoring partial unsafe state', () => {
    const storage = memory();
    saveProgress(quiz, selected(), storage);
    const good = JSON.parse(storage.getItem(STORAGE_KEY)!);
    const badValues = [
      '{broken',
      JSON.stringify({ ...good, quizVersion: 0 }),
      JSON.stringify({ ...good, schemaVersion: 999 }),
      JSON.stringify({ ...good, state: { ...good.state, cursor: 2 } }),
      JSON.stringify({ ...good, state: { ...good.state, cursor: -1 } }),
      JSON.stringify({ ...good, state: { ...good.state, cursor: 100 } }),
      JSON.stringify({ ...good, state: { ...good.state, answers: { unknown: 'x' } } }),
      JSON.stringify({ ...good, state: { ...good.state, screen: 'result' } }),
      JSON.stringify({ ...good, state: { ...good.state, answers: [] } }),
    ];
    for (const raw of badValues) {
      storage.setItem(STORAGE_KEY, raw);
      expect(readProgress(quiz, storage)).toEqual({ state: null, status: 'invalid' });
      expect(storage.getItem(STORAGE_KEY)).toBeNull();
    }
  });

  it('allows earlier answers to be edited while preserving a valid later history', () => {
    const storage = memory();
    let state = selected();
    state = transition(quiz, state, { type: 'next' });
    state = transition(quiz, state, { type: 'select', optionId: quiz.questions[1]!.options[1]!.id });
    state = transition(quiz, state, { type: 'previous' });
    saveProgress(quiz, state, storage);
    expect(readProgress(quiz, storage).state).toEqual(state);
  });

  it('does not throw when browser storage is unavailable', () => {
    const fail = () => { throw new Error('Storage disabled'); };
    const storage: StoragePort = { getItem: fail, setItem: fail, removeItem: fail };
    expect(readProgress(quiz, storage)).toEqual({ state: null, status: 'unavailable' });
    expect(saveProgress(quiz, selected(), storage)).toBe(false);
    expect(clearProgress(storage)).toBe(false);
  });
});
