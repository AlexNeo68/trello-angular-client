import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationStart,
  Params,
  Router,
} from '@angular/router';
import {
  Observable,
  Subject,
  Subscription,
  combineLatest,
  filter,
  map,
  takeUntil,
  throwError,
} from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CurrentUserInterface } from 'src/app/auth/types/current-user.interface';
import { BoardService } from 'src/app/board/services/board.service';
import { ColumnCreateRequestInterface } from 'src/app/board/types/column-create-request.interface';
import { TaskCreateRequestInterface } from 'src/app/board/types/task-create-request.interface';
import { BoardsService } from 'src/app/shared/services/boards.service';
import { ColumnsService } from 'src/app/shared/services/columns.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { BoardInterface } from 'src/app/shared/types/board.interface';
import { ColumnInterface } from 'src/app/shared/types/column.interface';
import { SocketEventName } from 'src/app/shared/types/socket-event-name.enum';
import { TaskInterface } from 'src/app/shared/types/task.interface';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId: string;
  boardIdSubscription: Subscription;
  data$: Observable<{
    board: BoardInterface;
    columns: ColumnInterface[];
    tasks: TaskInterface[];
  }>;
  unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardsService: BoardsService,
    private boardService: BoardService,
    private columnService: ColumnsService,
    private tasksService: TasksService,
    private socketService: SocketService,
    private authService: AuthService
  ) {
    this.boardIdSubscription = this.route.params.subscribe((params: Params) => {
      const boardId = params['boardId'];

      if (!boardId) throw new Error('Board id is not defined!');
      this.boardId = boardId;

      this.data$ = combineLatest(
        this.boardService.board$.pipe(filter(Boolean)),
        this.boardService.columns$,
        this.boardService.tasks$
      ).pipe(map(([board, columns, tasks]) => ({ board, columns, tasks })));
    });
  }

  ngOnDestroy(): void {
    this.boardIdSubscription.unsubscribe();

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(
      (currentUser: CurrentUserInterface) => {
        if (currentUser) {
          this.fetchData();
          this.socketService.emit(SocketEventName.boardsJoin, {
            boardId: this.boardId,
          });

          this.initializeListener();
        }
      }
    );
  }
  initializeListener(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && !event.url.includes('/boards/')) {
        this.boardService.leaveBoard(this.boardId);
      }
    });
    this.socketService
      .listen<ColumnInterface>(SocketEventName.columnsCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((column) => {
        this.boardService.addColumn(column);
      });
    this.socketService
      .listen<TaskInterface>(SocketEventName.tasksCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((task) => {
        this.boardService.addTask(task);
      });
    this.socketService
      .listen<BoardInterface>(SocketEventName.boardsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((board) => {
        this.boardService.updateBoard(board);
      });
    this.socketService
      .listen<ColumnInterface>(SocketEventName.columnsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedColumn) => {
        this.boardService.updateColumns(updatedColumn);
      });
    this.socketService
      .listen<void>(SocketEventName.boardsDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.router.navigateByUrl('/boards');
      });
    this.socketService
      .listen<string>(SocketEventName.columnsDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((columndId) => {
        this.boardService.deleteColumn(columndId);
      });
  }

  fetchData(): void {
    this.boardsService
      .getBoard(this.boardId)
      .subscribe((board: BoardInterface) => {
        this.boardService.setBoard(board);
      });
    this.columnService
      .getColumns(this.boardId)
      .subscribe((columns: ColumnInterface[]) => {
        this.boardService.setColumns(columns);
      });
    this.tasksService
      .getTasks(this.boardId)
      .subscribe((tasks: TaskInterface[]) => {
        this.boardService.setTasks(tasks);
      });
  }

  test(): void {
    this.socketService.emit(SocketEventName.columnsCreate, {
      title: 'Title Column',
      boardId: this.boardId,
    });
  }

  createColumn(title: string): void {
    const newColumn: ColumnCreateRequestInterface = {
      title,
      boardId: this.boardId,
    };
    this.columnService.createColumn(newColumn);
  }
  getColumnTasks(
    columnId: string,
    tasks: TaskInterface[]
  ): TaskInterface[] | [] {
    // return tasks.filter((task) => task.columndId == columnId);
    return tasks;
  }

  createTask(title: string, columnId: string) {
    console.log('createTask', title, columnId);
    const newTask: TaskCreateRequestInterface = {
      title,
      columnId,
      boardId: this.boardId,
    };
    this.tasksService.createTask(newTask);
  }

  updateBoardTitle(boardTitle: string): void {
    this.boardsService.updateBoardTitle(this.boardId, { title: boardTitle });
  }

  updateColumnTitle(columnTitle: string, columnId: string): void {
    this.columnService.updateColumnTitle(this.boardId, columnId, {
      title: columnTitle,
    });
  }

  deleteBoard(): void {
    this.boardsService.deleteBoard(this.boardId);
  }

  deleteColumn(columnId: string): void {
    this.columnService.deleteColumn(this.boardId, columnId);
  }

  openTask(taskId: string) {
    this.router.navigate(['boards', this.boardId, 'tasks', taskId]);
  }
}
