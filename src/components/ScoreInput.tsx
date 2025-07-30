import React, { useState } from 'react';
import { Calendar, Save, Star } from 'lucide-react';
import { Employee, Score, KPI } from '@/types';
import { useEmployees } from '@/contexts/EmployeeContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

interface ScoreInputProps {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ScoreInput({ employee, open, onOpenChange }: ScoreInputProps) {
  const { updateEmployee } = useEmployees();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    overall: '',
    kpiScores: {} as Record<string, string>,
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (open) {
      // Initialize KPI scores
      const initialKpiScores: Record<string, string> = {};
      employee.kpis.forEach(kpi => {
        initialKpiScores[kpi.id] = '';
      });
      
      setFormData({
        date: new Date().toISOString().split('T')[0],
        overall: '',
        kpiScores: initialKpiScores,
        notes: '',
      });
    }
  }, [open, employee.kpis]);

  const handleKPIScoreChange = (kpiId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      kpiScores: {
        ...prev.kpiScores,
        [kpiId]: value,
      },
    }));
  };

  const validateKPIScore = (kpi: KPI, value: string): boolean => {
    if (!value.trim()) return true; // Allow empty values
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;

    switch (kpi.type) {
      case 'percentage':
        return numValue >= 0 && numValue <= 100;
      case 'scale':
        return numValue >= 1 && numValue <= 10;
      case 'boolean':
        return value === '1' || value === '0';
      case 'numeric':
        return numValue >= 0;
      default:
        return true;
    }
  };

  const getKPIInputType = (kpi: KPI): string => {
    switch (kpi.type) {
      case 'boolean':
        return 'select';
      default:
        return 'number';
    }
  };

  const getKPIPlaceholder = (kpi: KPI): string => {
    switch (kpi.type) {
      case 'percentage':
        return '0-100';
      case 'scale':
        return '1-10';
      case 'numeric':
        return 'Enter number';
      case 'boolean':
        return 'Yes/No';
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.overall.trim()) {
      alert('Overall score is required');
      return;
    }

    const overallScore = parseFloat(formData.overall);
    if (isNaN(overallScore) || overallScore < 1 || overallScore > 10) {
      alert('Overall score must be between 1 and 10');
      return;
    }

    // Validate KPI scores
    for (const kpi of employee.kpis) {
      const value = formData.kpiScores[kpi.id];
      if (value && !validateKPIScore(kpi, value)) {
        alert(`Invalid value for ${kpi.name}. ${getKPIPlaceholder(kpi)}`);
        return;
      }
    }

    setLoading(true);
    try {
      // Process KPI scores
      const processedKpiScores: Record<string, number | boolean> = {};
      employee.kpis.forEach(kpi => {
        const value = formData.kpiScores[kpi.id];
        if (value.trim() && value !== 'not-scored') {
          if (kpi.type === 'boolean') {
            processedKpiScores[kpi.id] = value === '1';
          } else {
            processedKpiScores[kpi.id] = parseFloat(value);
          }
        }
      });

      const newScore: Score = {
        id: generateId(),
        date: formData.date,
        overall: overallScore,
        kpiScores: processedKpiScores,
        notes: formData.notes.trim(),
        createdAt: new Date().toISOString(),
      };

      // Add score to employee (sorted by date)
      const updatedScores = [...employee.scores, newScore].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const updatedEmployee: Employee = {
        ...employee,
        scores: updatedScores,
        updatedAt: new Date().toISOString(),
      };

      updateEmployee(updatedEmployee);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save score:', error);
      alert('Failed to save score. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      overall: '',
      kpiScores: {},
      notes: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Add Score for {employee.name}
          </DialogTitle>
          <DialogDescription>
            Record performance scores for this employee's KPIs and overall performance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Overall Score */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score-date">Date</Label>
              <Input
                id="score-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overall-score">Overall Score (1-10) *</Label>
              <Input
                id="overall-score"
                type="number"
                min="1"
                max="10"
                step="0.1"
                value={formData.overall}
                onChange={(e) => setFormData(prev => ({ ...prev, overall: e.target.value }))}
                placeholder="e.g., 8.5"
                required
              />
            </div>
          </div>

          {/* KPI Scores */}
          {employee.kpis.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <h4 className="font-medium">KPI Scores</h4>
                <span className="text-xs text-muted-foreground">(Optional - leave blank if not applicable)</span>
              </div>

              <div className="space-y-3">
                {employee.kpis.map((kpi) => (
                  <Card key={kpi.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Label className="font-medium">{kpi.name}</Label>
                          {kpi.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {kpi.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <div>Type: {kpi.type}</div>
                          {kpi.target && (
                            <div>Target: {kpi.target}{kpi.type === 'percentage' ? '%' : ''}</div>
                          )}
                        </div>
                      </div>

                      {getKPIInputType(kpi) === 'select' ? (
                        <Select
                          value={formData.kpiScores[kpi.id] || ''}
                          onValueChange={(value) => handleKPIScoreChange(kpi.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Yes/No" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-scored">Not scored</SelectItem>
                            <SelectItem value="1">Yes</SelectItem>
                            <SelectItem value="0">No</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type="number"
                          step={kpi.type === 'scale' ? '0.1' : 'any'}
                          min={kpi.type === 'percentage' ? '0' : kpi.type === 'scale' ? '1' : undefined}
                          max={kpi.type === 'percentage' ? '100' : kpi.type === 'scale' ? '10' : undefined}
                          value={formData.kpiScores[kpi.id] || ''}
                          onChange={(e) => handleKPIScoreChange(kpi.id, e.target.value)}
                          placeholder={getKPIPlaceholder(kpi)}
                        />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="score-notes">Notes</Label>
            <Textarea
              id="score-notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any comments about this score period..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (
                <>
                  <Save className="h-4 w-4" />
                  Save Score
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}