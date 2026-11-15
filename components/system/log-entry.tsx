import React from 'react';
import { LogEntry } from './data';
import { Info, AlertTriangle, AlertCircle, Clock } from 'lucide-react';

interface LogEntryProps {
     log: LogEntry;
     showTimestamp?: boolean;
}

export const LogEntryComponent: React.FC<LogEntryProps> = ({ log, showTimestamp = true }) => {
     const getLevelConfig = () => {
          switch (log.level) {
               case 'info':
                    return { icon: <Info size={14} />, color: '#3f3bef', bg: '#3f3bef10' };
               case 'warning':
                    return { icon: <AlertTriangle size={14} />, color: '#f59e0b', bg: '#f59e0b10' };
               case 'error':
                    return { icon: <AlertCircle size={14} />, color: '#ef4444', bg: '#ef444410' };
               default:
                    return { icon: <Info size={14} />, color: '#6b7280', bg: '#6b728010' };
          }
     };

     const levelConfig = getLevelConfig();

     return (
          <div className="flex items-start border-b p-3 last:border-b-0">
               <div
                    className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded"
                    style={{ background: levelConfig.bg, color: levelConfig.color }}
               >
                    {levelConfig.icon}
               </div>

               <div className="flex-1">
                    <div className="mb-1 flex items-start justify-between">
                         <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{log.service}</span>
                              <span
                                   className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                                   style={{ background: levelConfig.bg, color: levelConfig.color }}
                              >
                                   {log.level}
                              </span>
                         </div>

                         {showTimestamp && (
                              <div className="flex items-center gap-1">
                                   <Clock size={12} className="text-muted-foreground" />
                                   <span className="text-xs text-muted-foreground">{log.timestamp.split(' ')[1]}</span>
                              </div>
                         )}
                    </div>

                    <p className="text-sm text-muted-foreground">{log.message}</p>
               </div>
          </div>
     );
};