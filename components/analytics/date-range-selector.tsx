import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRangeSelectorProps {
     onRangeChange?: (range: string) => void;
     onDateChange?: (date: Date) => void;
     selectedRange?: string;
     selectedDate?: Date;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
     onRangeChange,
     onDateChange,
     selectedRange = 'week',
     selectedDate = new Date(),
}) => {
     const ranges = [
          { id: 'today', label: 'Today' },
          { id: 'week', label: 'This Week' },
          { id: 'month', label: 'This Month' },
          { id: 'quarter', label: 'This Quarter' },
          { id: 'year', label: 'This Year' },
     ];

     const formatDate = (date: Date) =>
          date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

     const handlePrevious = () => {
          const newDate = new Date(selectedDate);
          if (selectedRange === 'week') newDate.setDate(newDate.getDate() - 7);
          else if (selectedRange === 'month') newDate.setMonth(newDate.getMonth() - 1);
          else if (selectedRange === 'year') newDate.setFullYear(newDate.getFullYear() - 1);
          else newDate.setDate(newDate.getDate() - 1);
          onDateChange?.(newDate);
     };

     const handleNext = () => {
          const newDate = new Date(selectedDate);
          if (selectedRange === 'week') newDate.setDate(newDate.getDate() + 7);
          else if (selectedRange === 'month') newDate.setMonth(newDate.getMonth() + 1);
          else if (selectedRange === 'year') newDate.setFullYear(newDate.getFullYear() + 1);
          else newDate.setDate(newDate.getDate() + 1);
          onDateChange?.(newDate);
     };

     return (
          <Card className="p-6">
               <CardContent className="flex flex-col gap-6 p-0">
                    <div className="flex items-center justify-between">
                         <h4 className="text-lg font-semibold">Date Range</h4>
                         <Button variant="ghost" size="sm">
                              <Calendar size={16} className="mr-2" />
                              Custom Range
                         </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                         {ranges.map((range) => (
                              <Button
                                   key={range.id}
                                   size="sm"
                                   variant={selectedRange === range.id ? 'default' : 'secondary'}
                                   className="rounded-full"
                                   onClick={() => onRangeChange?.(range.id)}
                              >
                                   {range.label}
                              </Button>
                         ))}
                    </div>

                    <div className="flex items-center justify-center gap-4">
                         <Button variant="ghost" size="sm" onClick={handlePrevious}>
                              <ChevronLeft size={16} />
                         </Button>
                         <div className="min-w-[200px] rounded-lg bg-muted p-4 text-center">
                              <p className="font-semibold">{formatDate(selectedDate)}</p>
                              <p className="text-xs text-muted-foreground">
                                   {selectedRange.charAt(0).toUpperCase() + selectedRange.slice(1)} view
                              </p>
                         </div>
                         <Button variant="ghost" size="sm" onClick={handleNext}>
                              <ChevronRight size={16} />
                         </Button>
                    </div>
               </CardContent>
          </Card>
     );
};