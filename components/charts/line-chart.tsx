import React from 'react';
import { Card, Text } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { LineChartData } from '../analytics/data';

interface LineChartProps {
     data: LineChartData[];
     height?: number;
     showLegend?: boolean;
     title?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
     data,
     height = 200,
     showLegend = true,
     title
}) => {
     const maxValue = Math.max(...data.flatMap(d => d.data.map(p => p.value)));
     const chartHeight = height - 40;
     const pointRadius = 4;
     const strokeWidth = 2;

     const getYPosition = (value: number) => {
          return chartHeight - (value / maxValue) * chartHeight;
     };

     const createPath = (points: { x: number; y: number }[]) => {
          if (points.length < 2) return '';

          let path = `M ${points[0].x} ${points[0].y}`;

          for (let i = 1; i < points.length; i++) {
               const prev = points[i - 1];
               const curr = points[i];
               const controlX = (prev.x + curr.x) / 2;

               path += ` C ${controlX} ${prev.y}, ${controlX} ${curr.y}, ${curr.x} ${curr.y}`;
          }

          return path;
     };

     const createAreaPath = (points: { x: number; y: number }[]) => {
          if (points.length < 2) return '';

          let path = createPath(points);
          path += ` L ${points[points.length - 1].x} ${chartHeight}`;
          path += ` L ${points[0].x} ${chartHeight}`;
          path += ' Z';

          return path;
     };

     return (
          <Card css={{ p: '$6' }} variant="flat">
               {title && (
                    <Card.Header>
                         <Text h4>{title}</Text>
                    </Card.Header>
               )}

               <Card.Body>
                    <Box css={{ position: 'relative', height: `${height}px` }}>
                         {/* Y-axis grid lines */}
                         <Box
                              css={{
                                   position: 'absolute',
                                   top: 0,
                                   left: 0,
                                   right: 0,
                                   bottom: 0,
                                   display: 'flex',
                                   flexDirection: 'column',
                                   justifyContent: 'space-between'
                              }}
                         >
                              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
                                   <Box
                                        key={index}
                                        css={{
                                             width: '100%',
                                             height: '1px',
                                             bg: '$accents1'
                                        }}
                                   />
                              ))}
                         </Box>

                         {/* Chart content */}
                         <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                              {/* Draw areas first (behind lines) */}
                              {data.map((dataset, datasetIndex) => {
                                   const points = dataset.data.map((point, index) => ({
                                        x: (index / (dataset.data.length - 1)) * 100,
                                        y: getYPosition(point.value)
                                   }));

                                   return (
                                        <path
                                             key={`area-${datasetIndex}`}
                                             d={createAreaPath(points)}
                                             fill={`${dataset.color}20`}
                                             stroke="none"
                                        />
                                   );
                              })}

                              {/* Draw lines */}
                              {data.map((dataset, datasetIndex) => {
                                   const points = dataset.data.map((point, index) => ({
                                        x: (index / (dataset.data.length - 1)) * 100,
                                        y: getYPosition(point.value)
                                   }));

                                   return (
                                        <g key={`line-${datasetIndex}`}>
                                             <path
                                                  d={createPath(points)}
                                                  stroke={dataset.color}
                                                  strokeWidth={strokeWidth}
                                                  fill="none"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                             />

                                             {/* Draw points */}
                                             {points.map((point, pointIndex) => (
                                                  <circle
                                                       key={`point-${datasetIndex}-${pointIndex}`}
                                                       cx={point.x + '%'}
                                                       cy={point.y}
                                                       r={pointRadius}
                                                       fill={dataset.color}
                                                       stroke="$background"
                                                       strokeWidth="2"
                                                  />
                                             ))}
                                        </g>
                                   );
                              })}
                         </svg>

                         {/* X-axis labels */}
                         <Flex
                              justify="between"
                              css={{
                                   position: 'absolute',
                                   bottom: '-20px',
                                   left: '0',
                                   right: '0',
                                   mt: '$2'
                              }}
                         >
                              {data[0]?.data.map((point, index) => (
                                   <Text
                                        key={index}
                                        size="$xs"
                                        color="$accents7"
                                        css={{ textAlign: 'center', flex: 1 }}
                                   >
                                        {point.date}
                                   </Text>
                              ))}
                         </Flex>

                         {/* Y-axis labels */}
                         <Flex
                              direction="column"
                              justify="between"
                              css={{
                                   position: 'absolute',
                                   top: '0',
                                   left: '-40px',
                                   bottom: '0',
                                   width: '30px'
                              }}
                         >
                              {[1, 0.75, 0.5, 0.25, 0].map((ratio, index) => (
                                   <Text key={index} size="$xs" color="$accents7" css={{ textAlign: 'right' }}>
                                        {Math.round(maxValue * ratio).toLocaleString()}
                                   </Text>
                              ))}
                         </Flex>
                    </Box>

                    {/* Legend */}
                    {showLegend && data.length > 0 && (
                         <Flex justify="center" css={{ gap: '$6', mt: '$8' }}>
                              {data.map((dataset, index) => (
                                   <Flex key={index} align="center" css={{ gap: '$2' }}>
                                        <Box
                                             css={{
                                                  width: '12px',
                                                  height: '12px',
                                                  borderRadius: '50%',
                                                  bg: dataset.color
                                             }}
                                        />
                                        <Text size="$sm" color="$accents7">
                                             {dataset.label}
                                        </Text>
                                   </Flex>
                              ))}
                         </Flex>
                    )}
               </Card.Body>
          </Card>
     );
};