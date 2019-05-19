export const BOARD_HEIGHT = 6;
export const BOARD_WIDTH = 7;
export const CONNECT = 4;

export enum Color {
    Black = 1,
    Red = 2
}

export enum Piece {
    None = 0,
    Black = Color.Black,
    Red = Color.Red
}

export type Column = Piece[];

export type BoardState = Column[];

export type ColumnNumber = number;

export type RowNumber = number;

export type PlayedMoves = string;

export type PlayedMovesOrError = PlayedMoves | { error: string };

export function isPlayedMoves(moves: PlayedMovesOrError): moves is PlayedMoves {
    return typeof(moves) === 'string';
}
export interface Cell {
    row: RowNumber;
    column: ColumnNumber;
}
