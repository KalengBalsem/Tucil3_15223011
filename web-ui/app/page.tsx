"use client";

import { useState } from "react";
import PuzzleBoard from "@/components/puzzle-board";
import ControlPanel from "@/components/control-panel";
import InputPanel from "@/components/input-panel";
import OutputPanel from "@/components/output-panel";

// Define interfaces for better type safety
interface PieceInfo {
  id: string;
  orientation: 'h' | 'v';
  size: number;
  row: number;
  col: number;
}

interface BoardState {
  grid: number[][];
  pieces: PieceInfo[];
  width: number;
  height: number;
}

interface SolutionStep {
  board: string;
  move?: {
    pieceId: string;
    direction: 'up' | 'down' | 'left' | 'right';
    distance: number;
  };
}

export default function Home() {
  // Puzzle input text
  const [puzzleInput, setPuzzleInput] = useState<string>("");
  
  // Solver configuration
  const [algorithm, setAlgorithm] = useState<"ucs"|"astar"|"greedy">("astar");
  const [heuristic, setHeuristic] = useState<"manhattan"|"blocking"|"combined">("manhattan");
  
  // Solver result path
  const [solution, setSolution] = useState<SolutionStep[]>([]);
  
  // UI status & stats
  const [status, setStatus] = useState<"ready"|"running"|"done"|"error">("ready");
  const [time, setTime] = useState<number>(0);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [statesExpanded, setStatesExpanded] = useState<number>(0);
  
  // Which step of `solution` PuzzleBoard should show
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Current board visualization data
  const [boardState, setBoardState] = useState<BoardState | null>(null);

  // Parse the puzzle input text into a board state
  const parsePuzzleInput = (input: string): BoardState | null => {
    try {
      const lines = input.trim().split('\n');
      if (lines.length < 1) return null;
      
      // Parse board dimensions
      const dimensionsMatch = lines[0].match(/(\d+)x(\d+)/);
      if (!dimensionsMatch) return null;
      
      const width = parseInt(dimensionsMatch[1]);
      const height = parseInt(dimensionsMatch[2]);
      
      // Initialize empty grid
      const grid = Array(height).fill(0).map(() => Array(width).fill(0));
      const pieces: PieceInfo[] = [];
      
      // Parse pieces
      for (let i = 1; i < lines.length; i++) {
        const pieceMatch = lines[i].match(/([A-Z])\s+(h|v)\s+(\d+)\s+(\d+)\s+(\d+)/);
        if (!pieceMatch) continue;
        
        const [_, id, orientation, size, row, col] = pieceMatch;
        const pieceInfo: PieceInfo = {
          id,
          orientation: orientation as 'h' | 'v',
          size: parseInt(size),
          row: parseInt(row),
          col: parseInt(col)
        };
        
        pieces.push(pieceInfo);
        
        // Place piece on the grid
        const pieceId = pieces.length; // Use piece index + 1 as ID on grid
        if (orientation === 'h') {
          for (let j = 0; j < parseInt(size); j++) {
            grid[parseInt(row)][parseInt(col) + j] = pieceId;
          }
        } else {
          for (let j = 0; j < parseInt(size); j++) {
            grid[parseInt(row) + j][parseInt(col)] = pieceId;
          }
        }
      }
      
      return { grid, pieces, width, height };
    } catch (error) {
      console.error("Failed to parse puzzle input:", error);
      return null;
    }
  };

  // Load a puzzle from text input
  const handleLoadPuzzle = async () => {
    if (!puzzleInput.trim()) return;
    
    setStatus("ready");
    const initialBoardState = parsePuzzleInput(puzzleInput);
    
    if (initialBoardState) {
      setBoardState(initialBoardState);
    } else {
      setStatus("error");
      console.error("Failed to parse puzzle input");
    }
    
    setCurrentStep(0);
    setSolution([]);
  };

  // Solve the current puzzle
  const handleSolve = async () => {
    if (!puzzleInput.trim()) return;
    
    setStatus("running");
    const startTime = performance.now();
    
    try {
      const response = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: puzzleInput,
          algorithm,
          heuristic
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setStatus("error");
        return;
      }
      
      const endTime = performance.now();
      setTime((endTime - startTime) / 1000);
      setSolution(data.solution || []);
      setMovesCount(data.solution?.length - 1 || 0);
      setStatesExpanded(data.nodesExpanded || 0);
      setCurrentStep(0);
      setStatus("done");
      
      // Update board to show initial state
      if (data.solution && data.solution.length > 0) {
        updateBoardFromSolution(data.solution[0]);
      }
    } catch (error) {
      console.error("Solver error:", error);
      setStatus("error");
    }
  };

  // Update board visualization from solution step
  const updateBoardFromSolution = (solutionStep: SolutionStep) => {
    if (!solutionStep.board) return;
    
    // Assume the board is in the same format as the input
    // So we can use our parser to convert it
    const updatedBoardState = parsePuzzleInput(solutionStep.board);
    
    if (updatedBoardState) {
      setBoardState(updatedBoardState);
    } else {
      console.error("Failed to parse solution step:", solutionStep);
    }
  };

  // Control step navigation
  const handleNextStep = () => {
    if (currentStep < solution.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      updateBoardFromSolution(solution[newStep]);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      updateBoardFromSolution(solution[newStep]);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    if (solution.length > 0) {
      updateBoardFromSolution(solution[0]);
    }
  };

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Rush Hour Puzzle Solver</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <PuzzleBoard 
            boardState={boardState}
            currentStep={currentStep}
            solution={solution}
          />
          
          <ControlPanel
            onSolve={handleSolve}
            onPrevStep={handlePrevStep}
            onNextStep={handleNextStep}
            onReset={handleReset}
            canGoBack={currentStep > 0}
            canGoForward={currentStep < solution.length - 1}
            isRunning={status === "running"}
          />
        </div>

        <div className="space-y-6">
          <InputPanel 
            puzzleInput={puzzleInput} 
            setPuzzleInput={setPuzzleInput}
            onLoadPuzzle={handleLoadPuzzle}
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            heuristic={heuristic}
            setHeuristic={setHeuristic}
          />
          
          <OutputPanel
            status={status}
            time={time}
            movesCount={movesCount}
            statesExpanded={statesExpanded}
            solution={solution}
            currentStep={currentStep}
          />
        </div>
      </div>
    </main>
  );
}