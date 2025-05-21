// src/utils/printer.ts

import { GameState } from "../core/state"
import { Board }     from "../core/board"
import { Move }      from "../core/move"

/** ANSI escape code helpers */
const RESET        = "\x1b[0m"
const BOLD         = (s: string) => `\x1b[1m${s}${RESET}`
const YELLOW_BRIGHT = (s: string) => `\x1b[93m${s}${RESET}`
const GREEN_BRIGHT  = (s: string) => `\x1b[92m${s}${RESET}`
const CYAN_BRIGHT   = (s: string) => `\x1b[96m${s}${RESET}`

/**
 * Convert a Board into a string representation (rows separated by newline).
 * Highlights:
 * - Primary piece 'P' in bright yellow
 * - Exit 'K' in bright cyan (even if off‐board)
 * - The piece just moved in bright green
 */
export function boardToString(board: Board, highlightId?: string): string {
  const lines: string[] = []

  for (let r = 0; r < board.height; r++) {
    let row = ""

    // off‐board left exit
    if (board.exitCol < 0 && r === board.exitRow) {
      row += CYAN_BRIGHT("K")
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
        row += BOLD(YELLOW_BRIGHT(ch))
      } else if (ch === "K") {
        row += CYAN_BRIGHT(ch)
      } else if (ch === highlightId) {
        row += BOLD(GREEN_BRIGHT(ch))
      } else {
        row += ch
      }
    }

    // off‐board right exit
    if (board.exitCol >= board.width && r === board.exitRow) {
      row += CYAN_BRIGHT("K")
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

  console.log(BOLD("Papan Awal"))
  console.log(boardToString(path[0].board))
  console.log()

  for (let i = 1; i < path.length; i++) {
    const state = path[i]
    const move: Move = state.lastMove!
    console.log(
      BOLD(`Gerakan ${i}: `) +
      GREEN_BRIGHT(`${move.pieceId}-${move.direction}`)
    )
    console.log(boardToString(state.board, move.pieceId))
    console.log()
  }
}
