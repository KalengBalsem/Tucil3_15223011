// src/core/board.ts
import { Piece } from './piece';
import { Move } from './move';

/**
 * Represents the game board, including all pieces and the exit.
 */
export class Board {
    readonly width: number;
    readonly height: number;
    readonly pieces: Piece[];
    readonly primary: Piece;
    readonly exitRow: number;
    readonly exitCol: number;

    constructor(
        width: number,
        height: number,
        pieces: Piece[],
        primary: Piece,
        exitRow: number,
        exitCol: number
    ) {
        this.width = width;
        this.height = height;
        this.pieces = pieces;
        this.primary = primary;
        this.exitRow = exitRow;
        this.exitCol = exitCol;
    }

    // Clone the board and its pieces.
    public clone(): Board {
        const piecesClone = this.pieces.map((p) => p.clone());
        const primaryClone = piecesClone.find((p) => p.id === this.primary.id)!;
        return new Board(
        this.width,
        this.height,
        piecesClone,
        primaryClone,
        this.exitRow,
        this.exitCol
        );
    }

    // Check if the primary piece has reached the exit.
    public isGoal(): boolean {
        const p = this.primary;
        const endR = p.row + (p.orientation === 'V' ? p.length - 1 : 0);
        const endC = p.col + (p.orientation === 'H' ? p.length - 1 : 0);
        return endR === this.exitRow && endC === this.exitCol;
    }

    // Serialize the board into a unique string for hashing/visited-set.
    public serialize(): string {
    const maxR = Math.max(this.height, this.exitRow + 1);
    const maxC = Math.max(this.width,  this.exitCol + 1);
    const occ = Array.from({length: maxR}, () => Array(maxC).fill(false));
    // mark pieces
    for (const p of this.pieces) {
        for (let i = 0; i < p.length; i++) {
        const r = p.row + (p.orientation === 'V' ? i : 0);
        const c = p.col + (p.orientation === 'H' ? i : 0);
        if (r >= 0 && r < maxR && c >= 0 && c < maxC) {
            occ[r][c] = true;
        }
        }
    }

    // build string, but if it's the exit cell, print 'K'
    return occ
        .map((rowArr, r) =>
        rowArr
            .map((occupied, c) =>
            occupied
                ? this.cellAt(r, c)!    // piece ID
                : (r === this.exitRow && c === this.exitCol ? 'K' : '.')
            )
            .join('')
        )
        .join('|');
    }


    // Generate all legal moves from current board state.
    public generateMoves(): Move[] {
        const occ = this.buildOccMap();
        const moves: Move[] = [];

        for (const p of this.pieces) {
        // Remove p's occupancy
        this.toggleOccupancy(occ, p, false);
        const { row, col, length, orientation, id } = p;
        const isPrimary = id === this.primary.id;

        // Direction offsets for sliding
        const directions = orientation === 'H'
            ? [{ dir: 'left', dr: 0, dc: -1 }, { dir: 'right', dr: 0, dc: 1 }]
            : [{ dir: 'up', dr: -1, dc: 0 }, { dir: 'down', dr: 1, dc: 0 }];

        for (const { dir, dr, dc } of directions) {
            const leadR = row + (orientation === 'V' && dr > 0 ? length - 1 : 0);
            const leadC = col + (orientation === 'H' && dc > 0 ? length - 1 : 0);

            for (let d = 1;; d++) {
            const nr = leadR + dr * d;
            const nc = leadC + dc * d;
            // Inside board
            if (nr >= 0 && nr < this.height && nc >= 0 && nc < this.width) {
                if (occ[nr][nc]) break;
                moves.push({ pieceId: id, direction: dir as any, distance: d });
                continue;
            }
            // Off-board: only primary to exit
            if (
                isPrimary &&
                nr === this.exitRow &&
                nc === this.exitCol
            ) {
                moves.push({ pieceId: id, direction: dir as any, distance: d });
            }
            break;
            }
        }
        // Restore p's occupancy
        this.toggleOccupancy(occ, p, true);
        }
        return moves;
    }

    //Return character at (row,col): piece ID, 'K', '.', or null out of bounds.
    public cellAt(row: number, col: number): string | null {
        if (row < 0 || row >= this.height || col < 0 || col >= this.width) return null;
        if (row === this.exitRow && col === this.exitCol) return 'K';
        for (const p of this.pieces) {
        for (let i = 0; i < p.length; i++) {
            const r = p.row + (p.orientation === 'V' ? i : 0);
            const c = p.col + (p.orientation === 'H' ? i : 0);
            if (r === row && c === col) return p.id;
        }
        }
        return '.';
    }


    //Build occupancy map: true if occupied by any piece.
    public buildOccMap(): boolean[][] {
        const occ = Array.from({ length: this.height }, () =>
        Array(this.width).fill(false)
        );
        for (const p of this.pieces) {
        this.toggleOccupancy(occ, p, true);
        }
        return occ;
    }

    // Toggle occupancy of a piece on the map.
    private toggleOccupancy(
        occ: boolean[][],
        p: Piece,
        state: boolean
    ) {
        for (let i = 0; i < p.length; i++) {
        const r = p.row + (p.orientation === 'V' ? i : 0);
        const c = p.col + (p.orientation === 'H' ? i : 0);
        if (r >= 0 && r < this.height && c >= 0 && c < this.width) {
            occ[r][c] = state;
        }
        }
    }

    // get grid
    public getGrid(): string[][] {
        const grid: string[][] = Array.from({ length: this.height }, () =>
        Array(this.width).fill('.')
        );
        for (const p of this.pieces) {
        for (let i = 0; i < p.length; i++) {
            const r = p.row + (p.orientation === 'V' ? i : 0);
            const c = p.col + (p.orientation === 'H' ? i : 0);
            if (r >= 0 && r < this.height && c >= 0 && c < this.width) {
            grid[r][c] = p.id;
            }
        }
        }
        grid[this.exitRow][this.exitCol] = 'K';
        return grid;
    }
}
