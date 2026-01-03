import React from 'react';
import { Button, Text, Card } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
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
     selectedDate = new Date()
}) => {
     const ranges = [
          { id: 'today', label: 'Today' },
          { id: 'week', label: 'This Week' },
          { id: 'month', label: 'This Month' },
          { id: 'quarter', label: 'This Quarter' },
          { id: 'year', label: 'This Year' }
     ];

     const formatDate = (date: Date) => {
          return date.toLocaleDateString('en-US', {
               month: 'short',
               day: 'numeric',
               year: 'numeric'
          });
     };

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
          <Card css={{ p: '$6' }} variant="flat">
               <Card.Body>
                    <Flex direction="column" css={{ gap: '$6' }}>
                         <Flex justify="between" align="center">
                              <Text h4>Date Range</Text>
                              <Button
                                   auto
                                   light
                                   size="sm"
                                   icon={<Calendar size={16} />}
                              >
                                   Custom Range
                              </Button>
                         </Flex>

                         <Flex css={{ gap: '$2' }} wrap="wrap">
                              {ranges.map((range) => (
                                   <Button
                                        key={range.id}
                                        auto
                                        size="sm"
                                        color={selectedRange === range.id ? 'primary' : 'default'}
                                        css={{
                                             borderRadius: '$pill',
                                             bg: selectedRange === range.id ? '$primary' : '$accents0',
                                             color: selectedRange === range.id ? '$white' : '$text'
                                        }}
                                        onPress={() => onRangeChange?.(range.id)}
                                   >
                                        {range.label}
                                   </Button>
                              ))}
                         </Flex>

                         <Flex justify="center" align="center" css={{ gap: '$4' }}>
                              <Button
                                   auto
                                   light
                                   size="sm"
                                   icon={<ChevronLeft size={16} />}
                                   onPress={handlePrevious}
                              />

                              <Box
                                   css={{
                                        p: '$4',
                                        bg: '$accents0',
                                        borderRadius: '$lg',
                                        minWidth: '200px',
                                        textAlign: 'center'
                                   }}
                              >
                                   <Text b>{formatDate(selectedDate)}</Text>
                                   <Text size="$xs" color="$accents7">
                                        {selectedRange.charAt(0).toUpperCase() + selectedRange.slice(1)} view
                                   </Text>
                              </Box>

                              <Button
                                   auto
                                   light
                                   size="sm"
                                   icon={<ChevronRight size={16} />}
                                   onPress={handleNext}
                              />
                         </Flex>
                    </Flex>
               </Card.Body>
          </Card>
     );
};