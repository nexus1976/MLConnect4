import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { InteractionsService } from '../interactions/interactions.service';
import { APIPlayer } from '../player/api-player';
import { HumanPlayer } from '../player/human-player';
import { Player } from '../player/Player';

@Component({
    selector: 'app-player-selector',
    templateUrl: './player-selector.component.html',
    styleUrls: ['./player-selector.component.scss']
})
export class PlayerSelectorComponent {
    @Input()
    public title = '';

    @Output()
    public playerSelected = new EventEmitter<Player>();

    constructor(
        private httpClient: HttpClient,
        private interactionsService: InteractionsService
    ) {

    }

    public updatePlayer(playerType: string, host: string) {
        const player = playerType === 'human'
            ? new HumanPlayer(this.interactionsService)
            : new APIPlayer(this.httpClient, host);

        this.playerSelected.emit(player);
    }
}
