import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProjectsService } from '../../core/data/projects.service';
import { Project } from '../../core/data/models/project.model';
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmDialogComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  private ps = inject(ProjectsService);
  private router = inject(Router);

  items = signal<Project[]>([]);
  q = signal('');

  // estado de confirmación de borrado
  confirmOpen = signal(false);
  toDelete = signal<Project | null>(null);

  constructor() {
    this.ps.list$.subscribe(list => this.items.set(list));
  }

  filtered = computed(() => {
    const term = this.q().trim().toLowerCase();
    if (!term) return this.items();
    return this.items().filter(p => p.name.toLowerCase().includes(term));
  });

  open(p: Project) {
    this.router.navigate(['/projects', p.id]);
  }

  create() {
    this.router.navigate(['/projects', 'new']);
  }

  edit(p: Project, ev?: MouseEvent) {
    ev?.stopPropagation();
    this.router.navigate(['/projects', p.id, 'edit']);
  }

  askDelete(p: Project, ev?: MouseEvent) {
    ev?.stopPropagation();
    this.toDelete.set(p);
    this.confirmOpen.set(true);
  }

  confirmDelete() {
    const p = this.toDelete();
    if (p) {
      this.ps.remove(p.id);
    }
    this.confirmOpen.set(false);
    this.toDelete.set(null);
  }

  cancelDelete() {
    this.confirmOpen.set(false);
    this.toDelete.set(null);
  }
  
}
