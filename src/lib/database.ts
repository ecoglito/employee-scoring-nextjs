import { PrismaClient } from '@prisma/client';
import { Employee, KPI, Score, KPIType, KPIFrequency } from '@/types';

const prisma = new PrismaClient();

export class DatabaseService {
  static async getEmployees(): Promise<Employee[]> {
    try {
      const employees = await prisma.employee.findMany({
        include: {
          kpis: true,
          scores: {
            include: {
              kpiScores: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      return employees.map((emp: any) => this.mapPrismaEmployeeToEmployee(emp));
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      throw new Error('Failed to fetch employees');
    }
  }

  static async getEmployee(id: string): Promise<Employee | null> {
    try {
      const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
          kpis: true,
          scores: {
            include: {
              kpiScores: true,
            },
          },
        },
      });

      return employee ? this.mapPrismaEmployeeToEmployee(employee) : null;
    } catch (error) {
      console.error('Failed to fetch employee:', error);
      throw new Error('Failed to fetch employee');
    }
  }

  static async createEmployee(employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> {
    try {
      const created = await prisma.employee.create({
        data: {
          name: employee.name,
          role: employee.role,
          responsibility: employee.responsibility,
          responsibilities: employee.responsibilities,
          managerId: employee.managerId,
          department: employee.department,
          archived: employee.archived || false,
        },
        include: {
          kpis: true,
          scores: {
            include: {
              kpiScores: true,
            },
          },
        },
      });

      return this.mapPrismaEmployeeToEmployee(created);
    } catch (error) {
      console.error('Failed to create employee:', error);
      throw new Error('Failed to create employee');
    }
  }

  static async updateEmployee(employee: Employee): Promise<Employee> {
    try {
      const updated = await prisma.employee.update({
        where: { id: employee.id },
        data: {
          name: employee.name,
          role: employee.role,
          responsibility: employee.responsibility,
          responsibilities: employee.responsibilities,
          managerId: employee.managerId,
          department: employee.department,
          archived: employee.archived,
        },
        include: {
          kpis: true,
          scores: {
            include: {
              kpiScores: true,
            },
          },
        },
      });

      return this.mapPrismaEmployeeToEmployee(updated);
    } catch (error) {
      console.error('Failed to update employee:', error);
      throw new Error('Failed to update employee');
    }
  }

  static async deleteEmployee(id: string): Promise<void> {
    try {
      await prisma.employee.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Failed to delete employee:', error);
      throw new Error('Failed to delete employee');
    }
  }

  static async createKPI(employeeId: string, kpi: Omit<KPI, 'id' | 'createdAt'>): Promise<KPI> {
    try {
      const created = await prisma.kPI.create({
        data: {
          name: kpi.name,
          description: kpi.description,
          type: kpi.type,
          target: kpi.target,
          frequency: kpi.frequency,
          employeeId,
        },
      });

      return this.mapPrismaKPIToKPI(created);
    } catch (error) {
      console.error('Failed to create KPI:', error);
      throw new Error('Failed to create KPI');
    }
  }

  static async updateKPI(kpi: KPI): Promise<KPI> {
    try {
      const updated = await prisma.kPI.update({
        where: { id: kpi.id },
        data: {
          name: kpi.name,
          description: kpi.description,
          type: kpi.type,
          target: kpi.target,
          frequency: kpi.frequency,
        },
      });

      return this.mapPrismaKPIToKPI(updated);
    } catch (error) {
      console.error('Failed to update KPI:', error);
      throw new Error('Failed to update KPI');
    }
  }

  static async deleteKPI(id: string): Promise<void> {
    try {
      await prisma.kPI.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Failed to delete KPI:', error);
      throw new Error('Failed to delete KPI');
    }
  }

  static async createScore(employeeId: string, score: Omit<Score, 'id' | 'createdAt'>): Promise<Score> {
    try {
      const created = await prisma.score.create({
        data: {
          date: new Date(score.date),
          overall: score.overall,
          notes: score.notes,
          employeeId,
        },
      });

      // Create KPI scores
      if (score.kpiScores && Object.keys(score.kpiScores).length > 0) {
        const kpiScorePromises = Object.entries(score.kpiScores).map(([kpiId, value]) =>
          prisma.kpiScore.create({
            data: {
              kpiId,
              scoreId: created.id,
              value: typeof value === 'number' ? value : null,
              booleanValue: typeof value === 'boolean' ? value : null,
            },
          })
        );

        await Promise.all(kpiScorePromises);
      }

      // Fetch the complete score with KPI scores
      const completeScore = await prisma.score.findUnique({
        where: { id: created.id },
        include: {
          kpiScores: true,
        },
      });

      return this.mapPrismaScoreToScore(completeScore!);
    } catch (error) {
      console.error('Failed to create score:', error);
      throw new Error('Failed to create score');
    }
  }

  static async updateScore(score: Score): Promise<Score> {
    try {
      const updated = await prisma.score.update({
        where: { id: score.id },
        data: {
          date: new Date(score.date),
          overall: score.overall,
          notes: score.notes,
        },
      });

      // Delete existing KPI scores and recreate them
      await prisma.kpiScore.deleteMany({
        where: { scoreId: score.id },
      });

      if (score.kpiScores && Object.keys(score.kpiScores).length > 0) {
        const kpiScorePromises = Object.entries(score.kpiScores).map(([kpiId, value]) =>
          prisma.kpiScore.create({
            data: {
              kpiId,
              scoreId: score.id,
              value: typeof value === 'number' ? value : null,
              booleanValue: typeof value === 'boolean' ? value : null,
            },
          })
        );

        await Promise.all(kpiScorePromises);
      }

      // Fetch the complete score with KPI scores
      const completeScore = await prisma.score.findUnique({
        where: { id: score.id },
        include: {
          kpiScores: true,
        },
      });

      return this.mapPrismaScoreToScore(completeScore!);
    } catch (error) {
      console.error('Failed to update score:', error);
      throw new Error('Failed to update score');
    }
  }

  static async deleteScore(id: string): Promise<void> {
    try {
      await prisma.score.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Failed to delete score:', error);
      throw new Error('Failed to delete score');
    }
  }

  // Helper methods to map Prisma objects to our types
  private static mapPrismaEmployeeToEmployee(prismaEmployee: any): Employee {
    return {
      id: prismaEmployee.id,
      name: prismaEmployee.name,
      role: prismaEmployee.role,
      responsibility: prismaEmployee.responsibility,
      responsibilities: prismaEmployee.responsibilities,
      managerId: prismaEmployee.managerId,
      department: prismaEmployee.department,
      archived: prismaEmployee.archived,
      kpis: prismaEmployee.kpis?.map((kpi: any) => this.mapPrismaKPIToKPI(kpi)) || [],
      scores: prismaEmployee.scores?.map((score: any) => this.mapPrismaScoreToScore(score)) || [],
      createdAt: prismaEmployee.createdAt.toISOString(),
      updatedAt: prismaEmployee.updatedAt.toISOString(),
    };
  }

  private static mapPrismaKPIToKPI(prismaKPI: any): KPI {
    return {
      id: prismaKPI.id,
      name: prismaKPI.name,
      description: prismaKPI.description,
      type: prismaKPI.type as KPIType,
      target: prismaKPI.target,
      frequency: prismaKPI.frequency as KPIFrequency,
      createdAt: prismaKPI.createdAt.toISOString(),
    };
  }

  private static mapPrismaScoreToScore(prismaScore: any): Score {
    const kpiScores: Record<string, number | boolean> = {};
    
    if (prismaScore.kpiScores) {
      prismaScore.kpiScores.forEach((kpiScore: any) => {
        kpiScores[kpiScore.kpiId] = kpiScore.booleanValue !== null 
          ? kpiScore.booleanValue 
          : kpiScore.value;
      });
    }

    return {
      id: prismaScore.id,
      date: prismaScore.date.toISOString(),
      overall: prismaScore.overall,
      kpiScores,
      notes: prismaScore.notes,
      createdAt: prismaScore.createdAt.toISOString(),
    };
  }

  static async cleanup(): Promise<void> {
    await prisma.$disconnect();
  }
}

export default DatabaseService;