import React from 'react';
import { Card, Text, Progress } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { SystemMetric } from './data';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StatusBadge } from './status-badge';

interface MetricGaugeProps {
     metric: SystemMetric;
     compact?: boolean;
}

export const MetricGauge: React.FC<MetricGaugeProps> = ({ metric, compact = false }) => {
     const getStatusColor = () => {
          if (metric.value >= metric.threshold) return 'error';
          if (metric.value >= metric.threshold * 0.8) return 'warning';
          return 'success';
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
          <Card
               css={{
                    p: compact ? '$4' : '$6',
                    height: '100%'
               }}
               variant="flat"
          >
               <Card.Body>
                    <Flex direction="column" css={{ gap: compact ? '$2' : '$4' }}>
                         <Flex justify="between" align="center">
                              <Flex align="center" css={{ gap: '$2' }}>
                                   <Text size="$sm" css={{ fontWeight: 500 }}>
                                        {metric.name}
                                   </Text>
                              </Flex>
                              {!compact && getTrendIcon()}
                         </Flex>

                         <Flex direction="column" css={{ gap: compact ? '$1' : '$2' }}>
                              <Flex justify="between" align="end">
                                   <Text
                                        css={{
                                             fontSize: compact ? '$2xl' : '$3xl',
                                             fontWeight: '$bold',
                                             lineHeight: 1
                                        }}
                                   >
                                        {metric.value}{metric.unit}
                                   </Text>
                                   {!compact && (
                                        <Text size="$xs" color="$accents7">
                                             Max: {metric.max}{metric.unit}
                                        </Text>
                                   )}
                              </Flex>

                              <Progress
                                   value={metric.value}
                                   max={metric.max}
                                   color={getStatusColor()}
                                   size={compact ? 'sm' : 'md'}
                                   css={{ mt: compact ? '$1' : '$2' }}
                              />

                              {!compact && (
                                   <Flex justify="between">
                                        <Text size="$xs" color="$accents7">
                                             Threshold: {metric.threshold}{metric.unit}
                                        </Text>
                                        <StatusBadge status={metric.status} size="sm" withText={false} />
                                   </Flex>
                              )}
                         </Flex>
                    </Flex>
               </Card.Body>
          </Card>
     );
};