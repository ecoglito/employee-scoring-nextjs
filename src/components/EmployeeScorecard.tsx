'use client';

import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Shield, 
  Save, 
  Plus, 
  Trash2, 
  Edit2, 
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Flag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NotionEmployee } from '@/lib/notionEmployeeService';
import { useSession } from 'next-auth/react';
import { useEffectivePermissions } from '@/contexts/ViewModeContext';

interface ScorecardOutcome {
  id?: string;
  description: string;
  details: string[];
  rating?: string;
  comments?: string;
}

interface ScorecardCompetency {
  id?: string;
  competency: string;
  rating?: string;
  comments?: string;
}

interface EmployeeScorecardProps {
  employee: NotionEmployee;
  canEdit?: boolean;
}

// Default competencies based on the example
const DEFAULT_COMPETENCIES = [
  'Hires A players',
  'Analytical skills',
  'Creative/innovative',
  'Persistent',
  'Open to criticism and others\' ideas',
  'Leadership',
  'Communication',
  'Technical expertise',
  'Problem solving',
  'Team collaboration'
];

export default function EmployeeScorecard({ employee, canEdit = false }: EmployeeScorecardProps) {
  const { data: session } = useSession();
  const { isExec, isManager } = useEffectivePermissions();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [expandedOutcomes, setExpandedOutcomes] = useState<Set<number>>(new Set());
  
  // Scorecard data
  const [role, setRole] = useState(employee.position || '');
  const [mission, setMission] = useState('');
  const [outcomes, setOutcomes] = useState<ScorecardOutcome[]>([]);
  const [competencies, setCompetencies] = useState<ScorecardCompetency[]>([]);

  // Load scorecard data
  useEffect(() => {
    loadScorecard();
  }, [employee.notionId]);

  const loadScorecard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/scorecards?employeeNotionId=${employee.notionId}`);
      const data = await response.json();
      
      if (response.ok && data.scorecard) {
        setRole(data.scorecard.role);
        setMission(data.scorecard.mission || '');
        setOutcomes(data.scorecard.outcomes || []);
        setCompetencies(data.scorecard.competencies || []);
      } else {
        // Initialize with default competencies if no scorecard exists
        setCompetencies(DEFAULT_COMPETENCIES.map(comp => ({ competency: comp })));
      }
    } catch (error) {
      console.error('Failed to load scorecard:', error);
      setMessage({ type: 'error', text: 'Failed to load scorecard' });
    } finally {
      setLoading(false);
    }
  };

  const saveScorecard = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/scorecards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeNotionId: employee.notionId,
          role,
          mission,
          outcomes,
          competencies
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Scorecard saved successfully' });
        setIsEditing(false);
        loadScorecard(); // Reload to get latest data
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save scorecard' });
      }
    } catch (error) {
      console.error('Failed to save scorecard:', error);
      setMessage({ type: 'error', text: 'Failed to save scorecard' });
    } finally {
      setSaving(false);
    }
  };

  const addOutcome = () => {
    setOutcomes([...outcomes, { description: '', details: [] }]);
  };

  const updateOutcome = (index: number, field: keyof ScorecardOutcome, value: any) => {
    const updated = [...outcomes];
    updated[index] = { ...updated[index], [field]: value };
    setOutcomes(updated);
  };

  const removeOutcome = (index: number) => {
    setOutcomes(outcomes.filter((_, i) => i !== index));
  };

  const addOutcomeDetail = (outcomeIndex: number) => {
    const updated = [...outcomes];
    updated[outcomeIndex].details = [...(updated[outcomeIndex].details || []), ''];
    setOutcomes(updated);
  };

  const updateOutcomeDetail = (outcomeIndex: number, detailIndex: number, value: string) => {
    const updated = [...outcomes];
    updated[outcomeIndex].details[detailIndex] = value;
    setOutcomes(updated);
  };

  const removeOutcomeDetail = (outcomeIndex: number, detailIndex: number) => {
    const updated = [...outcomes];
    updated[outcomeIndex].details = updated[outcomeIndex].details.filter((_, i) => i !== detailIndex);
    setOutcomes(updated);
  };

  const updateCompetency = (index: number, field: keyof ScorecardCompetency, value: any) => {
    const updated = [...competencies];
    updated[index] = { ...updated[index], [field]: value };
    setCompetencies(updated);
  };

  const addCompetency = () => {
    setCompetencies([...competencies, { competency: '', rating: undefined, comments: undefined }]);
  };

  const removeCompetency = (index: number) => {
    setCompetencies(competencies.filter((_, i) => i !== index));
  };

  const toggleOutcomeExpanded = (index: number) => {
    const newExpanded = new Set(expandedOutcomes);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedOutcomes(newExpanded);
  };

  const getRatingColor = (rating?: string) => {
    switch (rating) {
      case 'A': return 'bg-green-100 text-green-800 border-green-300';
      case 'B': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'C': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allowEdit = canEdit && (isExec || isManager);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Performance Scorecard</CardTitle>
                  <CardDescription>Comprehensive evaluation framework</CardDescription>
                </div>
              </div>
              
              {/* Role and Mission */}
              <div className="grid gap-4">
                <div>
                  <Label className="text-base font-semibold flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4" />
                    Role
                  </Label>
                  {isEditing ? (
                    <Input
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g., General Manager"
                      className="max-w-md"
                    />
                  ) : (
                    <p className="text-lg">{role || 'No role defined'}</p>
                  )}
                </div>
                
                <div>
                  <Label className="text-base font-semibold flex items-center gap-2 mb-2">
                    <Flag className="h-4 w-4" />
                    Mission
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={mission}
                      onChange={(e) => setMission(e.target.value)}
                      placeholder="Describe the mission and key responsibilities..."
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {mission || 'No mission statement defined'}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {allowEdit && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        loadScorecard(); // Reset changes
                      }}
                      disabled={saving}
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={saveScorecard}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {message && (
        <Alert className={message.type === 'success' ? 'border-green-800' : 'border-red-800'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Outcomes Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Outcomes</CardTitle>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={addOutcome}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Outcome
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {outcomes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No outcomes defined yet
              </p>
            ) : (
              outcomes.map((outcome, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3"
                >
                  {/* Outcome Header */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Textarea
                            value={outcome.description}
                            onChange={(e) => updateOutcome(index, 'description', e.target.value)}
                            placeholder="Describe the outcome..."
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOutcome(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <p className="font-medium">{outcome.description}</p>
                      )}
                      
                      {/* Details */}
                      {(outcome.details.length > 0 || isEditing) && (
                        <div className="ml-4 space-y-2">
                          {outcome.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-start gap-2">
                              <span className="text-muted-foreground">•</span>
                              {isEditing ? (
                                <div className="flex gap-2 flex-1">
                                  <Input
                                    value={detail}
                                    onChange={(e) => updateOutcomeDetail(index, detailIndex, e.target.value)}
                                    placeholder="Add detail..."
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeOutcomeDetail(index, detailIndex)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">{detail}</span>
                              )}
                            </div>
                          ))}
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addOutcomeDetail(index)}
                              className="ml-6"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add detail
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Rating */}
                    <div className="flex-shrink-0">
                      {isEditing ? (
                        <Select
                          value={outcome.rating || ''}
                          onValueChange={(value) => updateOutcome(index, 'rating', value)}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="Rate" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : outcome.rating ? (
                        <Badge 
                          variant="outline" 
                          className={`text-lg px-4 py-1 ${getRatingColor(outcome.rating)}`}
                        >
                          {outcome.rating}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                  
                  {/* Comments */}
                  {(isEditing || outcome.comments) && (
                    <div className="ml-14">
                      {isEditing ? (
                        <Textarea
                          value={outcome.comments || ''}
                          onChange={(e) => updateOutcome(index, 'comments', e.target.value)}
                          placeholder="Add rating comments..."
                          className="min-h-[80px]"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                          {outcome.comments}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Competencies Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Competencies</CardTitle>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={addCompetency}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Competency
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {competencies.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No competencies defined yet
              </p>
            ) : (
              <div className="grid gap-2">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-muted rounded-lg font-medium text-sm">
                  <div className="col-span-4">Competency</div>
                  <div className="col-span-1 text-center">Rating</div>
                  <div className="col-span-7">Comments</div>
                </div>
                
                {/* Competency Rows */}
                {competencies.map((comp, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 px-4 py-3 border rounded-lg items-center"
                  >
                    <div className="col-span-4">
                      {isEditing ? (
                        <div className="flex gap-2 items-center">
                          <Input
                            value={comp.competency}
                            onChange={(e) => updateCompetency(index, 'competency', e.target.value)}
                            placeholder="Competency name..."
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCompetency(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <span className="font-medium">{comp.competency}</span>
                      )}
                    </div>
                    
                    <div className="col-span-1 text-center">
                      {isEditing ? (
                        <Select
                          value={comp.rating || ''}
                          onValueChange={(value) => updateCompetency(index, 'rating', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : comp.rating ? (
                        <Badge 
                          variant="outline" 
                          className={`${getRatingColor(comp.rating)}`}
                        >
                          {comp.rating}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                    
                    <div className="col-span-7">
                      {isEditing ? (
                        <Input
                          value={comp.comments || ''}
                          onChange={(e) => updateCompetency(index, 'comments', e.target.value)}
                          placeholder="Add comments..."
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {comp.comments || '-'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}