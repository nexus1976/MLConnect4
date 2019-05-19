import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import {
	ExhibitionControlsComponent
} from './exhibition/exhibition-controls/exhibition-controls.component';
import { ExhibitionComponent } from './exhibition/exhibition.component';
import { PlayerSelectorComponent } from './player-selector/player-selector.component';
import { PlayerScoreComponent } from './tournament/player-score/player-score.component';
import { ResultsTableComponent } from './tournament/results-table/results-table.component';
import {
	TournamentControlsComponent
} from './tournament/tournament-controls/tournament-controls.component';
import { TournamentComponent } from './tournament/tournament.component';

@NgModule({
  declarations: [
    AppComponent,
    ExhibitionComponent,
    ExhibitionControlsComponent,
    TournamentControlsComponent,
    BoardComponent,
    TournamentComponent,
    PlayerScoreComponent,
    PlayerSelectorComponent,
    ResultsTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
