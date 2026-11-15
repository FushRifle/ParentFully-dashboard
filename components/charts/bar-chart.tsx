'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { BarChartData } from '../analytics/data';

interface Props {
     data: BarChartData[];
     height?: number;
     title?: string;
}

export const BarChartComponent: React.FC<Props> = ({ data, height = 250, title }) => {
     // Transform your data: Recharts expects an array of objects, each with a key for the x-axis and the value.
     const chartData = data.map((item) => ({
          label: item.label,
          value: item.value,
          fill: item.color, // Use the color from your data for each bar
     }));

     const chartConfig = {
          value: { label: 'Value' },
     } satisfies ChartConfig;

     return (
          <Card>
               {title && (
                    <CardHeader>
                         <h4 className="text-lg font-semibold">{title}</h4>
                    </CardHeader>
               )}
               <CardContent>
                    <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
                         <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                              <CartesianGrid vertical={false} strokeDasharray="3 3" />
                              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                              {/* Using Cell to color each bar individually based on your data */}
                              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                   {chartData.map((entry, index) => (
                                        <rect key={`cell-${index}`} fill={entry.fill} />
                                   ))}
                              </Bar>
                         </BarChart>
                    </ChartContainer>
               </CardContent>
          </Card>
     );
};