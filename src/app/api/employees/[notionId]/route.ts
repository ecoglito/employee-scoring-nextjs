import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { notionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super admin can delete employees
    if (session.user?.email !== 'enzo@liquidlabs.inc') {
      return NextResponse.json({ error: 'Forbidden - Only super admin can delete employees' }, { status: 403 });
    }

    const { notionId } = params;

    if (!notionId) {
      return NextResponse.json({ error: 'Employee notionId required' }, { status: 400 });
    }

    // Delete the employee
    const deletedEmployee = await prisma.notionEmployee.delete({
      where: { notionId }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Employee deleted successfully',
      employee: deletedEmployee 
    });
  } catch (error) {
    console.error('Failed to delete employee:', error);
    
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}