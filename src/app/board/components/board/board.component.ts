import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription, throwError } from 'rxjs';
import { BoardService } from 'src/app/board/services/board.service';
import { BoardsService } from 'src/app/shared/services/boards.service';
import { BoardInterface } from 'src/app/shared/types/board.interface';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  board$: Observable<BoardInterface>;
  boardId: string;

  constructor(
    private route: ActivatedRoute,
    private boardsService: BoardsService,
    private boardService: BoardService
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) throw new Error('Board id is not defined!');

    this.boardId = boardId;
  }

  ngOnInit(): void {
    this.fetchData();
    this.board$ = this.boardService.board$;
  }

  fetchData(): void {
    this.boardsService
      .getBoard(this.boardId)
      .subscribe((board: BoardInterface) => {
        this.boardService.setBoard(board);
      });
  }
}
