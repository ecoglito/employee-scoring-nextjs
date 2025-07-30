import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.notionEmployee.findMany({
      orderBy: [
        { team: 'asc' },
        { name: 'asc' }
      ],
    });

    const formattedEmployees = employees.map(emp => ({
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
    }));

    return NextResponse.json(formattedEmployees);
  } catch (error) {
    console.error('Failed to fetch employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}