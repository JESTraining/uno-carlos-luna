import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Task } from '../../../../core/models/task.model';
import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
  });

  it('emptyTasks_ShowsEmptyState', () => {
    fixture.componentRef.setInput('tasks', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-task-empty-state')).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('li[task-item]').length).toBe(0);
  });

  it('withTasks_RendersTaskItems', () => {
    const tasks: Task[] = [
      { id: 1, title: 'One', isComplete: false },
      { id: 2, title: 'Two', isComplete: true },
    ];
    fixture.componentRef.setInput('tasks', tasks);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-task-empty-state')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('li[task-item]').length).toBe(2);
  });

  it('taskToggle_EmitsToggledEvent', () => {
    const tasks: Task[] = [{ id: 5, title: 'Toggle me', isComplete: false }];
    fixture.componentRef.setInput('tasks', tasks);
    fixture.detectChanges();

    spyOn(fixture.componentInstance.toggled, 'emit');
    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
    checkbox.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.toggled.emit).toHaveBeenCalledWith(5);
  });

  it('taskRemove_EmitsRemovedEvent', () => {
    const tasks: Task[] = [{ id: 7, title: 'Delete me', isComplete: false }];
    fixture.componentRef.setInput('tasks', tasks);
    fixture.detectChanges();

    spyOn(fixture.componentInstance.removed, 'emit');
    const deleteButton: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    deleteButton.click();

    expect(fixture.componentInstance.removed.emit).toHaveBeenCalledWith(7);
  });
});
