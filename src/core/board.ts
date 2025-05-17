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
        // build occupancy map
        const occ = Array.from({ length: this.height }, () => Array<boolean>(this.width).fill(false)
        );
        for (const p of this.pieces) {
            for (let i = 0; i < p.length; i++) {
                const r = p.row + (p.orientation === "V" ? i : 0);
                const c = p.col + (p.orientation === "H" ? i : 0);
                occ[r][c] = true;
            }
        }

        const moves: Move[] = [];

        for (const p of this.pieces) {
            // remove own occupancy for sliding checks
            for (let i = 0; i < p.length; i++) {
                const r = p.row + (p.orientation === "V" ? i : 0);
                const c = p.col + (p.orientation === "H" ? i : 0);
                occ[r][c] = false;
            }

            // directions
            const deltas: [Direction, number][] = 
                p.orientation === "H"
                    ? [['left', -1], ['right', 1]]
                    : [['up', -1], ['down', 1]];
            for (const [dir, delta] of deltas) {
                let steps = 0;
                let r = p.row;
                let c = p.col;

                // try extending one cell at a time
                while (true) {
                    steps++;
                    const nr = r + (p.orientation === "V" ? delta : 0);
                    const nc = c + (p.orientation === "H" ? delta : 0);
                    // check bounds for all cells of piece after move
                    const endR = nr + (p.orientation === "V" ? p.length - 1 : 0);
                    const endC = nc + (p.orientation === "H" ? p.length - 1 : 0);
                    if (
                        nr < 0 || nc < 0 ||
                        endR >= this.height || endC >= this.width
                    ) {
                        break;
                    }
                    // check occupancy of the new cell at moving edge
                    const checkR = p.orientation === "V" ? (delta > 0 ? endR : nr) : r;
                    const checkC = p.orientation === "H" ? (delta > 0 ? endC : nc) : c;
                    if (occ[checkR][checkC]) {
                        break;
                    }

                    // record valid move
                    moves.push({ pieceId: p.id, direction: dir, distance: steps });
                }
            }

            // restore occupancy
            for (let i = 0; i < p.length; i++) {
                const r = p.row + (p.orientation === "V" ? i : 0);
                const c = p.col + (p.orientation === "H" ? i : 0);
                occ[r][c] = true;
            }
        }

        return moves;
    }
}