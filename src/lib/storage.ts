import { AppData, Employee } from '@/types';

const STORAGE_KEY = 'employee-scoring-system';
const STORAGE_VERSION = '1.0.0';

// Initialize empty data structure
const initialData: AppData = {
  employees: {},
  version: STORAGE_VERSION,
};

// Get all data from localStorage
export const loadData = (): AppData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return initialData;
    }
    
    const parsed = JSON.parse(data) as AppData;
    
    // Version migration logic can be added here
    if (parsed.version !== STORAGE_VERSION) {
      console.warn('Data version mismatch, using latest schema');
      return { ...parsed, version: STORAGE_VERSION };
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return initialData;
  }
};

// Save all data to localStorage
export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
    throw new Error('Failed to save data. Storage might be full.');
  }
};

// Export data as JSON file
export const exportData = (): void => {
  try {
    const data = loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employee-scoring-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export data:', error);
    throw new Error('Failed to export data');
  }
};

// Import data from JSON file
export const importData = (file: File): Promise<AppData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content) as AppData;
        
        // Validate data structure
        if (!data.employees || typeof data.employees !== 'object') {
          throw new Error('Invalid data format: missing employees object');
        }
        
        // Basic validation for each employee
        Object.values(data.employees).forEach((employee, index) => {
          if (!employee.id || !employee.name) {
            throw new Error(`Invalid employee data at index ${index}: missing id or name`);
          }
        });
        
        // Save imported data
        saveData(data);
        resolve(data);
      } catch (error) {
        reject(new Error(`Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

// Clear all data (with confirmation)
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear data:', error);
    throw new Error('Failed to clear data');
  }
};

// Get specific employee
export const getEmployee = (id: string): Employee | null => {
  const data = loadData();
  return data.employees[id] || null;
};

// Save specific employee
export const saveEmployee = (employee: Employee): void => {
  const data = loadData();
  data.employees[employee.id] = {
    ...employee,
    updatedAt: new Date().toISOString(),
  };
  saveData(data);
};

// Delete employee (soft delete - archive)
export const archiveEmployee = (id: string): void => {
  const data = loadData();
  if (data.employees[id]) {
    data.employees[id] = {
      ...data.employees[id],
      archived: true,
      updatedAt: new Date().toISOString(),
    };
    saveData(data);
  }
};

// Permanently delete employee
export const deleteEmployee = (id: string): void => {
  const data = loadData();
  delete data.employees[id];
  saveData(data);
};

// Get all active employees
export const getActiveEmployees = (): Employee[] => {
  const data = loadData();
  return Object.values(data.employees).filter(emp => !emp.archived);
};

// Get all employees (including archived)
export const getAllEmployees = (): Employee[] => {
  const data = loadData();
  return Object.values(data.employees);
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};