import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

function requiredNonWhitespace(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  return typeof value === 'string' && value.trim() ? null : { required: true };
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  readonly disabled = input(false);
  readonly taskSubmitted = output<string>();

  readonly titleControl = new FormControl('', {
    nonNullable: true,
    validators: [requiredNonWhitespace, Validators.maxLength(500)],
  });

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    if (this.titleControl.invalid) {
      this.titleControl.markAsTouched();
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.taskSubmitted.emit(this.titleControl.value.trim());
    this.titleControl.reset();
  }
}
