import { parsePuzzle } from "./utils/parser";
import { ucs } from "./algorithms/ucs";
import { aStar } from "./algorithms/a_star";
import { greedy } from "./algorithms/greedy";
import { GameState } from "./core/state";

export interface SolveResult {
    solution: GameState | null;
    nodesExpanded: number;
}

export async function solveFromText(
    content: string,
    algo: "ucs" | "astar" | "greedy",
    heuristicName: "manhattan" | "blocking" | "combined" = "manhattan"
): Promise<SolveResult> {
    const board = parsePuzzle(content);
    let result:
        | { solution?: GameState; nodesExpanded: number }
        | undefined;

    switch (algo) {
        case "ucs":
            result = ucs(board);
            break;
        case "astar":
            result = aStar(board, heuristicName);
            break;
        case "greedy":
            result = greedy(board, heuristicName);
            break;
        default:
            throw new Error("Unsupported algorithm");
    }

    // Return both the found GameState (or null) and stats
    return {
        solution: result?.solution ?? null,
        nodesExpanded: result?.nodesExpanded ?? 0,
    };
}
