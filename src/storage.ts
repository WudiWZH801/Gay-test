import type { Quiz } from './domain/types.ts';
import type { QuizState } from './domain/quiz-state.ts';
export const STORAGE_KEY = 'gay-test:progress';
export interface StoragePort { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }
export interface ProgressRead { state: QuizState | null; status: 'ready' | 'empty' | 'invalid' | 'unavailable' }
const SCHEMA_VERSION = 1;
const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

function parseState(quiz: Quiz, raw: unknown): QuizState | null {
  if (!object(raw) || raw.schemaVersion !== SCHEMA_VERSION || raw.quizId !== quiz.id || raw.quizVersion !== quiz.version || !object(raw.state)) return null;
  const { screen, cursor, answers } = raw.state;
  if ((screen !== 'question' && screen !== 'result') || !Number.isInteger(cursor) || typeof cursor !== 'number' || cursor < 0 || cursor >= quiz.questions.length || !object(answers)) return null;
  const entries = Object.entries(answers);
  if (entries.some(([id, answer]) => typeof answer !== 'string' || !quiz.questions.some(q => q.id === id && q.options.some(o => o.id === answer)))) return null;
  let prefix = 0;
  while (prefix < quiz.questions.length && Object.hasOwn(answers, quiz.questions[prefix]!.id)) prefix++;
  // Valid history is a contiguous prefix, even after navigating back to edit.
  if (entries.length !== prefix || cursor > prefix) return null;
  if (screen === 'result' && (prefix !== quiz.questions.length || cursor !== quiz.questions.length - 1)) return null;
  return { screen, cursor, answers: Object.fromEntries(entries) as Record<string, string> };
}

export function readProgress(quiz: Quiz, storage: StoragePort): ProgressRead {
  let raw: string | null;
  try { raw = storage.getItem(STORAGE_KEY); }
  catch { return { state: null, status: 'unavailable' }; }
  if (raw === null) return { state: null, status: 'empty' };
  try {
    const state = parseState(quiz, JSON.parse(raw));
    if (state) return { state, status: 'ready' };
  } catch { /* Invalid JSON follows the same recovery path as old data. */ }
  clearProgress(storage);
  return { state: null, status: 'invalid' };
}

export function saveProgress(quiz: Quiz, state: QuizState, storage: StoragePort): boolean {
  if (state.screen === 'welcome') return clearProgress(storage);
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: SCHEMA_VERSION, quizId: quiz.id, quizVersion: quiz.version, state }));
    return true;
  } catch { return false; }
}

export function clearProgress(storage: StoragePort): boolean {
  try { storage.removeItem(STORAGE_KEY); return true; }
  catch { return false; }
}
