export type TaskStatus = 'pendiente' | 'en proceso' | 'completado';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;   // ISO (YYYY-MM-DD)
  dueDate?: string;    // ISO
  employeeId?: string; // referencia a Employee
  projectId: string;   // referencia a Project
}
