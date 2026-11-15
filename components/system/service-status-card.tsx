import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceStatus } from './data';
import { StatusBadge } from './status-badge';

interface ServiceStatusCardProps {
     service: ServiceStatus;
     compact?: boolean;
}

export const ServiceStatusCard: React.FC<ServiceStatusCardProps> = ({ service, compact = false }) => {
     return (
          <Card className={`h-full ${compact ? 'p-4' : 'p-6'}`}>
               <CardContent className="flex flex-col gap-4 p-0">
                    <div className="flex items-start justify-between">
                         <div className="flex flex-col gap-2">
                              <p className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}>{service.name}</p>
                              <StatusBadge status={service.status} size={compact ? 'sm' : 'md'} />
                         </div>
                         {!compact && service.lastIncident && (
                              <Badge variant="secondary">Last: {service.lastIncident}</Badge>
                         )}
                    </div>

                    <div className="flex flex-col gap-2">
                         <div className="flex justify-between">
                              <span className="text-xs text-muted-foreground">Uptime</span>
                              <span className="text-sm font-medium">{service.uptime}</span>
                         </div>
                         <div className="flex justify-between">
                              <span className="text-xs text-muted-foreground">Response Time</span>
                              <span className="text-sm font-medium">{service.responseTime}ms</span>
                         </div>
                    </div>

                    {!compact && service.dependencies && service.dependencies.length > 0 && (
                         <div className="border-t pt-2">
                              <p className="mb-1 text-xs text-muted-foreground">Dependencies</p>
                              <div className="flex flex-wrap gap-1">
                                   {service.dependencies.map((dep, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">{dep}</Badge>
                                   ))}
                              </div>
                         </div>
                    )}
               </CardContent>
          </Card>
     );
};