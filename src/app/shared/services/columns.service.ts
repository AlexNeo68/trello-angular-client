import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColumnCreateRequestInterface } from 'src/app/board/types/column-create-request.interface';
import { SocketService } from 'src/app/shared/services/socket.service';
import { ColumnInterface } from 'src/app/shared/types/column.interface';
import { SocketEventName } from 'src/app/shared/types/socket-event-name.enum';
import { generateApiUrl } from 'src/app/shared/utils/utils';

@Injectable()
export class ColumnsService {
  constructor(
    private httpClient: HttpClient,
    private socketService: SocketService
  ) {}

  getColumns(boardId: string): Observable<ColumnInterface[]> {
    const url = generateApiUrl(`boards/${boardId}/columns`);
    return this.httpClient.get<ColumnInterface[]>(url);
  }

  createColumn(newColumn: ColumnCreateRequestInterface): void {
    this.socketService.emit(SocketEventName.columnsCreate, newColumn);
  }
}
