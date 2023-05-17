import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './components/board/board.component';
import { BoardService } from 'src/app/board/services/board.service';
import { BoardsService } from 'src/app/shared/services/boards.service';
import { ColumnsService } from 'src/app/shared/services/columns.service';
import { TopbarModule } from 'src/app/shared/modules/topbar/topbar.module';
import { InlineFormModule } from 'src/app/shared/modules/inline-form/inline-form.module';

@NgModule({
  declarations: [BoardComponent],
  imports: [CommonModule, BoardRoutingModule, TopbarModule, InlineFormModule],
  providers: [BoardService, BoardsService, ColumnsService],
})
export class BoardModule {}
