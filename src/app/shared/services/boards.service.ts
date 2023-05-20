import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from 'src/app/shared/services/socket.service';
import { BoardInterface } from 'src/app/shared/types/board.interface';
import { SocketEventName } from 'src/app/shared/types/socket-event-name.enum';
import { generateApiUrl } from 'src/app/shared/utils/utils';

@Injectable()
export class BoardsService {
  constructor(
    private httpClient: HttpClient,
    private socketService: SocketService
  ) {}

  getBoards(): Observable<BoardInterface[]> {
    const url = generateApiUrl('boards');
    return this.httpClient.get<BoardInterface[]>(url);
  }

  getBoard(boardId: string): Observable<BoardInterface> {
    const url = generateApiUrl('boards/' + boardId);
    return this.httpClient.get<BoardInterface>(url);
  }

  createBoard(title: string): Observable<BoardInterface> {
    const url = generateApiUrl('boards');
    return this.httpClient.post<BoardInterface>(url, { title });
  }

  updateBoardTitle(boardId: string, fields: { title: string }): void {
    this.socketService.emit(SocketEventName.boardsUpdate, { boardId, fields });
  }
}
