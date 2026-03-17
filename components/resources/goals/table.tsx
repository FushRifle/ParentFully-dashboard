import React from 'react';
import { Goal } from '@/types/api';
import { useRouter } from 'next/router';
import { Card, Grid, Text, Badge } from '@nextui-org/react';

interface GoalsTableProps {
     goals: Goal[];
}

export const GoalsTable: React.FC<GoalsTableProps> = ({ goals }) => {
     const router = useRouter();

     if (!goals || goals.length === 0) {
          return (
               <Card css={{ textAlign: 'center', py: '$10', px: '$6' }}>
                    <Card.Body>
                         <Text>No goals found for this core value.</Text>
                    </Card.Body>
               </Card>
          );
     }

     const getStatusColor = (status: string) => {
          switch (status?.toLowerCase()) {
               case 'mastered':
                    return 'success';
               case 'working on':
               case 'in progress':
                    return 'warning';
               case 'not started':
                    return 'error';
               default:
                    return 'primary';
          }
     };

     const getStatusBadge = (status: string) => {
          const color = getStatusColor(status) as any;
          return (
               <Badge color={color} variant="flat" size="sm">
                    {status || 'Not Started'}
               </Badge>
          );
     };

     const handleGoalClick = (goalId: number) => {
          router.push(`/goals/details/${goalId}`);
     };

     return (
          <Grid.Container gap={1.5}>
               {goals.map((goal) => (
                    <Grid key={goal.id} xs={12} sm={6} md={4}>
                         <Card
                              isPressable
                              isHoverable
                              onClick={() => handleGoalClick(goal.id)}
                              css={{
                                   width: '100%',
                                   $$cardColor: '$colors$white60',
                                   border: '3px solid $gray600',
                                   transition: 'transform 0.2s, box-shadow 0.2s',
                                   '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '$lg',
                                        borderColor: '$primary',
                                   },
                              }}
                         >
                              <Card.Header css={{
                                   pb: 0,
                                   flexDirection: 'column',
                                   alignItems: 'flex-start',
                                   gap: '$2'
                              }}>
                                   <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '100%'
                                   }}>
                                        <Text h4 css={{ m: 0, color: '#FF8C01' }}>
                                             {goal.goal || goal.title}
                                        </Text>
                                        {getStatusBadge(goal.status)}
                                   </div>
                                   {goal.area && (
                                        <Text small css={{ color: '$gray600' }}>
                                             Area: {goal.area}
                                        </Text>
                                   )}
                              </Card.Header>

                              <Card.Body css={{ py: '$4' }}>
                                   {/* SMART Criteria Section */}
                                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {goal.smart_specific && (
                                             <Text size="sm" css={{ color: '$gray' }}>
                                                  <strong>Specific:</strong> {goal.smart_specific}
                                             </Text>
                                        )}
                                        {goal.smart_measurable && (
                                             <Text size="sm" css={{ color: '$gray' }}>
                                                  <strong>Measurable:</strong> {goal.smart_measurable}
                                             </Text>
                                        )}
                                        {!goal.smart_specific && !goal.smart_measurable && goal.description && (
                                             <Text size="sm" css={{ color: '$gray' }}>
                                                  {goal.description}
                                             </Text>
                                        )}
                                   </div>
                              </Card.Body>

                              <Card.Footer css={{
                                   flexWrap: 'wrap',
                                   gap: '$4',
                                   borderTop: '1px solid $gray200',
                                   bg: '$gray50'
                              }}>
                                   {/* Time-bound info if available */}
                                   {goal.time_bound_count > 0 && (
                                        <Text size="sm" css={{ color: '$gray200', width: '100%' }}>
                                             Frequency: {goal.time_bound_count} times per {goal.time_bound_value} {goal.time_bound_period}
                                        </Text>
                                   )}
                              </Card.Footer>
                         </Card>
                    </Grid>
               ))}
          </Grid.Container>
     );
};