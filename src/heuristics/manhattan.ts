import { Board } from '../core/board';

export function manhattan(board: Board): number {
    const p = board.primary;
    // Compute the 'front' cell of the primary piece (farthest in its orientation)
    const frontRow = p.row + (p.orientation === "V" ? p.length - 1 : 0);
    const frontCol = p.col + (p.orientation === "H" ? p.length - 1 : 0);
    return Math.abs(frontRow - board.exitRow) + Math.abs(frontCol - board.exitCol);
}