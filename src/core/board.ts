import { Piece } from './piece';
import { Move, Direction } from './move';

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

    public clone(): Board {
        // clone each piece
        const piecesClone = this.pieces.map((p) => new Piece(p.id, p.length, p.orientation, p.row, p.col));

        // find the cloned primary piece
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

    // check if primary piece is at the exit
    public isGoal(): boolean {
        if (this.primary.orientation !== "H") return false;
        return (
            this.primary.row === this.exitRow && this.primary.col + this.primary.length - 1 === this.exitCol
        );
    }

    // serialize the board into a unique string for hashing/visited-set
    public serialize(): string {
        const grid: string[][] = Array.from({ length: this.height }, () => Array(this.width).fill('.'));

        // place pieces
        for (const p of this.pieces) {
            for (let i = 0; i < p.length; i++) {
                const r = p.row + (p.orientation === "V" ? i : 0);
                const c = p.col + (p.orientation === "H" ? i : 0);
                grid[r][c] = p.id;
        
            }
        }

        // mark exit if empty
        if (grid[this.exitRow][this.exitCol] === '.') {
            grid[this.exitRow][this.exitCol] = 'K';
        }
        return grid.map((row) => row.join('')).join('|');
    }

    // Generate all legal moves from current board:
    // for each piece, slide in both directions until blocked.
    public generateMoves(): Move[] {
        // Build occupancy map
        const occ = Array.from({ length: this.height }, () =>
        Array<boolean>(this.width).fill(false)
        );
        for (const p of this.pieces) {
        for (let i = 0; i < p.length; i++) {
            const r = p.row + (p.orientation === 'V' ? i : 0);
            const c = p.col + (p.orientation === 'H' ? i : 0);
            occ[r][c] = true;
        }
        }

        const moves: Move[] = [];

        for (const p of this.pieces) {
            const { row, col, length, orientation, id } = p;
            if (orientation === 'H') {
            // LEFT slides
            for (let d = 1; ; d++) {
                const targetC = col - d;
                if (targetC >= 0) {
                if (occ[row][targetC]) break;
                moves.push({ pieceId: id, direction: 'left', distance: d });
                } else {
                // off-board left
                if (id === this.primary.id && row === this.exitRow && targetC === this.exitCol) {
                    moves.push({ pieceId: id, direction: 'left', distance: d });
                }
                break;
                }
            }
            // RIGHT slides
            const rightEnd = col + length - 1;
            for (let d = 1; ; d++) {
                const targetC = rightEnd + d;
                if (targetC < this.width) {
                if (occ[row][targetC]) break;
                moves.push({ pieceId: id, direction: 'right', distance: d });
                } else {
                // off-board right
                if (id === this.primary.id && row === this.exitRow && targetC === this.exitCol) {
                    moves.push({ pieceId: id, direction: 'right', distance: d });
                }
                break;
                }
            }
            } else {
            // VERTICAL: UP slides
            for (let d = 1; ; d++) {
                const targetR = row - d;
                if (targetR >= 0) {
                if (occ[targetR][col]) break;
                moves.push({ pieceId: id, direction: 'up', distance: d });
                } else {
                // off-board up
                if (id === this.primary.id && col === this.exitCol && targetR === this.exitRow) {
                    moves.push({ pieceId: id, direction: 'up', distance: d });
                }
                break;
                }
            }
            // DOWN slides
            const bottomEnd = row + length - 1;
            for (let d = 1; ; d++) {
                const targetR = bottomEnd + d;
                if (targetR < this.height) {
                if (occ[targetR][col]) break;
                moves.push({ pieceId: id, direction: 'down', distance: d });
                } else {
                // off-board down
                if (id === this.primary.id && col === this.exitCol && targetR === this.exitRow) {
                    moves.push({ pieceId: id, direction: 'down', distance: d });
                }
                break;
                }
            }
            }
        }

        return moves;
    }

}