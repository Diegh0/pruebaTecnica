import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Project } from './models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly KEY = 'projects';
  private readonly _items$ = new BehaviorSubject<Project[]>(this.load());

  readonly list$ = this._items$.asObservable();

  byId$(id: string): Observable<Project | undefined> {
    return this.list$.pipe(map(list => list.find(p => p.id === id)));
  }

  add(project: Omit<Project, 'id'>): string {
    const id = this.uuid();
    const next = [
      ...this._items$.value,
      { ...project, id, employeeIds: project.employeeIds ?? [] } // ⬅️ default
    ];
    this.persist(next);
    return id;
  }

  update(id: string, changes: Partial<Omit<Project, 'id'>>) {
    const next = this._items$.value.map(p =>
      p.id === id ? { ...p, ...changes, employeeIds: changes.employeeIds ?? p.employeeIds ?? [] } : p
    );
    this.persist(next);
  }

  remove(id: string) {
    const next = this._items$.value.filter(p => p.id !== id);
    this.persist(next);
  }

  // ---------------- helpers ----------------
  private persist(next: Project[]) {
    localStorage.setItem(this.KEY, JSON.stringify(next));
    this._items$.next(next);
  }

  private load(): Project[] {
    const raw = localStorage.getItem(this.KEY);
    if (raw) return JSON.parse(raw) as Project[];

    // seed de ejemplo (añadimos employeeIds vacíos)
    const seed: Project[] = [
      { id: 'p1', name: 'Landing corporativa', description: 'Web básica con CMS',
        startDate: '2025-09-01', endDate: '2025-10-15', status: 'en proceso', employeeIds: [] },
      { id: 'p2', name: 'App interna RRHH', description: 'Módulo de vacaciones y ausencias',
        startDate: '2025-07-10', endDate: '2025-08-30', status: 'completado', employeeIds: [] },
    ];
    localStorage.setItem(this.KEY, JSON.stringify(seed));
    return seed;
  }

  private uuid(): string {
    if ('randomUUID' in crypto) return (crypto as any).randomUUID();
    return 'p-' + Math.random().toString(36).slice(2, 11);
  }
}
