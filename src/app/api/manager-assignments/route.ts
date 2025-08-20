import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Get all manager assignments
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assignments = await prisma.managerAssignment.findMany({
      orderBy: { assignedAt: 'desc' }
    });

    return NextResponse.json(assignments, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Failed to get assignments:', error);
    return NextResponse.json({ error: 'Failed to get assignments' }, { status: 500 });
  }
}

// POST - Create new assignment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 });
    }

    // Check if user has permission to assign managers
    let userPermission = await prisma.userPermission.findUnique({
      where: { email: session.user.email }
    });

    // If no permission record exists, try to create one
    if (!userPermission) {
      const notionEmployee = await prisma.notionEmployee.findFirst({
        where: { email: session.user.email }
      });

      // Determine role
      let role = 'employee';
      if (notionEmployee?.team && typeof notionEmployee.team === 'object') {
        const teams = notionEmployee.team as any[];
        if (teams.includes('Exec')) {
          role = 'exec';
        }
      }

      // Create permission record
      userPermission = await prisma.userPermission.create({
        data: {
          email: session.user.email,
          name: session.user.name || session.user.email,
          role,
          canViewAll: role === 'exec',
          canManageAll: role === 'exec',
          canAssignManagers: role === 'exec'
        }
      });
    }

    if (!userPermission?.canAssignManagers) {
      return NextResponse.json({ 
        error: `Access denied: You don't have permission to assign managers. Your role: ${userPermission.role}` 
      }, { status: 403 });
    }

    const body = await request.json();
    const { managerId, employeeId } = body;

    if (!managerId || !employeeId) {
      return NextResponse.json({ 
        error: 'Missing required fields: managerId and employeeId are required' 
      }, { status: 400 });
    }

    // Log for debugging
    console.log('Assignment request:', {
      managerId,
      employeeId,
      assignedBy: session.user.email,
      userRole: userPermission.role
    });

    // Create the assignment
    const assignment = await prisma.managerAssignment.create({
      data: {
        managerId,
        employeeId,
        assignedBy: session.user.email
      }
    });

    return NextResponse.json(assignment);
  } catch (error: any) {
    console.error('Failed to create assignment - Full error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'This employee is already assigned to this manager' }, { status: 400 });
    }
    
    // Return more detailed error info
    return NextResponse.json({ 
      error: 'Failed to create assignment',
      details: error.message || 'Unknown error',
      code: error.code || 'UNKNOWN'
    }, { status: 500 });
  }
}

// DELETE - Remove assignment
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission
    const userPermission = await prisma.userPermission.findUnique({
      where: { email: session.user.email }
    });

    if (!userPermission?.canAssignManagers) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const managerId = searchParams.get('managerId');
    const employeeId = searchParams.get('employeeId');

    if (!managerId || !employeeId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const result = await prisma.managerAssignment.deleteMany({
      where: {
        managerId,
        employeeId
      }
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: result.count });
  } catch (error) {
    console.error('Failed to delete assignment:', error);
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 });
  }
}