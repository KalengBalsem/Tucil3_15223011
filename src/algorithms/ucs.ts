import { Board } from "../core/board";
import { GameState } from "../core/state";
import { PriorityQueue } from "../utils/priorityQueue";

export function ucs( initialBoard: Board ): {solution?: GameState; nodesExpanded: number } {
    // Initial state
    const initialState: GameState = {
        board: initialBoard,
        g: 0,
        h: 0,
        f: 0,
        parent: undefined,
        lastMove: undefined,
    };

    // frontier: priority queue ordered by f (here f = g)
    const frontier = new PriorityQueue<GameState>();
    frontier.push(initialState, initialState.f);

    const visited = new Set<string>();

    let nodesExpanded = 0;

    while (frontier.size() > 0) {
        const state = frontier.pop()!;
        const key = state.board.serialize();
        if (visited.has(key)) {
            continue; // Skip already visited states
        }
        visited.add(key);

        // check goal
        if (state.board.isGoal()) {
            return { solution: state, nodesExpanded };
        }

        // Expand
        nodesExpanded++;
        const moves = state.board.generateMoves();
        for (const move of moves) {
            // clone board and apply move
            const boardClone = state.board.clone();
            // find piece and move
            const piece = boardClone.pieces.find((p) => p.id === move.pieceId)!;
            // apply the slide move
            piece.move(
                move.direction == 'left' || move.direction == 'up'
                    ? -move.distance
                    : move.distance
            );

            const newKey = boardClone.serialize();
            if (visited.has(newKey)) {
                continue;
            }

            const newState: GameState = {
                board: boardClone,
                g: state.g + 1,
                h: 0,
                f: state.g + 1,
                parent: state,
                lastMove: move,
            };
            frontier.push(newState, newState.f);
        }
    }

    // no solution found
    return { nodesExpanded };
}