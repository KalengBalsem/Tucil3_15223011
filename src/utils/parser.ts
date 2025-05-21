import fs from "fs";
import { Piece, Orientation } from "../core/piece";
import { Board } from "../core/board";

export function parsePuzzle(filePath: string): Board {
    const content = fs.readFileSync(filePath, "utf-8").trimEnd();
    const lines = content.split(/\r?\n/);

    if (lines.length < 3) {
        throw new Error("Invalid file format: not enough lines");
    }

    // parse dimensions
    const [dimLine, countLine, ...restLines] = lines;
    const [A, B] = dimLine.split(/\s+/).map(Number);
    if (!Number.isInteger(A) || !Number.isInteger(B)) {
        throw new Error(`Invalid dimensions line: ${dimLine}`);
    }

    // Parse number of non-primary pieces (unused for logic, but can validate)
    const N = parseInt(countLine, 10);
    if (isNaN(N) || N < 0) {
        throw new Error(`Invalid piece count: ${countLine}`)
    }

    // Process grid lines, handling exit 'K' outside the AxB grid
    const processedRows: string[] = [];
    let exitRow: number | null = null;
    let exitCol: number | null = null;

    for (let i = 0; i < restLines.length; i++) {
        const rowStr = restLines[i];
        // Case: extra line with exit on top/bottom
        if (rowStr.length <= B && rowStr.includes('K')) {
            const c = rowStr.indexOf('K');
            if (processedRows.length === 0) {
                exitRow = -1;
                exitCol = c;
            } else if (processedRows.length === A) {
                exitRow = A;
                exitCol = c;
            } else {
                throw new Error(`Unexpected exit line at row ${i}: ${rowStr}`);
            }
            continue;
        }
        // Case: normal or side-exit row
        if (rowStr.length === B) {
            processedRows.push(rowStr);
        } else if (rowStr.length === B + 1 && rowStr.includes('K')) {
            // exit on left or right edge
            if (rowStr[0] === 'K') {
                exitRow = processedRows.length;
                exitCol = -1;
                console.log(`Detected left exit at row ${exitRow}`)
                processedRows.push(rowStr.slice(1));
            } else if (rowStr[B] === 'K') {
                exitRow = processedRows.length;
                exitCol = B;
                processedRows.push(rowStr.slice(0, B));
            } else {
                throw new Error(`Invalid row with extra char: ${rowStr}`);
            }
        } else {
            throw new Error(
                `Grid line ${processedRows.length} length mismatch: expected ${B} or ${B + 1}, got ${rowStr.length}`
            );
        }
    }

    if (processedRows.length !== A) {
        throw new Error(`Expected ${A} grid rows, got ${processedRows.length}`);
    }
    if (exitRow === null || exitCol === null) {
        throw new Error('No exit (K) found on any edge');
    }

    // Collect cells for pieces
    type Cell = { char: string; row: number; col: number };
    const cells: Cell[] = [];
    for (let r = 0; r < A; r++) {
        const rowStr = processedRows[r];
        for (let c = 0; c < B; c++) {
            const ch = rowStr[c];
            if (ch === '.') continue;
            cells.push({ char: ch, row: r, col: c });
        }
    }

    // Group cells by piece ID
    const groups = new Map<string, Cell[]>();
    for (const cell of cells) {
        if (cell.char === 'K') continue;
        if (!groups.has(cell.char)) groups.set(cell.char, []);
        groups.get(cell.char)!.push(cell);
    }

    const pieces: Piece[] = [];
    let primary: Piece | null = null;

    for (const [id, pts] of groups.entries()) {
        // Determine orientation
        const sameRow = pts.every((p) => p.row === pts[0].row);
        const sameCol = pts.every((p) => p.col === pts[0].col);
        let orientation: Orientation;
        if (sameRow && !sameCol) orientation = 'H';
        else if (sameCol && !sameRow) orientation = 'V';
        else throw new Error(`Piece '${id}' has non-linear cells`);

        // Anchor is top-leftmost
        pts.sort((a, b) => a.row - b.row || a.col - b.col);
        const anchor = pts[0];
        const length = pts.length;

        const piece = new Piece(id, length, orientation, anchor.row, anchor.col);
        if (id === 'P') primary = piece;
        pieces.push(piece);
    }

    if (!primary) throw new Error('No primary piece (P) found');
    if (pieces.length !== N + 1) {
        console.warn(`Warning: parsed ${pieces.length - 1} non-primary, expected ${N}`);
    }

    return new Board(B, A, pieces, primary, exitRow, exitCol);
}

/**
 * Pure in-memory parser for Rush Hour puzzles from text.
 * Does not touch the filesystem.
 *
 * Expected input format:
 * 1st line: "<cols> <rows>"
 * 2nd line: "<nonPrimaryPieceCount>"
 * Next <rows> lines: strings of length <cols> with letters for pieces and '.' for empty.
 * Exit 'K' may appear on edges to indicate the exit location.
 */
export function parsePuzzleFromString(content: string): Board {
  // preserve leading spaces in each row
  const lines = content.trimEnd().split(/\r?\n/);
  if (lines.length < 3) throw new Error("Insufficient lines in puzzle input");

  // Parse dimensions
  const [dimLine, countLine, ...restLines] = lines;
  const [B, A] = dimLine.split(/\s+/).map(n => parseInt(n, 10)); // cols = B, rows = A
  if (!Number.isInteger(A) || !Number.isInteger(B)) {
    throw new Error(`Invalid dimensions line: ${dimLine}`);
  }

  // Optional: validate non-primary piece count
  const expectedNonPrimary = parseInt(countLine, 10);
  if (isNaN(expectedNonPrimary) || expectedNonPrimary < 0) {
    throw new Error(`Invalid piece count: ${countLine}`);
  }

  // Handle grid lines and exit detection
  const processedRows: string[] = [];
  let exitRow: number | null = null;
  let exitCol: number | null = null;

  for (const rowStrRaw of restLines) {
    const rowStr = rowStrRaw;
    // Extra line with only K (top/bottom exit)
    if (rowStr.length <= B && rowStr.includes('K')) {
      const c = rowStr.indexOf('K');
      exitRow = processedRows.length === 0 ? -1 : A;
      exitCol = c;
      console.log(`Detected exit at row ${exitRow}, col ${exitCol}`);
      continue;
    }
    // Normal or side-exit row
    if (rowStr.length === B) {
      processedRows.push(rowStr);
    } else if (rowStr.length === B + 1 && rowStr.includes('K')) {
      // Left or right edge exit
      if (rowStr[0] === 'K') {
        exitRow = processedRows.length;
        exitCol = -1;
        processedRows.push(rowStr.slice(1));
      } else if (rowStr[B] === 'K') {
        exitRow = processedRows.length;
        exitCol = B;
        processedRows.push(rowStr.slice(0, B));
      } else {
        throw new Error(`Invalid row with extra char: ${rowStr}`);
      }
    } else {
      throw new Error(
        `Grid line ${processedRows.length} length mismatch: expected ${B} or ${B + 1}, got ${rowStr.length}`
      );
    }
    if (processedRows.length === A) break;
  }

  if (processedRows.length !== A) {
    throw new Error(`Expected ${A} grid rows, got ${processedRows.length}`);
  }
  if (exitRow === null || exitCol === null) {
    throw new Error('No exit (K) found on any edge');
  }

  // Collect non-empty cells
  type Cell = { char: string; row: number; col: number };
  const cells: Cell[] = [];
  for (let r = 0; r < A; r++) {
    for (let c = 0; c < B; c++) {
      const ch = processedRows[r][c];
      if (ch !== '.') cells.push({ char: ch, row: r, col: c });
    }
  }

  // Group cells by piece ID (excluding 'K')
  const groups = new Map<string, Cell[]>();
  for (const cell of cells) {
    if (cell.char === 'K') continue;
    const arr = groups.get(cell.char) || [];
    arr.push(cell);
    groups.set(cell.char, arr);
  }

  const pieces: Piece[] = [];
  let primary: Piece | null = null;

  for (const [id, pts] of groups.entries()) {
    // Determine orientation
    const sameRow = pts.every(p => p.row === pts[0].row);
    const sameCol = pts.every(p => p.col === pts[0].col);
    let orientation: Orientation;
    if (sameRow && !sameCol) orientation = 'H';
    else if (sameCol && !sameRow) orientation = 'V';
    else throw new Error(`Piece '${id}' has non-linear cells`);

    // Sort to find anchor
    pts.sort((a, b) => a.row - b.row || a.col - b.col);
    const anchor = pts[0];
    const length = pts.length;

    const piece = new Piece(id, length, orientation, anchor.row, anchor.col);
    if (id === 'P') primary = piece;
    pieces.push(piece);
  }

  if (!primary) throw new Error('No primary piece (P) found');
  if (pieces.length !== expectedNonPrimary + 1) {
    console.warn(`Warning: parsed ${pieces.length - 1} non-primary, expected ${expectedNonPrimary}`);
  }

  // Construct and return board
  return new Board(B, A, pieces, primary, exitRow, exitCol);
}

