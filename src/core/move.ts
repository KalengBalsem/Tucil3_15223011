export type Direction = "up" | "down" | "left" | "right";

export interface Move {
    pieceId: string;
    direction: Direction;
    distance: number;
}