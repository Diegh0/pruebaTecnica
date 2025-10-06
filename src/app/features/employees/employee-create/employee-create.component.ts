import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EmployeesService } from '../../../core/data/employees.service';
import { Employee } from '../../../core/data/models/employee.model';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-create',
  standalone: true,
  imports: [CommonModule, RouterLink, EmployeeFormComponent],
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.scss'],
})
export class EmployeeCreateComponent {
  private es = inject(EmployeesService);
  private router = inject(Router);

  initial: Partial<Employee> = {};

  onSave(payload: Omit<Employee, 'id'>) {
    this.es.add(payload);
    this.router.navigate(['/employees']);
  }
}
