import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationStart,
  Params,
  Router,
} from '@angular/router';
import {
  Observable,
  Subscription,
  combineLatest,
  filter,
  map,
  throwError,
} from 'rxjs';
import { BoardService } from 'src/app/board/services/board.service';
import { ColumnCreateRequestInterface } from 'src/app/board/types/column-create-request.interface';
import { BoardsService } from 'src/app/shared/services/boards.service';
import { ColumnsService } from 'src/app/shared/services/columns.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { BoardInterface } from 'src/app/shared/types/board.interface';
import { ColumnInterface } from 'src/app/shared/types/column.interface';
import { SocketEventName } from 'src/app/shared/types/socket-event-name.enum';

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
  }>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardsService: BoardsService,
    private boardService: BoardService,
    private columnService: ColumnsService,
    private socketService: SocketService
  ) {
    this.boardIdSubscription = this.route.params.subscribe((params: Params) => {
      const boardId = params['boardId'];

      if (!boardId) throw new Error('Board id is not defined!');
      this.boardId = boardId;

      this.data$ = combineLatest(
        this.boardService.board$.pipe(filter(Boolean)),
        this.boardService.columns$
      ).pipe(map(([board, columns]) => ({ board, columns })));
    });
  }

  ngOnDestroy(): void {
    this.boardIdSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.socketService.emit(SocketEventName.boardsJoin, {
      boardId: this.boardId,
    });

    this.fetchData();
    this.initializeListener();
  }
  initializeListener(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.boardService.leaveBoard(this.boardId);
      }
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
}
