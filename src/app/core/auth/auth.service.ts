import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Session = { user: string; ts: number };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly KEY = 'session';
  private readonly _isAuth$ = new BehaviorSubject<boolean>(this.hasSession());

  isAuthenticated$ = this._isAuth$.asObservable();

  login(username: string, password: string): boolean {
    // Credenciales simuladas
    const ok = username === 'admin' && password === '1234';
    if (ok) {
      const sess: Session = { user: username, ts: Date.now() };
      localStorage.setItem(this.KEY, JSON.stringify(sess));
      this._isAuth$.next(true);
    }
    return ok;
  }

  logout(): void {
    localStorage.removeItem(this.KEY);
    this._isAuth$.next(false);
  }

  isAuthenticated(): boolean {
    return this._isAuth$.value;
  }

  private hasSession(): boolean {
    return !!localStorage.getItem(this.KEY);
  }
}
