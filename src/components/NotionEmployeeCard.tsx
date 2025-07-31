import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Clock, DollarSign, Calendar, Users } from 'lucide-react';
import { NotionEmployee } from '@/lib/notionEmployeeService';
import NotionEmployeeDetail from './NotionEmployeeDetail';

interface NotionEmployeeCardProps {
  employee: NotionEmployee;
  showSalary?: boolean;
}

const teamColors: Record<string, string> = {
  'Exec': 'bg-purple-900/20 text-purple-400 border-purple-800',
  'Frontend': 'bg-blue-900/20 text-blue-400 border-blue-800',
  'Backend': 'bg-green-900/20 text-green-400 border-green-800',
  'Smart Contract': 'bg-blue-900/20 text-blue-400 border-blue-800',
  'Product': 'bg-pink-900/20 text-pink-400 border-pink-800',
  'Growth': 'bg-yellow-900/20 text-yellow-400 border-yellow-800',
  'Science': 'bg-indigo-900/20 text-indigo-400 border-indigo-800',
  'Infrastructure & DevOps': 'bg-gray-900/20 text-gray-400 border-gray-800',
};

const timezoneEmojis: Record<string, string> = {
  'EST': '🇺🇸',
  'PST': '🇺🇸',
  'MST': '🇺🇸',
  'CEST': '🇪🇺',
};

export default function NotionEmployeeCard({ employee, showSalary = false }: NotionEmployeeCardProps) {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getTeamColor = (team: string) => {
    return teamColors[team] || 'bg-gray-900/20 text-gray-400 border-gray-800';
  };

  const getAvatarGradient = (employee: NotionEmployee) => {
    // Get the primary team/role for gradient theming
    const primaryTeam = employee.team?.[0];
    const isExec = employee.team?.includes('Exec') || 
      employee.tags?.some(tag => tag.toLowerCase() === 'exec' || tag.toLowerCase() === 'executive');
    
    if (isExec) {
      return 'bg-gradient-to-br from-purple-500 to-indigo-600'; // Executive purple
    }
    
    switch (primaryTeam) {
      case 'Backend':
        return 'bg-gradient-to-br from-green-500 to-emerald-600';
      case 'Frontend':
        return 'bg-gradient-to-br from-blue-500 to-sky-600';
      case 'Smart Contract':
        return 'bg-gradient-to-br from-blue-600 to-indigo-700';
      case 'Product':
        return 'bg-gradient-to-br from-pink-500 to-rose-600';
      case 'Growth':
        return 'bg-gradient-to-br from-yellow-500 to-orange-600';
      case 'Science':
        return 'bg-gradient-to-br from-indigo-500 to-purple-600';
      case 'Infrastructure & DevOps':
        return 'bg-gradient-to-br from-gray-500 to-slate-600';
      default:
        return 'bg-gradient-to-br from-slate-500 to-gray-600'; // Default neutral
    }
  };

  return (
    <>
      <Card className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-200 cursor-pointer border-border/50 hover:border-border/80" onClick={() => setShowDetailDialog(true)}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-border">
            <AvatarFallback className={`${getAvatarGradient(employee)} text-white font-semibold text-lg`}>
              {getInitials(employee.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-xl leading-tight text-foreground">
                {employee.name || 'Unknown'}
              </h3>
              {employee.timezone && (
                <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-md">
                  <span className="text-base" title={`Timezone: ${employee.timezone}`}>
                    {timezoneEmojis[employee.timezone] || '🌍'}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {employee.timezone}
                  </span>
                </div>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 font-medium">
              {employee.position || 'No position set'}
            </p>

            {/* Teams */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {employee.team?.map((team) => (
                <Badge 
                  key={team} 
                  variant="outline" 
                  className={`text-xs font-medium px-2 py-1 ${getTeamColor(team)}`}
                >
                  <Users className="h-3 w-3 mr-1.5" />
                  {team}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Contact Info */}
        {employee.email && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center justify-center w-6 h-6 bg-white/10 rounded-md">
              <Mail className="h-3 w-3 text-white" />
            </div>
            <a 
              href={`mailto:${employee.email}`}
              className="text-muted-foreground hover:text-foreground hover:underline transition-colors font-medium"
            >
              {employee.email}
            </a>
          </div>
        )}

        {/* Start Date */}
        {employee.startDate && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center justify-center w-6 h-6 bg-white/10 rounded-md">
              <Calendar className="h-3 w-3 text-white" />
            </div>
            <span className="text-muted-foreground font-medium">
              Started {new Date(employee.startDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Salary (only if showSalary is true) */}
        {showSalary && employee.baseSalary && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center justify-center w-6 h-6 bg-white/10 rounded-md">
              <DollarSign className="h-3 w-3 text-white" />
            </div>
            <span className="text-muted-foreground font-medium">
              ${employee.baseSalary.toLocaleString()}
            </span>
          </div>
        )}

        {/* Tags */}
        {employee.tags && employee.tags.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {employee.tags.slice(0, 6).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-xs font-medium px-2 py-1 bg-muted/40 text-muted-foreground hover:bg-muted/60 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
              {employee.tags.length > 6 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs font-medium px-2 py-1 bg-muted/40 text-muted-foreground"
                >
                  +{employee.tags.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

      </CardContent>
      </Card>

      {/* Detail Dialog */}
      <NotionEmployeeDetail
        employee={employee}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
      />
    </>
  );
}