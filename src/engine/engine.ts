import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, expand, map, mergeMap } from 'rxjs/operators';

import { Player } from '../app/player/Player';
import {
	BOARD_HEIGHT, BOARD_WIDTH, BoardState, Color, ColumnNumber, CONNECT, Piece, PlayedMoves,
	PlayedMovesOrError, RowNumber
} from './BoardState';

export function playGame(redPlayer: Player, blackPlayer: Player, startingPosition: string): Observable<PlayedMovesOrError> {
    return of(startingPosition).pipe(
        expand((playedMoves) => getNextMove(playedMoves, blackPlayer, redPlayer).pipe(
            mergeMap((nextMove) => isLegalMove(playedMoves, nextMove)
                ? of(nextMove)
                : throwError(`Invalid Move: ${playedMoves} - ${nextMove}`)
            ),
            map((nextMove) => playedMoves + nextMove)
        )),
        catchError((error) => of({ error })),
    );
}

export function getNextMove(playedMoves: PlayedMoves, blackPlayer: Player, redPlayer: Player): Observable<ColumnNumber> {
    if (isWinningMove(playedMoves) || isBoardFull(playedMoves)) {
        return EMPTY;
    }

    const player = nextPlayerToMove(playedMoves) === Color.Black ? blackPlayer : redPlayer;

    return player.getNextMove(playedMoves);
}

export function isWinningMove(playedMoves: PlayedMoves): boolean {
    const boardState = playedMovesToBoardState(playedMoves);
    const piece = lastPlayedPiece(playedMoves);
    const row = lastPlayedRow(playedMoves);
    const colNum = lastPlayedColumn(playedMoves);
    const vectorCount = (c: number, r: number, x: number, y: number) =>
        (boardState[c - 1] || [])[r - 1] === piece
        ? vectorCount(c + x, r + y, x, y) + 1 : 0;

    return [[1, 0], [0, 1], [1, 1], [1, -1]].some(([x, y]) =>
        vectorCount(colNum, row, x, y) + vectorCount(colNum, row, x * -1, y * -1) > CONNECT
    );
}

export function isWinningMoveWithWinners(playedMoves: PlayedMoves): { hasWinner: boolean, winningPieces: { c: number, r: number }[] } {
    const boardState = playedMovesToBoardState(playedMoves);
    const piece = lastPlayedPiece(playedMoves);
    const row = lastPlayedRow(playedMoves);
    const colNum = lastPlayedColumn(playedMoves);
    let winningPieces = [];

    const vectorCount = (c: number, r: number, x: number, y: number) => {
        if ((boardState[c - 1] || [])[r - 1] === piece) {
            winningPieces.push({ c, r });
            return vectorCount(c + x, r + y, x, y) + 1;
        } else {
            return 0;
        }
    };

    const hasWinner = [[1, 0], [0, 1], [1, 1], [1, -1]].some(([x, y]) => {
        winningPieces = [];
        return vectorCount(colNum, row, x, y) + vectorCount(colNum, row, x * -1, y * -1) > CONNECT;
    });

    winningPieces = hasWinner ? winningPieces : [];

    return {
        hasWinner,
        winningPieces
    };
}

export function lastPlayedRow(playedMoves: PlayedMoves): RowNumber {
    const colNum = lastPlayedMove(playedMoves);
    return playedMoves.split('').filter((col) => col === colNum).length;
}

export function lastPlayedMove(playedMoves: PlayedMoves): string {
    return playedMoves[playedMoves.length - 1];
}

export function lastPlayedColumn(playedMoves: PlayedMoves): ColumnNumber {
    return Number.parseInt(lastPlayedMove(playedMoves), 10);
}

export function lastPlayedPiece(playedMoves: PlayedMoves): Piece {
    return nextPlayerToMove(playedMoves) === Color.Black ? Piece.Red : Piece.Black;
}

export function nextPlayerToMove(playedMoves: PlayedMoves): Color {
    return playedMoves.length % 2 + 1;
}

export function isColumnFull(playedMoves: PlayedMoves, colNum: ColumnNumber): boolean {
    return playedMoves.split('').filter((colStr) => Number.parseInt(colStr, 10) === colNum).length >= BOARD_HEIGHT;
}

export function isBoardFull(playedMoves: PlayedMoves): boolean {
    return playedMoves.length >= BOARD_HEIGHT * BOARD_WIDTH;
}

export function isLegalMove(playedMoves: PlayedMoves, colNum: ColumnNumber): boolean {
    return colNum >= 1 && colNum <= BOARD_WIDTH && !isColumnFull(playedMoves, colNum);
}

export function playedMovesToBoardState(playedMoves: string): BoardState {
    const emptyBoardState: BoardState = Array.from(Array(BOARD_WIDTH), () => []);
    return playedMoves.split('').reduce(
        ([ piece, boardState], move) => [
            piece === Piece.Black ? Piece.Red : Piece.Black,
            boardState[Number.parseInt(move, 10) - 1].push(piece) && boardState as any
        ],
        [Piece.Black, emptyBoardState] as [Piece, BoardState]
    )[1];
}

