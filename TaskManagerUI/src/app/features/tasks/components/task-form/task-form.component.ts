import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class TaskFormComponent implements OnInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  readonly disabled = input(false);
  readonly taskSubmitted = output<string>();

  readonly titleControl = new FormControl('', {
    nonNullable: true,
    validators: [requiredNonWhitespace, Validators.maxLength(500)],
  });

  showFieldError = false;

  ngOnInit(): void {
    this.titleControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (this.showFieldError && this.titleControl.valid) {
        this.showFieldError = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    if (this.titleControl.invalid) {
      this.showFieldError = true;
      this.titleControl.markAsTouched();
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.showFieldError = false;
    this.taskSubmitted.emit(this.titleControl.value.trim());
    this.titleControl.reset();
    this.changeDetectorRef.markForCheck();
  }
}
