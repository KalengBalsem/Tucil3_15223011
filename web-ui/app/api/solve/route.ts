import { NextResponse } from "next/server";
import { parsePuzzleFromString } from "@main/utils/parser";
import { ucs } from "@main/algorithms/ucs";
import { aStar } from "@main/algorithms/a_star";
import { greedy } from "@main/algorithms/greedy";
import { reconstructPath } from "@main/utils/printer";

export async function POST(req: Request) {
  try {
    const { content, algorithm, heuristic } = await req.json();
    
    if (!content) {
      return NextResponse.json(
        { error: "No puzzle content provided" },
        { status: 400 }
      );
    }
    
    // Parse the board using your existing parser
    const board = parsePuzzleFromString(content);
    console.log("Parsed board:", board);
    
    // Select algorithm and solve
    let result;
    switch (algorithm) {
      case "ucs":
        result = ucs(board);
        break;
      case "astar":
        result = aStar(board, heuristic);
        break;
      case "greedy":
        result = greedy(board, heuristic);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid algorithm" },
          { status: 400 }
        );
    }
    
    const { solution, nodesExpanded } = result;
    
    if (!solution) {
      return NextResponse.json(
        { error: "No solution found" },
        { status: 404 }
      );
    }
    
    // Reconstruct the path from the solution
    const path = reconstructPath(solution);

    // Convert to format expected by frontend
    const solutionSteps = path.map((state, index) => ({
      board: state.board.serialize(),
      move: index > 0 ? {
        piece: state.lastMove!.pieceId,
        direction: state.lastMove!.direction,
        distance: state.lastMove!.distance,
      } : null
    }));
    
    return NextResponse.json({
      solution: solutionSteps,
      nodesExpanded,
      moveCount: solutionSteps.length - 1,  // First state is initial
      exitRow: board.exitRow,
      exitCol: board.exitCol,
    });
  } catch (error) {
    console.error("Solver error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to solve puzzle" },
      { status: 500 }
    );
  }
}

