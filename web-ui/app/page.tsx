"use client"

import { useState, useEffect } from "react"
import PuzzleBoard from "@/components/puzzle-board"
import InputPanel from "@/components/input-panel"
import ControlPanel from "@/components/control-panel"
import OutputPanel from "@/components/output-panel"
import { BoardState, SolutionStep, SolverStatus } from "@/types"
import { parsePuzzleInput } from "@/utils/board-parser"
import { updateBoardFromSolution } from "@/utils/solution-utils"

export default function Home() {
  // Board state
  const [boardState, setBoardState] = useState<BoardState | null>(null);
  const [puzzleInput, setPuzzleInput] = useState<string>("");
  
  // Algorithm settings
  const [algorithm, setAlgorithm] = useState<"ucs" | "astar" | "greedy">("astar");
  const [heuristic, setHeuristic] = useState<"manhattan" | "blocking" | "combined">("manhattan");
  
  // Solution state
  const [currentSolution, setCurrentSolution] = useState<{
    steps: SolutionStep[];
    nodesExpanded: number;
    moveCount: number;
  } | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // UI state
  const [status, setStatus] = useState<SolverStatus>("ready");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  
  // Play timer for auto-advancing steps
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isPlaying && currentSolution) {
      timer = setInterval(() => {
        if (currentStepIndex < currentSolution.steps.length - 1) {
          handleNextStep();
        } else {
          setIsPlaying(false);
        }
      }, 800);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentStepIndex, currentSolution]);
  
  // Handle loading a puzzle
  const handleLoadPuzzle = () => {
    setIsLoading(true);
    
    // Clear previous results
    setCurrentSolution(null);
    setIsPlaying(false);
    setCurrentStepIndex(0);
    
    try {
      const boardState = parsePuzzleInput(puzzleInput);
      
      if (!boardState) {
        console.error("Failed to parse puzzle input");
        setError("Failed to parse puzzle. Please check the format and try again.");
        setIsLoading(false);
        return;
      }
      
      // Set the board state
      setBoardState(boardState);
      setStatus("ready");
      setError(null);
    } catch (error) {
      console.error("Error loading puzzle:", error);
      setError("An error occurred while loading the puzzle.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle solving the puzzle
  const handleSolvePuzzle = async () => {
    if (!boardState) return;
    
    setIsLoading(true);
    setStatus("running");
    setError(null);
    
    const startTime = performance.now();
    
    try {
      // Send the puzzle to the API
      const response = await fetch("/api/solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: puzzleInput, 
          algorithm: algorithm,
          heuristic: heuristic,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to solve the puzzle");
      }
      
      const data = await response.json();
      console.log("Solution data:", data);
      
      if (!data.solution || data.solution.length === 0) {
        setError("No solution found for this puzzle.");
        setStatus("error");
        return;
      }
      
      setCurrentSolution({
        steps: data.solution,
        nodesExpanded: data.nodesExpanded,
        moveCount: data.solution.length - 1,
      });
      
      // Update the board to the initial state
      setCurrentStepIndex(0);
      if (data.solution.length > 0) {
        const newBoardState = updateBoardFromSolution(data.solution[0]);
        if (newBoardState) {
          setBoardState(newBoardState);
        }
      }
      
      setStatus("done");
      
      // Calculate solve time
      const endTime = performance.now();
      setTime(endTime - startTime);
    } catch (error) {
      console.error("Error solving puzzle:", error);
      setError(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Controls for stepping through the solution
  const handleNextStep = () => {
    if (!currentSolution) return;
    if (currentStepIndex < currentSolution.steps.length - 1) {
      const newStep = currentStepIndex + 1;
      setCurrentStepIndex(newStep);
      
      const newBoardState = updateBoardFromSolution(currentSolution.steps[newStep]);
      if (newBoardState) {
        setBoardState(newBoardState);
      }
    }
  };
  
  const handlePrevStep = () => {
    if (!currentSolution) return;
    if (currentStepIndex > 0) {
      const newStep = currentStepIndex - 1;
      setCurrentStepIndex(newStep);
      
      const newBoardState = updateBoardFromSolution(currentSolution.steps[newStep]);
      if (newBoardState) {
        setBoardState(newBoardState);
      }
    }
  };
  
  const handleReset = () => {
    if (!currentSolution) return;
    setCurrentStepIndex(0);
    
    const newBoardState = updateBoardFromSolution(currentSolution.steps[0]);
    if (newBoardState) {
      setBoardState(newBoardState);
    }
  };
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Rush Hour Puzzle Solver</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <PuzzleBoard 
            boardState={boardState ? boardState.grid : []}
            currentStep={currentStepIndex}
            solution={
              currentSolution
                ? currentSolution.steps.map(step => ({
                    board: step.board,
                    move: step.move
                      ? {
                          pieceId: step.move.piece,
                          direction: step.move.direction,
                          distance: step.move.distance,
                        }
                      : undefined,
                  }))
                : []
            }
          />
          
          <ControlPanel
            onSolve={handleSolvePuzzle}
            onPrevStep={handlePrevStep}
            onNextStep={handleNextStep}
            onReset={handleReset}
            onTogglePlayback={togglePlayback}
            isPlaying={isPlaying}
            canGoBack={currentStepIndex > 0}
            canGoForward={currentSolution ? currentStepIndex < currentSolution.steps.length - 1 : false}
            isSolved={status === "done"}
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
            movesCount={currentSolution ? currentSolution.moveCount : 0}
            statesExpanded={currentSolution ? currentSolution.nodesExpanded : 0}
            solution={currentSolution ? currentSolution.steps : []}
            currentStep={currentStepIndex}
          />
        </div>
      </div>
    </main>
  )
}