import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { performance } from 'perf_hooks'
import { saveSolution } from './utils/saver'

import { parsePuzzle } from './utils/parser'
import { ucs } from './algorithms/ucs'
import { greedy } from './algorithms/greedy'
import { aStar } from './algorithms/a_star'
import { ida } from './algorithms/ida'
import { printSolution } from './utils/printer'

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise<string>((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

async function main() {
  console.log('\n=== Rush Hour Solver ===\n')

  // Choose algorithm
  const algoInput = await prompt(
    'Choose algorithm (ucs, greedy, astar, ida): '
  )
  const algo = algoInput.toLowerCase()
  if (!['ucs', 'greedy', 'astar', 'ida'].includes(algo)) {
    console.error('Invalid algorithm. Choose one of: ucs, greedy, astar, ida.')
    process.exit(1)
  }

  // If needed, choose heuristic
  let heuristic: 'manhattan' | 'blocking' | 'blockingCount' | 'combined' = 'manhattan'
  if (algo === 'greedy' || algo === 'astar' || algo === 'ida') {
    const hInput = await prompt(
      'Choose heuristic (manhattan, blocking, blockingCount, combined): '
    )
    const h = hInput.toLowerCase()
    if (!['manhattan', 'blocking', 'blockingcount', 'combined'].includes(h)) {
      console.error('Invalid heuristic. Choose one of: manhattan, blocking, blockingCount, combined.')
      process.exit(1)
    }
    // Normalize to match type
    heuristic = h === 'blockingcount' ? 'blockingCount' : (h as typeof heuristic)
  }

  // Input file name
  const fileName = await prompt(
    'Enter puzzle file name (e.g., test1.txt): '
  )
  // If user already entered a folder path, use it directly, otherwise, search in 'test' folder
  const filePath = path.isAbsolute(fileName)
    ? fileName
    : path.resolve(process.cwd(), fileName.includes(path.sep) ? fileName : path.join('test', fileName))
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }

  // Parse puzzle
  let board
  try {
    board = parsePuzzle(filePath)
  } catch (err) {
    if (err instanceof Error) {
      console.error('Failed to parse puzzle:', err.message)
    } else {
      console.error('Failed to parse puzzle:', err)
    }
    process.exit(1)
  }

  // Run solver
  console.log(`\nRunning ${algo.toUpperCase()}${algo !== 'ucs' && heuristic ? ' with ' + heuristic : ''}...`)
  const t0 = performance.now()

  let result
  switch (algo) {
    case 'ucs':
      result = ucs(board)
      break
    case 'greedy':
      result = greedy(board, heuristic)
      break
    case 'astar':
      result = aStar(board, heuristic)
      break
    case 'ida':
      result = ida(board, heuristic)
      break
  }

  const t1 = performance.now()

  // Show result
  if (result && result.solution) {
    console.log('\n=== Solution Found ===\n')
    printSolution(result.solution)
    console.log(`Nodes expanded: ${result.nodesExpanded}`)
    console.log(`Time: ${(t1 - t0).toFixed(3)} ms`)

    // Ask user to save
    const saveAns = await prompt('Save solution to file? (y/n): ')
    if (saveAns.toLowerCase().startsWith('y')) {
      const dir = await prompt('Output directory (default "test/results"): ')
      const outDir = dir.trim() || 'test/results'
      const saved = saveSolution(result.solution, outDir)
      console.log(`Solution written to ${saved}`)
    }
  } else {
    console.log('No solution found.')
  }



}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
