import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { mapApiTaskToTask } from '../../../core/mappers/task.mapper';
import { ApiResponse } from '../../../core/models/api-response.model';
import { ApiTask } from '../../../core/models/api-task.model';
import { Task } from '../../../core/models/task.model';
import { TaskRepository } from '../../../core/repositories/task.repository';

@Injectable()
export class HttpTaskRepository implements TaskRepository {
  private readonly http = inject(HttpClient);
  private readonly tasksUrl = `${environment.apiUrl}/tasks`;

  getAll(): Observable<readonly Task[]> {
    return this.http
      .get<ApiResponse<ApiTask[]>>(this.tasksUrl)
      .pipe(
        map((response) => this.unwrap(response)),
        map((tasks) => tasks.map(mapApiTaskToTask))
      );
  }

  create(title: string): Observable<Task> {
    return this.http
      .post<ApiResponse<ApiTask>>(this.tasksUrl, { title })
      .pipe(
        map((response) => this.unwrap(response)),
        map(mapApiTaskToTask)
      );
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${this.tasksUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  toggleComplete(id: number): Observable<Task> {
    return this.http
      .patch<ApiResponse<ApiTask>>(`${this.tasksUrl}/${id}/toggle`, null)
      .pipe(
        map((response) => this.unwrap(response)),
        map(mapApiTaskToTask)
      );
  }

  private unwrap<T>(response: ApiResponse<T>): T {
    if (!response.success || response.data === undefined || response.data === null) {
      const message = response.message ?? 'The API returned an unexpected response.';
      throw new Error(message);
    }

    return response.data;
  }
}
