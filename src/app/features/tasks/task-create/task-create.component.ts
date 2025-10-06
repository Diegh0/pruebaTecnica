import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Task } from '../../../core/data/models/task.model';
import { EmployeesService } from '../../../core/data/employees.service';
import { ProjectsService } from '../../../core/data/projects.service';
import { Employee } from '../../../core/data/models/employee.model';
import { Project } from '../../../core/data/models/project.model';
import { TasksService } from '../../../core/data/tasks.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, RouterLink, TaskFormComponent],
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
})
export class TaskCreateComponent {
  private router = inject(Router);
  private es = inject(EmployeesService);
  private ps = inject(ProjectsService);
  private ts = inject(TasksService);

  employees: Employee[] = [];
  projects: Project[] = [];

  constructor() {
    this.es.list$.subscribe(l => this.employees = l);
    this.ps.list$.subscribe(l => this.projects = l);
  }

  initial: Partial<Task> = { status: 'pendiente' };

  onSave(payload: Omit<Task, 'id'>) {
    const id = this.ts.add(payload);
    this.router.navigate(['/tasks', id, 'edit']); // o a /tasks si prefieres
  }
}
