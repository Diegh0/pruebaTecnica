import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Employee } from './models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private readonly KEY = 'employees';
  private readonly _items$ = new BehaviorSubject<Employee[]>(this.load());
  readonly list$ = this._items$.asObservable();

  byId$(id: string): Observable<Employee | undefined> {
    return this.list$.pipe(map(list => list.find(e => e.id === id)));
  }

  add(e: Omit<Employee, 'id'>): string {
    const id = this.uuid();
    const next = [...this._items$.value, { ...e, id }];
    this.persist(next);
    return id;
  }

  update(id: string, changes: Partial<Omit<Employee, 'id'>>): void {
    const next = this._items$.value.map(x => x.id === id ? { ...x, ...changes } : x);
    this.persist(next);
  }

  remove(id: string): void {
    const next = this._items$.value.filter(x => x.id !== id);
    this.persist(next);
  }

  // helpers
  private persist(next: Employee[]) {
    localStorage.setItem(this.KEY, JSON.stringify(next));
    this._items$.next(next);
  }
  private load(): Employee[] {
    const raw = localStorage.getItem(this.KEY);
    if (raw) return JSON.parse(raw) as Employee[];
    const seed: Employee[] = [
      { id: 'e1', fullName: 'Ana García', email: 'ana@empresa.com', role: 'Desarrollador' },
      { id: 'e2', fullName: 'Luis Pérez', email: 'luis@empresa.com', role: 'Diseñador' },
      { id: 'e3', fullName: 'María López', email: 'maria@empresa.com', role: 'QA' },
    ];
    localStorage.setItem(this.KEY, JSON.stringify(seed));
    return seed;
  }
  private uuid(): string {
    if ('randomUUID' in crypto) return (crypto as any).randomUUID();
    return 'e-' + Math.random().toString(36).slice(2, 11);
  }
}
