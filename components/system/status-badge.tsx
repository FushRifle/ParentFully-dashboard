import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
     status: 'operational' | 'degraded' | 'down' | 'healthy' | 'warning' | 'critical';
     size?: 'sm' | 'md' | 'lg';
     withText?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', withText = true }) => {
     const getConfig = () => {
          switch (status) {
               case 'operational':
               case 'healthy':
                    return {
                         dot: 'bg-emerald-500',
                         text: status === 'operational' ? 'Operational' : 'Healthy',
                    };
               case 'degraded':
               case 'warning':
                    return {
                         dot: 'bg-amber-500',
                         text: status === 'degraded' ? 'Degraded' : 'Warning',
                    };
               case 'down':
               case 'critical':
                    return {
                         dot: 'bg-red-500',
                         text: status === 'down' ? 'Down' : 'Critical',
                    };
               default:
                    return { dot: 'bg-gray-400', text: 'Unknown' };
          }
     };

     const config = getConfig();
     const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : size === 'lg' ? 'h-2.5 w-2.5' : 'h-2 w-2';

     return (
          <div className="flex items-center gap-2">
               <span className={`${dotSize} rounded-full ${config.dot}`} />
               {withText && <span className="text-sm font-medium">{config.text}</span>}
          </div>
     );
};