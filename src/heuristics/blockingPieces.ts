import { Board } from '../core/board';

/**
 * Counts how many vehicles block the primary piece's direct path to the exit.
 * Admissible because each blocker must slide at least once.
 */

export function blockingCount(board: Board): number {
  const p = board.primary;
  const blockers = new Set<string>();

  if (p.orientation === 'H') {
    const row = p.row;
    const start = p.col + p.length;
    const end = board.exitCol;
    const step = start <= end ? 1 : -1;
    
    for (let c = start; c !== end + step; c += step) {
      if (c >= 0 && c < board.width) {
        const ch = board.serialize().split('|')[row][c];
        if (ch !== '.' && ch !== 'K') blockers.add(ch);
      }
    }
  } else {
    const col = p.col;
    const start = p.row + p.length;
    const end = board.exitRow;
    const step = start <= end ? 1 : -1;
    
    for (let r = start; r !== end + step; r += step) {
      if (r >= 0 && r < board.height) {
        const ch = board.serialize().split('|')[r][col];
        if (ch !== '.' && ch !== 'K') blockers.add(ch);
      }
    }
  }
  return blockers.size;
}
