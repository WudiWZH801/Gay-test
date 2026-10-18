export const TYPE_IDS = ['queen', 'puppy', 'prince', 'artsy', 'sassy', 'homey', 'boss', 'chaotic'] as const;
export type TypeId = typeof TYPE_IDS[number];
export interface Archetype {
  id: TypeId;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  relationship: string;
  strengths: string[];
  pitfalls: string[];
  matches: { typeId: TypeId; reason: string }[];
}
export interface Option { id: string; text: string; primary: TypeId; secondary: TypeId }
export interface Question { id: string; text: string; options: Option[] }
export interface Quiz { id: string; version: number; types: Archetype[]; questions: Question[] }
export type Answers = Readonly<Record<string, string>>;
export interface QuizResult {
  scores: Record<TypeId, number>;
  leaders: TypeId[];
  ranking: { typeId: TypeId; score: number }[];
  total: number;
}
