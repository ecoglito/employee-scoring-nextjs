import React, { useState, useEffect } from 'react';
import { Employee } from '@/types';
import { useEmployees } from '@/contexts/EmployeeContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditEmployeeDialogProps {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditEmployeeDialog({ employee, open, onOpenChange }: EditEmployeeDialogProps) {
  const { updateEmployee, employees } = useEmployees();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    responsibility: '',
    managerId: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);

  // Initialize form with employee data when dialog opens
  useEffect(() => {
    if (open && employee) {
      setFormData({
        name: employee.name,
        role: employee.role,
        responsibility: employee.responsibility,
        managerId: employee.managerId || 'no-manager',
        department: employee.department || '',
      });
    }
  }, [open, employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.role.trim()) {
      alert('Name and role are required fields.');
      return;
    }

    setLoading(true);
    try {
      // Parse responsibilities from textarea (split by newlines)
      const responsibilities = formData.responsibility
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      const updatedEmployee: Employee = {
        ...employee,
        name: formData.name.trim(),
        role: formData.role.trim(),
        responsibility: formData.responsibility.trim(),
        responsibilities,
        managerId: formData.managerId === 'no-manager' ? undefined : formData.managerId || undefined,
        department: formData.department.trim() || undefined,
        updatedAt: new Date().toISOString(),
      };

      updateEmployee(updatedEmployee);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update employee:', error);
      alert('Failed to update employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      name: employee.name,
      role: employee.role,
      responsibility: employee.responsibility,
      managerId: employee.managerId || 'no-manager',
      department: employee.department || '',
    });
    onOpenChange(false);
  };

  // Filter out the current employee from manager options
  const managerOptions = employees.filter(emp => emp.id !== employee.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            Update employee information. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role/Title *</Label>
              <Input
                id="edit-role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g., Product Manager"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-department">Department</Label>
              <Input
                id="edit-department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="e.g., Engineering"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-manager">Manager</Label>
              <Select value={formData.managerId} onValueChange={(value) => setFormData(prev => ({ ...prev, managerId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select manager (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-manager">No manager</SelectItem>
                  {managerOptions.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} - {emp.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-responsibility">Primary Responsibility</Label>
            <Textarea
              id="edit-responsibility"
              value={formData.responsibility}
              onChange={(e) => setFormData(prev => ({ ...prev, responsibility: e.target.value }))}
              placeholder="Describe the main responsibility or role overview..."
              rows={3}
            />
          </div>

          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Created:</strong> {new Date(employee.createdAt).toLocaleString()}
              {employee.updatedAt !== employee.createdAt && (
                <>
                  <br />
                  <strong>Last Updated:</strong> {new Date(employee.updatedAt).toLocaleString()}
                </>
              )}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}