import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, KPI, Score } from '@/types';
import DatabaseService from '@/lib/database';

interface EmployeeContextType {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  archiveEmployee: (id: string) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  getEmployee: (id: string) => Employee | undefined;
  addKPI: (employeeId: string, kpi: Omit<KPI, 'id' | 'createdAt'>) => Promise<void>;
  updateKPI: (employeeId: string, kpi: KPI) => Promise<void>;
  deleteKPI: (employeeId: string, kpiId: string) => Promise<void>;
  addScore: (employeeId: string, score: Omit<Score, 'id' | 'createdAt'>) => Promise<void>;
  updateScore: (employeeId: string, score: Score) => Promise<void>;
  deleteScore: (employeeId: string, scoreId: string) => Promise<void>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

interface EmployeeProviderProps {
  children: ReactNode;
}

export function EmployeeProvider({ children }: EmployeeProviderProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DatabaseService.getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newEmployee = await DatabaseService.createEmployee(employeeData);
      setEmployees(prev => [...prev, newEmployee]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add employee');
      throw err;
    }
  };

  const updateEmployee = async (employee: Employee) => {
    try {
      setError(null);
      const updatedEmployee = await DatabaseService.updateEmployee(employee);
      setEmployees(prev => 
        prev.map(emp => emp.id === employee.id ? updatedEmployee : emp)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update employee');
      throw err;
    }
  };

  const archiveEmployee = async (id: string) => {
    try {
      setError(null);
      const employee = employees.find(emp => emp.id === id);
      if (employee) {
        const archivedEmployee = { ...employee, archived: true };
        await updateEmployee(archivedEmployee);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive employee');
      throw err;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      setError(null);
      await DatabaseService.deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee');
      throw err;
    }
  };

  const getEmployee = (id: string): Employee | undefined => {
    return employees.find(emp => emp.id === id);
  };

  const addKPI = async (employeeId: string, kpiData: Omit<KPI, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const newKPI = await DatabaseService.createKPI(employeeId, kpiData);
      setEmployees(prev => 
        prev.map(emp => 
          emp.id === employeeId 
            ? { ...emp, kpis: [...emp.kpis, newKPI] }
            : emp
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add KPI');
      throw err;
    }
  };

  const updateKPI = async (employeeId: string, kpi: KPI) => {
    try {
      setError(null);
      const updatedKPI = await DatabaseService.updateKPI(kpi);
      setEmployees(prev => 
        prev.map(emp => 
          emp.id === employeeId 
            ? { 
                ...emp, 
                kpis: emp.kpis.map(k => k.id === kpi.id ? updatedKPI : k) 
              }
            : emp
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update KPI');
      throw err;
    }
  };

  const deleteKPI = async (employeeId: string, kpiId: string) => {
    try {
      setError(null);
      await DatabaseService.deleteKPI(kpiId);
      setEmployees(prev => 
        prev.map(emp => 
          emp.id === employeeId 
            ? { ...emp, kpis: emp.kpis.filter(k => k.id !== kpiId) }
            : emp
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete KPI');
      throw err;
    }
  };

  const addScore = async (employeeId: string, scoreData: Omit<Score, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const newScore = await DatabaseService.createScore(employeeId, scoreData);
      setEmployees(prev => 
        prev.map(emp => 
          emp.id === employeeId 
            ? { ...emp, scores: [...emp.scores, newScore] }
            : emp
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add score');
      throw err;
    }
  };

  const updateScore = async (employeeId: string, score: Score) => {
    try {
      setError(null);
      const updatedScore = await DatabaseService.updateScore(score);
      setEmployees(prev => 
        prev.map(emp => 
          emp.id === employeeId 
            ? { 
                ...emp, 
                scores: emp.scores.map(s => s.id === score.id ? updatedScore : s) 
              }
            : emp
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update score');
      throw err;
    }
  };

  const deleteScore = async (employeeId: string, scoreId: string) => {
    try {
      setError(null);
      await DatabaseService.deleteScore(scoreId);
      setEmployees(prev => 
        prev.map(emp => 
          emp.id === employeeId 
            ? { ...emp, scores: emp.scores.filter(s => s.id !== scoreId) }
            : emp
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete score');
      throw err;
    }
  };

  const contextValue: EmployeeContextType = {
    employees,
    loading,
    error,
    refreshData,
    addEmployee,
    updateEmployee,
    archiveEmployee,
    deleteEmployee,
    getEmployee,
    addKPI,
    updateKPI,
    deleteKPI,
    addScore,
    updateScore,
    deleteScore,
  };

  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
}