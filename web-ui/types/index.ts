export type PieceInfo = {
  id: string;
  orientation: 'h' | 'v';
  size: number;
  row: number;
  col: number;
}

export type BoardState = {
  grid: number[][];
  pieces: PieceInfo[];
  width: number;
  height: number;
}

export type SolutionStep = {
  board: string;
  move?: {
    piece: string;
    direction: string;
    distance: number;
  } | null;
}

export type SolverStatus = "ready" | "running" | "done" | "error";