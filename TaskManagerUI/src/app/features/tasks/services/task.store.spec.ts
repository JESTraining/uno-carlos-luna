import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Task } from '../../../core/models/task.model';
import { TASK_REPOSITORY, TaskRepository } from '../../../core/repositories/task.repository';
import { TaskStore } from './task.store';

describe('TaskStore', () => {
  let store: TaskStore;
  let repository: jasmine.SpyObj<TaskRepository>;

  beforeEach(() => {
    repository = jasmine.createSpyObj<TaskRepository>('TaskRepository', [
      'getAll',
      'create',
      'delete',
      'toggleComplete',
    ]);
    repository.getAll.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [TaskStore, { provide: TASK_REPOSITORY, useValue: repository }],
    });
  });

  function createStore(): TaskStore {
    store = TestBed.inject(TaskStore);
    return store;
  }

  it('reload_OnInit_LoadsTasks', fakeAsync(() => {
    const tasks: Task[] = [{ id: 1, title: 'Loaded', isComplete: false }];
    repository.getAll.and.returnValue(of(tasks));

    createStore();
    tick();

    expect(store.tasks()).toEqual(tasks);
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
  }));

  it('reload_WhenApiFails_SetsErrorAndClearsTasks', fakeAsync(() => {
    repository.getAll.and.returnValue(throwError(() => new Error('Network error')));

    createStore();
    tick();

    expect(store.tasks()).toEqual([]);
    expect(store.error()).toBe('Unable to load tasks. Is the API running?');
    expect(store.loading()).toBeFalse();
  }));

  it('add_WithValidTitle_CreatesTaskAndReloads', fakeAsync(() => {
    const created: Task = { id: 1, title: 'Buy milk', isComplete: false };
    repository.getAll.and.returnValues(of([]), of([created]));
    repository.create.and.returnValue(of(created));

    createStore();
    tick();

    store.add('Buy milk');
    tick();

    expect(repository.create).toHaveBeenCalledWith('Buy milk');
    expect(store.tasks()).toEqual([created]);
    expect(store.error()).toBeNull();
  }));

  it('add_WithBlankTitle_DoesNotCallRepository', fakeAsync(() => {
    createStore();
    tick();

    store.add('   ');
    tick();

    expect(repository.create).not.toHaveBeenCalled();
  }));

  it('remove_WithValidId_DeletesTaskAndReloads', fakeAsync(() => {
    repository.getAll.and.returnValues(
      of([{ id: 1, title: 'Remove me', isComplete: false }]),
      of([])
    );
    repository.delete.and.returnValue(of(undefined));

    createStore();
    tick();

    store.remove(1);
    tick();

    expect(repository.delete).toHaveBeenCalledWith(1);
    expect(store.tasks()).toEqual([]);
  }));

  it('toggle_WithValidId_TogglesTaskAndReloads', fakeAsync(() => {
    const toggled: Task = { id: 1, title: 'Toggle me', isComplete: true };
    repository.getAll.and.returnValues(
      of([{ id: 1, title: 'Toggle me', isComplete: false }]),
      of([toggled])
    );
    repository.toggleComplete.and.returnValue(of(toggled));

    createStore();
    tick();

    store.toggle(1);
    tick();

    expect(repository.toggleComplete).toHaveBeenCalledWith(1);
    expect(store.tasks()).toEqual([toggled]);
  }));

  it('run_WhenActionFails_SetsGenericError', fakeAsync(() => {
    repository.getAll.and.returnValue(of([]));
    repository.create.and.returnValue(throwError(() => new Error('Create failed')));

    createStore();
    tick();

    store.add('Fail');
    tick();

    expect(store.error()).toBe('Something went wrong. Please try again.');
    expect(store.loading()).toBeFalse();
  }));
});
