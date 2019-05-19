import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Color } from '../../engine/BoardState';
import { APIPlayer } from './api-player';
import { Player } from './Player';

@Injectable()
export class PlayersService {
    private redPlayerSubject = new BehaviorSubject<Player>(
        new APIPlayer(this.httpClient, 'http://localhost:5000/api')
    );

    private blackPlayerSubject = new BehaviorSubject<Player>(
        new APIPlayer(this.httpClient, 'http://localhost:5000/api')
    );

    constructor(
        private httpClient: HttpClient
    ) {

    }

    public setPlayer(color: Color, player: Player) {
        if (color === Color.Black) {
            this.blackPlayerSubject.next(player);
        } else {
            this.redPlayerSubject.next(player);
        }
    }

    public redPlayer(): Observable<Player> {
        return this.redPlayerSubject.asObservable();
    }

    public blackPlayer(): Observable<Player> {
        return this.blackPlayerSubject.asObservable();
    }
}
