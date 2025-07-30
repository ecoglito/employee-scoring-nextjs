import { AppData, Employee, KPI, Score } from '@/types';
import { generateId } from './storage';

const createSampleKPI = (name: string, description: string, type: 'numeric' | 'percentage' | 'boolean' | 'scale', target?: number, frequency: 'weekly' | 'monthly' | 'quarterly' = 'monthly'): KPI => ({
  id: generateId(),
  name,
  description,
  type,
  target,
  frequency,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
});

const createSampleScore = (kpis: KPI[], baseScore: number, daysAgo: number): Score => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  const variation = (Math.random() - 0.5) * 2; // -1 to 1
  const overall = Math.max(1, Math.min(10, baseScore + variation));
  
  const kpiScores: Record<string, number | boolean> = {};
  kpis.forEach(kpi => {
    switch (kpi.type) {
      case 'numeric':
        kpiScores[kpi.id] = Math.max(0, Math.round((kpi.target || 5) + (Math.random() - 0.5) * 4));
        break;
      case 'percentage':
        kpiScores[kpi.id] = Math.max(0, Math.min(100, Math.round((kpi.target || 80) + (Math.random() - 0.5) * 30)));
        break;
      case 'boolean':
        kpiScores[kpi.id] = Math.random() > 0.3;
        break;
      case 'scale':
        kpiScores[kpi.id] = Math.max(1, Math.min(10, Math.round((kpi.target || 7) + (Math.random() - 0.5) * 4)));
        break;
    }
  });

  return {
    id: generateId(),
    date: date.toISOString().split('T')[0],
    overall,
    kpiScores,
    notes: Math.random() > 0.6 ? [
      'Great progress this period!',
      'Room for improvement in some areas.',
      'Exceeded expectations on key metrics.',
      'Solid performance across all areas.',
      'Strong collaboration and delivery.',
    ][Math.floor(Math.random() * 5)] : '',
    createdAt: date.toISOString(),
  };
};

export const generateSampleData = (): AppData => {
  const now = new Date().toISOString();
  
  // Create CEO
  const ceoKpis = [
    createSampleKPI('Revenue Growth', 'Quarterly revenue growth percentage', 'percentage', 15, 'quarterly'),
    createSampleKPI('Team Satisfaction', 'Employee satisfaction score', 'scale', 8),
    createSampleKPI('Strategic Goals', 'Number of strategic goals achieved', 'numeric', 3, 'quarterly'),
    createSampleKPI('Board Meeting Prep', 'Prepared for board meetings on time', 'boolean'),
  ];
  
  const ceo: Employee = {
    id: generateId(),
    name: 'Sarah Johnson',
    role: 'CEO',
    responsibility: 'Lead company strategy, oversee all operations, and drive growth initiatives.',
    responsibilities: [
      'Set company vision and strategy',
      'Oversee executive team',
      'Represent company to board and investors',
      'Drive key business initiatives'
    ],
    department: 'Executive',
    kpis: ceoKpis,
    scores: [
      createSampleScore(ceoKpis, 8.5, 90),
      createSampleScore(ceoKpis, 8.2, 60),
      createSampleScore(ceoKpis, 9.0, 30),
      createSampleScore(ceoKpis, 8.8, 7),
    ],
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: now,
  };

  // Create Engineering Manager
  const engManagerKpis = [
    createSampleKPI('Sprint Completion', 'Percentage of sprint goals completed', 'percentage', 85),
    createSampleKPI('Code Reviews', 'Code reviews completed per week', 'numeric', 15, 'weekly'),
    createSampleKPI('Team Growth', 'Team members developed and promoted', 'numeric', 2, 'quarterly'),
    createSampleKPI('System Uptime', 'System availability percentage', 'percentage', 99.5),
    createSampleKPI('On-time Delivery', 'Projects delivered on schedule', 'boolean'),
  ];

  const engManager: Employee = {
    id: generateId(),
    name: 'Alex Chen',
    role: 'Engineering Manager',
    responsibility: 'Lead engineering team, ensure technical excellence, and deliver products on time.',
    responsibilities: [
      'Manage engineering team of 8 developers',
      'Oversee technical architecture decisions',
      'Ensure code quality and best practices',
      'Coordinate with product and design teams'
    ],
    managerId: ceo.id,
    department: 'Engineering',
    kpis: engManagerKpis,
    scores: [
      createSampleScore(engManagerKpis, 8.0, 85),
      createSampleScore(engManagerKpis, 8.5, 55),
      createSampleScore(engManagerKpis, 7.8, 25),
      createSampleScore(engManagerKpis, 8.7, 5),
    ],
    createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: now,
  };

  // Create Product Manager
  const productManagerKpis = [
    createSampleKPI('Feature Adoption', 'New feature adoption rate', 'percentage', 40),
    createSampleKPI('User Feedback Score', 'Average user satisfaction rating', 'scale', 8),
    createSampleKPI('Roadmap Execution', 'Roadmap milestones hit on time', 'boolean'),
    createSampleKPI('Market Research', 'Research sessions conducted monthly', 'numeric', 8),
  ];

  const productManager: Employee = {
    id: generateId(),
    name: 'Maria Rodriguez',
    role: 'Product Manager',
    responsibility: 'Define product strategy, manage roadmap, and ensure user needs are met.',
    responsibilities: [
      'Own product roadmap and strategy',
      'Conduct user research and analysis',
      'Coordinate cross-functional product teams',
      'Define and track product metrics'
    ],
    managerId: ceo.id,
    department: 'Product',
    kpis: productManagerKpis,
    scores: [
      createSampleScore(productManagerKpis, 8.2, 80),
      createSampleScore(productManagerKpis, 8.8, 50),
      createSampleScore(productManagerKpis, 8.0, 20),
      createSampleScore(productManagerKpis, 9.1, 3),
    ],
    createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: now,
  };

  // Create Senior Engineers
  const seniorDev1Kpis = [
    createSampleKPI('Code Quality', 'Code review approval rate', 'percentage', 95),
    createSampleKPI('Bug Resolution', 'Bugs resolved per sprint', 'numeric', 8),
    createSampleKPI('Mentoring', 'Junior developers mentored', 'numeric', 2),
    createSampleKPI('Technical Debt', 'Technical debt items addressed', 'numeric', 3),
  ];

  const seniorDev1: Employee = {
    id: generateId(),
    name: 'David Kim',
    role: 'Senior Software Engineer',
    responsibility: 'Develop high-quality software, mentor junior developers, and contribute to technical decisions.',
    responsibilities: [
      'Lead feature development',
      'Mentor junior developers',
      'Participate in architectural decisions',
      'Ensure code quality standards'
    ],
    managerId: engManager.id,
    department: 'Engineering',
    kpis: seniorDev1Kpis,
    scores: [
      createSampleScore(seniorDev1Kpis, 8.5, 75),
      createSampleScore(seniorDev1Kpis, 8.9, 45),
      createSampleScore(seniorDev1Kpis, 8.1, 15),
    ],
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: now,
  };

  const seniorDev2Kpis = [
    createSampleKPI('Performance Optimization', 'Performance improvements implemented', 'numeric', 5),
    createSampleKPI('Documentation', 'Documentation pages updated', 'numeric', 10),
    createSampleKPI('Code Coverage', 'Test coverage percentage', 'percentage', 80),
    createSampleKPI('Innovation', 'New technologies/tools introduced', 'numeric', 2, 'quarterly'),
  ];

  const seniorDev2: Employee = {
    id: generateId(),
    name: 'Jennifer Wu',
    role: 'Senior Software Engineer',
    responsibility: 'Focus on performance optimization, maintain technical documentation, and drive innovation.',
    responsibilities: [
      'Optimize application performance',
      'Maintain technical documentation',
      'Research and evaluate new technologies',
      'Support deployment and DevOps processes'
    ],
    managerId: engManager.id,
    department: 'Engineering',
    kpis: seniorDev2Kpis,
    scores: [
      createSampleScore(seniorDev2Kpis, 8.3, 70),
      createSampleScore(seniorDev2Kpis, 8.7, 40),
      createSampleScore(seniorDev2Kpis, 8.2, 10),
    ],
    createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: now,
  };

  // Create Junior Engineers
  const juniorDev1Kpis = [
    createSampleKPI('Tasks Completed', 'Story points completed per sprint', 'numeric', 20),
    createSampleKPI('Learning Goals', 'Learning objectives achieved monthly', 'numeric', 3),
    createSampleKPI('Code Reviews', 'Participated in code reviews', 'boolean'),
    createSampleKPI('Skill Development', 'New skills/technologies learned', 'numeric', 1),
  ];

  const juniorDev1: Employee = {
    id: generateId(),
    name: 'Ryan Thompson',
    role: 'Junior Software Engineer',
    responsibility: 'Develop features under guidance, learn best practices, and contribute to team goals.',
    responsibilities: [
      'Implement assigned features and bug fixes',
      'Participate in code reviews',
      'Learn new technologies and frameworks',
      'Contribute to team knowledge sharing'
    ],
    managerId: engManager.id,
    department: 'Engineering',
    kpis: juniorDev1Kpis,
    scores: [
      createSampleScore(juniorDev1Kpis, 7.5, 65),
      createSampleScore(juniorDev1Kpis, 8.0, 35),
      createSampleScore(juniorDev1Kpis, 8.3, 8),
    ],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: now,
  };

  const juniorDev2: Employee = {
    id: generateId(),
    name: 'Emily Zhang',
    role: 'Junior Software Engineer',
    responsibility: 'Support development efforts, focus on testing, and grow technical skills.',
    responsibilities: [
      'Write unit and integration tests',
      'Fix bugs and implement small features',
      'Participate in agile ceremonies',
      'Shadow senior developers on complex tasks'
    ],
    managerId: engManager.id,
    department: 'Engineering',
    kpis: [
      createSampleKPI('Test Coverage', 'Tests written per sprint', 'numeric', 15),
      createSampleKPI('Bug Fixes', 'Bugs resolved per sprint', 'numeric', 5),
      createSampleKPI('Pair Programming', 'Pair programming sessions', 'numeric', 8),
      createSampleKPI('Team Participation', 'Active in team meetings', 'boolean'),
    ],
    scores: [
      createSampleScore(juniorDev1Kpis, 7.8, 60),
      createSampleScore(juniorDev1Kpis, 8.2, 30),
    ],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: now,
  };

  // Create Designer
  const designerKpis = [
    createSampleKPI('Design Quality', 'Design review approval rate', 'percentage', 90),
    createSampleKPI('User Testing', 'User testing sessions conducted', 'numeric', 4),
    createSampleKPI('Design System', 'Design system components created', 'numeric', 5),
    createSampleKPI('Prototyping', 'Interactive prototypes delivered', 'numeric', 3),
  ];

  const designer: Employee = {
    id: generateId(),
    name: 'Sophie Martinez',
    role: 'UX/UI Designer',
    responsibility: 'Create user-centered designs, conduct user research, and maintain design system.',
    responsibilities: [
      'Design user interfaces and experiences',
      'Conduct user research and testing',
      'Maintain and evolve design system',
      'Collaborate with product and engineering teams'
    ],
    managerId: productManager.id,
    department: 'Design',
    kpis: designerKpis,
    scores: [
      createSampleScore(designerKpis, 8.4, 70),
      createSampleScore(designerKpis, 8.8, 40),
      createSampleScore(designerKpis, 8.6, 12),
    ],
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: now,
  };

  const employees: Record<string, Employee> = {
    [ceo.id]: ceo,
    [engManager.id]: engManager,
    [productManager.id]: productManager,
    [seniorDev1.id]: seniorDev1,
    [seniorDev2.id]: seniorDev2,
    [juniorDev1.id]: juniorDev1,
    [juniorDev2.id]: juniorDev2,
    [designer.id]: designer,
  };

  return {
    employees,
    version: '1.0.0',
  };
};