import React from 'react';
import { Card, Text, Badge } from '@nextui-org/react';
import { Flex } from '../styles/flex';
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

     const getChangeColor = () => {
          switch (metric.changeType) {
               case 'increase':
                    return 'success';
               case 'decrease':
                    return 'error';
               default:
                    return 'default';
          }
     };

     return (
          <Card
               css={{
                    p: compact ? '$4' : '$6',
                    height: '100%',
                    borderLeft: `4px solid ${metric.color}`
               }}
               variant="flat"
          >
               <Card.Body>
                    <Flex direction="column" css={{ gap: compact ? '$2' : '$4' }}>
                         <Flex justify="between" align="center">
                              <Text size="$sm" color="$accents7" css={{ fontWeight: 500 }}>
                                   {metric.name}
                              </Text>
                              <Badge
                                   size="xs"
                                   variant="flat"
                                   color={getChangeColor()}
                                   css={{ gap: '$1' }}
                              >
                                   {getChangeIcon()}
                                   <Text size="$xs">
                                        {metric.change > 0 ? '+' : ''}{metric.change}%
                                   </Text>
                              </Badge>
                         </Flex>

                         <Flex align="center" css={{ gap: '$3' }}>
                              <Text
                                   css={{
                                        fontSize: compact ? '$xl' : '$2xl',
                                        fontWeight: '$bold',
                                        lineHeight: 1
                                   }}
                              >
                                   {metric.value}
                              </Text>
                              {!compact && (
                                   <Text
                                        css={{
                                             fontSize: '$4xl',
                                             opacity: 0.2,
                                             lineHeight: 1
                                        }}
                                   >
                                        {metric.icon}
                                   </Text>
                              )}
                         </Flex>

                         {!compact && (
                              <Text size="$xs" color="$accents7">
                                   Compared to previous period
                              </Text>
                         )}
                    </Flex>
               </Card.Body>
          </Card>
     );
};