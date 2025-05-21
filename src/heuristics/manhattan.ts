import { Board } from '../core/board';

export function manhattan(board: Board): number {
  const p = board.primary;
  if (board.isGoal()) return 0;

  // compute number of cells from P’s *front* to the exit
  if (p.orientation === 'H') {
    // P exits horizontally
    const frontCol = p.col + p.length;
    return Math.abs(board.exitCol - frontCol);
  } else {
    // P exits vertically
    const frontRow = p.row + p.length;
    return Math.abs(board.exitRow - frontRow);
  }
}