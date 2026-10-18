import { mkdirSync, writeFileSync } from 'node:fs';
import { quiz } from '../src/data/quiz.ts';
import { validateQuiz } from '../src/domain/validate-quiz.ts';
import { analyzeDistribution } from './distribution.ts';

const errors = validateQuiz(quiz);
if (errors.length) throw new Error(errors.join('\n'));
const report = analyzeDistribution(quiz);
if (report.types.some(t => !t.soleWins) || report.maxMinRatio > 2) throw new Error('Distribution contract failed');
mkdirSync('docs', { recursive: true });
writeFileSync('docs/score-distribution.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(`Enumerated ${report.combinations.toLocaleString('en-US')} sequences; max/min share ${report.maxMinRatio.toFixed(3)}.`);
for (const type of report.types) console.log(`${type.id.padEnd(8)} ${(type.expectedShare * 100).toFixed(2)}% (${type.soleWins} sole wins)`);
console.log(`Ties: ${(report.tieRate * 100).toFixed(2)}%; every leader is retained.`);
