import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

import { Cell } from '../../engine/BoardState';

@Injectable()
export class InteractionsService {
    private onCellClickedSubject = new Subject<Cell>();

    public cellClicked(cell: Cell) {
        this.onCellClickedSubject.next(cell);
    }

    public onCellClicked(): Observable<Cell> {
        return this.onCellClickedSubject.asObservable();
    }
}
