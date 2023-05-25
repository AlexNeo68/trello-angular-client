import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from 'src/app/board/components/board/board.component';
import { TaskModalComponent } from 'src/app/board/components/task-modal/task-modal.component';

const routes: Routes = [
  {
    path: 'boards/:boardId',
    component: BoardComponent,
    children: [
      {
        path: 'tasks/:taskId',
        component: TaskModalComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardRoutingModule {}
