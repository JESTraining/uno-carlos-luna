import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { TASK_REPOSITORY } from './core/repositories/task.repository';
import { HttpTaskRepository } from './features/tasks/data/http-task.repository';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    HttpTaskRepository,
    { provide: TASK_REPOSITORY, useExisting: HttpTaskRepository },
  ],
};
