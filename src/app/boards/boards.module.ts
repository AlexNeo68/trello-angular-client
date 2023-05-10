import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardsRoutingModule } from './boards-routing.module';
import { BoardsComponent } from './components/boards/boards.component';
import { BoardService } from 'src/app/shared/services/board.service';
import { InlineFormModule } from 'src/app/shared/modules/inline-form/inline-form.module';
import { TopbarModule } from 'src/app/shared/modules/topbar/topbar.module';

@NgModule({
  declarations: [BoardsComponent],
  imports: [CommonModule, BoardsRoutingModule, InlineFormModule, TopbarModule],
  providers: [BoardService],
})
export class BoardsModule {}
