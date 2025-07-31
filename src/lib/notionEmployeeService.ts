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
  managerId?: string | null;
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
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_TTL = 60 * 1000; // 1 minute

  static async getAllEmployees(): Promise<NotionEmployee[]> {
    const cacheKey = 'all-employees';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      // Failed to fetch Notion employees
      throw new Error('Failed to fetch employees');
    }
  }

  static async getEmployeesByTeam(teamName: string): Promise<NotionEmployee[]> {
    try {
      const allEmployees = await this.getAllEmployees();
      return allEmployees.filter(emp => emp.team?.includes(teamName));
    } catch (error) {
      // Failed to fetch team employees
      throw new Error('Failed to fetch team employees');
    }
  }

  static async getEmployeesByTag(tag: string): Promise<NotionEmployee[]> {
    try {
      const allEmployees = await this.getAllEmployees();
      return allEmployees.filter(emp => emp.tags?.includes(tag));
    } catch (error) {
      // Failed to fetch tagged employees
      throw new Error('Failed to fetch tagged employees');
    }
  }

  static async getTeamStats(): Promise<{ 
    teams: Array<{ name: string; count: number; members: string[] }>;
    tags: Array<{ name: string; count: number }>;
    timezones: Array<{ name: string; count: number }>;
    totalEmployees: number;
  }> {
    const cacheKey = 'team-stats';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL * 5) { // 5 minutes for stats
      return cached.data;
    }
    
    try {
      const response = await fetch('/api/employees/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch team stats');
      }
      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
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

      // Clear cache after sync
      this.cache.clear();
      
      return {
        success: result.success,
        message: result.message,
        synced: result.synced,
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to sync from Notion',
        errors: [error.message]
      };
    }
  }
}

export default NotionEmployeeService;