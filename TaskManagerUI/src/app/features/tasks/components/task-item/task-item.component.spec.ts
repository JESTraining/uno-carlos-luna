import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Task } from '../../../../core/models/task.model';
import { TaskItemComponent } from './task-item.component';

describe('TaskItemComponent', () => {
  let fixture: ComponentFixture<TaskItemComponent>;
  const task: Task = { id: 1, title: 'Buy milk', isComplete: false };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    fixture.componentRef.setInput('task', task);
    fixture.detectChanges();
  });

  it('renders task title', () => {
    const title = fixture.nativeElement.querySelector('span');

    expect(title.textContent).toContain('Buy milk');
  });

  it('checkboxChange_EmitsToggledWithTaskId', () => {
    spyOn(fixture.componentInstance.toggled, 'emit');
    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');

    checkbox.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.toggled.emit).toHaveBeenCalledWith(1);
  });

  it('deleteClick_EmitsRemovedWithTaskId', () => {
    spyOn(fixture.componentInstance.removed, 'emit');
    const deleteButton: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    deleteButton.click();

    expect(fixture.componentInstance.removed.emit).toHaveBeenCalledWith(1);
  });

  it('completeTask_AddsCompleteHostClass', () => {
    fixture.componentRef.setInput('task', { ...task, isComplete: true });
    fixture.detectChanges();

    expect(fixture.nativeElement.classList.contains('complete')).toBeTrue();
  });
});
