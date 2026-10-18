import type { Answers, Quiz, QuizResult, TypeId } from './types.ts';

export function scoreQuiz(quiz: Quiz, answers: Answers): QuizResult {
  if (!quiz.questions.length || Object.keys(answers).length !== quiz.questions.length) {
    throw new Error('A complete answer set is required');
  }
  const scores = Object.fromEntries(quiz.types.map(t => [t.id, 0])) as Record<TypeId, number>;
  for (const question of quiz.questions) {
    const option = Object.hasOwn(answers, question.id)
      ? question.options.find(o => o.id === answers[question.id])
      : undefined;
    if (!option || !Object.hasOwn(scores, option.primary) || !Object.hasOwn(scores, option.secondary)) {
      throw new Error(`Invalid answer for ${question.id}`);
    }
    scores[option.primary] += 2;
    scores[option.secondary] += 1;
  }
  const ranking = quiz.types.map(t => ({ typeId: t.id, score: scores[t.id] }))
    .sort((a, b) => b.score - a.score);
  const top = ranking[0]!.score;
  return {
    scores,
    leaders: ranking.filter(t => t.score === top).map(t => t.typeId),
    ranking,
    total: quiz.questions.length * 3,
  };
}
