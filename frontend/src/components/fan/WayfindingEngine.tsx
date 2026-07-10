import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Navigation, MapPin } from 'lucide-react';
import Button from '../ui/Button';

interface WayfindingEngineProps {
  onRouteSelect: (start: string, end: string) => void;
}

export default function WayfindingEngine({ onRouteSelect }: WayfindingEngineProps) {
  const [startPoint, setStartPoint] = useState('Gate B');
  const [endPoint, setEndPoint] = useState('Section 300');

  const startOptions = [
    'Gate A (North)',
    'Gate B (East)',
    'Gate C (South)',
    'Gate D (West)',
  ];

  const endOptions = [
    'Section 100 - Lower Bowl',
    'Section 200 - Club Level',
    'Section 300 - General Admission',
    'Main Concourse Food Court',
    'VIP Lounge'
  ];

  const handleCalculateRoute = () => {
    onRouteSelect(startPoint, endPoint);
  };

  return (
    <Card className="border border-info/20 bg-surfaceHighlight/10 mt-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-info via-primary to-transparent" />
      <CardContent className="p-5 flex flex-col gap-5">
        <div className="flex items-center gap-2 text-info">
          <Navigation className="w-5 h-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Precision Wayfinding & Navigation Engine</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-textSecondary uppercase tracking-widest font-semibold">1. Choose Entry / Start Point</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-textSecondary" />
              <select 
                className="w-full bg-surface/50 border border-borderWhite/20 rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-info outline-none appearance-none cursor-pointer"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                aria-label="Start Point"
              >
                {startOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-textSecondary uppercase tracking-widest font-semibold">2. Select Destination Target</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
              <select 
                className="w-full bg-surface/50 border border-borderWhite/20 rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-info outline-none appearance-none cursor-pointer"
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
                aria-label="Destination"
              >
                {endOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-4 border-t border-borderWhite/20">
          <div>
            <div className="text-xs text-textSecondary uppercase tracking-wider mb-1">Estimated Transit Time</div>
            <div className="text-xl font-bold text-textPrimary flex items-baseline gap-1">
              12 <span className="text-sm font-normal text-textSecondary">mins</span>
            </div>
          </div>
          <Button onClick={handleCalculateRoute} className="bg-info hover:bg-info/80 text-white font-semibold">
            Generate Safest Route
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
