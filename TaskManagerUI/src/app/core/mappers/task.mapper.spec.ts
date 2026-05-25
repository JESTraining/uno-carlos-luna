import { mapApiTaskToTask } from './task.mapper';

describe('mapApiTaskToTask', () => {
  it('maps api task fields to domain task', () => {
    const apiTask = { id: 1, title: 'Buy milk', isComplete: false };

    const result = mapApiTaskToTask(apiTask);

    expect(result).toEqual({ id: 1, title: 'Buy milk', isComplete: false });
  });

  it('preserves completed state', () => {
    const apiTask = { id: 2, title: 'Done task', isComplete: true };

    const result = mapApiTaskToTask(apiTask);

    expect(result.isComplete).toBeTrue();
  });
});
