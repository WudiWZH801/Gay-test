import type { Answers, Quiz, TypeId } from '../src/domain/types.ts';
export interface DistributionReport {
  quizVersion: number;
  combinations: number;
  tiedCombinations: number;
  tieRate: number;
  maxMinRatio: number;
  types: { id: TypeId; name: string; maximumScore: number; expectedShare: number; soleWins: number; exampleAnswers: Answers | null }[];
  tiedExample: Answers | null;
  maxTiedTypes: number;
  mostTiedAnswers: Answers | null;
}
/** Every sequence is equally weighted; tied leaders split one unit of probability. */
export function analyzeDistribution(quiz: Quiz): DistributionReport {
  const ids = quiz.types.map(t => t.id);
  const vectors = quiz.questions.map(q => q.options.map(o => [ids.indexOf(o.primary), ids.indexOf(o.secondary)] as const));
  const scores = new Int16Array(ids.length);
  const choices = new Uint8Array(quiz.questions.length);
  const expectedWins = ids.map(() => 0);
  const types = quiz.types.map(t => ({
    id: t.id, name: t.name,
    maximumScore: quiz.questions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.primary === t.id ? 2 : o.secondary === t.id ? 1 : 0)), 0),
    expectedShare: 0, soleWins: 0, exampleAnswers: null as Answers | null,
  }));
  let combinations = 0;
  let tiedCombinations = 0;
  let tiedExample: Answers | null = null;
  let maxTiedTypes = 0;
  let mostTiedAnswers: Answers | null = null;
  const snapshot = (): Answers => Object.fromEntries(quiz.questions.map((q, i) => [q.id, q.options[choices[i]!]!.id]));
  function visit(index: number): void {
    if (index === vectors.length) {
      combinations++;
      let top = -1;
      let count = 0;
      for (const score of scores) {
        if (score > top) { top = score; count = 1; }
        else if (score === top) count++;
      }
      if (count > 1) { tiedCombinations++; tiedExample ??= snapshot(); }
      if (count > maxTiedTypes) { maxTiedTypes = count; mostTiedAnswers = snapshot(); }
      for (let i = 0; i < ids.length; i++) {
        if (scores[i] !== top) continue;
        expectedWins[i]! += 1 / count;
        if (count === 1) { types[i]!.soleWins++; types[i]!.exampleAnswers ??= snapshot(); }
      }
      return;
    }
    for (let oi = 0; oi < vectors[index]!.length; oi++) {
      const [primary, secondary] = vectors[index]![oi]!;
      choices[index] = oi;
      scores[primary]! += 2;
      scores[secondary]! += 1;
      visit(index + 1);
      scores[primary]! -= 2;
      scores[secondary]! -= 1;
    }
  }
  visit(0);
  types.forEach((type, i) => { type.expectedShare = expectedWins[i]! / combinations; });
  const shares = types.map(t => t.expectedShare);
  return { quizVersion: quiz.version, combinations, tiedCombinations, tieRate: tiedCombinations / combinations, maxMinRatio: Math.max(...shares) / Math.min(...shares), types, tiedExample, maxTiedTypes, mostTiedAnswers };
}
