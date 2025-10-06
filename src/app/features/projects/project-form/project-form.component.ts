import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project, ProjectStatus } from '../../../core/data/models/project.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
})
export class ProjectFormComponent {
  @Input() initial?: Partial<Project> | null = null;
  @Output() save = new EventEmitter<Omit<Project, 'id'>>();

  statuses: ProjectStatus[] = ['planificado', 'en proceso', 'completado'];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    startDate: [''],
    endDate: [''],
    status: ['planned' as ProjectStatus, Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.initial) {
      this.form.patchValue({
        name: this.initial.name ?? '',
        description: this.initial.description ?? '',
        startDate: this.initial.startDate ?? '',
        endDate: this.initial.endDate ?? '',
        status: (this.initial.status as ProjectStatus) ?? 'planned',
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, description, startDate, endDate, status } = this.form.value;
    this.save.emit({
      name: name!.trim(),
      description: description?.trim() || '',
      startDate: startDate || '',
      endDate: endDate || '',
      status: status as ProjectStatus,
    });
  }

  get f() { return this.form.controls; }
}
