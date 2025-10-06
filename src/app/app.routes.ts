import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';


export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },

  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'projects' },
      { path: 'projects', loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent) },
      { path: 'projects/new', loadComponent: () => import('./features/projects/project-create/project-create.component').then(m => m.ProjectCreateComponent) },
      { path: 'projects/:id', loadComponent: () => import('./features/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent) },
      { path: 'projects/:id/edit', loadComponent: () => import('./features/projects/project-edit/project-edit.component').then(m => m.ProjectEditComponent) },
      { path: 'tasks', loadComponent: () => import('./features/tasks/tasks.component').then(m => m.TasksComponent) },
      { path: 'tasks/new', loadComponent: () => import('./features/tasks/task-create/task-create.component').then(m => m.TaskCreateComponent) },
      { path: 'tasks/:id/edit', loadComponent: () => import('./features/tasks/task-edit/task-edit.component').then(m => m.TaskEditComponent) },
      { path: 'employees', loadComponent: () => import('./features/employees/employees.component').then(m => m.EmployeesComponent) },
      { path: 'employees/new', loadComponent: () => import('./features/employees/employee-create/employee-create.component').then(m => m.EmployeeCreateComponent) },
      { path: 'employees/:id', loadComponent: () => import('./features/employees/employee-detail/employee-detail.component').then(m => m.EmployeeDetailComponent) }, 
      { path: 'employees/:id/edit', loadComponent: () => import('./features/employees/employee-edit/employee-edit.component').then(m => m.EmployeeEditComponent) },

    ]
  },

  { path: '**', redirectTo: '' }
];
