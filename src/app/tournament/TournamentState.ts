import { Player } from '../player/Player';
import { ActiveGame } from './ActiveGame';
import { GameResult } from './GameResult';

export interface TournamentState {
  activeGame: ActiveGame;
  playerOne: {
    player: Player,
    name: string,
    score: number
  };
  playerTwo: {
    player: Player,
    name: string,
    score: number
  };
  gameResults: GameResult[];
}
