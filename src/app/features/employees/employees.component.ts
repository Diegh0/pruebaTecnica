import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EmployeesService } from '../../core/data/employees.service';
import { Employee } from '../../core/data/models/employee.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmDialogComponent],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent {
  private es = inject(EmployeesService);
  private router = inject(Router);

  items = signal<Employee[]>([]);
  q = signal('');

  confirmOpen = signal(false);
  toDelete = signal<Employee | null>(null);

  constructor() {
    this.es.list$.subscribe(list => this.items.set(list));
  }

  filtered = computed(() => {
    const term = this.q().trim().toLowerCase();
    if (!term) return this.items();
    return this.items().filter(e =>
      (e.fullName?.toLowerCase().includes(term)) ||
      (e.email?.toLowerCase().includes(term)) ||
      (e.role?.toLowerCase().includes(term))
    );
  });

  create() { this.router.navigate(['/employees', 'new']); }
  edit(e: Employee, ev?: MouseEvent) { ev?.stopPropagation(); this.router.navigate(['/employees', e.id, 'edit']); }

  askDelete(e: Employee, ev?: MouseEvent) { ev?.stopPropagation(); this.toDelete.set(e); this.confirmOpen.set(true); }
  confirmDelete() {
    const e = this.toDelete();
    if (e) this.es.remove(e.id);
    this.confirmOpen.set(false); this.toDelete.set(null);
  }
  cancelDelete() { this.confirmOpen.set(false); this.toDelete.set(null); }
  open(e: Employee) { this.router.navigate(['/employees', e.id]); }

}
