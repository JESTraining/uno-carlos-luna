import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Task } from '../../../../core/models/task.model';
import { TaskEmptyStateComponent } from '../task-empty-state/task-empty-state.component';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskEmptyStateComponent, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  readonly tasks = input.required<readonly Task[]>();

  readonly toggled = output<number>();
  readonly removed = output<number>();
}
