import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HeatmapSector } from '../../types';
import HeatmapNode from './HeatmapNode';

interface StadiumMapProps {
  data: HeatmapSector[] | null;
  activeRoute?: { start: string; end: string } | null;
  showHeatmap: boolean;
  hoveredSector: HeatmapSector | null;
  setHoveredSector: (sector: HeatmapSector | null) => void;
  nodeCoords: Record<string, { x: number, y: number }>;
}

const StadiumMap = memo(({ data, activeRoute, showHeatmap, hoveredSector, setHoveredSector, nodeCoords }: StadiumMapProps) => {
  
  const getRoutePath = () => {
    if (!activeRoute) return null;
    
    let startNode = { x: 100, y: 300 }; // default West
    if (activeRoute.start.includes('North')) startNode = nodeCoords['N1'];
    if (activeRoute.start.includes('East')) startNode = nodeCoords['E1'];
    if (activeRoute.start.includes('South')) startNode = nodeCoords['S1'];

    let endNode = { x: 400, y: 300 }; // Center pitch
    if (activeRoute.end.includes('100')) endNode = nodeCoords['N2'];
    if (activeRoute.end.includes('300')) endNode = nodeCoords['S1'];

    const dx = endNode.x - startNode.x;
    const dy = endNode.y - startNode.y;
    const cx = startNode.x + dx / 2 + 50; 
    const cy = startNode.y + dy / 2 - 50;

    return `M ${startNode.x} ${startNode.y} Q ${cx} ${cy} ${endNode.x} ${endNode.y}`;
  };

  return (
    <div className="w-full h-full max-h-[600px] aspect-video relative z-0">
      <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-2xl">
        <g className="stroke-textPrimary" strokeOpacity="0.1" strokeWidth="2" fill="none">
          <circle cx="400" cy="300" r="250" />
          <circle cx="400" cy="300" r="200" />
          <circle cx="400" cy="300" r="150" />
          
          <rect x="300" y="220" width="200" height="160" rx="4" strokeOpacity="0.15" stroke="#10b981" strokeWidth="2" fill="#10b981" fillOpacity="0.02" />
          <line x1="400" y1="220" x2="400" y2="380" strokeOpacity="0.15" stroke="#10b981" strokeWidth="2" />
          <circle cx="400" cy="300" r="25" strokeOpacity="0.15" stroke="#10b981" strokeWidth="2" />
          <rect x="300" y="260" width="30" height="80" strokeOpacity="0.15" stroke="#10b981" strokeWidth="1.5" />
          <rect x="470" y="260" width="30" height="80" strokeOpacity="0.15" stroke="#10b981" strokeWidth="1.5" />
          
          <line x1="400" y1="50" x2="400" y2="150" strokeOpacity="0.05" strokeDasharray="4 4" />
          <line x1="400" y1="450" x2="400" y2="550" strokeOpacity="0.05" strokeDasharray="4 4" />
          <line x1="150" y1="300" x2="250" y2="300" strokeOpacity="0.05" strokeDasharray="4 4" />
          <line x1="550" y1="300" x2="650" y2="300" strokeOpacity="0.05" strokeDasharray="4 4" />
        </g>

        <g className="fill-textPrimary" fillOpacity="0.4" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="2">
          <text x="400" y="40">NORTH GATE</text>
          <text x="400" y="570">SOUTH GATE</text>
          <text x="760" y="305">EAST GATE</text>
          <text x="40" y="305">WEST GATE</text>
        </g>

        <AnimatePresence>
          {activeRoute && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <path 
                d={getRoutePath()!} 
                fill="none" 
                stroke="#0ea5e9" 
                strokeWidth="6" 
                strokeLinecap="round"
                strokeDasharray="10, 10"
                className="animate-[dash_2s_linear_infinite]"
              />
              <path 
                d={getRoutePath()!} 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="12" 
                strokeOpacity="0.3"
                strokeLinecap="round"
              />
            </motion.g>
          )}
        </AnimatePresence>

        {showHeatmap && data?.map((sector: HeatmapSector) => {
          const coords = nodeCoords[sector.id] || { x: 400, y: 300 };
          return (
            <HeatmapNode 
              key={sector.id}
              {...sector}
              x={coords.x}
              y={coords.y}
              onHover={setHoveredSector}
              isHovered={hoveredSector?.id === sector.id}
            />
          );
        })}
      </svg>
    </div>
  );
});

StadiumMap.displayName = 'StadiumMap';

export default StadiumMap;
