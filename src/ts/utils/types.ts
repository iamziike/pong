export type CanvasSize = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type BoxSize = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type GameMode = "Single" | "Double" | null;
export type PaddlePosition = "LEFT" | "RIGHT" | "RANDOM";
export type GameDifficulty = "EASY" | "MEDIUM" | "HARD";

// online
export type OnlineConnectionType = "CREATING" | "FINDING";
