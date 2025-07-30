import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee } from '@/types';
import { 
  saveEmployee, 
  archiveEmployee, 
  deleteEmployee, 
  getActiveEmployees, 
  getAllEmployees,
  generateId
} from '@/lib/storage';

interface EmployeeContextType {
  employees: Employee[];
  allEmployees: Employee[];
  loading: boolean;
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEmployee: (employee: Employee) => void;
  archiveEmployee: (id: string) => void;
  deleteEmployee: (id: string) => void;
  getEmployee: (id: string) => Employee | undefined;
  refreshData: () => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

interface EmployeeProviderProps {
  children: ReactNode;
}

export function EmployeeProvider({ children }: EmployeeProviderProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = () => {
    setLoading(true);
    try {
      const activeEmployees = getActiveEmployees();
      const allEmps = getAllEmployees();
      setEmployees(activeEmployees);
      setAllEmployees(allEmps);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addEmployee = (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newEmployee: Employee = {
      ...employeeData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    saveEmployee(newEmployee);
    refreshData();
  };

  const updateEmployee = (employee: Employee) => {
    saveEmployee(employee);
    refreshData();
  };

  const handleArchiveEmployee = (id: string) => {
    archiveEmployee(id);
    refreshData();
  };

  const handleDeleteEmployee = (id: string) => {
    deleteEmployee(id);
    refreshData();
  };

  const getEmployee = (id: string): Employee | undefined => {
    return allEmployees.find(emp => emp.id === id);
  };

  return (
    <EmployeeContext.Provider value={{
      employees,
      allEmployees,
      loading,
      addEmployee,
      updateEmployee,
      archiveEmployee: handleArchiveEmployee,
      deleteEmployee: handleDeleteEmployee,
      getEmployee,
      refreshData,
    }}>
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