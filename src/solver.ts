import { parsePuzzle } from "./utils/parser";
import { ucs } from "./algorithms/ucs";
import { aStar } from "./algorithms/a_star";
import { greedy } from "./algorithms/greedy";
import { ida } from "./algorithms/ida"; // Import the IDA* algorithm
import { GameState } from "./core/state";

export interface SolveResult {
    solution: GameState | null;
    nodesExpanded: number;
}

export async function solveFromText(
    content: string,
    algo: "ucs" | "astar" | "greedy" | "ida", // Add "ida" as an option
    heuristicName: "manhattan" | "blocking" | "combined" | "blockingCount" = "manhattan" // Add "blockingCount" as an option
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
        case "ida":
            result = ida(board, heuristicName); // Add IDA* algorithm handling
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
