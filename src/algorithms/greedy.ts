import { Board } from '../core/board';
import { GameState } from '../core/state';
import { Move } from '../core/move';
import { PriorityQueue } from '../utils/priorityQueue';
import { printSolution } from '../utils/printer';

// Import heuristic functions
import { manhattan } from '../heuristics/manhattan';
import { blockingDistance } from '../heuristics/blockingDistance';
import { combined } from '../heuristics/combined';

/**
 * Greedy Best-First Search: solely guided by heuristic h(n).
 * @param initialBoard - starting board
 * @returns solution and nodesExpanded
 */

export function greedy( initialBoard: Board, heuristic: 'manhattan' | 'blocking' | 'combined' = 'manhattan'): {solution?: GameState; nodesExpanded: number } {
    // select heuristic function
    const heuristicFn = heuristic === 'manhattan'
        ? manhattan
        : heuristic === 'blocking'
        ? blockingDistance
        : combined;    


    const initialState: GameState = {
        board: initialBoard,
        g: 0,
        h: heuristicFn(initialBoard),
        f: heuristicFn(initialBoard),
        parent: undefined,
        lastMove: undefined,
    };

    const frontier = new PriorityQueue<GameState>();
    frontier.push(initialState, initialState.h);

    const visited = new Set<string>();
    let nodesExpanded = 0;

    while (frontier.size() > 0) {
        const state = frontier.pop()!;
        const key = state.board.serialize();
        if (visited.has(key)) continue; // Skip already visited states
        visited.add(key);

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
            const serialized = boardClone.serialize();
            if (visited.has(serialized)) continue;

            const h = heuristicFn(boardClone);
            const newState: GameState = {
                board: boardClone,
                g: state.g + 1,
                h,
                f: h,
                parent: state,
                lastMove: move,
            };
            frontier.push(newState, h);
        }
    }

    return { nodesExpanded }
}