import { InjectionToken } from '@angular/core';
import { Task } from '../models/task.model';

export interface TaskRepository {
  getAll(): readonly Task[];
  create(title: string): Task;
  delete(id: number): boolean;
  toggleComplete(id: number): boolean;
}

export const TASK_REPOSITORY = new InjectionToken<TaskRepository>('TaskRepository');
