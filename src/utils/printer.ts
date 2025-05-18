// src/utils/printer.ts
import { GameState } from "../core/state";
import { Board } from "../core/board";
import { Move } from "../core/move";
import chalk from "chalk";

/**
 * Convert a Board into a string representation (rows separated by newline).
 * Highlights:
 * - 'P' (primary) = yellow
 * - exit 'K' = cyan
 * - moved piece (if specified) = green
 */
export function boardToString(board: Board, highlightId?: string): string {
  const lines: string[] = [];
  for (let r = 0; r < board.height; r++) {
    let row = "";
    for (let c = 0; c < board.width; c++) {
      let ch = '.';
      if (r === board.exitRow && c === board.exitCol) {
        ch = 'K';
      } else {
        const p = board.pieces.find((p) => {
          for (let i = 0; i < p.length; i++) {
            const rr = p.row + (p.orientation === "V" ? i : 0);
            const cc = p.col + (p.orientation === "H" ? i : 0);
            if (rr === r && cc === c) return true;
          }
          return false;
        });
        if (p) ch = p.id;
      }

      // Apply colors
      if (ch === 'P') {
        row += chalk.yellow.bold(ch);
      } else if (ch === 'K') {
        row += chalk.cyanBright(ch);
      } else if (ch === highlightId) {
        row += chalk.greenBright.bold(ch);
      } else {
        row += ch;
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

  console.log(chalk.bold("Papan Awal"));
  console.log(boardToString(path[0].board));
  console.log();

  for (let i = 1; i < path.length; i++) {
    const state = path[i];
    const move: Move = state.lastMove!;
    console.log(
      chalk.bold(`Gerakan ${i}: `) +
      chalk.greenBright(`${move.pieceId}-${move.direction}`)
    );
    console.log(boardToString(state.board, move.pieceId));
    console.log();
  }
}
