import { NextResponse } from "next/server";
import { GameState } from "@main/core/state";
import { solveFromText, SolveResult } from "@main/solver";

export async function POST(req: Request) {
  const { content, algorithm, heuristic } = await req.json();

  // Now solveFromText returns { solution, nodesExpanded }
  const { solution, nodesExpanded }: SolveResult = await solveFromText(
    content,
    algorithm,
    heuristic
  );

  if (!solution) {
    return NextResponse.json(
      { error: "No solution found" },
      { status: 400 }
    );
  }

  // Build the path array from the returned GameState
  const path: { board: string; move?: any }[] = [];
  let cur: GameState | undefined = solution;
  while (cur) {
    path.unshift({ board: cur.board.serialize(), move: cur.lastMove });
    cur = cur.parent;
  }

  // Now `nodesExpanded` is available
  return NextResponse.json({ solution: path, nodesExpanded });
}
