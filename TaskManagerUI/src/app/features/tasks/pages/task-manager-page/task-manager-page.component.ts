import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { TaskStore } from '../../services/task.store';

@Component({
  selector: 'app-task-manager-page',
  standalone: true,
  imports: [TaskFormComponent, TaskListComponent],
  templateUrl: './task-manager-page.component.html',
  styleUrl: './task-manager-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TaskStore],
})
export class TaskManagerPageComponent {
  protected readonly store = inject(TaskStore);
  protected readonly tasks = this.store.tasks;
  protected readonly incompleteTasks = computed(() =>
    this.tasks().filter((task) => !task.isComplete)
  );
  protected readonly completedTasks = computed(() =>
    this.tasks().filter((task) => task.isComplete)
  );

  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      this.tasks();
      untracked(() => this.changeDetectorRef.markForCheck());
    });
  }
}
