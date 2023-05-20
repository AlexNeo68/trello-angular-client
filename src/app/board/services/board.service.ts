import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketService } from 'src/app/shared/services/socket.service';
import { BoardInterface } from 'src/app/shared/types/board.interface';
import { ColumnInterface } from 'src/app/shared/types/column.interface';
import { SocketEventName } from 'src/app/shared/types/socket-event-name.enum';
import { TaskInterface } from 'src/app/shared/types/task.interface';

@Injectable()
export class BoardService {
  board$ = new BehaviorSubject<BoardInterface | null>(null);
  columns$ = new BehaviorSubject<ColumnInterface[] | null>(null);
  tasks$ = new BehaviorSubject<TaskInterface[] | null>(null);

  constructor(private socketService: SocketService) {}

  setBoard(board: BoardInterface) {
    this.board$.next(board);
  }

  setColumns(columns: ColumnInterface[]) {
    this.columns$.next(columns);
  }

  setTasks(tasks: TaskInterface[]) {
    this.tasks$.next(tasks);
  }

  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.socketService.emit(SocketEventName.boardsLeave, { boardId });
  }

  addColumn(column: ColumnInterface): void {
    const updatedColumns = [...this.columns$.getValue(), column];
    this.columns$.next(updatedColumns);
  }

  addTask(task: TaskInterface): void {
    const updatedTasks = [...this.tasks$.getValue(), task];
    this.tasks$.next(updatedTasks);
  }

  updateBoard(updatedBoard: BoardInterface): void {
    const board = this.board$.getValue();
    if (board) {
      this.board$.next({ ...board, title: updatedBoard.title });
    }
  }
}
