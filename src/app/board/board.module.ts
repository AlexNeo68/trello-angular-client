import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './components/board/board.component';
import { BoardService } from 'src/app/board/services/board.service';
import { BoardsService } from 'src/app/shared/services/boards.service';

@NgModule({
  declarations: [BoardComponent],
  imports: [CommonModule, BoardRoutingModule],
  providers: [BoardService, BoardsService],
})
export class BoardModule {}
