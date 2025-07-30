import React, { useState } from 'react';
import { Plus, Edit, Trash2, Target } from 'lucide-react';
import { Employee, KPI, KPIType, KPIFrequency } from '@/types';
import { useEmployees } from '@/contexts/EmployeeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { generateId } from '@/lib/storage';

interface KPIManagerProps {
  employee: Employee;
}

export default function KPIManager({ employee }: KPIManagerProps) {
  const { updateEmployee } = useEmployees();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingKPI, setEditingKPI] = useState<KPI | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'numeric' as KPIType,
    target: '',
    frequency: 'monthly' as KPIFrequency,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'numeric',
      target: '',
      frequency: 'monthly',
    });
  };

  const handleAddKPI = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('KPI name is required');
      return;
    }

    const newKPI: KPI = {
      id: generateId(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      type: formData.type,
      target: formData.target ? parseFloat(formData.target) : undefined,
      frequency: formData.frequency,
      createdAt: new Date().toISOString(),
    };

    const updatedEmployee: Employee = {
      ...employee,
      kpis: [...employee.kpis, newKPI],
      updatedAt: new Date().toISOString(),
    };

    updateEmployee(updatedEmployee);
    resetForm();
    setShowAddDialog(false);
  };

  const handleEditKPI = (kpi: KPI) => {
    setEditingKPI(kpi);
    setFormData({
      name: kpi.name,
      description: kpi.description,
      type: kpi.type,
      target: kpi.target ? kpi.target.toString() : '',
      frequency: kpi.frequency,
    });
    setShowEditDialog(true);
  };

  const handleUpdateKPI = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingKPI || !formData.name.trim()) {
      alert('KPI name is required');
      return;
    }

    const updatedKPI: KPI = {
      ...editingKPI,
      name: formData.name.trim(),
      description: formData.description.trim(),
      type: formData.type,
      target: formData.target ? parseFloat(formData.target) : undefined,
      frequency: formData.frequency,
    };

    const updatedEmployee: Employee = {
      ...employee,
      kpis: employee.kpis.map(kpi => kpi.id === editingKPI.id ? updatedKPI : kpi),
      updatedAt: new Date().toISOString(),
    };

    updateEmployee(updatedEmployee);
    resetForm();
    setEditingKPI(null);
    setShowEditDialog(false);
  };

  const handleDeleteKPI = (kpiId: string) => {
    if (window.confirm('Are you sure you want to delete this KPI? This will also remove all associated scores.')) {
      const updatedEmployee: Employee = {
        ...employee,
        kpis: employee.kpis.filter(kpi => kpi.id !== kpiId),
        scores: employee.scores.map(score => ({
          ...score,
          kpiScores: Object.fromEntries(
            Object.entries(score.kpiScores).filter(([id]) => id !== kpiId)
          ),
        })),
        updatedAt: new Date().toISOString(),
      };

      updateEmployee(updatedEmployee);
    }
  };

  const getKPITypeLabel = (type: KPIType): string => {
    switch (type) {
      case 'numeric': return 'Number';
      case 'percentage': return 'Percentage';
      case 'boolean': return 'Yes/No';
      case 'scale': return 'Scale (1-10)';
      default: return type;
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingKPI(null);
    setShowAddDialog(false);
    setShowEditDialog(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          <h3 className="text-lg font-semibold">KPIs</h3>
          <span className="text-muted-foreground">({employee.kpis.length})</span>
        </div>
        <Button onClick={() => setShowAddDialog(true)} size="sm">
          <Plus className="h-4 w-4" />
          Add KPI
        </Button>
      </div>

      {/* KPI List */}
      {employee.kpis.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-semibold mb-2">No KPIs defined</h4>
            <p className="text-muted-foreground text-center mb-4">
              Add KPIs to track this employee's performance against specific goals.
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4" />
              Add First KPI
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {employee.kpis.map((kpi) => (
            <Card key={kpi.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{kpi.name}</CardTitle>
                    {kpi.description && (
                      <p className="text-sm text-muted-foreground">{kpi.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditKPI(kpi)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteKPI(kpi.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium">{getKPITypeLabel(kpi.type)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Frequency:</span>
                    <p className="font-medium capitalize">{kpi.frequency}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target:</span>
                    <p className="font-medium">
                      {kpi.target ? `${kpi.target}${kpi.type === 'percentage' ? '%' : ''}` : 'Not set'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add KPI Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New KPI</DialogTitle>
            <DialogDescription>
              Define a key performance indicator for {employee.name}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddKPI} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-kpi-name">KPI Name *</Label>
              <Input
                id="add-kpi-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Weekly Code Commits"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-kpi-description">Description</Label>
              <Textarea
                id="add-kpi-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this KPI measures..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-kpi-type">Measurement Type</Label>
                <Select value={formData.type} onValueChange={(value: KPIType) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="numeric">Number</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="boolean">Yes/No</SelectItem>
                    <SelectItem value="scale">Scale (1-10)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-kpi-frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value: KPIFrequency) => setFormData(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-kpi-target">Target Value (Optional)</Label>
              <Input
                id="add-kpi-target"
                type="number"
                step="any"
                value={formData.target}
                onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                placeholder="e.g., 5, 95, 8.5"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Add KPI</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit KPI Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit KPI</DialogTitle>
            <DialogDescription>
              Update the KPI definition for {employee.name}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateKPI} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-kpi-name">KPI Name *</Label>
              <Input
                id="edit-kpi-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Weekly Code Commits"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-kpi-description">Description</Label>
              <Textarea
                id="edit-kpi-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this KPI measures..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-kpi-type">Measurement Type</Label>
                <Select value={formData.type} onValueChange={(value: KPIType) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="numeric">Number</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="boolean">Yes/No</SelectItem>
                    <SelectItem value="scale">Scale (1-10)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-kpi-frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value: KPIFrequency) => setFormData(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-kpi-target">Target Value (Optional)</Label>
              <Input
                id="edit-kpi-target"
                type="number"
                step="any"
                value={formData.target}
                onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                placeholder="e.g., 5, 95, 8.5"
              />
            </div>

            {editingKPI && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm text-muted-foreground">
                  <strong>Created:</strong> {new Date(editingKPI.createdAt).toLocaleString()}
                </p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Update KPI</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}