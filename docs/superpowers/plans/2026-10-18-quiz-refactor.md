# Gay-test Refactor Implementation Plan

> For agentic workers: use superpowers:executing-plans to implement this plan inline, with a whole-branch review at the end.

**Goal:** Deliver the approved entertainment quiz redesign with deterministic, balanced scoring and accessible, resumable interaction.

**Architecture:** Typed quiz data feeds pure scoring and state transitions. Native DOM views render that state; session storage is an optional adapter. Vite builds static assets for GitHub Pages.

**Tech Stack:** TypeScript, Vite, Vitest, Playwright; no frontend runtime framework.

**Spec:** `../specs/2026-10-18-quiz-refactor-design.md` (approved in chat on 2026-10-18).

## Global Constraints

- 10 questions, 4 options each, 8 entertainment archetypes with stable IDs.
- Every option has one primary type worth 2 and one different secondary type worth 1.
- Every question contains each type once. Every type is primary 5 times and secondary 5 times.
- Equal-score leaders all appear as a composite result; no randomness.
- Exhaustive independent-uniform model: all types can win alone and largest/smallest expected result share <= 2.
- Answers are the source of truth; no incremental score mutation. Preserve answers when navigating backward.
- Session storage only, versioned and validated. Unavailable storage cannot prevent play.
- Native radios, focus management, reduced-motion support, 320/390/768/1280 px checks.
- Purple gradient/card direction, local answer processing, static Pages deployment under `/Gay-test/`.

## Review Focus

1. Malformed or old storage, including holes in the answer history: reject and recover without blocking play (Task 2).
2. Changing an earlier answer after reaching the last question: recalculate from answers without duplicate scores (Tasks 2 and 3).
3. Repeated final submission and navigation outside an active quiz: remain bounded and idempotent (Task 2).
4. Storage access throws or is disabled: keep the complete app usable (Tasks 2 and 3).
5. Several tied types, long text, reduced motion and keyboard-only use: expose every leader and keep navigation usable (Task 3).

## Task 1: Typed data and scoring

**Files:** package.json, tsconfig.json, vite.config.ts, src/data/quiz.ts, src/domain/types.ts, src/domain/scoring.ts, src/domain/validate-quiz.ts, tests/scoring.test.ts, tests/data.test.ts, scripts/analyze-distribution.ts.

**Interfaces:** `Quiz`, `TypeId`, `Answers = Readonly<Record<string,string>>`; `scoreQuiz(quiz: Quiz, answers: Answers): QuizResult`; `validateQuiz(quiz: Quiz): string[]`; `analyzeDistribution(quiz: Quiz): DistributionReport`.

- [x] Write behavior tests for exact 2+1 accumulation, stable ties, invalid/incomplete answers and all data constraints.
- [x] Run tests and observe missing-feature failures.
- [x] Implement types, deliberate question/option pairings and rewritten archetype text, pure score function and data validation.
- [x] Run tests, type checks and full combination analysis. Require all 8 sole winners and share ratio <= 2.
- [x] Commit the tested domain and content.

## Task 2: State and persistence

**Files:** src/domain/quiz-state.ts, src/storage.ts, tests/quiz-state.test.ts, tests/storage.test.ts.

**Interfaces:** `QuizState = {screen, cursor, answers}`; `initialState(): QuizState`; `transition(quiz: Quiz, state: QuizState, action: QuizAction): QuizState`; `readProgress(quiz: Quiz, storage: StoragePort): ProgressRead`; `saveProgress(quiz: Quiz, state: QuizState, storage: StoragePort): boolean`; `clearProgress(storage: StoragePort): boolean`.

- [x] Write tests for unanswered next, answer/revisit/change, bounded finish, reset, invalid IDs, malformed/versioned storage, history holes and throwing storage.
- [x] Run tests and observe missing-feature failures.
- [x] Implement immutable state transitions and storage validation using stable question/option IDs and quiz/schema versions.
- [x] Run the full unit suite and type check.
- [x] Commit tested state/persistence.

## Task 3: Accessible interface

**Files:** index.html, src/main.ts, src/styles.css, src/ui/{dom,welcome,question,result}.ts, public/favicon.svg, tests/quiz.e2e.ts, playwright.config.ts.

**Interfaces:** Views consume `Quiz`, `QuizState`, and domain result; event handlers call Task 2 transitions. Render text with DOM textContent, use fieldset/legend/radios. Selection updates controls without replacing the focused radio group.

- [x] Write end-to-end tests for complete/restart, previous/change, refresh/continue, reset, invalid/blocked storage, composite results, keyboard flow, reduced motion and responsive widths.
- [x] Run on the original entry and observe missing approved controls/behavior.
- [x] Implement the views, focus and progress semantics, optional storage adapter, metadata and styles.
- [x] Run end-to-end tests against the production build under `/Gay-test/`; inspect screenshots and fix material layout issues.
- [x] Commit tested interface.

## Task 4: Delivery and review

**Files:** .github/workflows/{ci,deploy}.yml, README.md, docs/score-distribution.json, .gitignore, .gitattributes.

- [x] Add CI unit/type/distribution/build/browser checks and a main-only Pages deployment workflow.
- [x] Document development, data rules, result semantics, session lifetime, Pages source setup and limitations.
- [x] Run full checks, production build, browser suite and package audit. Review the branch with a fresh reviewer; reproduce any important finding with a failing test before fixing it.
- [ ] Commit final verification and publish the feature branch as a PR. Do not merge or replace the live site as part of this task.
