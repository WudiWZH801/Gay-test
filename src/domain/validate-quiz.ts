import { TYPE_IDS, type Quiz } from './types.ts';

/** Editorial/build-time checks for the fixed ten-question scoring contract. */
export function validateQuiz(quiz: Quiz): string[] {
  const errors: string[] = [];
  const ids = quiz.types.map(t => t.id);
  const unique = (values: string[]) => new Set(values).size === values.length;
  if (!quiz.id || !Number.isInteger(quiz.version) || quiz.version < 1) errors.push('Invalid quiz identity');
  if (ids.length !== 8 || !unique(ids) || TYPE_IDS.some(id => !ids.includes(id))) errors.push('Expected eight unique known types');
  if (quiz.questions.length !== 10 || !unique(quiz.questions.map(q => q.id))) errors.push('Expected ten unique questions');
  for (const type of quiz.types) {
    if ([type.name, type.icon, type.tagline, type.description, type.relationship].some(t => !t.trim())) errors.push(`Incomplete text: ${type.id}`);
    if (!type.strengths.length || !type.pitfalls.length || [...type.strengths, ...type.pitfalls].some(t => !t.trim())) errors.push(`Incomplete traits: ${type.id}`);
    if (!type.matches.length || !unique(type.matches.map(m => m.typeId)) || type.matches.some(m => !ids.includes(m.typeId) || m.typeId === type.id || !m.reason.trim())) errors.push(`Invalid matches: ${type.id}`);
  }
  for (const question of quiz.questions) {
    const options = question.options;
    if (!question.id.trim() || !question.text.trim() || options.length !== 4 || !unique(options.map(o => o.id))) errors.push(`Invalid question: ${question.id}`);
    const coverage = options.flatMap(o => [o.primary, o.secondary]);
    if (coverage.length !== 8 || !unique(coverage) || coverage.some(id => !ids.includes(id))) errors.push(`Unequal question coverage: ${question.id}`);
    if (options.some(o => !o.id.trim() || !o.text.trim() || o.primary === o.secondary)) errors.push(`Invalid option: ${question.id}`);
  }
  const options = quiz.questions.flatMap(q => q.options);
  for (const id of ids) {
    if (options.filter(o => o.primary === id).length !== 5 || options.filter(o => o.secondary === id).length !== 5) errors.push(`Unequal scoring budget: ${id}`);
  }
  return errors;
}
