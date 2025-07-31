import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.notionEmployee.findMany({
      select: {
        name: true,
        team: true,
        tags: true,
        timezone: true
      }
    });

    // Team stats
    const teamMap = new Map<string, string[]>();
    const tagMap = new Map<string, number>();
    const timezoneMap = new Map<string, number>();

    employees.forEach(emp => {
      // Teams
      const teams = Array.isArray(emp.team) ? emp.team : [];
      teams.forEach(team => {
        if (!teamMap.has(team)) {
          teamMap.set(team, []);
        }
        teamMap.get(team)!.push(emp.name || 'Unknown');
      });

      // Tags
      const tags = Array.isArray(emp.tags) ? emp.tags : [];
      tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });

      // Timezones
      if (emp.timezone) {
        timezoneMap.set(emp.timezone, (timezoneMap.get(emp.timezone) || 0) + 1);
      }
    });

    const stats = {
      teams: Array.from(teamMap.entries()).map(([name, members]) => ({
        name,
        count: members.length,
        members
      })),
      tags: Array.from(tagMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      timezones: Array.from(timezoneMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      totalEmployees: employees.length
    };

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Failed to get team stats:', error);
    return NextResponse.json(
      { error: 'Failed to get team stats' },
      { status: 500 }
    );
  }
}