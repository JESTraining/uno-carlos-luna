import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Task } from '../../../core/models/task.model';
import { TASK_REPOSITORY } from '../../../core/repositories/task.repository';

@Injectable()
export class TaskStore {
  private readonly repository = inject(TASK_REPOSITORY);
  private readonly tasksState = signal<readonly Task[]>([]);

  readonly tasks = this.tasksState.asReadonly();
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    void this.reload();
  }

  add(title: string): void {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    void this.run(() => this.repository.create(trimmed));
  }

  remove(id: number): void {
    void this.run(() => this.repository.delete(id));
  }

  toggle(id: number): void {
    void this.run(() => this.repository.toggleComplete(id));
  }

  private async run(action: () => Observable<unknown>): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      await firstValueFrom(action());
      await this.reload();
    } catch {
      this.error.set('Something went wrong. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  private async reload(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      const tasks = await firstValueFrom(this.repository.getAll());
      this.tasksState.set(tasks);
    } catch {
      this.error.set('Unable to load tasks. Is the API running?');
      this.tasksState.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
