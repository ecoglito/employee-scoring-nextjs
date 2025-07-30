import React, { useState } from 'react';
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

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddEmployeeDialog({ open, onOpenChange }: AddEmployeeDialogProps) {
  const { addEmployee, employees } = useEmployees();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    responsibility: '',
    responsibilities: [] as string[],
    managerId: 'no-manager',
    department: '',
  });
  const [loading, setLoading] = useState(false);

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

      addEmployee({
        name: formData.name.trim(),
        role: formData.role.trim(),
        responsibility: formData.responsibility.trim(),
        responsibilities,
        managerId: formData.managerId === 'no-manager' ? undefined : formData.managerId || undefined,
        department: formData.department.trim() || undefined,
        kpis: [],
        scores: [],
      });

      // Reset form
      setFormData({
        name: '',
        role: '',
        responsibility: '',
        responsibilities: [],
        managerId: 'no-manager',
        department: '',
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Failed to add employee:', error);
      alert('Failed to add employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      role: '',
      responsibility: '',
      responsibilities: [],
      managerId: 'no-manager',
      department: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Create a new employee profile. You'll be able to add KPIs and scores after creating the employee.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role/Title *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g., Product Manager"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="e.g., Engineering"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <Select value={formData.managerId} onValueChange={(value) => setFormData(prev => ({ ...prev, managerId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select manager (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-manager">No manager</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibility">Primary Responsibility</Label>
            <Textarea
              id="responsibility"
              value={formData.responsibility}
              onChange={(e) => setFormData(prev => ({ ...prev, responsibility: e.target.value }))}
              placeholder="Describe the main responsibility or role overview..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}