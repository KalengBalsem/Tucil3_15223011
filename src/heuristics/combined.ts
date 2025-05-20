import { Board } from '../core/board';
import { manhattan } from './manhattan';
import { blockingDistance } from './blockingDistance';

export function combined(board: Board): number {
  return manhattan(board) + blockingDistance(board);
}