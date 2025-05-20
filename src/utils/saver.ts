import fs from 'fs'
import path from 'path'
import { GameState } from '../core/state'
import { reconstructPath, boardToString } from './printer'

/**
 * Saves a GameState solution to a text file under outputDir.
 * Returns the full path to the written file.
 */
export function saveSolution(goal: GameState, outputDir: string): string {
  const states = reconstructPath(goal)
  // ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  const fileName = `result_${Date.now()}.txt`
  const filePath = path.join(outputDir, fileName)

  const lines: string[] = []
  states.forEach((st, idx) => {
    if (idx === 0) {
      lines.push('Initial Board:')
      lines.push(boardToString(st.board))
    } else {
      const mv = st.lastMove!
      lines.push(`Move ${idx}: ${mv.pieceId}-${mv.direction}-${mv.distance}`)
      lines.push(boardToString(st.board, mv.pieceId))
    }
    lines.push('') // blank line
  })

  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8')
  return filePath
}