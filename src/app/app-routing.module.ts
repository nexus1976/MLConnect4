import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExhibitionComponent } from './exhibition/exhibition.component';
import { TournamentComponent } from './tournament/tournament.component';

const routes: Routes = [
  { path: 'exhibition', component: ExhibitionComponent },
  { path: 'tournament', component: TournamentComponent },
  { path: '',   redirectTo: '/exhibition', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
