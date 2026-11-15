import React from 'react';
import { Goal } from '@/types/api';
import { useRouter } from 'next/router';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface GoalsTableProps {
     goals: Goal[];
     onDelete?: (id: number) => void;
}

export const GoalsTable: React.FC<GoalsTableProps> = ({ goals, onDelete }) => {
     const router = useRouter();

     if (!goals || goals.length === 0) {
          return (
               <Card className="px-6 py-10 text-center">
                    <CardContent>
                         <p className="text-muted-foreground">No goals found for this core value.</p>
                    </CardContent>
               </Card>
          );
     }

     const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
          switch (status?.toLowerCase()) {
               case 'mastered':
                    return 'default';
               case 'working on':
               case 'in progress':
                    return 'secondary';
               case 'not started':
                    return 'destructive';
               default:
                    return 'outline';
          }
     };

     const getStatusBadge = (status: string) => (
          <Badge variant={getStatusVariant(status)} className="text-xs">
               {status || 'Not Started'}
          </Badge>
     );

     const handleGoalClick = (goalId: number) => {
          router.push(`/goals/details/${goalId}`);
     };

     return (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
               {goals.map((goal) => (
                    <div key={goal.id} className="relative w-full">
                         {onDelete && (
                              <Button
                                   variant="destructive"
                                   size="icon"
                                   className="absolute right-2 top-2 z-10 h-7 w-7 rounded-full p-0"
                                   onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(goal.id);
                                   }}
                              >
                                   <X size={14} />
                              </Button>
                         )}

                         <Card
                              onClick={() => handleGoalClick(goal.id)}
                              className="w-full cursor-pointer border-[3px] border-gray-600 bg-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-lg dark:bg-card/60"
                         >
                              <CardHeader className="flex flex-col items-start gap-2 pb-0">
                                   <div className="flex w-full items-center justify-between">
                                        <h4 className="m-0 text-lg font-semibold" style={{ color: '#FF8C01' }}>
                                             {goal.goal || goal.title}
                                        </h4>
                                        {getStatusBadge(goal.status)}
                                   </div>
                                   {goal.area && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Area: {goal.area}</p>
                                   )}
                              </CardHeader>

                              <CardContent className="flex flex-col gap-2 py-4">
                                   {goal.smart_specific && (
                                        <p className="text-sm text-muted-foreground">
                                             <strong>Specific:</strong> {goal.smart_specific}
                                        </p>
                                   )}
                                   {goal.smart_measurable && (
                                        <p className="text-sm text-muted-foreground">
                                             <strong>Measurable:</strong> {goal.smart_measurable}
                                        </p>
                                   )}
                                   {!goal.smart_specific && !goal.smart_measurable && goal.description && (
                                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                                   )}
                              </CardContent>

                              <CardFooter className="flex flex-wrap gap-4 border-t border-gray-200 bg-gray-50 dark:bg-muted/50">
                                   {goal.time_bound_count > 0 && (
                                        <p className="w-full text-sm text-gray-200">
                                             Frequency: {goal.time_bound_count} times per {goal.time_bound_value}{' '}
                                             {goal.time_bound_period}
                                        </p>
                                   )}
                              </CardFooter>
                         </Card>
                    </div>
               ))}
          </div>
     );
};