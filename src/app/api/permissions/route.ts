import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Get user permissions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userPermission = await prisma.userPermission.findUnique({
      where: { email: session.user.email }
    });

    if (!userPermission) {
      // Get Notion employee to determine role
      const notionEmployee = await prisma.notionEmployee.findFirst({
        where: { email: session.user.email }
      });

      // Determine role from tags/team
      let role = 'employee';
      if (notionEmployee?.team && typeof notionEmployee.team === 'object') {
        const teams = notionEmployee.team as any[];
        if (teams.includes('Exec')) {
          role = 'exec';
        }
      }
      
      // Also check tags for manager indicators
      if (notionEmployee?.tags && typeof notionEmployee.tags === 'object') {
        const tags = notionEmployee.tags as any[];
        const managerTags = ['manager', 'lead', 'head', 'director', 'vp'];
        if (tags.some((tag: string) => managerTags.some(mTag => tag.toLowerCase().includes(mTag)))) {
          role = 'manager';
        }
      }

      // Create default permission
      const newPermission = await prisma.userPermission.create({
        data: {
          email: session.user.email,
          name: session.user.name || session.user.email,
          role,
          canViewAll: role === 'exec',
          canManageAll: role === 'exec',
          canAssignManagers: role === 'exec'
        }
      });

      return NextResponse.json(newPermission);
    }

    return NextResponse.json(userPermission);
  } catch (error) {
    console.error('Failed to get permissions:', error);
    return NextResponse.json({ error: 'Failed to get permissions' }, { status: 500 });
  }
}

// POST - Update user permissions
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to update permissions
    const currentUserPermission = await prisma.userPermission.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUserPermission?.canAssignManagers) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { email, role, canViewAll, canManageAll } = body;

    const updatedPermission = await prisma.userPermission.upsert({
      where: { email },
      update: {
        role,
        canViewAll,
        canManageAll
      },
      create: {
        email,
        name: body.name || email,
        role,
        canViewAll,
        canManageAll,
        canAssignManagers: role === 'exec'
      }
    });

    return NextResponse.json(updatedPermission);
  } catch (error) {
    console.error('Failed to update permissions:', error);
    return NextResponse.json({ error: 'Failed to update permissions' }, { status: 500 });
  }
}