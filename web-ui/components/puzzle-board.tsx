"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DoorOpen } from "lucide-react"

// Special value to represent the exit cell
const EXIT_CELL = -1

// Color mapping for puzzle pieces
const colorMap: Record<number, string> = {
  [EXIT_CELL]: "bg-gray-100 border-2 border-dashed border-gray-300",
  0: "bg-white border border-gray-200",
  1: "bg-red-500",
  2: "bg-blue-500",
  3: "bg-green-500",
  4: "bg-yellow-500",
  5: "bg-purple-500",
  6: "bg-pink-500",
  7: "bg-indigo-500",
  8: "bg-teal-500",
  9: "bg-orange-500",
  10: "bg-cyan-500",
  11: "bg-lime-500",
  12: "bg-amber-500",
  13: "bg-emerald-500",
  14: "bg-rose-500",
  15: "bg-violet-500",
  16: "bg-fuchsia-500",
  17: "bg-sky-500",
  18: "bg-green-600",
  19: "bg-blue-600",
  20: "bg-red-600",
  21: "bg-yellow-600",
  22: "bg-purple-600",
  23: "bg-pink-600",
  24: "bg-indigo-600",
  25: "bg-teal-600",
  26: "bg-orange-600",
  27: "invisible"
}

const numToLetter: Record<number, string> = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
  8: "H",
  9: "I",
  10: "J",
  11: "K",
  12: "L",
  13: "M",
  14: "N",
  15: "O",
  16: "P",
  17: "Q",
  18: "R",
  19: "S",
  20: "T",
  21: "U",
  22: "V",
  23: "W",
  24: "X",
  25: "Y",
  26: "Z",
}

interface PuzzleBoardProps {
  boardState: number[][] | null
  currentStep: number
  solution: Array<{ board: string; move?: { pieceId: string; direction: string; distance: number } }>
  exitRow: number
  exitCol: number
}

export default function PuzzleBoard({ boardState, currentStep, solution, exitRow, exitCol }: PuzzleBoardProps) {
  // Local grid state
  const [grid, setGrid] = useState<number[][]>([])

  // Update grid when boardState changes (on file load) or when stepping through solution
  useEffect(() => {
    // If a solution is present, render based on solution steps
    if (solution.length > 0) {
      const raw = solution[currentStep].board.trim()
      const rows = raw.includes("|")
        ? raw.split("|").map(line => line.trim())
        : raw.split(/\r?\n|\n|\r/).filter(line => line.trim().length > 0)

      const letterToNum = Object.entries(numToLetter).reduce((acc, [num, letter]) => {
        acc[letter] = +num
        return acc
      }, {} as Record<string, number>)

      function parseCell(ch: string): number {
        if (ch === ".") return 0
        if (ch === "K") return EXIT_CELL
        return letterToNum[ch] ?? 0
      }

      const parsedGrid = rows.map(row => row.split("").map(parseCell))
      setGrid(fillInvisibleExit(parsedGrid, exitRow, exitCol))
      return
    }

    // Otherwise, if boardState was provided via file load, use it
    if (boardState && boardState.length > 0) {
      setGrid(fillInvisibleExit(boardState, exitRow, exitCol))
    } else {
      // Clear grid if no data
      setGrid([])
    }
  }, [boardState, solution, currentStep, exitRow, exitCol])

  const rows = grid.length
  const cols = grid[0]?.length || 0

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Rush Hour Puzzle</CardTitle>
      </CardHeader>
      <CardContent className="px-6 flex flex-col items-center">
        <div className="w-full max-w-lg">
          {rows > 0 && cols > 0 ? (
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridAutoRows: "minmax(0, 1fr)",
              }}
            >
              {grid.flatMap((row, r) =>
                row.map((cell, c) => {
                  const bg = colorMap[cell] || "bg-gray-300"
                  const letter = numToLetter[cell] || ""
                  const isExit = cell === EXIT_CELL
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`${bg} aspect-square rounded transition-all duration-200 shadow-sm flex items-center justify-center`}
                    >
                      {isExit ? (
                        <DoorOpen className="h-6 w-6 text-gray-400" />
                      ) : letter ? (
                        <span className="text-lg font-bold text-white">{letter}</span>
                      ) : null}
                    </div>
                  )
                })
              )}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No puzzle data available
            </div>
          )}
        </div>
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Goal: Move the red car (piece 1) to the exit</p>
          {solution.length > 0 && currentStep > 0 && solution[currentStep].move && (
            <p className="mt-2 font-medium">
              Move: Piece {solution[currentStep].move!.pieceId} {solution[currentStep].move!.direction} by {solution[currentStep].move!.distance}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Inserts an invisible buffer row/column at the exit edge so the UI can show the door
function fillInvisibleExit(
  grid: number[][],
  exitRow: number,
  exitCol: number
): number[][] {
  const INVISIBLE = 27
  const numRows = grid.length
  const numCols = grid[0]?.length ?? 0
  let filled = grid.map(row => [...row]) // Deep copy

  // Side exit: left or right
  if (exitCol === 0) {
    filled = filled.map(row => [INVISIBLE, ...row])
  } else if (exitCol === numCols) {
    filled = filled.map(row => [...row, INVISIBLE])
  }

  // Top/bottom exit
  if (exitRow === 0) {
    const topRow = new Array(filled[0].length).fill(INVISIBLE)
    filled = [topRow, ...filled]
  } else if (exitRow === numRows) {
    const bottomRow = new Array(filled[0].length).fill(INVISIBLE)
    filled = [...filled, bottomRow]
  }

  return filled
}
