import { Observable, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { ColumnNumber, PlayedMoves } from '../../engine/BoardState';
import { isLegalMove } from '../../engine/engine';
import { InteractionsService } from '../interactions/interactions.service';
import { Player } from './Player';

export class HumanPlayer implements Player {
    constructor(
        private interactionsService: InteractionsService
    ) {

    }

    public getNextMove(playedMoves: PlayedMoves): Observable<ColumnNumber> {
        return this.interactionsService.onCellClicked().pipe(
            map(({ column }) => column),
            filter((column) => isLegalMove(playedMoves, column)),
            take(1)
        );
    }

    public getName(): Observable<string> {
        return of('HUMAN');
    }
}
