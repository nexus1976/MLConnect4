import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, startWith, switchMap, withLatestFrom } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { PlayedMoves, PlayedMovesOrError } from '../../engine/BoardState';
import { playGame } from '../../engine/engine';
import { PlayersService } from '../player/players.service';

@Injectable()
export class EngineService {
    private newGameSubject = new Subject<void>();

    private startingPositionSubject = new BehaviorSubject<string>('');

    private playGameShared: Observable<PlayedMovesOrError> = this.newGameSubject.pipe(
        startWith(null),
        withLatestFrom(
            this.startingPositionSubject,
            this.playersService.blackPlayer(),
            this.playersService.redPlayer(),
        ),
        switchMap(([_, startPos, blackPlayer, redPlayer]) => playGame(redPlayer, blackPlayer, startPos)),
        shareReplay(1)
    );

    constructor(
        private playersService: PlayersService
    ) {

    }

    public startingPosition(position: string) {
        this.startingPositionSubject.next(position);
    }

    public newGame() {
        this.newGameSubject.next();
    }

    public playedMoves(): Observable<PlayedMoves> {
        return this.playGameShared.pipe(
            filter((r) => typeof r === 'string'),
            map((r) => r as PlayedMoves)
        );
    }

    public playedMovesWithErrors(): Observable<PlayedMoves | { error: string }> {
        return this.playGameShared;
    }
}
