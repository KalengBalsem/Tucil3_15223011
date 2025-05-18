"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DoorOpen } from "lucide-react"

// Special value to represent the exit cell
const EXIT_CELL = -1

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
  10: "bg-cyan-500",
  11: "bg-lime-500",
  12: "bg-amber-500",
  13: "bg-fuchsia-500",
  14: "bg-emerald-500",
  15: "bg-violet-500",
  16: "bg-rose-500",
  17: "bg-sky-500",
  18: "bg-stone-500",
  19: "bg-neutral-500",
  20: "bg-zinc-500",
  21: "bg-slate-500",
  22: "bg-gray-500",
  23: "bg-yellow-900",
  24: "bg-gray-900",
  25: "invisible",
}

interface PuzzleBoardProps {
  boardState: number[][];
  currentStep: number;
  solution: any[];
}

export default function PuzzleBoard({ 
  boardState, 
  currentStep, 
  solution 
}: PuzzleBoardProps) {
  // Default to sample puzzle if boardState is empty
  const [puzzle, setPuzzle] = useState<number[][]>([
    [0, 1, 1, 0, 0, 0, 10],
    [0, 0, 0, 0, 2, 0, 10],
    [3, 3, 3, 0, 2, 0, EXIT_CELL],
    [0, 0, 4, 0, 2, 0, 10],
    [0, 0, 4, 5, 5, 5, 10],
    [0, 0, 0, 0, 0, 0, 10],
  ]);

  // Update board when solution step changes
  useEffect(() => {
    if (solution && solution.length > 0 && currentStep >= 0 && currentStep < solution.length) {
      // Get the board state for current step
      const currentSolutionStep = solution[currentStep];
      
      // If there's a valid board representation in the solution step
      if (currentSolutionStep && currentSolutionStep.board) {
        // This function needs to convert the board string/data into a 2D grid
        const newPuzzleState = convertBoardToGrid(currentSolutionStep.board);
        setPuzzle(newPuzzleState);
      }
    } else if (boardState && boardState.length > 0) {
      setPuzzle(boardState);
    }
  }, [boardState, solution, currentStep]);

  // This function converts the board representation from the solver to our grid format
  const convertBoardToGrid = (boardData: any): number[][] => {
    // This implementation will depend on the exact format your solver returns
    // For now, returning a simple example grid
    
    // If the boardData is already a 2D grid, return it directly
    if (Array.isArray(boardData) && Array.isArray(boardData[0])) {
      return boardData;
    }
    
    // If it's a string representation, parse it into a grid
    // This is just a placeholder - you'll need to implement the actual conversion
    if (typeof boardData === 'string') {
      // Example: convert a string like "0,1,1,0,0,0;0,0,0,0,2,0;..." to a 2D grid
      const rows = boardData.split(';');
      return rows.map(row => row.split(',').map(Number));
    }
    
    // If conversion can't be done, return default grid
    return [
      [0, 1, 1, 0, 0, 0, 10],
      [0, 0, 0, 0, 2, 0, 10],
      [3, 3, 3, 0, 2, 0, EXIT_CELL],
      [0, 0, 4, 0, 2, 0, 10],
      [0, 0, 4, 5, 5, 5, 10],
      [0, 0, 0, 0, 0, 0, 10],
    ];
  };

  // Function to identify which pieces can be moved
  const getPieceInfo = (pieceId: number) => {
    if (pieceId <= 0) return null;
    
    // Find all cells with this piece ID
    const cells: [number, number][] = [];
    puzzle.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === pieceId) {
          cells.push([rowIndex, colIndex]);
        }
      });
    });
    
    if (cells.length === 0) return null;
    
    // Determine if horizontal or vertical
    const isHorizontal = cells.every(cell => cell[0] === cells[0][0]);
    
    return {
      id: pieceId,
      cells,
      isHorizontal,
      length: cells.length
    };
  };

  // Get highlight class for the current move
  const getHighlightClass = (rowIndex: number, colIndex: number) => {
    if (!solution || solution.length === 0 || currentStep === 0) return "";
    
    const currentMove = solution[currentStep]?.move;
    if (!currentMove) return "";
    
    const movingPieceId = currentMove.pieceId;
    
    // If this cell contains the moving piece, highlight it
    return puzzle[rowIndex][colIndex] === movingPieceId 
      ? "ring-2 ring-white ring-opacity-70" 
      : "";
  };

  // Determine if we should show the exit arrows on specific cells
  const showExitArrow = (rowIndex: number, colIndex: number) => {
    return puzzle[rowIndex][colIndex] === EXIT_CELL;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Rush Hour Puzzle</CardTitle>
        <CardDescription>
          {solution && solution.length > 0 
            ? `Step ${currentStep} of ${solution.length - 1}` 
            : "Set up your puzzle to begin"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mx-auto" style={{ width: "min(100%, 450px)" }}>
          {puzzle.length > 0 ? (
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${puzzle[0].length}, minmax(0, 1fr))`,
                aspectRatio: `${puzzle[0].length}/${puzzle.length}`,
              }}
            >
              {puzzle.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const pieceInfo = cell > 0 ? getPieceInfo(cell) : null;
                  
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        ${colorMap[cell] || "bg-gray-300"} 
                        ${getHighlightClass(rowIndex, colIndex)}
                        rounded transition-all duration-200 shadow-sm 
                        flex items-center justify-center
                      `}
                      style={{ aspectRatio: "1/1" }}
                      title={cell > 0 ? `Piece ${cell}` : cell === EXIT_CELL ? "Exit" : "Empty space"}
                    >
                      {showExitArrow(rowIndex, colIndex) && (
                        <DoorOpen className="h-6 w-6 text-gray-400" />
                      )}
                      
                      {/* Optionally show piece number */}
                      {cell > 0 && (
                        <span className="text-xs font-bold text-white opacity-70">
                          {cell}
                        </span>
                      )}
                    </div>
                  );
                }),
              )}
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No puzzle data available
            </div>
          )}
        </div>

        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Goal: Move the red car (piece 1) to the exit</p>
          
          {solution && solution.length > 0 && currentStep > 0 && (
            <p className="mt-2 font-medium">
              {solution[currentStep]?.move 
                ? `Move: Piece ${solution[currentStep].move.pieceId} ${solution[currentStep].move.direction} by ${solution[currentStep].move.distance}`
                : ""}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}