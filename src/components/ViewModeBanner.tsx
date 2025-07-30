'use client';

import React from 'react';
import { Eye, X } from 'lucide-react';
import { useViewMode } from '@/contexts/ViewModeContext';
import { Button } from '@/components/ui/button';

export default function ViewModeBanner() {
  const { viewingAsEmployee, setViewingAsEmployee, isViewingAs } = useViewMode();

  if (!isViewingAs || !viewingAsEmployee) {
    return null;
  }

  const handleStopViewing = () => {
    setViewingAsEmployee(null);
    // Refresh the page to reset to actual view
    window.location.href = window.location.origin;
  };

  return (
    <div className="bg-yellow-500 text-black px-4 py-3 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="h-5 w-5 animate-pulse" />
          <div>
            <span className="font-medium">
              Viewing site as: <strong className="font-bold">{viewingAsEmployee.name}</strong>
            </span>
            <span className="text-yellow-900 ml-2">
              ({viewingAsEmployee.position || 'No position'})
            </span>
            {viewingAsEmployee.team && viewingAsEmployee.team.length > 0 && (
              <span className="text-yellow-900 ml-2">
                • {viewingAsEmployee.team.join(', ')}
              </span>
            )}
          </div>
        </div>
        
        <Button
          size="sm"
          variant="secondary"
          onClick={handleStopViewing}
          className="bg-white text-black hover:bg-gray-100"
        >
          <X className="h-4 w-4 mr-1" />
          Exit View Mode
        </Button>
      </div>
    </div>
  );
}