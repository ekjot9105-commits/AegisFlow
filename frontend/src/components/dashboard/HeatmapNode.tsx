import { memo } from 'react';
import type { HeatmapSector } from '../../types';

export interface HeatmapNodeProps extends HeatmapSector {
  x: number;
  y: number;
  isHovered: boolean;
  onHover: (sector: HeatmapSector | null) => void;
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'critical': return '#ef4444'; // danger
    case 'high': return '#f59e0b'; // warning
    case 'medium': return '#22c55e'; // primary
    default: return '#10b981'; // safe
  }
};

const HeatmapNode = memo(({ id, x, y, risk, name, density, prediction, recommendation, confidence, expected_crowd, queue_time, onHover, isHovered }: HeatmapNodeProps) => {
  const color = getRiskColor(risk);
  
  return (
    <g 
      onMouseEnter={() => onHover({ id, name, density, risk, prediction, recommendation, confidence, expected_crowd, queue_time } as HeatmapSector)} 
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer outline-none"
      tabIndex={0}
      role="button"
      aria-label={`Sector ${name}, ${density}% full, Risk level ${risk}`}
    >
      {/* Outer Pulse */}
      {isHovered && (
        <circle cx={x} cy={y} r="20" fill={color} fillOpacity="0.2" className="animate-ping" />
      )}
      
      {/* Base Node */}
      <circle cx={x} cy={y} r="10" fill={color} stroke="var(--bg-surface)" strokeWidth="2" className="transition-all duration-300 hover:scale-125" style={{ transformOrigin: `${x}px ${y}px` }} />
      
      {/* Label */}
      <text x={x} y={y + 25} fill="var(--text-primary)" fontSize="12" textAnchor="middle" fontWeight="bold" className="pointer-events-none drop-shadow-md">
        {id}
      </text>
    </g>
  );
});

export default HeatmapNode;
