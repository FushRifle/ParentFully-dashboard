'use client';
import { Pie, PieChart as RePieChart, Cell } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { PieChartData } from '../analytics/data';

interface Props {
     data: PieChartData[];
     size?: number;
     title?: string;
}

export const PieChartComponent: React.FC<Props> = ({ data, size = 250, title }) => {
     const total = data.reduce((sum, item) => sum + item.value, 0);

     const chartConfig = data.reduce((acc, item, index) => {
          acc[item.label] = {
               label: item.label,
               color: item.color || `var(--chart-${index + 1})`,
          };
          return acc;
     }, {} as ChartConfig);

     return (
          <Card>
               {title && (
                    <CardHeader>
                         <h4 className="text-lg font-semibold">{title}</h4>
                    </CardHeader>
               )}
               <CardContent className="flex justify-center">
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square" style={{ maxHeight: size }}>
                         <RePieChart>
                              <ChartTooltip content={<ChartTooltipContent nameKey="label" hideLabel />} />
                              <Pie
                                   data={data}
                                   dataKey="value"
                                   nameKey="label"
                                   innerRadius={size * 0.3}
                                   outerRadius={size * 0.4}
                                   strokeWidth={2}
                              >
                                   {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                   ))}
                              </Pie>
                         </RePieChart>
                    </ChartContainer>
               </CardContent>
          </Card>
     );
};