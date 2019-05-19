import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-player-score',
    templateUrl: './player-score.component.html',
    styleUrls: ['./player-score.component.scss']
})
export class PlayerScoreComponent {
    @Input()
    public score = 0;

    @Input()
    public playerName = '';

    @Input()
    public playerIsBlack = true;

    @Input()
    @HostBinding('class.is-winner')
    public winner = false;
}
