// src/utils/printer.ts
import chalk from "chalk"
import { GameState } from "../core/state"
import { Board } from "../core/board"
import { Move } from "../core/move"

/**
 * Convert a Board into a string representation (rows separated by newline).
 * Highlights:
 * - Primary piece 'P' in yellow
 * - Exit 'K' in cyan (even if off‐board)
 * - The piece just moved in green
 */
export function boardToString(board: Board, highlightId?: string): string {
  const lines: string[] = []

  for (let r = 0; r < board.height; r++) {
    let row = ""

    // off‐board left exit
    if (board.exitCol < 0 && r === board.exitRow) {
      row += chalk.cyanBright("K")
    } else if (board.exitCol < 0) {
      row += " "
    }

    // on‐board cells
    for (let c = 0; c < board.width; c++) {
      let ch = "."

      // on‐board exit
      if (r === board.exitRow && c === board.exitCol) {
        ch = "K"
      } else {
        const p = board.pieces.find((p) => {
          for (let i = 0; i < p.length; i++) {
            const rr = p.row + (p.orientation === "V" ? i : 0)
            const cc = p.col + (p.orientation === "H" ? i : 0)
            if (rr === r && cc === c) return true
          }
          return false
        })
        if (p) ch = p.id
      }

      // colorization
      if (ch === "P") {
        row += chalk.yellow.bold(ch)
      } else if (ch === "K") {
        row += chalk.cyanBright(ch)
      } else if (ch === highlightId) {
        row += chalk.greenBright.bold(ch)
      } else {
        row += ch
      }
    }

    // off‐board right exit
    if (board.exitCol >= board.width && r === board.exitRow) {
      row += chalk.cyanBright("K")
    }

    lines.push(row)
  }

  return lines.join("\n")
}

/**
 * Reconstruct path from root to goal
 */
export function reconstructPath(goal: GameState): GameState[] {
  const path: GameState[] = []
  let curr: GameState | undefined = goal
  while (curr) {
    path.push(curr)
    curr = curr.parent
  }
  return path.reverse()
}

/**
 * Print the entire solution trace
 */
export function printSolution(goal: GameState): void {
  const path = reconstructPath(goal)
  if (!path.length) return

  console.log(chalk.bold("Papan Awal"))
  console.log(boardToString(path[0].board))
  console.log()

  for (let i = 1; i < path.length; i++) {
    const state = path[i]
    const move: Move = state.lastMove!
    console.log(
      chalk.bold(`Gerakan ${i}: `) +
        chalk.greenBright(`${move.pieceId}-${move.direction}`)
    )
    console.log(boardToString(state.board, move.pieceId))
    console.log()
  }
}
