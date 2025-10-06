import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProjectsService } from '../../../core/data/projects.service';
import { Project } from '../../../core/data/models/project.model';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CommonModule, RouterLink, ProjectFormComponent],
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
})
export class ProjectCreateComponent {
  private ps = inject(ProjectsService);
  private router = inject(Router);

  initial: Partial<Project> = {
    status: 'planificado',
  };

  onSave(data: Omit<Project, 'id'>) {
    const id = this.ps.add(data);
    this.router.navigate(['/projects', id]); // Ir al detalle tras crear
  }
}
