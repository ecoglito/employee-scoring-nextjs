'use client';

import { NotionEmployee } from './notionEmployeeService';

export interface UserPermissions {
  userId: string;
  email: string;
  name: string;
  role: 'exec' | 'manager' | 'employee';
  canViewAll: boolean;
  canManageAll: boolean;
  managedEmployeeIds: string[]; // Notion IDs of employees they can manage
  canAssignManagers: boolean;
}

export interface ManagerAssignment {
  managerId: string; // Notion ID of the manager
  employeeId: string; // Notion ID of the employee
  assignedBy: string; // Email of who assigned this
  assignedAt: string;
}

class PermissionService {
  private static instance: PermissionService;
  private permissions: Map<string, UserPermissions> = new Map();
  private managerAssignments: ManagerAssignment[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('user-permissions');
      if (stored) {
        const data = JSON.parse(stored);
        this.permissions = new Map(data.permissions || []);
        this.managerAssignments = data.managerAssignments || [];
      }
    } catch (error) {
      console.error('Failed to load permissions from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      const data = {
        permissions: Array.from(this.permissions.entries()),
        managerAssignments: this.managerAssignments
      };
      localStorage.setItem('user-permissions', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save permissions to storage:', error);
    }
  }

  // Public save method for external use
  savePermissions() {
    this.saveToStorage();
  }

  // Get user permissions by email
  getUserPermissions(email: string): UserPermissions | null {
    return this.permissions.get(email) || null;
  }

  // Initialize or update user permissions based on their Notion profile
  initializeUser(email: string, notionEmployee: NotionEmployee | null): UserPermissions {
    let permissions = this.permissions.get(email);
    
    if (!permissions) {
      // Determine role from Notion employee data
      const role = this.determineRole(notionEmployee);
      
      permissions = {
        userId: notionEmployee?.notionId || email,
        email,
        name: notionEmployee?.name || email.split('@')[0],
        role,
        canViewAll: role === 'exec',
        canManageAll: role === 'exec',
        managedEmployeeIds: [],
        canAssignManagers: role === 'exec'
      };
      
      this.permissions.set(email, permissions);
      this.saveToStorage();
    } else {
      // Update the Notion ID if we have it and it's different
      if (notionEmployee?.notionId && permissions.userId !== notionEmployee.notionId) {
        permissions.userId = notionEmployee.notionId;
        this.saveToStorage();
      }
    }
    
    return permissions;
  }

  private determineRole(notionEmployee: NotionEmployee | null): 'exec' | 'manager' | 'employee' {
    if (!notionEmployee) return 'employee';
    
    // Check if user has "Exec" team
    if (notionEmployee.team?.includes('Exec')) {
      return 'exec';
    }
    
    // Check if user has "exec" tag (case-insensitive)
    const hasExecTag = notionEmployee.tags?.some(tag => 
      tag.toLowerCase() === 'exec' || tag.toLowerCase() === 'executive'
    );
    
    if (hasExecTag) {
      return 'exec';
    }
    
    // Check if user has "manager" tag or similar
    const managerTags = ['manager', 'lead', 'head', 'director', 'vp'];
    const hasManagerTag = notionEmployee.tags?.some(tag => 
      managerTags.some(managerTag => 
        tag.toLowerCase().includes(managerTag)
      )
    );
    
    if (hasManagerTag) {
      return 'manager';
    }
    
    return 'employee';
  }

  // Assign an employee to a manager
  assignEmployeeToManager(managerEmail: string, employeeNotionId: string, assignedBy: string): boolean {
    const managerPermissions = this.permissions.get(managerEmail);
    if (!managerPermissions || (managerPermissions.role !== 'manager' && managerPermissions.role !== 'exec')) {
      return false;
    }

    // Add to manager's managed employees
    if (!managerPermissions.managedEmployeeIds.includes(employeeNotionId)) {
      managerPermissions.managedEmployeeIds.push(employeeNotionId);
    }

    // Add to assignments tracking
    const existingAssignment = this.managerAssignments.find(
      a => a.managerId === managerPermissions.userId && a.employeeId === employeeNotionId
    );

    if (!existingAssignment) {
      this.managerAssignments.push({
        managerId: managerPermissions.userId,
        employeeId: employeeNotionId,
        assignedBy,
        assignedAt: new Date().toISOString()
      });
    }

    console.log('Assigned employee to manager:', {
      managerEmail,
      managerId: managerPermissions.userId,
      employeeNotionId,
      currentManagedIds: managerPermissions.managedEmployeeIds,
      totalAssignments: this.managerAssignments.length
    });

    this.saveToStorage();
    return true;
  }

  // Remove employee from manager
  removeEmployeeFromManager(managerEmail: string, employeeNotionId: string): boolean {
    const managerPermissions = this.permissions.get(managerEmail);
    if (!managerPermissions) return false;

    // Remove from manager's managed employees
    managerPermissions.managedEmployeeIds = managerPermissions.managedEmployeeIds.filter(
      id => id !== employeeNotionId
    );

    // Remove from assignments
    this.managerAssignments = this.managerAssignments.filter(
      a => !(a.managerId === managerPermissions.userId && a.employeeId === employeeNotionId)
    );

    this.saveToStorage();
    return true;
  }

  // Get employees a user can view
  getViewableEmployees(userEmail: string, allEmployees: NotionEmployee[]): NotionEmployee[] {
    // Everyone can see all employees (company directory view)
    // The restriction is on what information they can see about each employee
    // This is handled in the NotionEmployeeDetail component with canViewKPIs
    return allEmployees;
  }

  // Get employees a user can manage (add KPIs, scores, etc.)
  getManageableEmployees(userEmail: string, allEmployees: NotionEmployee[]): NotionEmployee[] {
    const permissions = this.getUserPermissions(userEmail);
    if (!permissions) return [];

    // Execs can manage everyone
    if (permissions.canManageAll) {
      return allEmployees;
    }

    // Managers can manage their assigned employees
    if (permissions.role === 'manager') {
      return allEmployees.filter(emp => 
        permissions.managedEmployeeIds.includes(emp.notionId)
      );
    }

    // Regular employees can't manage anyone
    return [];
  }

  // Check if user can assign managers
  canAssignManagers(userEmail: string): boolean {
    const permissions = this.getUserPermissions(userEmail);
    return permissions?.canAssignManagers || false;
  }

  // Get all manager assignments
  getManagerAssignments(): ManagerAssignment[] {
    return [...this.managerAssignments];
  }

  // Clear all assignments (useful for reloading from API)
  clearAssignments(): void {
    this.managerAssignments = [];
    // Don't save yet - we'll rebuild and then save
  }

  // Get managers and their assigned employees
  getManagerHierarchy(allEmployees: NotionEmployee[]): Array<{
    manager: NotionEmployee;
    managedEmployees: NotionEmployee[];
  }> {
    const hierarchy: Array<{
      manager: NotionEmployee;
      managedEmployees: NotionEmployee[];
    }> = [];

    // Get all users with manager permissions
    for (const [email, permissions] of this.permissions.entries()) {
      if (permissions.role === 'manager' && permissions.managedEmployeeIds.length > 0) {
        const manager = allEmployees.find(emp => emp.email === email);
        if (manager) {
          const managedEmployees = allEmployees.filter(emp => 
            permissions.managedEmployeeIds.includes(emp.notionId)
          );
          hierarchy.push({ manager, managedEmployees });
        }
      }
    }

    return hierarchy;
  }

  // Promote user to manager (only if they're currently an employee)
  promoteToManager(userEmail: string): boolean {
    const permissions = this.permissions.get(userEmail);
    if (!permissions) return false;

    // Don't downgrade executives to managers
    if (permissions.role === 'exec') {
      // Exec already has all manager permissions, just save in case anything changed
      this.saveToStorage();
      return true;
    }
    
    // Only promote if they're currently an employee
    if (permissions.role === 'employee') {
      permissions.role = 'manager';
      this.saveToStorage();
      return true;
    }
    
    return true;
  }

  // Demote manager to employee
  demoteToEmployee(userEmail: string): boolean {
    const permissions = this.permissions.get(userEmail);
    if (!permissions) return false;

    permissions.role = 'employee';
    permissions.managedEmployeeIds = [];
    permissions.canViewAll = false;
    permissions.canManageAll = false;

    // Remove all assignments for this manager
    this.managerAssignments = this.managerAssignments.filter(
      a => a.managerId !== permissions.userId
    );

    this.saveToStorage();
    return true;
  }
}

export default PermissionService.getInstance();