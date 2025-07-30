'use client';

import React, { useState, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Globe, MapPin, Users, X } from 'lucide-react';
import { NotionEmployee } from '@/lib/notionEmployeeService';

interface DetailedTeamWorldMapProps {
  employees: NotionEmployee[];
}

// Detailed timezone to location mapping with coordinates and state/region info
const timezoneToLocation: Record<string, {
  name: string;
  country: string;
  state?: string;
  coordinates: [number, number]; // [longitude, latitude]
  region: string;
}> = {
  // United States - East Coast
  'EST': {
    name: 'Eastern US',
    country: 'United States',
    state: 'Eastern States',
    coordinates: [-77.0369, 38.9072], // Washington DC area
    region: 'North America'
  },
  'EDT': {
    name: 'Eastern US',
    country: 'United States', 
    state: 'Eastern States',
    coordinates: [-77.0369, 38.9072],
    region: 'North America'
  },
  
  // United States - Central
  'CST': {
    name: 'Central US',
    country: 'United States',
    state: 'Central States', 
    coordinates: [-93.2650, 44.9778], // Minneapolis area
    region: 'North America'
  },
  'CDT': {
    name: 'Central US',
    country: 'United States',
    state: 'Central States',
    coordinates: [-93.2650, 44.9778],
    region: 'North America'
  },
  
  // United States - Mountain
  'MST': {
    name: 'Mountain US',
    country: 'United States',
    state: 'Mountain States',
    coordinates: [-104.9903, 39.7392], // Denver area
    region: 'North America'
  },
  'MDT': {
    name: 'Mountain US', 
    country: 'United States',
    state: 'Mountain States',
    coordinates: [-104.9903, 39.7392],
    region: 'North America'
  },
  
  // United States - West Coast
  'PST': {
    name: 'Pacific US',
    country: 'United States',
    state: 'Pacific States',
    coordinates: [-122.4194, 37.7749], // San Francisco area
    region: 'North America'
  },
  'PDT': {
    name: 'Pacific US',
    country: 'United States', 
    state: 'Pacific States',
    coordinates: [-122.4194, 37.7749],
    region: 'North America'
  },
  
  // Europe
  'CET': {
    name: 'Central Europe',
    country: 'Germany',
    state: 'Central European Region',
    coordinates: [10.4515, 51.1657], // Germany center
    region: 'Europe'
  },
  'CEST': {
    name: 'Central Europe',
    country: 'Germany',
    state: 'Central European Region', 
    coordinates: [10.4515, 51.1657],
    region: 'Europe'
  },
  
  // United Kingdom
  'GMT': {
    name: 'London',
    country: 'United Kingdom',
    state: 'England',
    coordinates: [-0.1276, 51.5074], // London
    region: 'Europe'
  },
  'BST': {
    name: 'London',
    country: 'United Kingdom',
    state: 'England', 
    coordinates: [-0.1276, 51.5074],
    region: 'Europe'
  },
  
  // Asia Pacific
  'JST': {
    name: 'Tokyo',
    country: 'Japan',
    state: 'Kantō Region',
    coordinates: [139.6503, 35.6762], // Tokyo
    region: 'Asia Pacific'
  },
  
  'IST': {
    name: 'India',
    country: 'India',
    state: 'Maharashtra',
    coordinates: [72.8777, 19.0760], // Mumbai
    region: 'Asia Pacific'
  },
  
  'AEST': {
    name: 'Sydney',
    country: 'Australia',
    state: 'New South Wales',
    coordinates: [151.2093, -33.8688], // Sydney
    region: 'Asia Pacific'
  },
  'AEDT': {
    name: 'Sydney',
    country: 'Australia',
    state: 'New South Wales',
    coordinates: [151.2093, -33.8688],
    region: 'Asia Pacific'
  },
  
  // South America
  'BRT': {
    name: 'São Paulo',
    country: 'Brazil', 
    state: 'São Paulo State',
    coordinates: [-46.6333, -23.5505], // São Paulo
    region: 'South America'
  },
  
  'ART': {
    name: 'Buenos Aires',
    country: 'Argentina',
    state: 'Buenos Aires Province', 
    coordinates: [-58.3816, -34.6037], // Buenos Aires
    region: 'South America'
  },
  
  // Africa
  'CAT': {
    name: 'Cape Town',
    country: 'South Africa',
    state: 'Western Cape',
    coordinates: [18.4241, -33.9249], // Cape Town
    region: 'Africa'
  },
  
  'WAT': {
    name: 'Lagos',
    country: 'Nigeria', 
    state: 'Lagos State',
    coordinates: [3.3792, 6.5244], // Lagos
    region: 'Africa'
  },
  
  'EAT': {
    name: 'Nairobi',
    country: 'Kenya',
    state: 'Nairobi County',
    coordinates: [36.8219, -1.2921], // Nairobi
    region: 'Africa'
  }
};

// World map topology URL (using Natural Earth data)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function DetailedTeamWorldMap({ employees }: DetailedTeamWorldMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    location: string;
    employees: NotionEmployee[];
    info: typeof timezoneToLocation[string];
  } | null>(null);

  // Process employee data by location
  const locationData = useMemo(() => {
    const locations: Record<string, {
      info: typeof timezoneToLocation[string];
      employees: NotionEmployee[];
    }> = {};

    employees.forEach(employee => {
      if (employee.timezone && timezoneToLocation[employee.timezone]) {
        const locationInfo = timezoneToLocation[employee.timezone];
        const key = `${locationInfo.country}-${locationInfo.state || locationInfo.name}`;
        
        if (!locations[key]) {
          locations[key] = {
            info: locationInfo,
            employees: []
          };
        }
        locations[key].employees.push(employee);
      }
    });

    return Object.values(locations);
  }, [employees]);

  const getMarkerSize = (employeeCount: number) => {
    if (employeeCount <= 1) return 8;
    if (employeeCount <= 3) return 12;
    if (employeeCount <= 5) return 16;
    if (employeeCount <= 10) return 20;
    return 24;
  };

  const getMarkerColor = (employeeCount: number) => {
    if (employeeCount <= 1) return '#6b7280'; // gray-500
    if (employeeCount <= 3) return '#4b5563'; // gray-600  
    if (employeeCount <= 5) return '#374151'; // gray-700
    if (employeeCount <= 10) return '#1f2937'; // gray-800
    return '#111827'; // gray-900
  };

  const handleMarkerClick = (location: any) => {
    setSelectedLocation({
      location: `${location.info.name}, ${location.info.state || location.info.country}`,
      employees: location.employees,
      info: location.info
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Global Team Distribution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Detailed view of team member locations by state/region
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-96">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 120,
              center: [0, 20]
            }}
            width={800}
            height={400}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#374151"
                      stroke="#1f2937"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { 
                          outline: 'none',
                          fill: '#4b5563'
                        },
                        pressed: { outline: 'none' }
                      }}
                    />
                  ))
                }
              </Geographies>
              
              {/* Location markers */}
              {locationData.map((location, index) => (
                <Marker
                  key={index}
                  coordinates={location.info.coordinates}
                >
                  <circle
                    r={getMarkerSize(location.employees.length)}
                    fill={getMarkerColor(location.employees.length)}
                    stroke="#ffffff"
                    strokeWidth={2}
                    style={{
                      cursor: 'pointer',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}
                    onClick={() => handleMarkerClick(location)}
                  />
                  {/* Inner glow for larger markers */}
                  {location.employees.length > 3 && (
                    <circle
                      r={getMarkerSize(location.employees.length) - 4}
                      fill={getMarkerColor(location.employees.length)}
                      opacity={0.6}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleMarkerClick(location)}
                    />
                  )}
                  {/* Pulse animation for clickable markers */}
                  <circle
                    r={getMarkerSize(location.employees.length) + 8}
                    fill={getMarkerColor(location.employees.length)}
                    opacity={0.3}
                    style={{
                      cursor: 'pointer',
                      animation: 'pulse 2s infinite'
                    }}
                    onClick={() => handleMarkerClick(location)}
                  />
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* Location Detail Modal */}
          <Dialog open={!!selectedLocation} onOpenChange={() => setSelectedLocation(null)}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  {selectedLocation?.location}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {selectedLocation?.employees.length} team member{selectedLocation?.employees.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-muted-foreground">
                    {selectedLocation?.info.region}
                  </span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4">
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
                  {selectedLocation?.employees.map((emp: NotionEmployee, index) => (
                    <div 
                      key={emp.notionId} 
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border"
                    >
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-base">{emp.name}</span>
                          {emp.team && emp.team.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {emp.team[0]}
                            </Badge>
                          )}
                        </div>
                        
                        {emp.position && (
                          <span className="text-sm text-muted-foreground mb-2">
                            {emp.position}
                          </span>
                        )}
                        
                        {emp.tags && emp.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {emp.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {emp.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{emp.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <Badge className="bg-gray-900/20 text-gray-400 border-gray-800">
                          {emp.timezone}
                        </Badge>
                        {emp.startDate && (
                          <span className="text-xs text-muted-foreground">
                            Since {new Date(emp.startDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={() => setSelectedLocation(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Enhanced Legend */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6b7280' }}></div>
              <span>1 employee</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#4b5563' }}></div>
              <span>2-3 employees</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#374151' }}></div>
              <span>4-5 employees</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#1f2937' }}></div>
              <span>6-10 employees</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#111827' }}></div>
              <span>10+ employees</span>
            </div>
          </div>
          
          {/* Location summary */}
          <div className="text-center text-xs text-muted-foreground">
            Team members across {locationData.length} location{locationData.length !== 1 ? 's' : ''} 
            {locationData.length > 0 && (
              <span className="ml-2">
                • {locationData.reduce((acc, loc) => acc + loc.employees.length, 0)} total employees
              </span>
            )}
            <div className="mt-1 font-medium text-gray-400">
              Click any location marker to see team members
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}