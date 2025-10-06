import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../../core/data/models/employee.model';
import { Project } from '../../../core/data/models/project.model';
import { Task, TaskStatus } from '../../../core/data/models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent {
  /** Valores iniciales (para create/edit) */
  @Input() initial?: Partial<Task> | null = null;
  /** Listas para selects */
  @Input() employees: Employee[] = [];
  @Input() projects: Project[] = [];

  /** Emite el payload listo para guardar (sin id) */
  @Output() save = new EventEmitter<Omit<Task, 'id'>>();

  statuses: TaskStatus[] = ['pendiente', 'en proceso', 'completado'];

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    status: ['pending' as TaskStatus, Validators.required],
    createdAt: [''], // ISO
    dueDate: [''],   // ISO
    employeeId: [''],
    projectId: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const v = this.initial ?? {};
    this.form.patchValue({
      title: v.title ?? '',
      description: v.description ?? '',
      status: (v.status as TaskStatus) ?? 'pending',
      createdAt: v.createdAt ?? today,
      dueDate: v.dueDate ?? '',
      employeeId: v.employeeId ?? '',
      projectId: v.projectId ?? '',
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const vals = this.form.getRawValue();
    this.save.emit({
      title: vals.title!.trim(),
      description: (vals.description || '').trim(),
      status: vals.status as TaskStatus,
      createdAt: vals.createdAt || new Date().toISOString().slice(0,10),
      dueDate: vals.dueDate || '',
      employeeId: vals.employeeId || '',
      projectId: vals.projectId!,
    });
  }

  get f() { return this.form.controls; }
}
