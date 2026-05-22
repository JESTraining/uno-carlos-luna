import { Injectable } from '@angular/core';
import { Task } from '../../../core/models/task.model';
import { TaskRepository } from '../../../core/repositories/task.repository';
import { MOCK_TASKS_SEED } from './mock-tasks.seed';

@Injectable()
export class MockTaskRepository implements TaskRepository {
  private readonly tasks: Task[] = MOCK_TASKS_SEED.map((task) => ({ ...task }));
  private nextId = MOCK_TASKS_SEED.length + 1;

  getAll(): readonly Task[] {
    return this.tasks.map((task) => ({ ...task }));
  }

  create(title: string): Task {
    const task: Task = {
      id: this.nextId++,
      title,
      isComplete: false,
    };
    this.tasks.push(task);
    return { ...task };
  }

  delete(id: number): boolean {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      return false;
    }
    this.tasks.splice(index, 1);
    return true;
  }

  toggleComplete(id: number): boolean {
    const index = this.tasks.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    const current = this.tasks[index];
    this.tasks[index] = { ...current, isComplete: !current.isComplete };
    return true;
  }
}
