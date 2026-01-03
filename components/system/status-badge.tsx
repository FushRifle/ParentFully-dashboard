import React from 'react';
import { Badge, Text } from '@nextui-org/react';
import { Flex } from '../styles/flex';

interface StatusBadgeProps {
     status: 'operational' | 'degraded' | 'down' | 'healthy' | 'warning' | 'critical';
     size?: 'sm' | 'md' | 'lg';
     withText?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
     status,
     size = 'md',
     withText = true
}) => {
     const getStatusConfig = () => {
          switch (status) {
               case 'operational':
               case 'healthy':
                    return {
                         color: 'success' as const,
                         icon: '●',
                         text: status === 'operational' ? 'Operational' : 'Healthy'
                    };
               case 'degraded':
               case 'warning':
                    return {
                         color: 'warning' as const,
                         icon: '●',
                         text: status === 'degraded' ? 'Degraded' : 'Warning'
                    };
               case 'down':
               case 'critical':
                    return {
                         color: 'error' as const,
                         icon: '●',
                         text: status === 'down' ? 'Down' : 'Critical'
                    };
               default:
                    return {
                         color: 'default' as const,
                         icon: '○',
                         text: 'Unknown'
                    };
          }
     };

     const config = getStatusConfig();

     return (
          <Flex align="center" css={{ gap: '$2' }}>
               <Badge
                    size={size}
                    variant="flat"
                    color={config.color}
                    css={{
                         minWidth: 'auto',
                         p: 0,
                         '& .nextui-badge-content': {
                              p: '$1'
                         }
                    }}
               >
                    <Text css={{ fontSize: '8px', lineHeight: 1 }}>{config.icon}</Text>
               </Badge>
               {withText && (
                    <Text size="$sm" css={{ fontWeight: 500 }}>
                         {config.text}
                    </Text>
               )}
          </Flex>
     );
};