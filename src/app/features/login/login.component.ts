import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styles: [`
    .login-wrapper {
      min-height: 100dvh;
      background: var(--color-bg);
      color: var(--color-text);
    }
    .login-card {
      background: var(--color-surface);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-2);
      padding: calc(var(--space-4) * 2);
      width: 100%;
      max-width: 420px;
    }
    label { display:block; margin-bottom: .25rem; color: var(--color-text); }
    input {
      width: 100%;
      padding: var(--space-3);
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
      background: #111a; color: var(--color-text);
      margin-bottom: var(--space-4);
      outline: none;
    }
    button {
      width: 100%;
      border: 0;
      border-radius: var(--radius-sm);
      padding: var(--space-3);
      background: var(--color-primary);
      color: #0b0f14;
      font-weight: 600;
      box-shadow: var(--shadow-1);
      cursor: pointer;
    }
    .error { color: var(--color-danger); margin-top: var(--space-3); }
  `],
  template: `
    <div class="login-wrapper l-flex l-flex--center">
      <div class="login-card">
        <h1 style="margin-bottom: var(--space-4)">Iniciar sesión</h1>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <label for="user">Usuario</label>
          <input id="user" type="text" formControlName="user" autocomplete="username" />

          <label for="pass">Contraseña</label>
          <input id="pass" type="password" formControlName="pass" autocomplete="current-password" />

          <button type="submit">Entrar</button>
        </form>

        <p class="error" *ngIf="error()">Usuario o contraseña incorrectos</p>
        <p style="opacity:.7; margin-top: var(--space-3)">Demo: <strong>admin / 1234</strong></p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  error = signal(false);

  form = this.fb.group({
    user: ['', Validators.required],
    pass: ['', Validators.required],
  });

  submit() {
    this.error.set(false);
    const { user, pass } = this.form.value;
    if (!user || !pass) return;

    const ok = this.auth.login(user, pass);
    if (ok) {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/projects';
      this.router.navigateByUrl(returnUrl);
    } else {
      this.error.set(true);
    }
  }
}
