import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PlayedMoves } from '../../engine/BoardState';
import { EngineService } from '../game/engine.service';
import { InteractionsService } from '../interactions/interactions.service';
import { PlayersService } from '../player/players.service';

@Component({
  selector: 'app-exhibition',
  templateUrl: './exhibition.component.html',
  styleUrls: ['./exhibition.component.scss'],
  providers: [
    EngineService,
    InteractionsService,
    PlayersService
  ]
})
export class ExhibitionComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  public playedMoves$: Observable<PlayedMoves> = this.engineService.playedMoves();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private engineService: EngineService
  ) {
  }

  public ngOnInit() {
    this.route.queryParamMap.pipe(
      takeUntil(this.unsubscribe$),
      take(1),
      filter((map) => map.has('moves'))
    ).subscribe((state) => this.engineService.startingPosition(state.get('moves')));

    this.engineService.playedMoves().pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe((moves) =>
      this.router.navigate(['exhibition'], { queryParams: { moves }})
    );
  }

  public ngOnDestroy() {
    this.unsubscribe$.next();
  }
}
