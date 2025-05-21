import { Board } from '../core/board';

/**
 * For each distinct vehicle blocking P’s direct path to the exit,
 * compute how many steps (slides) it must make to clear the corridor,
 * and sum those distances. Admissible since each blocker must move
 * at least that many times.
 */
export function blockingDistance(board: Board): number {
  const p = board.primary;
  const occ = board.buildOccMap();
  const seen = new Set<string>();
  let total = 0;

  // Determine the cells along P’s exit corridor
  const corridor: [number, number][] = [];
  if (p.orientation === 'H') {
    const row = p.row;
    const start = p.col + p.length;
    const end = board.exitCol;
    const step = start < end ? 1 : -1;
    for (let c = start; c !== end + step; c += step) {
      corridor.push([row, c]);
    }
  } else {
    const col = p.col;
    const start = p.row + p.length;
    const end = board.exitRow;
    const step = start < end ? 1 : -1;
    for (let r = start; r !== end + step; r += step) {
      corridor.push([r, col]);
    }
  }

  for (const [r, c] of corridor) {
    const id = board.cellAt(r, c);
    if (!id || id === '.' || id === 'K' || seen.has(id)) continue;
    seen.add(id);

    // Locate that piece
    const piece = board.pieces.find((x) => x.id === id)!;

    // Try sliding it 1, 2, 3... steps along its orientation
    // until it no longer overlaps any corridor cell
    let dist = 1;
    outer: for (;; dist++) {
      // For each of the piece's cells after sliding `dist`:
      for (let i = 0; i < piece.length; i++) {
        const nr =
          piece.row +
          (piece.orientation === 'V' ? i : 0) +
          (piece.orientation === 'V'
            ? dist * (board.exitRow > piece.row ? 1 : -1)
            : 0);
        const nc =
          piece.col +
          (piece.orientation === 'H' ? i : 0) +
          (piece.orientation === 'H'
            ? dist * (board.exitCol > piece.col ? 1 : -1)
            : 0);

        // Allow stepping into the exit for the primary only
        if (nr === board.exitRow && nc === board.exitCol && piece.id === p.id) {
          continue;
        }
        // If this cell is still inside the grid, it must be free
        if (nr >= 0 && nr < board.height && nc >= 0 && nc < board.width) {
          if (occ[nr][nc]) break outer; // blocked, try next dist
        }
        // otherwise out of grid (not always allowed), but we only care clearing corridor
      }
      // Check if after sliding `dist`, none of the piece’s new cells sit in any corridor cell
      let stillInCorridor = false;
      for (const [cr, cc] of corridor) {
        if (piece.orientation === 'H') {
          // corridor is horizontal in row=p.row; check any overlap
          if (
            cr === piece.row &&
            cc >=
              piece.col +
                dist * (board.exitCol > piece.col ? 1 : -1) &&
            cc <
              piece.col +
                dist * (board.exitCol > piece.col ? 1 : -1) +
                piece.length
          ) {
            stillInCorridor = true;
            break;
          }
        } else {
          if (
            cc === piece.col &&
            cr >=
              piece.row +
                dist * (board.exitRow > piece.row ? 1 : -1) &&
            cr <
              piece.row +
                dist * (board.exitRow > piece.row ? 1 : -1) +
                piece.length
          ) {
            stillInCorridor = true;
            break;
          }
        }
      }
      if (!stillInCorridor) {
        total += dist;
        break;
      }
    }
  }

  return total;
}
