import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Fetch a scorecard for an employee
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const employeeNotionId = searchParams.get('employeeNotionId');

  if (!employeeNotionId) {
    return NextResponse.json({ error: 'Employee Notion ID required' }, { status: 400 });
  }

  try {
    const scorecard = await prisma.employeeScorecard.findUnique({
      where: { employeeNotionId },
      include: {
        outcomes: {
          orderBy: { orderIndex: 'asc' }
        },
        competencies: {
          orderBy: { competency: 'asc' }
        }
      }
    });

    return NextResponse.json({ scorecard });
  } catch (error) {
    console.error('Failed to fetch scorecard:', error);
    return NextResponse.json({ error: 'Failed to fetch scorecard' }, { status: 500 });
  }
}

// POST - Create or update a scorecard
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { employeeNotionId, role, mission, outcomes, competencies } = body;

    if (!employeeNotionId || !role) {
      return NextResponse.json({ 
        error: 'Employee Notion ID and role are required' 
      }, { status: 400 });
    }

    // Create or update scorecard in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Check if scorecard exists
      const existing = await tx.employeeScorecard.findUnique({
        where: { employeeNotionId }
      });

      let scorecard;
      if (existing) {
        // Update existing scorecard
        scorecard = await tx.employeeScorecard.update({
          where: { id: existing.id },
          data: {
            role,
            mission,
            updatedAt: new Date()
          }
        });

        // Delete existing outcomes and competencies
        await tx.scorecardOutcome.deleteMany({
          where: { scorecardId: scorecard.id }
        });
        await tx.scorecardCompetency.deleteMany({
          where: { scorecardId: scorecard.id }
        });
      } else {
        // Create new scorecard
        scorecard = await tx.employeeScorecard.create({
          data: {
            employeeNotionId,
            role,
            mission,
            createdBy: session.user.email
          }
        });
      }

      // Create outcomes
      if (outcomes && outcomes.length > 0) {
        await tx.scorecardOutcome.createMany({
          data: outcomes.map((outcome: any, index: number) => ({
            scorecardId: scorecard.id,
            orderIndex: index + 1,
            description: outcome.description,
            details: outcome.details || [],
            rating: outcome.rating,
            comments: outcome.comments
          }))
        });
      }

      // Create competencies
      if (competencies && competencies.length > 0) {
        await tx.scorecardCompetency.createMany({
          data: competencies.map((comp: any) => ({
            scorecardId: scorecard.id,
            competency: comp.competency,
            rating: comp.rating,
            comments: comp.comments
          }))
        });
      }

      // Return the complete scorecard
      return await tx.employeeScorecard.findUnique({
        where: { id: scorecard.id },
        include: {
          outcomes: {
            orderBy: { orderIndex: 'asc' }
          },
          competencies: {
            orderBy: { competency: 'asc' }
          }
        }
      });
    });

    return NextResponse.json({ 
      success: true, 
      scorecard: result 
    });
  } catch (error) {
    console.error('Failed to save scorecard:', error);
    return NextResponse.json({ 
      error: 'Failed to save scorecard' 
    }, { status: 500 });
  }
}

// DELETE - Delete a scorecard
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const employeeNotionId = searchParams.get('employeeNotionId');

  if (!employeeNotionId) {
    return NextResponse.json({ error: 'Employee Notion ID required' }, { status: 400 });
  }

  try {
    await prisma.employeeScorecard.delete({
      where: { employeeNotionId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete scorecard:', error);
    return NextResponse.json({ error: 'Failed to delete scorecard' }, { status: 500 });
  }
}