import { Component, Input } from '@angular/core';

import { GameResult } from '../GameResult';

@Component({
    selector: 'app-results-table',
    templateUrl: './results-table.component.html',
    styleUrls: ['./results-table.component.scss']
})
export class ResultsTableComponent {
    @Input()
    public results: GameResult[];
}
