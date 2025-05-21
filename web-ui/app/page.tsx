"use client";

import { useState, useEffect, useCallback } from "react";
import PuzzleBoard from "@/components/puzzle-board";
import ControlPanel from "@/components/control-panel";
import InputPanel from "@/components/input-panel";
import OutputPanel from "@/components/output-panel";
import { updateBoardFromSolution } from "@/utils/solution-utils";
import { BoardState, SolutionStep } from "@/types";

export default function Home() {
  // File content from uploaded file
  const [fileContent, setFileContent] = useState<string>("");

  // Solver configuration
  const [algorithm, setAlgorithm] = useState<"ucs" | "astar" | "greedy" | "ida">("astar");
  const [heuristic, setHeuristic] = useState<"manhattan" | "blocking" | "combined" | "blockingCount">("manhattan");

  // Solver result
  const [solution, setSolution] = useState<SolutionStep[]>([]);
  const [exitRow, setExitRow] = useState<number>(-1);
  const [exitCol, setExitCol] = useState<number>(-1);

  // UI status & stats
  const [status, setStatus] = useState<"ready" | "running" | "done" | "error">("ready");
  // Removed unused isLoading state
  const [time, setTime] = useState<number>(0);
  // Removed unused isLoading state
  const [movesCount, setMovesCount] = useState<number>(0);
  const [statesExpanded, setStatesExpanded] = useState<number>(0);

  // Which step of `solution` to show
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Current board visualization data
  const [boardState, setBoardState] = useState<BoardState | null>(null);

  const handleFileLoad = (content: string) => {
    setFileContent(content);
    setStatus("ready");
    setSolution([]);
    setCurrentStep(0);
    setExitRow(-1);
    setExitCol(-1);
    setTime(0);
    setMovesCount(0);
    setStatesExpanded(0);

    // Parse the initial board state from the file content
    const initialBoardState = updateBoardFromSolution({ board: content, move: null });
    if (initialBoardState) {
      setBoardState(initialBoardState);
    } else {
      setBoardState(null); // Reset if parsing fails
    }
  };

  // Solve the current puzzle
  const handleSolve = async () => {
    if (!fileContent) return;

    setIsPlaying(true);
    setStatus("running");
    setTime(0);
    setMovesCount(0);
    setStatesExpanded(0);

    const startTime = performance.now();
    try {
      const response = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: fileContent, algorithm, heuristic }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to solve the puzzle");
      }

      const data = await response.json();
      if (!data.solution || data.solution.length === 0) {
        setStatus("error");
        return;
      }

      // Destructure API data
      const { solution: sol, nodesExpanded, exitRow: eRow, exitCol: eCol } = data;

      setSolution(sol as SolutionStep[]);
      setExitRow(eRow);
      setExitCol(eCol);
      setMovesCount(sol.length - 1);
      setStatesExpanded(nodesExpanded || 0);

      // Initial board state
      const initial = updateBoardFromSolution(sol[0]);
      if (initial) setBoardState(initial);
      setCurrentStep(0);

      setStatus("done");
      const endTime = performance.now();
      setTime((endTime - startTime) / 1000);
    } catch (err) {
      console.error("Solver error:", err);
      setStatus("error");
    } finally {
      setIsPlaying(false);
    }
  };

  // Step navigation
  const handleNextStep = useCallback(() => {
    if (currentStep < solution.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      const board = updateBoardFromSolution(solution[next]);
      if (board) setBoardState(board);
    }
  }, [currentStep, solution]);

  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      const board = updateBoardFromSolution(solution[prev]);
      if (board) setBoardState(board);
    }
  };

  const handleReset = () => {
    if (solution.length > 0) {
      setCurrentStep(0);
      const board = updateBoardFromSolution(solution[0]);
      if (board) setBoardState(board);
    }
  };

  // Auto-play (optional)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && solution.length > 0) {
      timer = setInterval(() => {
        if (currentStep < solution.length - 1) {
          handleNextStep();
        } else {
          setIsPlaying(false);
        }
      }, 800);
    }
    return () => clearInterval(timer!);
  }, [isPlaying, currentStep, solution]);

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Rush Hour Puzzle Solver</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <PuzzleBoard
            boardState={boardState?.grid || []} // Use `boardState` instead of `initialBoardState`
            currentStep={currentStep}
            solution={solution.map(step => ({
              board: step.board,
              move: step.move
          ? {
              pieceId: (step.move as { piece?: string; pieceId?: string }).piece ?? (step.move as { piece?: string; pieceId?: string }).pieceId ?? "",
              direction: (step.move as { direction: string }).direction,
              distance: (step.move as { distance: number }).distance,
            }
          : undefined,
            }))}
            exitRow={exitRow}
            exitCol={exitCol}
          />

          <ControlPanel
            onSolve={handleSolve}
            onPrevStep={handlePrevStep}
            onNextStep={handleNextStep}
            onReset={handleReset}
            onTogglePlayback={() => setIsPlaying(p => !p)}
            onJumpToEnd={() => {
              if (solution.length > 0) {
          setIsPlaying(false); // Stop any ongoing playback
          setCurrentStep(solution.length - 1);
          const board = updateBoardFromSolution(solution[solution.length - 1]);
          if (board) setBoardState(board);
              }
            }}
            isPlaying={isPlaying}
            canGoBack={currentStep > 0}
            canGoForward={currentStep < solution.length - 1}
            isRunning={status === "running"}
            isSolved={status === "done" && solution.length > 0}
          />
        </div>

        <div className="space-y-6">
          <InputPanel
            onFileLoad={handleFileLoad}
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
            solution={solution.map(step => ({
              move: step.move
                ? {
                    pieceId: (step.move as { piece?: string; pieceId?: string }).piece ?? (step.move as { piece?: string; pieceId?: string }).pieceId ?? "",
                    direction: step.move.direction,
                    distance: step.move.distance,
                  }
                : undefined,
            }))}
            currentStep={currentStep}
          />
        </div>
      </div>
    </main>
  );
}