import React from 'react';
import { Card, Text, Tooltip } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { BarChartData } from '../analytics/data';

interface BarChartProps {
     data: BarChartData[];
     height?: number;
     showValues?: boolean;
     title?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
     data,
     height = 200,
     showValues = true,
     title
}) => {
     const maxValue = Math.max(...data.map(d => d.value));
     const barWidth = 100 / data.length - 2;
     const chartHeight = height - 40;

     return (
          <Card css={{ p: '$6' }} variant="flat">
               {title && (
                    <Card.Header>
                         <Text h4>{title}</Text>
                    </Card.Header>
               )}

               <Card.Body>
                    <Box css={{ position: 'relative', height: `${height}px` }}>
                         {/* Bars */}
                         <Flex
                              align="end"
                              css={{
                                   height: `${chartHeight}px`,
                                   gap: '2%',
                                   position: 'relative',
                                   zIndex: 1
                              }}
                         >
                              {data.map((item, index) => {
                                   const barHeight = (item.value / maxValue) * chartHeight;

                                   return (
                                        <Tooltip
                                             key={index}
                                             content={
                                                  <Box css={{ p: '$2' }}>
                                                       <Text size="$sm">{item.label}</Text>
                                                       <Text b size="$sm">{item.value.toLocaleString()}</Text>
                                                  </Box>
                                             }
                                             placement="top"
                                        >
                                             <Box
                                                  css={{
                                                       flex: 1,
                                                       height: `${barHeight}px`,
                                                       bg: item.color,
                                                       borderRadius: '$sm',
                                                       cursor: 'pointer',
                                                       transition: 'all 0.2s ease',
                                                       '&:hover': {
                                                            opacity: 0.8,
                                                            transform: 'translateY(-2px)'
                                                       }
                                                  }}
                                             />
                                        </Tooltip>
                                   );
                              })}
                         </Flex>

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
                              {data.map((item, index) => (
                                   <Text
                                        key={index}
                                        size="$xs"
                                        color="$accents7"
                                        css={{
                                             textAlign: 'center',
                                             flex: 1,
                                             transform: 'rotate(-45deg)',
                                             transformOrigin: 'top left',
                                             whiteSpace: 'nowrap'
                                        }}
                                   >
                                        {item.label}
                                   </Text>
                              ))}
                         </Flex>

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

                    {/* Value labels on bars */}
                    {showValues && (
                         <Flex justify="between" css={{ mt: '$2' }}>
                              {data.map((item, index) => (
                                   <Text
                                        key={index}
                                        size="$xs"
                                        color="$accents7"
                                        css={{ textAlign: 'center', flex: 1 }}
                                   >
                                        {item.value > 1000
                                             ? `${(item.value / 1000).toFixed(1)}k`
                                             : item.value}
                                   </Text>
                              ))}
                         </Flex>
                    )}
               </Card.Body>
          </Card>
     );
};