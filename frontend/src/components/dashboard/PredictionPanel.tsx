import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { BrainCircuit, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PredictionPanel() {
  return (
    <Card className="col-span-1 lg:col-span-2 bg-gradient-to-br from-surface to-surfaceHighlight/50 border-primary/20 min-h-[200px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <BrainCircuit size={20} />
          AI Copilot Prediction Active
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-borderWhite/10">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Zap size={16} className="text-warning" /> Critical Alert: Gate 4 Overcrowding
              </h4>
              <p className="text-sm text-textSecondary leading-relaxed">
                AI predicts Gate 4 density will exceed 110% capacity in exactly 8 minutes due to simultaneous metro arrivals.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button size="sm" variant="primary">Execute Mitigation Plan</Button>
              <Button size="sm" variant="ghost">View Details</Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 flex flex-col justify-center items-center p-4 border-l md:border-l-borderWhite/10 border-t md:border-t-0 border-borderWhite/10">
            <div className="relative w-24 h-24 mb-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                <motion.circle 
                  cx="50" cy="50" r="40" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  fill="none"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * 0.94) }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  className="text-accent"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-bold">94%</span>
              </div>
            </div>
            <span className="text-xs text-textSecondary uppercase tracking-wider font-semibold">AI Confidence</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
