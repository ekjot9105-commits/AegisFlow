import { fetchHeatmapData } from '../../services/dashboard';
import type { HeatmapSector } from '../../types';
import StadiumMap from './StadiumMap';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import SkeletonLoader from '../ui/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface StadiumHeatmapProps {
  activeRoute?: { start: string; end: string } | null;
  title?: string;
  subtitle?: string;
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'critical': return '#ef4444'; // danger
    case 'high': return '#f59e0b'; // warning
    case 'medium': return '#22c55e'; // primary
    default: return '#10b981'; // safe
  }
};

// Predefined SVG coordinates for sections (100x100 coordinate system mapped to viewBox)
const nodeCoords: Record<string, { x: number, y: number }> = {
  'N1': { x: 400, y: 100 },
  'N2': { x: 500, y: 150 },
  'E1': { x: 700, y: 300 },
  'S1': { x: 400, y: 500 },
  'W1': { x: 100, y: 300 },
};

export default function StadiumHeatmap({ activeRoute, title = "Live Stadium Heatmap", subtitle }: StadiumHeatmapProps) {
  const [data, setData] = useState<HeatmapSector[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredSector, setHoveredSector] = useState<HeatmapSector | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  const [predictionHorizon, setPredictionHorizon] = useState(0);

  // Fallback function if SSE fails or if prediction horizon is set
  const fetchMockData = async (horizon: number = 0) => {
    try {
      if (horizon > 0) {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/api/v1/dashboard/predict?horizon=${horizon}`);
        const json = await res.json();
        // map prediction data back into the expected heatmap structure
        const predictionData = json.data.map((p: Record<string, string | number>) => ({
            id: p.id,
            name: p.name,
            density: p.predicted_density,
            risk: p.risk_trend === 'critical' ? 'critical' : p.risk_trend === 'increasing' ? 'high' : p.risk_trend === 'decreasing' ? 'low' : 'medium',
            prediction: `t+${horizon}m AI Prediction`,
            queue_time: `${p.predicted_queue_time} mins`,
            recommendation: 'Predicted State',
            confidence: 85,
            expected_crowd: '--'
        }));
        setData(predictionData);
      } else {
        const mockData = await fetchHeatmapData();
        setData(mockData);
      }
    } catch (e) {
      console.error('Failed to fetch data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let interval: ReturnType<typeof setInterval> | null = null;

    if (predictionHorizon === 0) {
        // Attempt Server-Sent Events (SSE) connection for extreme efficiency for live data
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        eventSource = new EventSource(`${apiUrl}/api/v1/dashboard/heatmap/stream`);
        
        eventSource.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            setData(parsed);
            setIsLoading(false);
          } catch (err) {
            console.error("SSE parse error", err);
          }
        };

        eventSource.onerror = () => {
          // If backend SSE is down, fallback to mock polling
          console.warn("SSE connection failed, falling back to mock polling.");
          eventSource?.close();
          fetchMockData(0);
          interval = setInterval(() => fetchMockData(0), 5000);
        };
    } else {
        // Fetch predictive data
        fetchMockData(predictionHorizon);
    }

    return () => {
      if (eventSource) eventSource.close();
      if (interval) clearInterval(interval);
    };
  }, [predictionHorizon]);

  if (isLoading) {
    return <SkeletonLoader className="h-96 w-full" />;
  }


  // Active Route logic is handled in StadiumMap now

  return (
    <Card className="col-span-1 lg:col-span-2 relative overflow-hidden h-full min-h-[500px] border border-primary/20 bg-surfaceHighlight/10">
      <CardHeader className="flex flex-row items-start justify-between z-10 relative">
        <div>
          <CardTitle className="text-primary uppercase tracking-widest text-sm mb-1 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {title}
          </CardTitle>
          {subtitle && <h2 className="text-xl font-bold text-textPrimary tracking-wide">{subtitle}</h2>}
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 z-10">
          {/* Time Slider */}
          <div className="flex items-center gap-3 bg-surface/80 p-2 rounded-lg border border-borderWhite/10 shadow-sm backdrop-blur">
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Time</span>
            <div className="flex gap-1">
              {[0, 5, 10, 15].map(time => (
                <button
                  key={time}
                  onClick={() => setPredictionHorizon(time)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                    predictionHorizon === time 
                      ? 'bg-primary text-bg-base' 
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {time === 0 ? 'LIVE' : `+${time}m`}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="showHeatmap" className="accent-primary" checked={showHeatmap} onChange={(e) => setShowHeatmap(e.target.checked)} />
            <label htmlFor="showHeatmap" className="text-sm font-medium text-textSecondary cursor-pointer">Heatmap</label>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="h-[calc(100%-5rem)] relative p-0 flex items-center justify-center overflow-hidden">
        
        {/* Screen Reader Only Table */}
        <div className="sr-only">
          <table>
            <caption>Live Stadium Sector Status</caption>
            <thead>
              <tr><th scope="col">Sector Name</th><th scope="col">Crowd Density</th><th scope="col">Risk Level</th></tr>
            </thead>
            <tbody>
              {data?.map((sector: HeatmapSector) => (
                <tr key={sector.id}><td>{sector.name} ({sector.id})</td><td>{sector.density}%</td><td>{sector.risk}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dynamic SVG Map */}
        <StadiumMap
          data={data}
          activeRoute={activeRoute}
          showHeatmap={showHeatmap}
          hoveredSector={hoveredSector}
          setHoveredSector={setHoveredSector}
          nodeCoords={nodeCoords}
        />

        {/* Heatmap Legend */}
        <div className="absolute bottom-6 right-6 glass-panel bg-surface/80 p-4 rounded-xl border border-borderWhite/20 shadow-lg text-xs z-10 backdrop-blur-md">
          <div className="font-bold uppercase tracking-wider text-textSecondary mb-3">Heatmap Key</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10b981]" /> Smooth Flow / Safe</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f59e0b]" /> Moderate / Cleaning</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ef4444]" /> Congested / Active Incident</div>
          </div>
        </div>

        {/* Hover Details Panel */}
        <AnimatePresence>
          {hoveredSector && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute glass-panel p-5 rounded-xl flex flex-col gap-4 shadow-2xl z-20 pointer-events-none min-w-[300px]"
              style={{ left: `50%`, top: `20px`, transform: `translateX(-50%)` }}
            >
              {/* Top Row: Basic Info */}
              <div className="flex gap-6 items-center border-b border-borderWhite/10 pb-3">
                <div>
                  <div className="text-xs text-textSecondary uppercase tracking-wider">{hoveredSector.name}</div>
                  <div className="font-bold text-lg text-textPrimary">{hoveredSector.id}</div>
                </div>
                <div className="border-l border-borderWhite/10 pl-4">
                  <div className="text-xs text-textSecondary uppercase">Density</div>
                  <div className="font-bold text-textPrimary">{hoveredSector.density}%</div>
                </div>
                <div className="border-l border-borderWhite/10 pl-4">
                  <div className="text-xs text-textSecondary uppercase">Risk Level</div>
                  <div className="font-bold capitalize" style={{ color: getRiskColor(hoveredSector.risk) }}>{hoveredSector.risk}</div>
                </div>
              </div>

              {/* Bottom Row: AI Insights */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-textSecondary block mb-1">AI Prediction</span>
                  <span className="font-medium text-textPrimary">{hoveredSector.prediction || 'Calculating...'}</span>
                </div>
                <div>
                  <span className="text-textSecondary block mb-1">Queue Time</span>
                  <span className="font-medium text-textPrimary">{hoveredSector.queue_time || '--'}</span>
                </div>
                <div>
                  <span className="text-textSecondary block mb-1">10m Expected Crowd</span>
                  <span className="font-medium text-textPrimary">{hoveredSector.expected_crowd || '--'}</span>
                </div>
                <div>
                  <span className="text-textSecondary block mb-1">Confidence</span>
                  <span className="font-medium text-accent">{hoveredSector.confidence ? `${hoveredSector.confidence}%` : '--'}</span>
                </div>
                <div className="col-span-2 mt-1 p-2 bg-primary/10 rounded border border-primary/20">
                  <span className="text-primary font-semibold block mb-1">Actionable Recommendation</span>
                  <span className="text-textPrimary">{hoveredSector.recommendation || 'No action needed'}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
