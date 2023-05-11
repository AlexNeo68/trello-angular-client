import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardInterface } from 'src/app/shared/types/board.interface';
import { generateApiUrl } from 'src/app/shared/utils/utils';

@Injectable()
export class BoardsService {
  constructor(private httpClient: HttpClient) {}

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
}
