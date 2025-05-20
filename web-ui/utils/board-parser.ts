import { BoardState, PieceInfo } from '@/types';

export const EXIT_CELL = -1;

export function parsePuzzleInput(input: string): BoardState | null {
  try {
    const lines = input.trim().split(/\r?\n/).map(l => l.trim());
    if (lines.length < 3) return null;

    // Parse dimensions
    const [dimLine, countLine, ...boardRows] = lines;
    const [width, height] = dimLine.split(/\s+/).map(Number);
    
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      throw new Error(`Invalid dimensions: ${dimLine}`);
    }

    // Initialize grid and track piece cells
    const grid: number[][] = Array(height).fill(0).map(() => Array(width).fill(0));
    const cellsByPiece: Record<string, {row: number, col: number}[]> = {};
    
    // Process board rows
    for (let row = 0; row < height && row < boardRows.length; row++) {
      const rowStr = boardRows[row];
      
      for (let col = 0; col < width && col < rowStr.length; col++) {
        const cell = rowStr[col];
        
        if (cell === '.') {
          // Empty cell
          grid[row][col] = 0;
        } else if (cell === 'K') {
          // Exit cell
          grid[row][col] = EXIT_CELL;
        } else {
          // Piece cell
          if (!cellsByPiece[cell]) {
            cellsByPiece[cell] = [];
          }
          cellsByPiece[cell].push({row, col});
        }
      }
    }
    
    // Process pieces
    const pieces: PieceInfo[] = [];
    let pieceId = 1;
    
    for (const [char, cells] of Object.entries(cellsByPiece)) {
      // Sort cells to find the top-left cell (anchor)
      cells.sort((a, b) => a.row - b.row || a.col - b.col);
      const anchor = cells[0];
      
      // Determine orientation
      const sameRow = cells.every(c => c.row === anchor.row);
      const sameCol = cells.every(c => c.col === anchor.col);
      
      let orientation: 'h' | 'v';
      if (sameRow && !sameCol) {
        orientation = 'h';
      } else if (sameCol && !sameRow) {
        orientation = 'v';
      } else {
        throw new Error(`Piece '${char}' has invalid cell layout`);
      }
      
      // Create piece
      pieces.push({
        id: char,
        orientation,
        size: cells.length,
        row: anchor.row,
        col: anchor.col
      });
      
      // Mark cells in the grid
      for (const cell of cells) {
        grid[cell.row][cell.col] = pieceId;
      }
      
      pieceId++;
    }
    
    return { grid, pieces, width, height };
  } catch (error) {
    console.error("Failed to parse puzzle input:", error);
    return null;
  }
}