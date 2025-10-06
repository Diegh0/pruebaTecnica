import { Component, computed, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe,NgIf],
  styles: [`
    nav {
      background: var(--color-surface);
      color: var(--color-text);
      box-shadow: var(--shadow-1);
      padding: var(--space-3) var(--space-4);
      border-bottom: 1px solid var(--color-border);
    }
    a { color: var(--color-text); text-decoration: none; margin-right: var(--space-4); }
    .spacer { flex: 1; }
    button {
      background: transparent; border: 1px solid var(--color-border);
      color: var(--color-text); padding: .4rem .8rem; border-radius: var(--radius-sm); cursor: pointer;
    }
  `],
  template: `
    <nav class="l-flex l-flex--between l-flex--row">
      <div>
        <a routerLink="/projects">Proyectos</a>
        <a routerLink="/tasks">Tareas</a>
        <a routerLink="/employees">Empleados</a>
      </div>
      <div class="spacer"></div>
      <div *ngIf="isAuth()">
        <button class="btn btn--icon btn--ghost" (click)="logout()">Salir</button>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  isAuth = computed(() => this.auth.isAuthenticated());
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
