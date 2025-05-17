import { Board } from './board';
import { Move } from './move';

export interface GameState {
    board: Board;
    g: number;          // cost to reach this state
    h: number;          // heuristic cost
    f: number;          // g + h
    parent?: GameState; // for solution path reconstruction
    lastMove?: Move;
}

