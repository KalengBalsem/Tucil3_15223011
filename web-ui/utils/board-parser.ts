// board-parser.ts
import { BoardState, PieceInfo } from '@/types';

export const EXIT_CELL = -1;

export interface BoardStateExtended extends BoardState {
  /** Map piece character (e.g. 'P') to numeric ID used in grid */
  charToNum: Record<string, number>;
  /** Exit position relative to the original grid */
  exitRow: number;
  exitCol: number;
}

/**
 * Parses a Rush Hour puzzle from text input into:
 *  - numeric grid (0=empty, >0 piece IDs, -1 exit)
 *  - PieceInfo list
 *  - charToNum map for stable mapping preserving input order
 *  - exitRow/exitCol for outside-exit positioning
 *
 * Format:
 *  1st line: "<rows> <cols>"
 *  2nd line: "<nonPrimaryCount>" (unused here)
 *  Following lines: grid rows of length cols or cols+1 when 'K' marks exit on an edge
 */