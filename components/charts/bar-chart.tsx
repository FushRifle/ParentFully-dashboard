'use client';
import { Bar, BarChart, Cell, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { BarChartData } from '../analytics/data';

interface Props {
     data: BarChartData[];
     height?: number;
     title?: string;
     embedded?: boolean;
}

export const BarChartComponent: React.FC<Props> = ({ data, height = 250, title, embedded = false }) => {
     // Transform your data: Recharts expects an array of objects, each with a key for the x-axis and the value.
     const chartData = data.map((item) => ({
          label: item.label,
          value: item.value,
          fill: item.color, // Use the color from your data for each bar
     }));

     const chartConfig = {
          value: { label: 'Value' },
     } satisfies ChartConfig;

     const Wrapper = embedded ? 'div' : Card;
     return (
          <Wrapper className="w-full min-w-0">
               {title && (
                    <CardHeader>
                         <h4 className="text-lg font-semibold">{title}</h4>
                    </CardHeader>
               )}
               <div className={embedded ? 'w-full min-w-0' : 'px-6 pb-6'}>
                    <ChartContainer config={chartConfig} className="w-full aspect-auto" style={{ height }}>
                         <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                              <CartesianGrid vertical={false} strokeDasharray="3 3" />
                              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                              <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} allowDecimals={false} domain={[0, 'dataMax']} />
                              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                              {/* Using Cell to color each bar individually based on your data */}
                              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                   {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                   ))}
                              </Bar>
                         </BarChart>
                    </ChartContainer>
               </div>
          </Wrapper>
     );
};
