import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnalyticsMetric } from './data';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
     metric: AnalyticsMetric;
     compact?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, compact = false }) => {
     const getChangeIcon = () => {
          switch (metric.changeType) {
               case 'increase':
                    return <TrendingUp size={14} color="#10b981" />;
               case 'decrease':
                    return <TrendingDown size={14} color="#ef4444" />;
               default:
                    return <Minus size={14} color="#6b7280" />;
          }
     };

     const getChangeVariant = (): 'default' | 'secondary' | 'destructive' | 'outline' => {
          switch (metric.changeType) {
               case 'increase':
                    return 'default';
               case 'decrease':
                    return 'destructive';
               default:
                    return 'secondary';
          }
     };

     return (
          <Card
               className={`h-full ${compact ? 'p-4' : 'p-6'}`}
               style={{ borderLeft: `4px solid ${metric.color}` }}
          >
               <CardContent className="flex flex-col gap-4 p-0">
                    <div className="flex items-center justify-between">
                         <span className="text-sm font-medium text-muted-foreground">{metric.name}</span>
                         <Badge variant={getChangeVariant()} className="gap-1">
                              {getChangeIcon()}
                              <span className="text-xs">
                                   {metric.change > 0 ? '+' : ''}
                                   {metric.change}%
                              </span>
                         </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                         <span className={`font-bold leading-none ${compact ? 'text-xl' : 'text-2xl'}`}>
                              {metric.value}
                         </span>
                    </div>

                    {!compact && (
                         <span className="text-xs text-muted-foreground">Compared to previous period</span>
                    )}
               </CardContent>
          </Card>
     );
};