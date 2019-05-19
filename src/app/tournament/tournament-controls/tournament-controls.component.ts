import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

import { Player } from '../../player/Player';
import { OpeningBookQuery } from '../OpeningBookQuery';

export enum PlayerNumber {
  PlayerOne,
  PlayerTwo
}
@Component({
  selector: 'app-tournament-controls',
  templateUrl: './tournament-controls.component.html',
  styleUrls: ['./tournament-controls.component.scss']
})
export class TournamentControlsComponent {
  public PlayerNumber = PlayerNumber;

  @Output()
  public newGameRequested = new EventEmitter<OpeningBookQuery>();

  @Output()
  public playerUpated = new EventEmitter<{ playerNumber: PlayerNumber, player: Player }>();

  @ViewChild('numberOfGames')
  public numberOfGamesInput: ElementRef;

  @ViewChild('openBookStartIdx')
  public openBookStartIdxInput: ElementRef;

  constructor(
  ) {

  }

  public newGame() {
    const numberOfGamesVal = this.numberOfGamesInput.nativeElement.value;
    const openBookStartIdxVal = this.openBookStartIdxInput.nativeElement.value;
    const numberOfGames = Number.parseInt(numberOfGamesVal, 10);
    const openBookStartIdx = Number.parseInt(openBookStartIdxVal, 10) || 0;

    if (Number.isNaN(numberOfGames) || numberOfGames <= 0) {
      return;
    }

    this.newGameRequested.emit({
      numberOfGames,
      openBookStartIdx
    });
  }

  public updatePlayer(playerNumber: PlayerNumber, player: Player) {
    this.playerUpated.emit({
      playerNumber,
      player
    });
  }
}
