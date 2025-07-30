import React, { useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { useEmployees } from '@/contexts/EmployeeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import EmployeeCard from './EmployeeCard';
import AddEmployeeDialog from './AddEmployeeDialog';

export default function EmployeeList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  let employees, loading;
  
  try {
    const context = useEmployees();
    employees = context.employees;
    loading = context.loading;
  } catch (error) {
    // If useEmployees fails (database mode without proper context), show a message
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">
              Individual employee KPI tracking and scoring
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Database Mode Active</h3>
            <p className="text-muted-foreground mb-4">
              The Employees tab works with Local Storage mode. Switch to "Team" tab to see your Notion team data, 
              or toggle Database mode OFF to use the employee scoring system.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Team tab:</strong> Your real team from Notion
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Employees tab:</strong> Private KPI scoring (Local Storage mode)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Employees</h1>
          <span className="text-muted-foreground">({employees.length})</span>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search employees by name, role, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Employee Grid */}
      {filteredEmployees.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {employees.length === 0 ? 'No employees yet' : 'No employees found'}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {employees.length === 0 
                ? 'Get started by adding your first employee to the system.'
                : 'Try adjusting your search terms or clear the search.'
              }
            </p>
            {employees.length === 0 && (
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4" />
                Add First Employee
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      )}

      {/* Add Employee Dialog */}
      <AddEmployeeDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
    </div>
  );
}