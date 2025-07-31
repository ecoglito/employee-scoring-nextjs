import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Parallel fetch employees and manager assignments
    const [employees, managerAssignments] = await Promise.all([
      prisma.notionEmployee.findMany({
        orderBy: [
          { team: 'asc' },
          { name: 'asc' }
        ],
      }),
      prisma.managerAssignment.findMany()
    ]);

    const formattedEmployees = employees.map(emp => {
      // Find manager assignment for this employee
      const managerAssignment = managerAssignments.find(ma => ma.employeeId === emp.notionId);
      
      return {
        id: emp.id,
        notionId: emp.notionId,
        name: emp.name,
        position: emp.position,
        email: emp.email,
        phone: emp.phone,
        level: emp.level,
        step: emp.step,
        team: Array.isArray(emp.team) ? emp.team : [],
        skills: Array.isArray(emp.skills) ? emp.skills : [],
        tags: Array.isArray(emp.tags) ? emp.tags : [],
        group: Array.isArray(emp.group) ? emp.group : [],
        baseSalary: emp.baseSalary,
        billableRate: emp.billableRate,
        startDate: emp.startDate,
        timezone: emp.timezone,
        reportsTo: Array.isArray(emp.reportsTo) ? emp.reportsTo : [],
        manages: Array.isArray(emp.manages) ? emp.manages : [],
        managerId: managerAssignment?.managerId || null, // Get from ManagerAssignment table
        profile: Array.isArray(emp.profile) ? emp.profile : [],
        notionAccount: Array.isArray(emp.notionAccount) ? emp.notionAccount : [],
        tenure: emp.tenure,
        locationFactor: emp.locationFactor,
        stepFactor: emp.stepFactor,
        levelFactor: emp.levelFactor,
        totalSalary: emp.totalSalary,
        syncedAt: emp.syncedAt,
        createdAt: emp.createdAt,
        updatedAt: emp.updatedAt,
      };
    });

    return NextResponse.json(formattedEmployees, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    // Failed to fetch employees
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}