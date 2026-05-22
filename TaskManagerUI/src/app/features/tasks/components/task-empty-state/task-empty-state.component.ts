import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-task-empty-state',
  standalone: true,
  templateUrl: './task-empty-state.component.html',
  styleUrl: './task-empty-state.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskEmptyStateComponent {}
