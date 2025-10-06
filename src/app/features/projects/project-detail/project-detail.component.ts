import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { ProjectsService } from '../../../core/data/projects.service';
import { TasksService } from '../../../core/data/tasks.service';
import { EmployeesService } from '../../../core/data/employees.service';

import { Project } from '../../../core/data/models/project.model';
import { Task } from '../../../core/data/models/task.model';
import { Employee } from '../../../core/data/models/employee.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ps = inject(ProjectsService);
  private ts = inject(TasksService);
  private es = inject(EmployeesService);

  id = this.route.snapshot.paramMap.get('id') || '';
  project$ = this.ps.byId$(this.id);

  // colecciones para tablas/selects
  tasks = signal<Task[]>([]);
  employees = signal<Employee[]>([]);

  constructor() {
    this.ts.list$.subscribe(l => this.tasks.set(l));
    this.es.list$.subscribe(l => this.employees.set(l));
  }

  // tareas del proyecto
  tasksOfProject = computed(() => this.tasks().filter(t => t.projectId === this.id));

  employeeName = (id?: string) => this.employees().find(e => e.id === id)?.fullName || '—';

  // ---- acciones ----
  back() { this.router.navigate(['/projects']); }
  edit(id: string) { this.router.navigate(['/projects', id, 'edit']); }

  // asignación de empleado a una tarea (inline)
  setEmployeeForTask(t: Task, employeeId: string) {
    this.ts.update(t.id, { employeeId: employeeId || '' });
  }

  // toggle de empleados asignados al proyecto (checkboxes)
  toggleEmployee(project: Project, empId: string, checked: boolean) {
    const set = new Set(project.employeeIds ?? []);
    checked ? set.add(empId) : set.delete(empId);
    this.ps.update(project.id, { employeeIds: Array.from(set) });
  }
}
