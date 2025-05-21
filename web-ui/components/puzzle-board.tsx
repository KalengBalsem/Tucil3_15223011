"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DoorOpen } from "lucide-react"

// Special values
const EXIT_CELL = -1
const INVISIBLE = 27

// Map numeric IDs → Tailwind styles
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
  [INVISIBLE]: "invisible",
}

// Numeric ID → display letter
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
  boardState: number[][]
  currentStep: number
  solution: Array<{
    board: string
    move?: { pieceId: string; direction: string; distance: number }
  }>
  exitRow: number
  exitCol: number
}

/** Pads a numeric grid with a 1-cell gutter around the exit so its shape never changes. */
function padForExit(grid: number[][], exitRow: number, exitCol: number): number[][] {
  const h = grid.length
  const w = grid[0]?.length ?? 0
  let out = grid.map(r => [...r])

  // Add vertical gutter
  if (exitCol === 0) {
    out = out.map(r => [INVISIBLE, ...r])
  } else if (exitCol === w) {
    out = out.map(r => [...r, INVISIBLE])
  }

  // Add horizontal gutter
  if (exitRow === 0) {
    out = [new Array(out[0].length).fill(INVISIBLE), ...out]
  } else if (exitRow === h) {
    out = [...out, new Array(out[0].length).fill(INVISIBLE)]
  }

  return out
}

export default function PuzzleBoard({
  boardState,
  currentStep,
  solution,
  exitRow,
  exitCol,
}: PuzzleBoardProps) {
  const [grid, setGrid] = useState<number[][]>([])

  const fallback = boardState!.length ? boardState : [
    [0,1,1,0,0,0,27],
    [0,0,0,0,2,0,27],
    [3,3,3,0,2,0,EXIT_CELL],
    [0,0,4,0,2,0,27],
    [0,0,4,5,5,5,27],
    [0,0,0,0,0,0,27],
  ]

  useEffect(() => {
    let base: number[][]

    // 1) No boardState? show dummy puzzle
    if (!solution.length) {
      setGrid(boardState!.length ? boardState : fallback)
      return
    }

    // 3) Otherwise parse the current solution step
    else {
      const raw = solution[currentStep].board.trim()
      const rows = raw.includes("|")
        ? raw.split("|").map(l => l.trim())
        : raw.split(/\r?\n|\n|\r/).filter(Boolean)

      const letterToNum = Object.entries(numToLetter).reduce(
        (acc, [num, letter]) => ((acc[letter] = +num), acc),
        {} as Record<string, number>
      )

      base = rows.map(r =>
        r.split("").map(ch =>
          ch === "." ? 0 : ch === "K" ? EXIT_CELL : letterToNum[ch] ?? 0
        )
      )
    }

    // 4) Pad for exit and set
    setGrid(padForExit(base, exitRow, exitCol))
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
                gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0,1fr))`,
              }}
            >
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const bg = colorMap[cell] || "bg-gray-300"
                  const isExit = cell === EXIT_CELL
                  const letter = !isExit ? numToLetter[cell] : ""
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`${bg} aspect-square rounded shadow-sm flex items-center justify-center`}
                    >
                      {isExit ? (
                        <DoorOpen className="h-6 w-6 text-gray-400" />
                      ) : letter ? (
                        <span className="text-lg font-bold text-white">
                          {letter}
                        </span>
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
          <p>Goal: Move the car P to the exit</p>
          {solution.length > 0 &&
            currentStep > 0 &&
            solution[currentStep].move && (
              <p className="mt-2 font-medium">
                Move: Piece {solution[currentStep].move!.pieceId}{" "}
                {solution[currentStep].move!.direction} by{" "}
                {solution[currentStep].move!.distance}
              </p>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
