import { Board } from '../core/board';
import { manhattan } from './manhattan';
import { blockingCount } from './blockingPieces';

export function combined(board: Board): number {
  return manhattan(board) + blockingCount(board);
}