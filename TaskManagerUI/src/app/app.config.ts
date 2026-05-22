import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { TASK_REPOSITORY } from './core/repositories/task.repository';
import { MockTaskRepository } from './features/tasks/data/mock-task.repository';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    MockTaskRepository,
    { provide: TASK_REPOSITORY, useExisting: MockTaskRepository },
  ],
};
