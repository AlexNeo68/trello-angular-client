import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { BoardsService } from 'src/app/shared/services/boards.service';
import { BoardInterface } from 'src/app/shared/types/board.interface';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
})
export class BoardsComponent implements OnInit, OnDestroy {
  constructor(private boardsService: BoardsService) {}

  boards: BoardInterface[] = [];
  boardsSubscription: Subscription;
  ngOnInit(): void {
    this.boardsSubscription = this.boardsService
      .getBoards()
      .subscribe((boards: BoardInterface[]) => {
        this.boards = boards;
      });
  }

  ngOnDestroy(): void {
    this.boardsSubscription.unsubscribe();
  }

  createBoard(title: string): void {
    this.boardsService.createBoard(title).subscribe((board: BoardInterface) => {
      this.boards.push(board);
    });
  }
}
