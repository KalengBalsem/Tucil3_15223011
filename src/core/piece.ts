export type Orientation = "H" | "V";

export class Piece {
    readonly id: string;
    readonly length: number;
    readonly orientation: Orientation;
    row: number;
    col: number;

    constructor(
        id: string,
        length: number,
        orientation: Orientation,
        row: number,
        col: number
    ){
        this.id = id;
        this.length = length;
        this.orientation = orientation;
        this.row = row;
        this.col = col;
    }

    public move(offset:number): void {
        if (this.orientation === "H") {
            this.col += offset;
        } else {
            this.row += offset;
        }
    }

    public clone(): Piece {
        return new Piece(this.id, this.length, this.orientation, this.row, this.col);
    }
}