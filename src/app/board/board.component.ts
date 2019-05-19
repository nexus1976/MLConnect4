import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import {
	BOARD_HEIGHT, BOARD_WIDTH, ColumnNumber, Piece, PlayedMoves, RowNumber
} from '../../engine/BoardState';
import { isWinningMoveWithWinners, playedMovesToBoardState } from '../../engine/engine';
import { InteractionsService } from '../interactions/interactions.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
  public rowCells = Array.from(Array(BOARD_HEIGHT));

  public columnCells = Array.from(Array(BOARD_WIDTH));

  public Piece = Piece;

  @Input()
  public playedMoves: PlayedMoves;

  public get gameState() {
    return {
      boardState: playedMovesToBoardState(this.playedMoves as PlayedMoves),
      winningPieces: isWinningMoveWithWinners(this.playedMoves).winningPieces
    };
  }

  constructor(
    private interactionsService: InteractionsService
  ) { }

  public onCellClicked(column: ColumnNumber, row: RowNumber) {
    this.interactionsService.cellClicked({ row, column });
  }

  public isWinningPiece(winningPieces: { c: number, r: number }[], column: ColumnNumber, row: RowNumber): boolean {
    return winningPieces.some(({ c, r }) => c === column && r === row);
  }
}
