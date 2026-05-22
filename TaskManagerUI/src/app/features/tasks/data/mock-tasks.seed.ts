import { Task } from '../../../core/models/task.model';

export const MOCK_TASKS_SEED: readonly Task[] = [
  { id: 1, title: 'Review pull requests', isComplete: false },
  { id: 2, title: 'Prepare demo for stakeholders', isComplete: true },
  { id: 3, title: 'Document API contract', isComplete: false },
];
