import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TasksService } from '../../core/data/tasks.service';
import { EmployeesService } from '../../core/data/employees.service';
import { ProjectsService } from '../../core/data/projects.service';
import { Task, TaskStatus } from '../../core/data/models/task.model';
import { Project } from '../../core/data/models/project.model';
import { Employee } from '../../core/data/models/employee.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component'; // ⬅️ NUEVO

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmDialogComponent], // ⬅️ AÑADIDO
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent {
  private ts = inject(TasksService);
  private es = inject(EmployeesService);
  private ps = inject(ProjectsService);
  private router = inject(Router);

  tasks = signal<Task[]>([]);
  employees = signal<Employee[]>([]);
  projects = signal<Project[]>([]);

  // filtros
  q = signal('');
  status = signal<'all' | TaskStatus>('all');
  projectId = signal<string>('all');

  // estado de borrado
  confirmOpen = signal(false);
  toDelete = signal<Task | null>(null);

  constructor() {
    this.ts.list$.subscribe(list => this.tasks.set(list));
    this.es.list$.subscribe(list => this.employees.set(list));
    this.ps.list$.subscribe(list => this.projects.set(list));
  }

  filtered = computed(() => {
    const term = this.q().trim().toLowerCase();
    const st = this.status();
    const pid = this.projectId();
    return this.tasks().filter(t => {
      const okTerm = !term || t.title.toLowerCase().includes(term);
      const okStatus = st === 'all' || t.status === st;
      const okProject = pid === 'all' || t.projectId === pid;
      return okTerm && okStatus && okProject;
    });
  });

  employeeName(id?: string): string {
    if (!id) return '—';
    const e = this.employees().find(x => x.id === id);
    return e?.fullName || '—';
    }
  projectName(id: string): string {
    const p = this.projects().find(x => x.id === id);
    return p?.name || '—';
  }

  create() { this.router.navigate(['/tasks', 'new']); }
  edit(t: Task, ev?: MouseEvent) { ev?.stopPropagation(); this.router.navigate(['/tasks', t.id, 'edit']); }

  // 🗑️ borrar con confirmación
  askDelete(t: Task, ev?: MouseEvent) {
    ev?.stopPropagation();
    this.toDelete.set(t);
    this.confirmOpen.set(true);
  }
  confirmDelete() {
    const t = this.toDelete();
    if (t) this.ts.remove(t.id);
    this.confirmOpen.set(false);
    this.toDelete.set(null);
  }
  cancelDelete() {
    this.confirmOpen.set(false);
    this.toDelete.set(null);
  }
  
}
