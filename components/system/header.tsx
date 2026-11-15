import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Activity, AlertCircle, Clock } from 'lucide-react';

interface SystemStatusHeaderProps {
     status: {
          system: string;
          uptime: string;
          lastUpdated: string;
          totalServices: number;
          operationalServices: number;
          incidents: number;
     };
}

export const SystemStatusHeader: React.FC<SystemStatusHeaderProps> = ({ status }) => {
     const getSystemStatusVariant = (): 'default' | 'secondary' | 'destructive' | 'outline' => {
          if (status.system === 'operational') return 'default';
          if (status.system === 'degraded') return 'secondary';
          return 'destructive';
     };

     const metrics = [
          { icon: <Activity size={20} color="#10b981" />, bg: '#10b98110', label: 'Uptime', value: status.uptime },
          { icon: <Server size={20} color="#3f3bef" />, bg: '#3f3bef10', label: 'Services', value: `${status.operationalServices}/${status.totalServices}` },
          { icon: <AlertCircle size={20} color="#ef4444" />, bg: '#ef444410', label: 'Active Incidents', value: status.incidents },
          { icon: <Clock size={20} color="#f59e0b" />, bg: '#f59e0b10', label: 'Last Incident', value: '2 days ago' },
     ];

     return (
          <Card className="p-6">
               <CardContent className="flex flex-col gap-6 p-0">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500">
                                   <Server size={24} color="white" />
                              </div>
                              <div>
                                   <h3 className="text-2xl font-semibold">System Status</h3>
                                   <div className="mt-1 flex items-center gap-2">
                                        <Badge variant={getSystemStatusVariant()}>
                                             {status.system.toUpperCase()}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                             Last updated: {status.lastUpdated}
                                        </span>
                                   </div>
                              </div>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                         {metrics.map((m) => (
                              <div key={m.label} className="flex items-center gap-3">
                                   <div className="flex h-10 w-10 items-center justify-center rounded-md" style={{ background: m.bg }}>
                                        {m.icon}
                                   </div>
                                   <div>
                                        <p className="text-sm text-muted-foreground">{m.label}</p>
                                        <p className="text-lg font-semibold">{m.value}</p>
                                   </div>
                              </div>
                         ))}
                    </div>
               </CardContent>
          </Card>
     );
};