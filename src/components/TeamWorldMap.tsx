'use client';

import React, { useState, useMemo } from 'react';
import WorldMap from 'react-svg-worldmap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { NotionEmployee } from '@/lib/notionEmployeeService';

interface TeamWorldMapProps {
  employees: NotionEmployee[];
}

// Mapping from timezones to country codes (ISO 3166-1 alpha-2)
const timezoneToCountry: Record<string, string> = {
  'EST': 'US', // Eastern Standard Time - United States
  'PST': 'US', // Pacific Standard Time - United States
  'MST': 'US', // Mountain Standard Time - United States
  'CST': 'US', // Central Standard Time - United States
  'CEST': 'DE', // Central European Summer Time - Germany (representing EU)
  'CET': 'DE',  // Central European Time - Germany
  'GMT': 'GB',  // Greenwich Mean Time - United Kingdom
  'BST': 'GB',  // British Summer Time - United Kingdom
  'JST': 'JP',  // Japan Standard Time - Japan
  'IST': 'IN',  // India Standard Time - India
  'AEST': 'AU', // Australian Eastern Standard Time - Australia
  'AEDT': 'AU', // Australian Eastern Daylight Time - Australia
  'CAT': 'ZA',  // Central Africa Time - South Africa
  'WAT': 'NG',  // West Africa Time - Nigeria
  'EAT': 'KE',  // East Africa Time - Kenya
  'BRT': 'BR',  // Brasília Time - Brazil
  'ART': 'AR',  // Argentina Time - Argentina
  'COT': 'CO',  // Colombia Time - Colombia
  'PET': 'PE',  // Peru Time - Peru
};

// Color scheme for different employee counts
const getColor = (count: number): string => {
  if (count === 0) return '#374151'; // gray-700 - no employees
  if (count <= 2) return '#f97316'; // orange-500 - few employees
  if (count <= 5) return '#ea580c'; // orange-600 - some employees
  if (count <= 10) return '#c2410c'; // orange-700 - many employees
  return '#9a3412'; // orange-800 - lots of employees
};

export default function TeamWorldMap({ employees }: TeamWorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: any } | null>(null);

  // Process employee data to get country-based counts and employee lists
  const mapData = useMemo(() => {
    const countryData: Record<string, { count: number; employees: NotionEmployee[] }> = {};
    
    employees.forEach(employee => {
      if (employee.timezone) {
        const countryCode = timezoneToCountry[employee.timezone];
        if (countryCode) {
          if (!countryData[countryCode]) {
            countryData[countryCode] = { count: 0, employees: [] };
          }
          countryData[countryCode].count++;
          countryData[countryCode].employees.push(employee);
        }
      }
    });

    // Convert to format expected by react-svg-worldmap
    return Object.entries(countryData).map(([country, data]) => ({
      country,
      value: data.count,
      employees: data.employees,
      color: getColor(data.count)
    }));
  }, [employees]);

  const handleMouseEnter = (event: React.MouseEvent, data: any) => {
    setHoveredCountry(data.country);
    setTooltip({
      x: event.clientX,
      y: event.clientY,
      data
    });
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
    setTooltip(null);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltip) {
      setTooltip(prev => prev ? {
        ...prev,
        x: event.clientX,
        y: event.clientY
      } : null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Global Team Distribution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Team members by location based on timezone data
        </p>
      </CardHeader>
      <CardContent>
        <div 
          className="relative w-full h-96 flex items-center justify-center"
          onMouseMove={handleMouseMove}
        >
          <WorldMap
            color="#374151"
            title=""
            value-suffix="employees"
            size="lg"
            data={mapData}
            onClickFunction={() => {}} // No click action needed
            styleFunction={(context: any) => {
              const baseStyle = {
                fill: context.color || '#374151',
                stroke: '#1f2937',
                strokeWidth: 0.5,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              };
              
              if (hoveredCountry === context.countryCode) {
                return {
                  ...baseStyle,
                  fill: context.color ? `${context.color}dd` : '#374151dd',
                  strokeWidth: 1.5,
                  filter: 'brightness(1.1)'
                };
              }
              
              return baseStyle;
            }}
            richInteraction={true}
            tooltipTextFunction={(countryCode: string, countryName: string, value: number) => {
              const countryData = mapData.find(d => d.country === countryCode);
              if (!countryData) return '';
              
              return `${countryName}: ${value} employee${value !== 1 ? 's' : ''}`;
            }}
          />
          
          {/* Custom tooltip */}
          {tooltip && (
            <div
              className="fixed z-50 pointer-events-none bg-card border border-border rounded-lg shadow-lg p-3 max-w-xs"
              style={{
                left: tooltip.x + 10,
                top: tooltip.y - 10,
                transform: 'translateY(-100%)'
              }}
            >
              <div className="font-semibold text-sm mb-2">
                {tooltip.data.employees.length} team member{tooltip.data.employees.length !== 1 ? 's' : ''}
              </div>
              <div className="space-y-1">
                {tooltip.data.employees.slice(0, 5).map((emp: NotionEmployee) => (
                  <div key={emp.notionId} className="text-xs text-muted-foreground">
                    <span className="font-medium">{emp.name}</span>
                    {emp.timezone && (
                      <span className="ml-2 opacity-75">({emp.timezone})</span>
                    )}
                  </div>
                ))}
                {tooltip.data.employees.length > 5 && (
                  <div className="text-xs text-muted-foreground font-medium">
                    +{tooltip.data.employees.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f97316' }}></div>
            <span>1-2 employees</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ea580c' }}></div>
            <span>3-5 employees</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#c2410c' }}></div>
            <span>6-10 employees</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#9a3412' }}></div>
            <span>10+ employees</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}