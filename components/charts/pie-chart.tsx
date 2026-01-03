import React from 'react';
import { Card, Text } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';

interface PieChartData {
     label: string;
     value: number;
     color: string;
}

interface PieChartProps {
     data: PieChartData[];
     size?: number;
     showLegend?: boolean;
     title?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
     data,
     size = 200,
     showLegend = true,
     title
}) => {
     const total = data.reduce((sum, item) => sum + item.value, 0);
     const radius = size / 2;
     const strokeWidth = 30;
     const innerRadius = radius - strokeWidth;
     const circumference = 2 * Math.PI * innerRadius;

     let accumulatedAngle = 0;

     const segments = data.map((item, index) => {
          const percentage = item.value / total;
          const angle = percentage * 360;
          const strokeDasharray = `${circumference * percentage} ${circumference * (1 - percentage)}`;
          const rotation = accumulatedAngle;

          accumulatedAngle += angle;

          return {
               ...item,
               percentage,
               angle,
               strokeDasharray,
               rotation
          };
     });

     return (
          <Card css={{ p: '$6' }} variant="flat">
               {title && (
                    <Card.Header>
                         <Text h4>{title}</Text>
                    </Card.Header>
               )}

               <Card.Body>
                    <Flex direction="column" align="center" css={{ gap: '$6' }}>
                         {/* Chart */}
                         <Box css={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
                              <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                                   {segments.map((segment, index) => (
                                        <circle
                                             key={index}
                                             cx={radius}
                                             cy={radius}
                                             r={innerRadius}
                                             fill="transparent"
                                             stroke={segment.color}
                                             strokeWidth={strokeWidth}
                                             strokeDasharray={segment.strokeDasharray}
                                             strokeDashoffset="0"
                                             style={{
                                                  transform: `rotate(${segment.rotation}deg)`,
                                                  transformOrigin: 'center'
                                             }}
                                        />
                                   ))}
                              </svg>

                              {/* Center text */}
                              <Flex
                                   direction="column"
                                   align="center"
                                   justify="center"
                                   css={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        textAlign: 'center'
                                   }}
                              >
                                   <Text b size="$lg">
                                        {total.toLocaleString()}
                                   </Text>
                                   <Text size="$xs" color="$accents7">
                                        Total
                                   </Text>
                              </Flex>
                         </Box>

                         {/* Legend */}
                         {showLegend && (
                              <Flex direction="column" css={{ gap: '$3', width: '100%' }}>
                                   {segments.map((segment, index) => (
                                        <Flex key={index} justify="between" align="center">
                                             <Flex align="center" css={{ gap: '$3' }}>
                                                  <Box
                                                       css={{
                                                            width: '12px',
                                                            height: '12px',
                                                            borderRadius: '50%',
                                                            bg: segment.color
                                                       }}
                                                  />
                                                  <Text size="$sm">{segment.label}</Text>
                                             </Flex>
                                             <Flex align="center" css={{ gap: '$2' }}>
                                                  <Text b size="$sm">
                                                       {segment.value}
                                                  </Text>
                                                  <Text size="$xs" color="$accents7">
                                                       ({Math.round(segment.percentage * 100)}%)
                                                  </Text>
                                             </Flex>
                                        </Flex>
                                   ))}
                              </Flex>
                         )}
                    </Flex>
               </Card.Body>
          </Card>
     );
};