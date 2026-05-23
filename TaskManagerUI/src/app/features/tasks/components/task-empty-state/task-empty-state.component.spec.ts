import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskEmptyStateComponent } from './task-empty-state.component';

describe('TaskEmptyStateComponent', () => {
  let fixture: ComponentFixture<TaskEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskEmptyStateComponent);
    fixture.detectChanges();
  });

  it('renders empty state message', () => {
    const message: HTMLElement = fixture.nativeElement.querySelector('.empty-state');

    expect(message.textContent).toContain('No tasks yet');
    expect(message.getAttribute('role')).toBe('status');
  });
});
