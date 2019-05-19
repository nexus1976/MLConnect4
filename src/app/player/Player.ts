import { Observable } from 'rxjs';

import { ColumnNumber, PlayedMoves } from '../../engine/BoardState';

export interface Player {
    getNextMove(playedMoves: PlayedMoves): Observable<ColumnNumber>;
    getName(): Observable<string>;
}
