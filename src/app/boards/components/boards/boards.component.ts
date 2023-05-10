import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { BoardService } from 'src/app/shared/services/board.service';
import { BoardInterface } from 'src/app/shared/types/board.interface';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
})
export class BoardsComponent implements OnInit, OnDestroy {
  constructor(private boardsService: BoardService) {}

  boards: BoardInterface[] = [];
  boardsSubscription: Subscription;
  boardsCreateSubscription: Subscription;
  ngOnInit(): void {
    this.boardsSubscription = this.boardsService
      .getBoards()
      .subscribe((boards: BoardInterface[]) => {
        this.boards = boards;
      });
  }

  ngOnDestroy(): void {
    this.boardsSubscription.unsubscribe();
    this.boardsCreateSubscription.unsubscribe();
  }

  createBoard(title: string): void {
    this.boardsCreateSubscription = this.boardsService
      .createBoard(title)
      .subscribe((board: BoardInterface) => {
        this.boards.push(board);
      });
  }
}
