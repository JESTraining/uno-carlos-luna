import { Routes } from '@angular/router';
import { TaskManagerPageComponent } from './features/tasks/pages/task-manager-page/task-manager-page.component';

export const routes: Routes = [
  {
    path: '',
    component: TaskManagerPageComponent,
    title: 'Task Manager',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
