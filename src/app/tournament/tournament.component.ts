import { concat, EMPTY, forkJoin, from, Observable, of, Subject, timer } from 'rxjs';
import {
	catchError, concatMap, filter, map, mergeMap, scan, share, startWith, switchMap, tap
} from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';

import { isPlayedMoves, PlayedMoves } from '../../engine/BoardState';
import { isBoardFull, isWinningMove, playGame } from '../../engine/engine';
import { EngineService } from '../game/engine.service';
import { InteractionsService } from '../interactions/interactions.service';
import { APIPlayer } from '../player/api-player';
import { Player } from '../player/Player';
import { PlayersService } from '../player/players.service';
import { ActiveGame } from './ActiveGame';
import { GameResult } from './GameResult';
import { OPENING_BOOK } from './OPENING_BOOK';
import { OPENING_BOOK_L1_R3 } from './OPENING_BOOK_L1_R3';
import { OpeningBookQuery } from './OpeningBookQuery';
import { PlayerNumber } from './tournament-controls/tournament-controls.component';
import { TournamentState } from './TournamentState';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss'],
  providers: [
    EngineService,
    InteractionsService,
    PlayersService
  ]
})
export class TournamentComponent implements OnDestroy {
  public startTournamentSubject = new Subject<OpeningBookQuery>();

  public tournament$: Observable<TournamentState> = this.startTournamentSubject.pipe(
    tap(() => this.lastError = ''),
    switchMap((openingBookQuery) => this.playTournament(this.playerOne, this.playerTwo, openingBookQuery).pipe(
      catchError((err) => {
        this.lastError = JSON.stringify(err);
        return EMPTY;
      })
    )),
    share(),
  );

  public playedMoves$: Observable<PlayedMoves> = this.tournament$.pipe(
    map(({ activeGame }) => activeGame.playedMoves),
    filter(isPlayedMoves),
    startWith('')
  );

  public playerOneScore$: Observable<number> = this.tournament$.pipe(
    map(({ playerOne }) => playerOne.score),
    startWith(0)
  );

  public playerTwoScore$: Observable<number> = this.tournament$.pipe(
    map(({ playerTwo }) => playerTwo.score),
    startWith(0)
  );

  public playerOneName$: Observable<string> = this.tournament$.pipe(
    map(({ playerOne }) => playerOne.name),
    startWith('Player One')
  );

  public playerTwoName$: Observable<string> = this.tournament$.pipe(
    map(({ playerTwo }) => playerTwo.name),
    startWith('Player Two')
  );

  public playerOneIsBlack$: Observable<boolean> = this.tournament$.pipe(
    map(({ activeGame }) => activeGame.isPlayerOneBlack)
  );

  public gameResults$: Observable<GameResult[]> = this.tournament$.pipe(
    map(({ gameResults }) => gameResults)
  );

  public lastGameResult$: Observable<GameResult> = this.gameResults$.pipe(
    filter(({ length }) => length > 0),
    map((gameResults) => gameResults[gameResults.length - 1])
  );

  public playerOneWon$: Observable<boolean> = this.lastGameResult$.pipe(
    map(({ playerOneWon }) => playerOneWon)
  );

  public playerTwoWon$: Observable<boolean> = this.lastGameResult$.pipe(
    map(({ playerTwoWon }) => playerTwoWon)
  );

  public lastError: string;

  private unsubscribe$ = new Subject<void>();

  private playerOne: Player = new APIPlayer(this.httpClient, 'http://localhost:5000/api');

  private playerTwo: Player = new APIPlayer(this.httpClient, 'http://localhost:5000/api');

  constructor(
    private httpClient: HttpClient
  ) {
  }

  public startTournament(openingBookQuery: OpeningBookQuery) {
    this.startTournamentSubject.next(openingBookQuery);
  }

  public updatePlayer({ playerNumber, player }: { playerNumber: PlayerNumber, player: Player }) {
    if (playerNumber === PlayerNumber.PlayerOne) {
      this.playerOne = player;
    } else {
      this.playerTwo = player;
    }
  }

  public ngOnDestroy() {
    this.unsubscribe$.next();
  }

  private playTournament(playerOne: Player, playerTwo: Player, openingBookQuery: OpeningBookQuery): Observable<TournamentState> {
    return this.getInitialTournamentState(playerOne, playerTwo).pipe(
      mergeMap((initialTournamentState) => from(this.getOpeningBook(openingBookQuery)).pipe(
        concatMap((moves) => this.createActiveGameFromStartingPos(moves)),
        concatMap((game) => this.playGame(playerOne, playerTwo, game)),
        scan<ActiveGame, TournamentState>((state, game) => this.updateTournamentState(state, game), initialTournamentState),
        concatMap((results) => this.delayGameIfLastMove(results.activeGame), (state) => state)
      ))
    );
  }

  private playGame(playerOne: Player, playerTwo: Player, game: ActiveGame): Observable<ActiveGame> {
    const { isPlayerOneBlack, startingMoves } = game;
    const blackPlayer = isPlayerOneBlack ? playerOne : playerTwo;
    const redPlayer = isPlayerOneBlack ? playerTwo : playerOne;

    return playGame(redPlayer, blackPlayer, startingMoves).pipe(
      map((moves) => ({ isPlayerOneBlack, playedMoves: moves, startingMoves }))
    );
  }

  private createActiveGameFromStartingPos(playedMoves: PlayedMoves): Observable<ActiveGame> {
    return of({
      isPlayerOneBlack: true,
      startingMoves: playedMoves,
      playedMoves
    }, {
      isPlayerOneBlack: false,
      startingMoves: playedMoves,
      playedMoves
    });
  }

  private getInitialTournamentState(playerOne: Player, playerTwo: Player): Observable<TournamentState> {
    return forkJoin(
      playerOne.getName(),
      playerTwo.getName()
    ).pipe(
      map(([playerOneName, playerTwoName]) => {
        return {
          activeGame: {
            playedMoves: '',
            startingMoves: '',
            isPlayerOneBlack: true
          },
          playerOne: {
            player: playerOne,
            name: playerOneName,
            score: 0
          },
          playerTwo: {
            player: playerTwo,
            name: playerTwoName,
            score: 0
          },
          gameResults: []
        };
      }),
    );
  }

  private getActiveGameInfo(activeGame: ActiveGame) {
    const playedMoves = activeGame.playedMoves;
    const isValidMove = isPlayedMoves(playedMoves);
    const isMoveWinning = isPlayedMoves(playedMoves) && isWinningMove(playedMoves);
    const isFullBoard = isPlayedMoves(playedMoves) && isBoardFull(playedMoves);
    const isGameEndingMove = isMoveWinning || isFullBoard || !isValidMove;

    return {
      isValidMove,
      isMoveWinning,
      isFullBoard,
      isGameEndingMove
    };
  }

  private updateTournamentState(tournamentState: TournamentState, activeGame: ActiveGame): TournamentState {
    const { playedMoves, isPlayerOneBlack, startingMoves } = activeGame;
    const { playerOne, playerTwo } = tournamentState;
    const { isValidMove, isMoveWinning, isGameEndingMove } = this.getActiveGameInfo(activeGame);
    const lastMoveWasBlack = isPlayedMoves(playedMoves) && playedMoves.length % 2 === 1;
    const gameResults = tournamentState.gameResults.slice();
    const tournamentsLastValidMoves = tournamentState.activeGame.playedMoves;
    const previousValidMoveWasBlack = isPlayedMoves(tournamentsLastValidMoves) && tournamentsLastValidMoves.length % 2 === 1;
    const playerOneErrored = !isValidMove && previousValidMoveWasBlack !== isPlayerOneBlack;
    const playerTwoErrored = !isValidMove && previousValidMoveWasBlack === isPlayerOneBlack;
    const playerOneWinningMove = isMoveWinning && lastMoveWasBlack === isPlayerOneBlack;
    const playerTwoWinningMove = isMoveWinning && lastMoveWasBlack !== isPlayerOneBlack;
    const playerOneWon = playerOneWinningMove || playerTwoErrored;
    const playerTwoWon = playerTwoWinningMove || playerOneErrored;
    const isDraw = isGameEndingMove && !playerOneWon && !playerTwoWon;

    let playerOneScore = playerOne.score;
    let playerTwoScore = playerTwo.score;

    if (playerOneWon) {
      playerOneScore++;
    }

    if (playerTwoWon) {
      playerTwoScore++;
    }

    if (isDraw) {
      playerOneScore += 0.5;
      playerTwoScore += 0.5;
    }

    if (isGameEndingMove) {
      gameResults.push({
        playedMoves: (isValidMove ? playedMoves : tournamentsLastValidMoves) as PlayedMoves,
        startingMoves,
        isPlayerOneBlack,
        endedFromError: !isValidMove,
        playerOneWon,
        playerTwoWon,
        playerOneName: playerOne.name,
        playerTwoName: playerTwo.name,
        error: isPlayedMoves(playedMoves) ? '' : 'ERROR'
      });
    }

    return {
      activeGame: {
        ...activeGame,
        playedMoves
      },
      playerOne: {
        ...playerOne,
        score: playerOneScore
      },
      playerTwo: {
        ...playerTwo,
        score: playerTwoScore
      },
      gameResults
    };
  }

  private delayGameIfLastMove(activeGame: ActiveGame): Observable<void> {
    const { isGameEndingMove } = this.getActiveGameInfo(activeGame);
    const delay = isGameEndingMove ? 2000 : 0;

    return concat(of(null), timer(delay).pipe(filter(() => false)));
  }

  private getOpeningBook(openingBookQuery: OpeningBookQuery) {
    const { openBookStartIdx, numberOfGames } = openingBookQuery;
    return OPENING_BOOK.concat(OPENING_BOOK_L1_R3).slice(openBookStartIdx, openBookStartIdx + Math.ceil(numberOfGames / 2));
  }
}
