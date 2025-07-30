export interface NotionEmployee {
  id: number;
  notionId: string;
  name: string | null;
  position: string | null;
  email: string | null;
  phone: string | null;
  level: number | null;
  step: number | null;
  team: string[] | null;
  skills: string[] | null;
  tags: string[] | null;
  group: string[] | null;
  baseSalary: number | null;
  billableRate: number | null;
  startDate: Date | null;
  timezone: string | null;
  reportsTo: string[] | null;
  manages: string[] | null;
  profile: any[] | null;
  notionAccount: any[] | null;
  tenure: string | null;
  locationFactor: string | null;
  stepFactor: string | null;
  levelFactor: string | null;
  totalSalary: string | null;
  syncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class NotionEmployeeService {
  static async getAllEmployees(): Promise<NotionEmployee[]> {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch Notion employees:', error);
      throw new Error('Failed to fetch employees');
    }
  }

  static async getEmployeesByTeam(teamName: string): Promise<NotionEmployee[]> {
    try {
      const allEmployees = await this.getAllEmployees();
      return allEmployees.filter(emp => emp.team?.includes(teamName));
    } catch (error) {
      console.error('Failed to fetch team employees:', error);
      throw new Error('Failed to fetch team employees');
    }
  }

  static async getEmployeesByTag(tag: string): Promise<NotionEmployee[]> {
    try {
      const allEmployees = await this.getAllEmployees();
      return allEmployees.filter(emp => emp.tags?.includes(tag));
    } catch (error) {
      console.error('Failed to fetch tagged employees:', error);
      throw new Error('Failed to fetch tagged employees');
    }
  }

  static async getTeamStats(): Promise<{ 
    teams: Array<{ name: string; count: number; members: string[] }>;
    tags: Array<{ name: string; count: number }>;
    timezones: Array<{ name: string; count: number }>;
    totalEmployees: number;
  }> {
    try {
      const response = await fetch('/api/employees/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch team stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get team stats:', error);
      throw new Error('Failed to get team stats');
    }
  }

  static async refreshFromNotion(): Promise<{
    success: boolean;
    message: string;
    synced?: number;
    errors?: string[];
  }> {
    try {
      const response = await fetch('/api/notion/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Sync failed');
      }

      return {
        success: result.success,
        message: result.message,
        synced: result.synced,
      };
    } catch (error: any) {
      console.error('Failed to sync from Notion:', error);
      return {
        success: false,
        message: 'Failed to sync from Notion',
        errors: [error.message]
      };
    }
  }
}

export default NotionEmployeeService;