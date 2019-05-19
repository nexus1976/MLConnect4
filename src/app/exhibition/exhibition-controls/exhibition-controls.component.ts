import { map } from 'rxjs/operators';
import { isBoardFull, isWinningMove, lastPlayedPiece } from 'src/engine/engine';

import { Component, ElementRef, ViewChild } from '@angular/core';

import { Color, Piece } from '../../../engine/BoardState';
import { EngineService } from '../../game/engine.service';
import { Player } from '../../player/Player';
import { PlayersService } from '../../player/players.service';

@Component({
  selector: 'app-exhibition-controls',
  templateUrl: './exhibition-controls.component.html',
  styleUrls: ['./exhibition-controls.component.scss']
})
export class ExhibitionControlsComponent {
  public Color = Color;

  public playedMoves$ = this.engineService.playedMoves();

  @ViewChild('startPos')
  public startingPosInput: ElementRef;

  public gameState$ = this.engineService.playedMovesWithErrors().pipe(
    map((playedMoves) =>
      !(typeof playedMoves === 'string')
      ? `Error: ${JSON.stringify(playedMoves.error)}`
      : isWinningMove(playedMoves)
      ? `${lastPlayedPiece(playedMoves) === Piece.Black ? 'Black' : 'Red'} Won!`
      : isBoardFull(playedMoves)
      ? 'Game is Drawn'
      : `${lastPlayedPiece(playedMoves) === Piece.Black ? 'Red' : 'Black'}s turn...`
    )
  );

  constructor(
    private engineService: EngineService,
    private playersService: PlayersService
  ) {

  }

  public newGame() {
    const startPos = this.startingPosInput.nativeElement.value;
    const sanitizedPos = startPos.replace( /\D/g, '');
    this.engineService.startingPosition(sanitizedPos);
    this.engineService.newGame();
  }

  public updatePlayer(color: Color, player: Player) {
    this.playersService.setPlayer(color, player);
  }
}
