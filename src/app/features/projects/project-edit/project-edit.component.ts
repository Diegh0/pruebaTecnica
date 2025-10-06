import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ProjectsService } from '../../../core/data/projects.service';
import { Project } from '../../../core/data/models/project.model';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-project-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe, ProjectFormComponent],
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss'],
})
export class ProjectEditComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ps = inject(ProjectsService);

  id = this.route.snapshot.paramMap.get('id') || '';
  project$ = this.ps.byId$(this.id);

  onSave(data: Omit<Project, 'id'>) {
    this.ps.update(this.id, data);
    this.router.navigate(['/projects', this.id]);
  }
}
