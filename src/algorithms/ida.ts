// src/algorithms/ida.ts
import { Board } from '../core/board';
import { GameState } from '../core/state';
import { Move } from '../core/move';

import { manhattan } from '../heuristics/manhattan';
import { blockingCount } from '../heuristics/blockingPieces';
import { blockingDistance } from '../heuristics/blockingDistance';
import { combined } from '../heuristics/combined';

type HeuristicType = 'manhattan' | 'blockingCount' | 'blocking' | 'combined';

const heuristics: Record<HeuristicType, (board: Board) => number> = {
  manhattan,
  blockingCount,
  blocking: blockingDistance,
  combined,
};

/**
 * IDA* Search: Iterative Deepening A* with selectable heuristic.
 * Memory-efficient, but may re-expand nodes across iterations.
 */
export function ida(
  initialBoard: Board,
  heuristic: HeuristicType = 'manhattan'
): { solution?: GameState; nodesExpanded: number } {
  const hFn = heuristics[heuristic];
  const startH = hFn(initialBoard);
  let threshold = startH;
  let nodesExpanded = 0;

  // path stack of GameStates
  const rootState: GameState = {
    board: initialBoard,
    g: 0,
    h: startH,
    f: startH,
    parent: undefined,
    lastMove: undefined,
  };
  const path: GameState[] = [rootState];

  let solution: GameState | undefined;

  function dfs(limit: number): number {
    const current = path[path.length - 1];
    nodesExpanded++;
    const f = current.g + current.h;
    if (f > limit) {
      return f;
    }
    if (current.board.isGoal()) {
      solution = current;
      return -Infinity; // signal found
    }

    let minThreshold = Infinity;
    const moves = current.board.generateMoves();
    for (const move of moves) {
      // apply move: clone board and create new state
      const boardClone = current.board.clone();
      const piece = boardClone.pieces.find((p) => p.id === move.pieceId)!;
      piece.move(
        move.direction === 'left' || move.direction === 'up' ? -move.distance : move.distance
      );
      const serialized = boardClone.serialize();
      // avoid immediate cycles
      if (path.some((s) => s.board.serialize() === serialized)) {
        continue;
      }
      const g2 = current.g + 1;
      const h2 = hFn(boardClone);
      const state2: GameState = {
        board: boardClone,
        g: g2,
        h: h2,
        f: g2 + h2,
        parent: current,
        lastMove: move,
      };

      path.push(state2);
      const t = dfs(limit);
      if (t === -Infinity) {
        return -Infinity; // found
      }
      if (t < minThreshold) {
        minThreshold = t;
      }
      path.pop();
    }
    return minThreshold;
  }

  while (true) {
    const t = dfs(threshold);
    if (t === -Infinity) {
      // solution found
      break;
    }
    if (t === Infinity) {
      // no solution
      break;
    }
    threshold = t;
  }

  return { solution, nodesExpanded };
}
