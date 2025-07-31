'use client';

import React, { useState, useEffect } from 'react';
import { Home, LogOut, Shield, Users, Lock, Eye, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { useEffectivePermissions, useViewMode } from '@/contexts/ViewModeContext';
import { usePermissions } from '@/hooks/usePermissions';
import ViewModeBanner from '@/components/ViewModeBanner';
import NotionEmployeeService, { NotionEmployee } from '@/lib/notionEmployeeService';
import SyncFooter from '@/components/SyncFooter';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  session: Session;
}

export default function AppLayout({
  children,
  activeTab,
  onTabChange,
  session,
}: AppLayoutProps) {
  const { permissions, isExec, isManager, viewingAs } = useEffectivePermissions();
  const { isExec: actualIsExec } = usePermissions(); // Get actual exec status
  const { viewingAsEmployee, setViewingAsEmployee } = useViewMode();
  const [employees, setEmployees] = useState<NotionEmployee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside() {
      setMobileMenuOpen(false);
    }

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [mobileMenuOpen]);

  // Load employees for view-as dropdown (only for super admin)
  useEffect(() => {
    const loadEmployees = async () => {
      if (actualIsExec && session?.user?.email === 'enzo@liquidlabs.inc') {
        setLoadingEmployees(true);
        try {
          const data = await NotionEmployeeService.getAllEmployees();
          setEmployees(data);
        } catch (error) {
          // Failed to load employees
        } finally {
          setLoadingEmployees(false);
        }
      }
    };
    loadEmployees();
  }, [actualIsExec, session?.user?.email]);

  const handleEmployeeSelect = (employeeId: string) => {
    const employee = employees.find(emp => emp.notionId === employeeId);
    if (employee) {
      setViewingAsEmployee(employee);
      // Stay on current page when switching view
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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

  // Group employees by role/team
  const groupedEmployees = {
    executives: employees.filter(emp => 
      emp.team?.includes('Exec') || 
      emp.tags?.some(tag => tag.toLowerCase() === 'exec' || tag.toLowerCase() === 'executive')
    ),
    managers: employees.filter(emp => {
      const isExec = emp.team?.includes('Exec') || 
        emp.tags?.some(tag => tag.toLowerCase() === 'exec' || tag.toLowerCase() === 'executive');
      const hasManagerTag = emp.tags?.some(tag => 
        ['manager', 'lead', 'head', 'director', 'vp'].some(mTag => 
          tag.toLowerCase().includes(mTag)
        )
      );
      return !isExec && hasManagerTag;
    }),
    employees: employees.filter(emp => {
      const isExec = emp.team?.includes('Exec') || 
        emp.tags?.some(tag => tag.toLowerCase() === 'exec' || tag.toLowerCase() === 'executive');
      const hasManagerTag = emp.tags?.some(tag => 
        ['manager', 'lead', 'head', 'director', 'vp'].some(mTag => 
          tag.toLowerCase().includes(mTag)
        )
      );
      return !isExec && !hasManagerTag;
    })
  };
  
  const tabs = [
    { id: 'team', label: 'Team', icon: Home },
  ];
  
  // Add manager tab if user is a manager or exec
  if (isExec || isManager) {
    tabs.push({ id: 'manager', label: 'Manager', icon: Users });
  }
  
  // Add admin tab only for executives
  if (isExec) {
    tabs.push({ id: 'admin', label: 'Admin', icon: Shield });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* View Mode Banner */}
      <ViewModeBanner />
      
      {/* Combined Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Navigation (Desktop) */}
            <div className="flex items-center space-x-6">
              <Image 
                src="/gte-logo.svg" 
                alt="GTE Logo" 
                width={32} 
                height={32} 
                className="h-8 w-auto"
              />
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <Button
                      key={tab.id}
                      variant="ghost"
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-muted text-foreground shadow-md hover:!bg-muted hover:!text-foreground' 
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => onTabChange(tab.id)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{tab.label}</span>
                    </Button>
                  );
                })}
              </nav>
            </div>

            {/* Right: User Info and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">
                  {viewingAs ? viewingAs : session.user?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {viewingAs ? 'Viewing as' : session.user?.email}
                </p>
              </div>
              
              {/* View As Employee Selector - Only for super admin */}
              {actualIsExec && session?.user?.email === 'enzo@liquidlabs.inc' && !viewingAsEmployee && (
                <Select onValueChange={handleEmployeeSelect}>
                  <SelectTrigger className="w-[200px]">
                    <Eye className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="View as..." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Executives */}
                    {groupedEmployees.executives.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          Executives
                        </div>
                        {groupedEmployees.executives.map((employee) => (
                          <SelectItem 
                            key={employee.notionId} 
                            value={employee.notionId}
                            className="focus:bg-muted focus:text-foreground hover:bg-muted hover:text-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className={`${getAvatarGradient(employee)} text-white text-xs font-semibold`}>
                                  {getInitials(employee.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{employee.name}</span>
                              <Badge variant="secondary" className="text-xs ml-auto">Exec</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                    
                    {/* Managers */}
                    {groupedEmployees.managers.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          Managers
                        </div>
                        {groupedEmployees.managers.map((employee) => (
                          <SelectItem 
                            key={employee.notionId} 
                            value={employee.notionId}
                            className="focus:bg-muted focus:text-foreground hover:bg-muted hover:text-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className={`${getAvatarGradient(employee)} text-white text-xs font-semibold`}>
                                  {getInitials(employee.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{employee.name}</span>
                              <Badge variant="secondary" className="text-xs ml-auto">Manager</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                    
                    {/* Regular Employees */}
                    {groupedEmployees.employees.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          Employees
                        </div>
                        {groupedEmployees.employees.map((employee) => (
                          <SelectItem 
                            key={employee.notionId} 
                            value={employee.notionId}
                            className="focus:bg-muted focus:text-foreground hover:bg-muted hover:text-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className={`${getAvatarGradient(employee)} text-white text-xs font-semibold`}>
                                  {getInitials(employee.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{employee.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-muted-foreground hover:text-foreground flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden border-t bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container mx-auto px-6 py-4 space-y-2">
              {/* Mobile Navigation Tabs */}
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    className={`w-full justify-start space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-muted text-foreground shadow-md hover:!bg-muted hover:!text-foreground' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => {
                      onTabChange(tab.id);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium text-base">{tab.label}</span>
                  </Button>
                );
              })}

              {/* Mobile User Info */}
              <div className="pt-4 border-t border-border">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium">
                    {viewingAs ? viewingAs : session.user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {viewingAs ? 'Viewing as' : session.user?.email}
                  </p>
                </div>

                {/* Mobile View As Employee Selector - Only for super admin */}
                {actualIsExec && session?.user?.email === 'enzo@liquidlabs.inc' && !viewingAsEmployee && (
                  <div className="px-4 py-2">
                    <Select onValueChange={handleEmployeeSelect}>
                      <SelectTrigger className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="View as..." />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Same content as desktop version */}
                        {groupedEmployees.executives.length > 0 && (
                          <>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                              Executives
                            </div>
                            {groupedEmployees.executives.map((employee) => (
                              <SelectItem 
                                key={employee.notionId} 
                                value={employee.notionId}
                                className="focus:bg-muted focus:text-foreground hover:bg-muted hover:text-foreground"
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className={`${getAvatarGradient(employee)} text-white text-xs font-semibold`}>
                                      {getInitials(employee.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{employee.name}</span>
                                  <Badge variant="secondary" className="text-xs ml-auto">Exec</Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </>
                        )}
                        
                        {groupedEmployees.managers.length > 0 && (
                          <>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                              Managers
                            </div>
                            {groupedEmployees.managers.map((employee) => (
                              <SelectItem 
                                key={employee.notionId} 
                                value={employee.notionId}
                                className="focus:bg-muted focus:text-foreground hover:bg-muted hover:text-foreground"
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className={`${getAvatarGradient(employee)} text-white text-xs font-semibold`}>
                                      {getInitials(employee.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{employee.name}</span>
                                  <Badge variant="secondary" className="text-xs ml-auto">Manager</Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </>
                        )}
                        
                        {groupedEmployees.employees.length > 0 && (
                          <>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                              Employees
                            </div>
                            {groupedEmployees.employees.map((employee) => (
                              <SelectItem 
                                key={employee.notionId} 
                                value={employee.notionId}
                                className="focus:bg-muted focus:text-foreground hover:bg-muted hover:text-foreground"
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className={`${getAvatarGradient(employee)} text-white text-xs font-semibold`}>
                                      {getInitials(employee.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{employee.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Content Area */}
      <main className="container mx-auto px-4 py-6 pb-16">
        {children}
      </main>

      {/* Sync Footer - Only for executives */}
      <SyncFooter />
    </div>
  );
}