import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../../core/data/models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent {
  @Input() initial?: Partial<Employee> | null = null;
  @Output() save = new EventEmitter<Omit<Employee, 'id'>>();

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.email]],
    role: [''],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.initial) {
      this.form.patchValue({
        fullName: this.initial.fullName ?? '',
        email: this.initial.email ?? '',
        role: this.initial.role ?? '',
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { fullName, email, role } = this.form.value;
    this.save.emit({
      fullName: fullName!.trim(),
      email: email?.trim() || '',
      role: role?.trim() || '',
    });
  }

  get f() { return this.form.controls; }
}
