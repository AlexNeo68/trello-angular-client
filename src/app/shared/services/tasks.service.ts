import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskCreateRequestInterface } from 'src/app/board/types/task-create-request.interface';
import { SocketService } from 'src/app/shared/services/socket.service';
import { SocketEventName } from 'src/app/shared/types/socket-event-name.enum';
import { TaskInterface } from 'src/app/shared/types/task.interface';
import { generateApiUrl } from 'src/app/shared/utils/utils';

@Injectable()
export class TasksService {
  constructor(
    private httpClient: HttpClient,
    private socketService: SocketService
  ) {}

  getTasks(boardId: string): Observable<TaskInterface[]> {
    const url = generateApiUrl(`boards/${boardId}/tasks`);
    return this.httpClient.get<TaskInterface[]>(url);
  }

  createTask(newTask: TaskCreateRequestInterface): void {
    this.socketService.emit(SocketEventName.tasksCreate, newTask);
  }
}
