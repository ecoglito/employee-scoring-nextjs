import DatabaseService from './database';
import { loadData } from './storage';
import { AppData, Employee } from '@/types';

export class MigrationService {
  /**
   * Migrate data from localStorage to database
   */
  static async migrateFromLocalStorage(): Promise<{
    success: boolean;
    migratedEmployees: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let migratedEmployees = 0;

    try {
      // Load data from localStorage
      const localData = loadData();
      
      if (!localData || Object.keys(localData.employees).length === 0) {
        return {
          success: true,
          migratedEmployees: 0,
          errors: ['No data found in localStorage'],
        };
      }

      // Get existing employees from database to avoid duplicates
      const existingEmployees = await DatabaseService.getEmployees();
      const existingIds = new Set(existingEmployees.map(emp => emp.id));

      // Migrate each employee
      for (const [id, employee] of Object.entries(localData.employees)) {
        try {
          // Skip if employee already exists
          if (existingIds.has(id)) {
            console.log(`Skipping existing employee: ${employee.name}`);
            continue;
          }

          // Create employee without KPIs and scores first
          const employeeData = {
            name: employee.name,
            role: employee.role,
            responsibility: employee.responsibility,
            responsibilities: employee.responsibilities,
            managerId: employee.managerId,
            department: employee.department,
            archived: employee.archived || false,
            kpis: [],
            scores: [],
          };

          const createdEmployee = await DatabaseService.createEmployee(employeeData);

          // Add KPIs
          for (const kpi of employee.kpis) {
            try {
              await DatabaseService.createKPI(createdEmployee.id, {
                name: kpi.name,
                description: kpi.description,
                type: kpi.type,
                target: kpi.target,
                frequency: kpi.frequency,
              });
            } catch (kpiError) {
              errors.push(`Failed to migrate KPI "${kpi.name}" for employee "${employee.name}": ${kpiError}`);
            }
          }

          // Add scores
          for (const score of employee.scores) {
            try {
              await DatabaseService.createScore(createdEmployee.id, {
                date: score.date,
                overall: score.overall,
                kpiScores: score.kpiScores,
                notes: score.notes,
              });
            } catch (scoreError) {
              errors.push(`Failed to migrate score for employee "${employee.name}": ${scoreError}`);
            }
          }

          migratedEmployees++;
          console.log(`Successfully migrated employee: ${employee.name}`);

        } catch (employeeError) {
          errors.push(`Failed to migrate employee "${employee.name}": ${employeeError}`);
        }
      }

      return {
        success: errors.length === 0,
        migratedEmployees,
        errors,
      };

    } catch (error) {
      return {
        success: false,
        migratedEmployees,
        errors: [`Migration failed: ${error}`],
      };
    }
  }

  /**
   * Export database data to localStorage format for backup
   */
  static async exportToLocalStorageFormat(): Promise<AppData> {
    try {
      const employees = await DatabaseService.getEmployees();
      
      const employeesRecord: Record<string, Employee> = {};
      employees.forEach(employee => {
        employeesRecord[employee.id] = employee;
      });

      return {
        employees: employeesRecord,
        version: '1.0.0',
      };
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('Failed to export data from database');
    }
  }

  /**
   * Clear all data from database
   */
  static async clearDatabase(): Promise<void> {
    try {
      const employees = await DatabaseService.getEmployees();
      
      for (const employee of employees) {
        await DatabaseService.deleteEmployee(employee.id);
      }
    } catch (error) {
      console.error('Failed to clear database:', error);
      throw new Error('Failed to clear database');
    }
  }

  /**
   * Import data from JSON format to database
   */
  static async importFromJSON(jsonData: AppData): Promise<{
    success: boolean;
    importedEmployees: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let importedEmployees = 0;

    try {
      // Get existing employees from database to avoid duplicates
      const existingEmployees = await DatabaseService.getEmployees();
      const existingIds = new Set(existingEmployees.map(emp => emp.id));

      // Import each employee
      for (const [id, employee] of Object.entries(jsonData.employees)) {
        try {
          // Skip if employee already exists
          if (existingIds.has(id)) {
            console.log(`Skipping existing employee: ${employee.name}`);
            continue;
          }

          // Create employee without KPIs and scores first
          const employeeData = {
            name: employee.name,
            role: employee.role,
            responsibility: employee.responsibility,
            responsibilities: employee.responsibilities,
            managerId: employee.managerId,
            department: employee.department,
            archived: employee.archived || false,
            kpis: [],
            scores: [],
          };

          const createdEmployee = await DatabaseService.createEmployee(employeeData);

          // Add KPIs
          for (const kpi of employee.kpis) {
            try {
              await DatabaseService.createKPI(createdEmployee.id, {
                name: kpi.name,
                description: kpi.description,
                type: kpi.type,
                target: kpi.target,
                frequency: kpi.frequency,
              });
            } catch (kpiError) {
              errors.push(`Failed to import KPI "${kpi.name}" for employee "${employee.name}": ${kpiError}`);
            }
          }

          // Add scores
          for (const score of employee.scores) {
            try {
              await DatabaseService.createScore(createdEmployee.id, {
                date: score.date,
                overall: score.overall,
                kpiScores: score.kpiScores,
                notes: score.notes,
              });
            } catch (scoreError) {
              errors.push(`Failed to import score for employee "${employee.name}": ${scoreError}`);
            }
          }

          importedEmployees++;
          console.log(`Successfully imported employee: ${employee.name}`);

        } catch (employeeError) {
          errors.push(`Failed to import employee "${employee.name}": ${employeeError}`);
        }
      }

      return {
        success: errors.length === 0,
        importedEmployees,
        errors,
      };

    } catch (error) {
      return {
        success: false,
        importedEmployees,
        errors: [`Import failed: ${error}`],
      };
    }
  }
}

export default MigrationService;