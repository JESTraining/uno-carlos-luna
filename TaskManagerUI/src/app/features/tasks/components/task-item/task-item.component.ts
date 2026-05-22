import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'li[task-item]',
  standalone: true,
  host: {
    '[class.complete]': 'task().isComplete',
  },
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  readonly task = input.required<Task>();

  readonly toggled = output<number>();
  readonly removed = output<number>();
}
