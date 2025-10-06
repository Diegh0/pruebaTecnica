import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Task } from './models/task.model';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly KEY = 'tasks';
  private readonly _items$ = new BehaviorSubject<Task[]>(this.load());
  readonly list$ = this._items$.asObservable();

  byId$(id: string): Observable<Task | undefined> {
    return this.list$.pipe(map(list => list.find(t => t.id === id)));
  }

  add(task: Omit<Task, 'id'>): string {
    const id = this.uuid();
    const next = [...this._items$.value, { ...task, id }];
    this.persist(next);
    return id;
  }

  update(id: string, changes: Partial<Omit<Task, 'id'>>) {
    const next = this._items$.value.map(t => t.id === id ? { ...t, ...changes } : t);
    this.persist(next);
  }

  remove(id: string) {
    const next = this._items$.value.filter(t => t.id !== id);
    this.persist(next);
  }

  // helpers
  private persist(next: Task[]) {
    localStorage.setItem(this.KEY, JSON.stringify(next));
    this._items$.next(next);
  }
  private load(): Task[] {
    const raw = localStorage.getItem(this.KEY);
    if (raw) return JSON.parse(raw) as Task[];

    // seed de ejemplo (referencias a p1/p2 y empleados e1/e2)
    const seed: Task[] = [
      { id: 't1', title: 'Crear wireframes', status: 'en proceso', createdAt: '2025-09-02', dueDate: '2025-09-10', employeeId: 'e2', projectId: 'p1' },
      { id: 't2', title: 'Configurar CI/CD', status: 'pendiente', createdAt: '2025-09-03', dueDate: '2025-09-20', employeeId: 'e1', projectId: 'p1' },
      { id: 't3', title: 'Pruebas de regresión', status: 'completado', createdAt: '2025-07-12', dueDate: '2025-08-15', employeeId: 'e3', projectId: 'p2' },
    ];
    localStorage.setItem(this.KEY, JSON.stringify(seed));
    return seed;
  }
  private uuid(): string {
    if ('randomUUID' in crypto) return (crypto as any).randomUUID();
    return 't-' + Math.random().toString(36).slice(2, 11);
  }
}
