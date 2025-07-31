import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is an executive by checking their employee record
    const userEmployee = await prisma.notionEmployee.findFirst({
      where: { email: session.user.email }
    });
    
    if (!userEmployee) {
      return NextResponse.json(
        { error: 'User not found in employee database' },
        { status: 403 }
      );
    }
    
    // Check if user is the super admin
    if (session.user.email !== 'enzo@liquidlabs.inc') {
      return NextResponse.json(
        { error: 'Only the super admin can update salaries' },
        { status: 403 }
      );
    }
    
    const { employeeNotionId, baseSalary } = await request.json();
    
    if (!employeeNotionId || baseSalary === undefined || baseSalary === null) {
      return NextResponse.json(
        { error: 'Employee ID and salary are required' },
        { status: 400 }
      );
    }
    
    // Validate salary is a positive number
    const salaryNumber = Number(baseSalary);
    if (isNaN(salaryNumber) || salaryNumber < 0) {
      return NextResponse.json(
        { error: 'Salary must be a positive number' },
        { status: 400 }
      );
    }
    
    // Update the employee's salary
    const updatedEmployee = await prisma.notionEmployee.update({
      where: { notionId: employeeNotionId },
      data: { 
        baseSalary: salaryNumber,
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      employee: {
        notionId: updatedEmployee.notionId,
        name: updatedEmployee.name,
        baseSalary: updatedEmployee.baseSalary
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update salary' },
      { status: 500 }
    );
  }
}