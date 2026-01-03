import React from 'react';
import { Card, Text } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { LogEntry } from './data';
import { Info, AlertTriangle, AlertCircle, Clock, Badge } from 'lucide-react';

interface LogEntryProps {
     log: LogEntry;
     showTimestamp?: boolean;
}

export const LogEntryComponent: React.FC<LogEntryProps> = ({
     log,
     showTimestamp = true
}) => {
     const getLevelConfig = () => {
          switch (log.level) {
               case 'info':
                    return {
                         icon: <Info size={14} />,
                         color: '#3f3bef',
                         bg: '#3f3bef10'
                    };
               case 'warning':
                    return {
                         icon: <AlertTriangle size={14} />,
                         color: '#f59e0b',
                         bg: '#f59e0b10'
                    };
               case 'error':
                    return {
                         icon: <AlertCircle size={14} />,
                         color: '#ef4444',
                         bg: '#ef444410'
                    };
               default:
                    return {
                         icon: <Info size={14} />,
                         color: '#6b7280',
                         bg: '#6b728010'
                    };
          }
     };

     const levelConfig = getLevelConfig();

     return (
          <Flex
               align="start"
               css={{
                    p: '$3',
                    borderBottom: '1px solid $border',
                    '&:last-child': { borderBottom: 'none' }
               }}
          >
               <Box
                    css={{
                         flexShrink: 0,
                         width: '24px',
                         height: '24px',
                         borderRadius: '$sm',
                         bg: levelConfig.bg,
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         mr: '$3'
                    }}
               >
                    <Box css={{ color: levelConfig.color }}>
                         {levelConfig.icon}
                    </Box>
               </Box>

               <Box css={{ flex: 1 }}>
                    <Flex justify="between" align="start" css={{ mb: '$1' }}>
                         <Flex align="center" css={{ gap: '$2' }}>
                              <Text size="$sm" css={{ fontWeight: 500 }}>
                                   {log.service}
                              </Text>
                              <Badge
                                   size="xs"
                                   style={{
                                        background: levelConfig.bg,
                                        color: levelConfig.color,
                                        textTransform: 'uppercase'
                                   }}
                              >
                                   {log.level}
                              </Badge>
                         </Flex>

                         {showTimestamp && (
                              <Flex align="center" css={{ gap: '$1' }}>
                                   <Clock size={12} color="$accents7" />
                                   <Text size="$xs" color="$accents7">
                                        {log.timestamp.split(' ')[1]}
                                   </Text>
                              </Flex>
                         )}
                    </Flex>

                    <Text size="$sm" color="$accents7">
                         {log.message}
                    </Text>
               </Box>
          </Flex>
     );
};