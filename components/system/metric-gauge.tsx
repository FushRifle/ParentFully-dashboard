import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SystemMetric } from './data';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StatusBadge } from './status-badge';

interface MetricGaugeProps {
     metric: SystemMetric;
     compact?: boolean;
}

export const MetricGauge: React.FC<MetricGaugeProps> = ({ metric, compact = false }) => {
     const getStatusColor = () => {
          if (metric.value >= metric.threshold) return 'bg-red-500';
          if (metric.value >= metric.threshold * 0.8) return 'bg-amber-500';
          return 'bg-emerald-500';
     };

     const getTrendIcon = () => {
          switch (metric.trend) {
               case 'up':
                    return <TrendingUp size={14} color="#10b981" />;
               case 'down':
                    return <TrendingDown size={14} color="#ef4444" />;
               default:
                    return <Minus size={14} color="#6b7280" />;
          }
     };

     return (
          <Card className={`h-full ${compact ? 'p-4' : 'p-6'}`}>
               <CardContent className="flex flex-col gap-4 p-0">
                    <div className="flex items-center justify-between">
                         <span className="text-sm font-medium">{metric.name}</span>
                         {!compact && getTrendIcon()}
                    </div>

                    <div className="flex flex-col gap-2">
                         <div className="flex items-end justify-between">
                              <span className={`font-bold leading-none ${compact ? 'text-2xl' : 'text-3xl'}`}>
                                   {metric.value}{metric.unit}
                              </span>
                              {!compact && (
                                   <span className="text-xs text-muted-foreground">Max: {metric.max}{metric.unit}</span>
                              )}
                         </div>

                         <div className={`h-2 w-full overflow-hidden rounded-full bg-muted ${compact ? 'mt-1' : 'mt-2'}`}>
                              <div
                                   className={`h-full rounded-full transition-all ${getStatusColor()}`}
                                   style={{ width: `${Math.min(100, (metric.value / metric.max) * 100)}%` }}
                              />
                         </div>

                         {!compact && (
                              <div className="flex justify-between">
                                   <span className="text-xs text-muted-foreground">Threshold: {metric.threshold}{metric.unit}</span>
                                   <StatusBadge status={metric.status} size="sm" withText={false} />
                              </div>
                         )}
                    </div>
               </CardContent>
          </Card>
     );
};