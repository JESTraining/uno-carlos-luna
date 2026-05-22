import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

export interface TaskRepository {
  getAll(): Observable<readonly Task[]>;
  create(title: string): Observable<Task>;
  delete(id: number): Observable<void>;
  toggleComplete(id: number): Observable<Task>;
}

export const TASK_REPOSITORY = new InjectionToken<TaskRepository>('TaskRepository');
