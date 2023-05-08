import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardsRoutingModule } from './boards-routing.module';
import { BoardsComponent } from './components/boards/boards.component';


@NgModule({
  declarations: [
    BoardsComponent
  ],
  imports: [
    CommonModule,
    BoardsRoutingModule
  ]
})
export class BoardsModule { }
