import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { EmployeesService } from '../../../core/data/employees.service';
import { Employee } from '../../../core/data/models/employee.model';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe, EmployeeFormComponent],
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss'],
})
export class EmployeeEditComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private es = inject(EmployeesService);

  id = this.route.snapshot.paramMap.get('id') || '';
  employee$ = this.es.byId$(this.id);

  onSave(payload: Omit<Employee, 'id'>) {
    this.es.update(this.id, payload);
    this.router.navigate(['/employees']);
  }
}
