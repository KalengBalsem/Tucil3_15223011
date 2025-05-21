import { Board } from '../core/board';

export function blockingCount(board: Board): number {
  const p = board.primary;
  if (board.isGoal()) return 0;

  const blockers = new Set<string>();
  const occ = board.buildOccMap();

  // Walk the corridor cells
  let r = p.row + (p.orientation === 'V' ? p.length : 0);
  let c = p.col + (p.orientation === 'H' ? p.length : 0);
  const dr = p.orientation === 'V' ? (board.exitRow > p.row ? 1 : -1) : 0;
  const dc = p.orientation === 'H' ? (board.exitCol > p.col ? 1 : -1) : 0;

  while (r !== board.exitRow + dr || c !== board.exitCol + dc) {
    const id = board.cellAt(r, c);
    if (id && id !== '.' && id !== 'K') blockers.add(id);
    r += dr;
    c += dc;
  }

  // P itself needs one slide plus each blocker
  return 1 + blockers.size;
}