import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { TrendingUp, Target, Clock, AlertTriangle } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics & Trends</h2>
        <p className="text-textSecondary text-sm mt-1">Historical operations data and AI performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Accuracy', value: '94.2%', icon: Target, trend: '+2.1%' },
          { label: 'Avg Response', value: '1m 24s', icon: Clock, trend: '-12s' },
          { label: 'Incidents Avoided', value: '142', icon: AlertTriangle, trend: '+14' },
          { label: 'Peak Density', value: '98%', icon: TrendingUp, trend: '-2%' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg"><Icon size={20} className="text-primary" /></div>
                  <span className={`text-xs font-semibold ${stat.trend.startsWith('+') ? 'text-accent' : 'text-primary'}`}>
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <p className="text-sm text-textSecondary mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Historical Crowd Density (24h)</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center border-t border-borderWhite/10">
            <div className="w-full h-full p-4 flex items-end gap-2" aria-label="Bar chart showing crowd density">
              {[40, 55, 30, 80, 95, 85, 60, 45, 70, 90, 65, 50].map((h, i) => (
                <div key={i} className="flex-1 bg-primary/50 hover:bg-primary transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Prediction Accuracy Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center border-t border-borderWhite/10">
            <div className="w-full h-full relative p-4" aria-label="Line chart showing prediction accuracy">
               <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0,80 Q20,90 40,50 T80,30 T100,20" fill="none" stroke="currentColor" className="text-accent" strokeWidth="2" />
               </svg>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
