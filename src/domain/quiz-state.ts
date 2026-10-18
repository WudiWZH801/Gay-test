import type { Answers, Quiz } from './types.ts';
export interface QuizState { screen: 'welcome' | 'question' | 'result'; cursor: number; answers: Answers }
export type QuizAction = { type: 'start' | 'reset' | 'previous' | 'next' } | { type: 'select'; optionId: string };
export function initialState(): QuizState { return { screen: 'welcome', cursor: 0, answers: {} }; }
export function transition(quiz: Quiz, state: QuizState, action: QuizAction): QuizState {
  if (action.type === 'reset') return initialState();
  if (action.type === 'start') return { ...initialState(), screen: 'question' };
  if (state.screen !== 'question') return state;
  const question = quiz.questions[state.cursor];
  if (!question) return state;
  if (action.type === 'select') {
    if (!question.options.some(o => o.id === action.optionId)) return state;
    return { ...state, answers: { ...state.answers, [question.id]: action.optionId } };
  }
  if (action.type === 'previous') return state.cursor > 0 ? { ...state, cursor: state.cursor - 1 } : state;
  if (!question.options.some(o => o.id === state.answers[question.id])) return state;
  if (state.cursor < quiz.questions.length - 1) return { ...state, cursor: state.cursor + 1 };
  if (!quiz.questions.every(q => q.options.some(o => o.id === state.answers[q.id]))) return state;
  return { ...state, screen: 'result' };
}
