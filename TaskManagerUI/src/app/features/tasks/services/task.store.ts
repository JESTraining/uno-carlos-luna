import { inject, Injectable, signal } from '@angular/core';
import { Task } from '../../../core/models/task.model';
import { TASK_REPOSITORY } from '../../../core/repositories/task.repository';

@Injectable()
export class TaskStore {
  private readonly repository = inject(TASK_REPOSITORY);
  private readonly tasksState = signal<readonly Task[]>(this.repository.getAll());

  readonly tasks = this.tasksState.asReadonly();

  add(title: string): void {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    this.repository.create(trimmed);
    this.reload();
  }

  remove(id: number): void {
    this.repository.delete(id);
    this.reload();
  }

  toggle(id: number): void {
    this.repository.toggleComplete(id);
    this.reload();
  }

  private reload(): void {
    this.tasksState.set(this.repository.getAll());
  }
}
