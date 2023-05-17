import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColumnInterface } from 'src/app/shared/types/column.interface';
import { generateApiUrl } from 'src/app/shared/utils/utils';

@Injectable()
export class ColumnsService {
  constructor(private httpClient: HttpClient) {}
  getColumns(boardId: string): Observable<ColumnInterface[]> {
    const url = generateApiUrl(`boards/${boardId}/columns`);
    return this.httpClient.get<ColumnInterface[]>(url);
  }
}
