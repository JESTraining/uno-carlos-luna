import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Task } from '../../../../core/models/task.model';
import { TASK_REPOSITORY, TaskRepository } from '../../../../core/repositories/task.repository';
import { TaskManagerPageComponent } from './task-manager-page.component';

type TaskManagerPageHarness = TaskManagerPageComponent & {
  incompleteTasks(): readonly Task[];
  completedTasks(): readonly Task[];
};

describe('TaskManagerPageComponent', () => {
  let fixture: ComponentFixture<TaskManagerPageComponent>;
  let repository: jasmine.SpyObj<TaskRepository>;

  beforeEach(async () => {
    repository = jasmine.createSpyObj<TaskRepository>('TaskRepository', [
      'getAll',
      'create',
      'delete',
      'toggleComplete',
    ]);
    repository.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [TaskManagerPageComponent],
      providers: [{ provide: TASK_REPOSITORY, useValue: repository }],
    }).compileComponents();
  });

  function createComponent(): ComponentFixture<TaskManagerPageComponent> {
    fixture = TestBed.createComponent(TaskManagerPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('renders page header', fakeAsync(() => {
    createComponent();
    tick();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Task Manager');
  }));

  it('storeError_DisplaysAlert', fakeAsync(() => {
    repository.getAll.and.returnValue(throwError(() => new Error('API down')));
    createComponent();
    tick();
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('.alert-error');
    expect(alert?.textContent).toContain('Unable to load tasks. Is the API running?');
  }));

  it('tasks_SplitsIncompleteAndCompletedLists', fakeAsync(() => {
    const tasks: Task[] = [
      { id: 1, title: 'Open', isComplete: false },
      { id: 2, title: 'Done', isComplete: true },
    ];
    repository.getAll.and.returnValue(of(tasks));

    createComponent();
    tick();
    fixture.detectChanges();

    const component = fixture.componentInstance as TaskManagerPageHarness;

    expect(component.incompleteTasks()).toEqual([tasks[0]]);
    expect(component.completedTasks()).toEqual([tasks[1]]);
  }));
});
