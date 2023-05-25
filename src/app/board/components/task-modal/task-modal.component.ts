import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  Subject,
  combineLatest,
  filter,
  map,
  take,
  takeUntil,
} from 'rxjs';
import { BoardService } from 'src/app/board/services/board.service';
import { ColumnInterface } from 'src/app/shared/types/column.interface';
import { TaskInterface } from 'src/app/shared/types/task.interface';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
})
export class TaskModalComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'task-modal';

  boardId: string;
  taskId: string;
  task$: Observable<TaskInterface>;

  columnForm = this.fb.group({
    columnId: [null],
  });

  unsubscribe$ = new Subject<void>();

  data$: Observable<{
    task: TaskInterface;
    columns: ColumnInterface[];
  }>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private boardService: BoardService,
    private fb: FormBuilder
  ) {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');
    if (!taskId) {
      throw new Error('TaskID not defined');
    }
    if (!boardId) {
      throw new Error('BoardID not defined');
    }
    this.boardId = boardId;
    this.taskId = taskId;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.task$ = this.boardService.tasks$.pipe(
      map((tasks) => {
        if (!tasks || !tasks.length) return null;
        return tasks.find((task) => task.id === this.taskId);
      }),
      filter(Boolean)
    );

    this.data$ = combineLatest([this.task$, this.boardService.columns$]).pipe(
      map(([task, columns]) => {
        return { task, columns };
      })
    );

    this.task$.pipe(takeUntil(this.unsubscribe$)).subscribe((task) => {
      console.log(task);
      this.columnForm.patchValue({ columnId: task.columndId });
    });
  }

  goToBoard() {
    this.router.navigate(['boards', this.boardId]);
  }

  taskUpdateName(taskName: string): void {
    console.log('taskUpdateName', taskName);
  }
  taskUpdateColumnId() {
    console.log('taskUpdateColumnId', this.columnForm.value);
  }
  updateTaskDescription(description: string) {
    console.log('updateTaskDescription', description);
  }
}
