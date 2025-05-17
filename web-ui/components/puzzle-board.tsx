"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DoorOpen } from "lucide-react"

// Special value to represent the exit cell
const EXIT_CELL = -1

// Sample puzzle data - this would come from your solver
// The grid is now 6x7 with the rightmost column representing the exit
const samplePuzzle = [
  [0, 1, 1, 0, 0, 0, 10],
  [0, 0, 0, 0, 2, 0, 10],
  [3, 3, 3, 0, 2, 0, EXIT_CELL],
  [0, 0, 4, 0, 2, 0, 10],
  [0, 0, 4, 5, 5, 5, 10],
  [0, 0, 0, 0, 0, 0, 10],
]

// Color mapping for puzzle pieces
const colorMap: Record<number, string> = {
  [EXIT_CELL]: "bg-gray-100 border-2 border-dashed border-gray-300", // Exit cell
  0: "bg-white border border-gray-200", // Empty cell
  1: "bg-red-500", // Target car (usually red)
  2: "bg-blue-500",
  3: "bg-green-500",
  4: "bg-yellow-500",
  5: "bg-purple-500",
  6: "bg-pink-500",
  7: "bg-indigo-500",
  8: "bg-orange-500",
  9: "bg-teal-500",
  10: "invisible",
  11: "bg-cyan-500",
  12: "bg-lime-500",
  13: "bg-amber-500",
  14: "bg-fuchsia-500",
  15: "bg-emerald-500",
  16: "bg-violet-500",
  17: "bg-rose-500",
  18: "bg-sky-500",
  19: "bg-stone-500",
  20: "bg-neutral-500",
  21: "bg-zinc-500",
  22: "bg-slate-500",
  23: "bg-gray-500",
  24: "bg-yellow-900",
}

interface PuzzleBoardProps {
  // Optional prop to receive puzzle data from external source
  initialPuzzle?: number[][]
  // Optional callback when a solution is found
  onSolutionFound?: (solution: number[][][]) => void
}

export default function PuzzleBoard({ initialPuzzle, onSolutionFound }: PuzzleBoardProps) {
  // Use provided puzzle data or fall back to sample data
  const [puzzle, setPuzzle] = useState(initialPuzzle || samplePuzzle)

  // Update puzzle when initialPuzzle prop changes
  useEffect(() => {
    if (initialPuzzle) {
      setPuzzle(initialPuzzle)
    }
  }, [initialPuzzle])

  // Function to update puzzle state (can be called from parent or internally)
  const updatePuzzleState = (newPuzzleState: number[][]) => {
    setPuzzle(newPuzzleState)
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Puzzle Visualization</CardTitle>
        <CardDescription>Current puzzle state - drag pieces to move them</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mx-auto" style={{ width: "min(100%, 450px)" }}>
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${puzzle[0].length}, minmax(0, 1fr))`,
              aspectRatio: `${puzzle[0].length}/${puzzle.length}`,
            }}
          >
            {puzzle.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${colorMap[cell]} rounded transition-colors duration-200 shadow-sm flex items-center justify-center`}
                  style={{ aspectRatio: "1/1" }}
                >
                  {cell === EXIT_CELL && <DoorOpen className="h-6 w-6 text-gray-400" />}
                </div>
              )),
            )}
          </div>
        </div>

        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Goal: Move the red car to the exit</p>
        </div>
      </CardContent>
    </Card>
  )
}
