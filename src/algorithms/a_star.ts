import { Board } from '../core/board';
import { GameState } from '../core/state';
import { Move } from '../core/move';
import { PriorityQueue } from '../utils/priorityQueue';

// Import heuristic functions
import { manhattan } from '../heuristics/manhattan';
import { blockingCount } from '../heuristics/blockingPieces';
import { blockingDistance } from '../heuristics/blockingDistance';
import { combined } from '../heuristics/combined';

export function aStar(
    initialBoard: Board,
    heuristic: 'manhattan' | 'blocking' | 'blockingCount' | 'combined' = 'manhattan'
): { solution?: GameState; nodesExpanded: number } {
    // select heuristic function
    const heuristicFn =
        heuristic === 'manhattan'
            ? manhattan
            : heuristic === 'blocking'
            ? blockingDistance
            : heuristic === 'blockingCount'
            ? blockingCount
            : combined;

    // initial state
    const h0 = heuristicFn(initialBoard);
    const initialState: GameState = {
        board: initialBoard,
        g: 0,
        h: h0,
        f: h0,
        parent: undefined,
        lastMove: undefined,
    };

    // frontier ordered by f(n) = g(n) + h(n)
    const frontier = new PriorityQueue<GameState>();
    frontier.push(initialState, initialState.f);

    const visited = new Map<string, number>();
    let nodesExpanded = 0;

    while (frontier.size() > 0) {
        const state = frontier.pop()!;
        const key = state.board.serialize();
        
        if (visited.has(key) && visited.get(key)! <= state.g) continue; // Skip already visited states
        visited.set(key, state.g);

        // goal check
        if (state.board.isGoal()) {
            return { solution: state, nodesExpanded };
        }

        // expand
        nodesExpanded++;
        const moves: Move[] = state.board.generateMoves();
        for (const move of moves) {
            const boardClone = state.board.clone();
            const piece = boardClone.pieces.find((p) => p.id === move.pieceId)!;
            piece.move(
                move.direction === 'left' || move.direction === 'up'
                    ? -move.distance
                    : move.distance
            );

            const newG = state.g + 1;
            const serialized = boardClone.serialize();
            if (visited.has(serialized) && visited.get(serialized)! <= newG) continue;

            const newH = heuristicFn(boardClone);
            const newF = newG + newH;
            const newState: GameState = {
                board: boardClone,
                g: newG,
                h: newH,
                f: newF,
                parent: state,
                lastMove: move,
            };
            frontier.push(newState, newF);
        }
    }

    return { nodesExpanded };
}