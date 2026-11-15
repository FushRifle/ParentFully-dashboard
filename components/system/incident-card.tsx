import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Incident } from './data';
import { AlertCircle, Clock, CheckCircle, Search, Eye } from 'lucide-react';

interface IncidentCardProps {
     incident: Incident;
     compact?: boolean;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, compact = false }) => {
     const getStatusConfig = () => {
          switch (incident.status) {
               case 'resolved':
                    return { icon: <CheckCircle size={14} />, text: 'Resolved' };
               case 'investigating':
                    return { icon: <Search size={14} />, text: 'Investigating' };
               case 'identified':
                    return { icon: <AlertCircle size={14} />, text: 'Identified' };
               case 'monitoring':
                    return { icon: <Eye size={14} />, text: 'Monitoring' };
               default:
                    return { icon: <Clock size={14} />, text: 'Unknown' };
          }
     };

     const getSeverityVariant = (): 'default' | 'secondary' | 'destructive' | 'outline' => {
          switch (incident.severity) {
               case 'critical':
                    return 'destructive';
               case 'major':
                    return 'secondary';
               case 'minor':
                    return 'default';
               default:
                    return 'outline';
          }
     };

     const statusConfig = getStatusConfig();

     return (
          <Card className={`h-full ${compact ? 'p-4' : 'p-6'}`}>
               <CardContent className="flex flex-col gap-4 p-0">
                    <div className="flex items-start justify-between">
                         <p className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}>{incident.title}</p>
                         <Badge variant={getSeverityVariant()}>{incident.severity}</Badge>
                    </div>

                    <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2">
                              {statusConfig.icon}
                              <span className="text-sm font-medium">{statusConfig.text}</span>
                         </div>

                         <div className="flex justify-between">
                              <span className="text-xs text-muted-foreground">Started</span>
                              <span className="text-sm">{incident.startTime}</span>
                         </div>

                         {incident.endTime && (
                              <div className="flex justify-between">
                                   <span className="text-xs text-muted-foreground">Resolved</span>
                                   <span className="text-sm">{incident.endTime}</span>
                              </div>
                         )}
                    </div>

                    {!compact && incident.affectedServices.length > 0 && (
                         <div>
                              <p className="mb-1 text-xs text-muted-foreground">Affected Services</p>
                              <div className="flex flex-wrap gap-1">
                                   {incident.affectedServices.map((service, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">{service}</Badge>
                                   ))}
                              </div>
                         </div>
                    )}

                    {!compact && incident.description && (
                         <p className="mt-2 text-sm text-muted-foreground">{incident.description}</p>
                    )}
               </CardContent>
          </Card>
     );
};