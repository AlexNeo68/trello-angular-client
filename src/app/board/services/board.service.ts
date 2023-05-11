import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BoardInterface } from 'src/app/shared/types/board.interface';

@Injectable()
export class BoardService {
  board$ = new BehaviorSubject<BoardInterface | null>(null);

  constructor() {}
  setBoard(board: BoardInterface) {
    this.board$.next(board);
  }
}
