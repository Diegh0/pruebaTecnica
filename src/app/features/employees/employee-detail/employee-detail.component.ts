import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { EmployeesService } from '../../../core/data/employees.service';
import { TasksService } from '../../../core/data/tasks.service';
import { ProjectsService } from '../../../core/data/projects.service';

import { Employee } from '../../../core/data/models/employee.model';
import { Task } from '../../../core/data/models/task.model';
import { Project } from '../../../core/data/models/project.model';

import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe, ConfirmDialogComponent],
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private es = inject(EmployeesService);
  private ts = inject(TasksService);
  private ps = inject(ProjectsService);

  id = this.route.snapshot.paramMap.get('id') || '';
  employee$ = this.es.byId$(this.id);

  // colecciones
  tasks = signal<Task[]>([]);
  projects = signal<Project[]>([]);

  // confirmación de borrado
  confirmOpen = signal(false);
  current: Employee | null = null;

  constructor() {
    this.ts.list$.subscribe(l => this.tasks.set(l));
    this.ps.list$.subscribe(l => this.projects.set(l));
  }

  // tareas del empleado
  tasksOfEmployee = computed(() => this.tasks().filter(t => t.employeeId === this.id));

  // proyectos en los que participa (derivados de sus tareas)
  projectsOfEmployee = computed(() => {
    const ids = new Set(this.tasksOfEmployee().map(t => t.projectId));
    return this.projects().filter(p => ids.has(p.id));
  });

  projectName(id: string): string {
    return this.projects().find(p => p.id === id)?.name || '—';
  }

  edit(emp: Employee) { this.router.navigate(['/employees', emp.id, 'edit']); }
  back() { this.router.navigate(['/employees']); }

 
}
