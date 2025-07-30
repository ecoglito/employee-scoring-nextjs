export type KPIType = 'numeric' | 'percentage' | 'boolean' | 'scale';
export type KPIFrequency = 'weekly' | 'monthly' | 'quarterly';

export interface KPI {
  id: string;
  name: string;
  description: string;
  type: KPIType;
  target?: number;
  frequency: KPIFrequency;
  createdAt: string;
}

export interface Score {
  id: string;
  date: string;
  overall: number;
  kpiScores: Record<string, number | boolean>;
  notes?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  responsibility: string;
  responsibilities: string[];
  managerId?: string;
  department?: string;
  kpis: KPI[];
  scores: Score[];
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
}

export interface AppData {
  employees: Record<string, Employee>;
  version: string;
}

export interface EmployeeStats {
  id: string;
  name: string;
  role: string;
  currentScore?: number;
  lastScored?: string;
  kpiCompletionRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TeamStats {
  managerId: string;
  managerName: string;
  directReports: EmployeeStats[];
  averageScore: number;
  completionRate: number;
}