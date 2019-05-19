import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

import { ColumnNumber, PlayedMoves } from '../../engine/BoardState';
import { Player } from './Player';

export class APIPlayer implements Player {
    constructor(
        private httpClient: HttpClient,
        private host: string
    ) {

    }

    public getNextMove(playedMoves: PlayedMoves): Observable<ColumnNumber> {
        return this.httpClient.get<string>(`${this.host}/nextmove?prevmoves=${playedMoves}`).pipe(
            map((move) => Number.parseInt(move, 10))
        );
    }

    public getName(): Observable<string> {
        return this.httpClient.get<string>(`${this.host}/name`);
    }
}
