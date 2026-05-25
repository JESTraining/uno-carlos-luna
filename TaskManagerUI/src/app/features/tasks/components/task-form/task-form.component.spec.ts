import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('onSubmit_WithInvalidForm_DoesNotEmitTask', () => {
    spyOn(component.taskSubmitted, 'emit');

    component.onSubmit(new SubmitEvent('submit'));

    expect(component.taskSubmitted.emit).not.toHaveBeenCalled();
    expect(component.showFieldError).toBeTrue();
  });

  it('onSubmit_WithWhitespaceOnly_ShowsValidationError', () => {
    spyOn(component.taskSubmitted, 'emit');
    component.titleControl.setValue('   ');

    component.onSubmit(new SubmitEvent('submit'));

    expect(component.taskSubmitted.emit).not.toHaveBeenCalled();
    expect(component.showFieldError).toBeTrue();
  });

  it('onSubmit_WithValidTitle_EmitsTrimmedTitleAndResetsForm', () => {
    spyOn(component.taskSubmitted, 'emit');
    component.titleControl.setValue('  Buy milk  ');

    component.onSubmit(new SubmitEvent('submit'));

    expect(component.taskSubmitted.emit).toHaveBeenCalledWith('Buy milk');
    expect(component.titleControl.value).toBe('');
    expect(component.showFieldError).toBeFalse();
  });

  it('onSubmit_WithTitleOverMaxLength_DoesNotEmitTask', () => {
    spyOn(component.taskSubmitted, 'emit');
    component.titleControl.setValue('a'.repeat(501));

    component.onSubmit(new SubmitEvent('submit'));

    expect(component.taskSubmitted.emit).not.toHaveBeenCalled();
    expect(component.showFieldError).toBeTrue();
  });

  it('valueChanges_WhenInvalidFieldBecomesValid_HidesFieldError', () => {
    component.showFieldError = true;
    component.titleControl.setValue('');
    component.titleControl.setValue('Valid task');

    expect(component.showFieldError).toBeFalse();
  });
});
