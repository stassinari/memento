export interface User {
  secretKey?: string;
}

export interface TastingScores {
  aroma: number;
  acidity: number;
  sweetness: number;
  body: number;
  finish: number;
}

export interface ITastingNotes {
  name: string;
  children?: ITastingNotes[];
}
