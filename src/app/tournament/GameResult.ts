import { PlayedMoves } from '../../engine/BoardState';

export interface GameResult {
  playedMoves: PlayedMoves;
  startingMoves: PlayedMoves;
  endedFromError: boolean;
  isPlayerOneBlack: boolean;
  playerOneWon: boolean;
  playerTwoWon: boolean;
  playerOneName: string;
  playerTwoName: string;
  error: string;
}
