'use client';
import { Pie, PieChart as RePieChart, Cell } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { PieChartData } from '../analytics/data';

interface Props {
     data: PieChartData[];
     size?: number;
     title?: string;
     embedded?: boolean;
}

export const PieChartComponent: React.FC<Props> = ({ data, size = 250, title, embedded = false }) => {
     const chartData = data.map((item, index) => ({ ...item, value: Number(item.value) || 0, color: item.color || ['#f28c18', '#10b981', '#3b82f6'][index % 3] }));

     const chartConfig = data.reduce((acc, item, index) => {
          acc[item.label] = {
               label: item.label,
               color: item.color || `var(--chart-${index + 1})`,
          };
          return acc;
     }, {} as ChartConfig);

     const Wrapper = embedded ? 'div' : Card;
     return (
          <Wrapper className="w-full min-w-0">
               {title && (
                    <CardHeader>
                         <h4 className="text-lg font-semibold">{title}</h4>
                    </CardHeader>
               )}
               <div className={embedded ? 'min-w-0' : 'min-w-0 px-6 pb-6'}>
                    <ChartContainer config={chartConfig} className="mx-auto w-full aspect-auto" style={{ height: size, minHeight: size }}>
                         <RePieChart>
                              <ChartTooltip content={<ChartTooltipContent nameKey="label" hideLabel />} />
                              <Pie
                                   data={chartData}
                                   dataKey="value"
                                   nameKey="label"
                                   cx="50%"
                                   cy="50%"
                                   innerRadius="55%"
                                   outerRadius="80%"
                                   strokeWidth={2}
                              >
                                   {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                   ))}
                              </Pie>
                         </RePieChart>
                    </ChartContainer>
               </div>
          </Wrapper>
     );
};
