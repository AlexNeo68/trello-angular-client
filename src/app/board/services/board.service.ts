import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketService } from 'src/app/shared/services/socket.service';
import { BoardInterface } from 'src/app/shared/types/board.interface';
import { ColumnInterface } from 'src/app/shared/types/column.interface';
import { SocketEventName } from 'src/app/shared/types/socket-event-name.enum';

@Injectable()
export class BoardService {
  board$ = new BehaviorSubject<BoardInterface | null>(null);
  columns$ = new BehaviorSubject<ColumnInterface[] | null>(null);

  constructor(private socketService: SocketService) {}

  setBoard(board: BoardInterface) {
    this.board$.next(board);
  }

  setColumns(columns: ColumnInterface[]) {
    this.columns$.next(columns);
  }

  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.socketService.emit(SocketEventName.boardsLeave, { boardId });
  }
}
