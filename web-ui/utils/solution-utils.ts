import { BoardState, PieceInfo, SolutionStep } from '@/types';
import { EXIT_CELL } from './board-parser';

export function updateBoardFromSolution(solutionStep: SolutionStep): BoardState | null {
  if (!solutionStep || !solutionStep.board) return null;
  
  try {
    // Convert the serialized board into a grid
    const lines = solutionStep.board.trim().split('\n');
    const height = lines.length;
    const width = lines[0].length;
    
    const grid: number[][] = Array(height).fill(0).map(() => Array(width).fill(0));
    const pieces: PieceInfo[] = [];
    
    // Track all piece cells
    const cellsByPiece: Record<string, {row: number, col: number}[]> = {};
    
    // Process the board representation
    for (let row = 0; row < height; row++) {
      const rowStr = lines[row];
      for (let col = 0; col < width; col++) {
        const cell = rowStr[col];
        
        if (cell === '.') {
          // Empty cell
          grid[row][col] = 0;
        } else if (cell === 'K') {
          // Exit cell
          grid[row][col] = EXIT_CELL;
        } else {
          // Add to piece cells
          if (!cellsByPiece[cell]) {
            cellsByPiece[cell] = [];
          }
          cellsByPiece[cell].push({row, col});
        }
      }
    }
    
    // Process pieces
    let pieceId = 1;
    for (const [char, cells] of Object.entries(cellsByPiece)) {
      // Sort cells by position to find top-left
      cells.sort((a, b) => a.row - b.row || a.col - b.col);
      const [firstCell] = cells;
      
      // Determine orientation and size
      const sameRow = cells.every(c => c.row === firstCell.row);
      const sameCol = cells.every(c => c.col === firstCell.col);
      
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
        row: firstCell.row,
        col: firstCell.col
      });
      
      // Mark cells in the grid
      for (const cell of cells) {
        grid[cell.row][cell.col] = pieceId;
      }
      
      pieceId++;
    }
    
    return { grid, pieces, width, height };
  } catch (error) {
    console.error("Failed to parse solution step:", error, solutionStep);
    return null;
  }
}