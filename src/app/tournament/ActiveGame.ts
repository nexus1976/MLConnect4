import { PlayedMoves, PlayedMovesOrError } from '../../engine/BoardState';

export interface ActiveGame {
    playedMoves: PlayedMovesOrError;
    startingMoves: PlayedMoves;
    isPlayerOneBlack: boolean;
}
