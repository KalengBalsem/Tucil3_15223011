// src/utils/printer.ts
import { GameState } from "../core/state";
import { Board } from "../core/board";
import { Move } from "../core/move";

/**
 * Convert a Board into a string representation (rows separated by newline).
 */
export function boardToString(board: Board): string {
  const lines: string[] = [];
  for (let r = 0; r < board.height; r++) {
    let row = "";
    for (let c = 0; c < board.width; c++) {
      // Determine character at cell or exit
      if (r === board.exitRow && c === board.exitCol) {
        row += "K";
      } else {
        // find a piece occupying this cell
        const cellChar = board.pieces.find((p) => {
          for (let i = 0; i < p.length; i++) {
            const rr = p.row + (p.orientation === "V" ? i : 0);
            const cc = p.col + (p.orientation === "H" ? i : 0);
            if (rr === r && cc === c) return true;
          }
          return false;
        })?.id;
        row += cellChar ?? ".";
      }
    }
    lines.push(row);
  }
  return lines.join("\n");
}

/**
 * Given the goal state, reconstruct the path from the root, and return ordered states.
 */
export function reconstructPath(goal: GameState): GameState[] {
  const path: GameState[] = [];
  let curr: GameState | undefined = goal;
  while (curr) {
    path.push(curr);
    curr = curr.parent;
  }
  return path.reverse();
}

/**
 * Print the solution moves and board configurations to console.
 */
export function printSolution(goal: GameState): void {
  const path = reconstructPath(goal);
  if (path.length === 0) return;

  // Print initial board
  console.log("Papan Awal");
  console.log(boardToString(path[0].board));
  console.log();

  // Iterate moves
  for (let i = 1; i < path.length; i++) {
    const state = path[i];
    const move: Move = state.lastMove!;
    // Format "Gerakan i: <piece>-<direction>"
    console.log(`Gerakan ${i}: ${move.pieceId}-${move.direction}`);
    console.log(boardToString(state.board));
    console.log();
  }
}
