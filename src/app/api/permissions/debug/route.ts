import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Debug permissions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get Notion employee data
    const notionEmployee = await prisma.notionEmployee.findFirst({
      where: { email: session.user.email }
    });

    // Get user permissions
    const userPermission = await prisma.userPermission.findUnique({
      where: { email: session.user.email }
    });

    // Get manager assignments
    const assignments = await prisma.managerAssignment.findMany({
      where: {
        OR: [
          { assignedBy: session.user.email },
          { managerId: notionEmployee?.notionId || 'none' }
        ]
      }
    });

    return NextResponse.json({
      session: {
        email: session.user.email,
        name: session.user.name
      },
      notionEmployee: notionEmployee ? {
        notionId: notionEmployee.notionId,
        name: notionEmployee.name,
        email: notionEmployee.email,
        team: notionEmployee.team,
        tags: notionEmployee.tags,
        position: notionEmployee.position
      } : null,
      userPermission,
      assignments: assignments.length,
      debug: {
        hasNotionRecord: !!notionEmployee,
        hasPermissionRecord: !!userPermission,
        teams: notionEmployee?.team || [],
        isExec: notionEmployee?.team && typeof notionEmployee.team === 'object' && 
                (notionEmployee.team as any[]).includes('Exec')
      }
    });
  } catch (error) {
    console.error('Debug permissions error:', error);
    return NextResponse.json({ error: 'Failed to debug permissions' }, { status: 500 });
  }
}