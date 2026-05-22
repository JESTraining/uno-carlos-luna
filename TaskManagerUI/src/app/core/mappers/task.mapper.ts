import { ApiTask } from '../models/api-task.model';
import { Task } from '../models/task.model';

export function mapApiTaskToTask(apiTask: ApiTask): Task {
  return {
    id: apiTask.id,
    title: apiTask.title,
    isComplete: apiTask.isComplete,
  };
}
