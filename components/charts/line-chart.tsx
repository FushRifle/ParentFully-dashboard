'use client';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import { LineChartData } from '../analytics/data';

interface Props {
     data: LineChartData[];
     height?: number;
     title?: string;
}

export const LineChartComponent: React.FC<Props> = ({ data, height = 250, title }) => {
     // Recharts needs a single array of objects. We merge the datasets by date.
     const chartData = data[0]?.data.map((point, idx) => {
          const entry: Record<string, any> = { date: point.date };
          data.forEach((dataset) => {
               entry[dataset.label] = dataset.data[idx]?.value;
          });
          return entry;
     }) || [];

     // Build the config dynamically from your datasets
     const chartConfig = data.reduce((acc, dataset, index) => {
          acc[dataset.label] = {
               label: dataset.label,
               color: dataset.color || `var(--chart-${index + 1})`,
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
               <CardContent>
                    <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
                         <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <CartesianGrid vertical={false} strokeDasharray="3 3" />
                              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <ChartLegend content={<ChartLegendContent />} />
                              {data.map((dataset) => (
                                   <Line
                                        key={dataset.label}
                                        type="monotone"
                                        dataKey={dataset.label}
                                        stroke={`var(--color-${dataset.label})`}
                                        strokeWidth={2}
                                        dot={false}
                                   />
                              ))}
                         </LineChart>
                    </ChartContainer>
               </CardContent>
          </Card>
     );
};