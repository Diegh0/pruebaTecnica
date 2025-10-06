import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Task } from '../../../core/data/models/task.model';
import { Employee } from '../../../core/data/models/employee.model';
import { Project } from '../../../core/data/models/project.model';
import { TasksService } from '../../../core/data/tasks.service';
import { EmployeesService } from '../../../core/data/employees.service';
import { ProjectsService } from '../../../core/data/projects.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe, TaskFormComponent],
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],
})
export class TaskEditComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ts = inject(TasksService);
  private es = inject(EmployeesService);
  private ps = inject(ProjectsService);

  id = this.route.snapshot.paramMap.get('id') || '';
  task$ = this.ts.byId$(this.id);

  employees: Employee[] = [];
  projects: Project[] = [];

  constructor() {
    this.es.list$.subscribe(l => this.employees = l);
    this.ps.list$.subscribe(l => this.projects = l);
  }

  onSave(payload: Omit<Task, 'id'>) {
    this.ts.update(this.id, payload);
    this.router.navigate(['/tasks']); // o mantener en edit/volver
  }
}
