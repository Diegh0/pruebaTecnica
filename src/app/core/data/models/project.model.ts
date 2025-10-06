//export type ProjectStatus = 'planned' | 'in_progress' | 'done';
export type ProjectStatus = 'planificado' | 'en proceso' | 'completado';

export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate?: string; 
  endDate?: string;  
  status: ProjectStatus;
  employeeIds?: string[]; // default: []

}
