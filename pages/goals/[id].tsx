import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { GoalsTable } from '@/components/resources/goals/table';
import { goalCategoryApi } from '@/services/goalService';
import { useGoals } from '@/hooks/goals/useGoalsData';
import { Card, Text, Loading, Button, Container } from '@nextui-org/react';
import type { CoreValue, Goal } from '@/types/api';

const CoreValueGoalsPage: NextPage = () => {
     const router = useRouter();
     const { id } = router.query;

     const [coreValue, setCoreValue] = useState<CoreValue | null>(null);
     const [goals, setGoals] = useState<Goal[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     const { getGoalsByCategory, loading: goalsLoading } = useGoals();

     useEffect(() => {
          const fetchData = async () => {
               if (!id || typeof id !== 'string') return;

               setLoading(true);
               setError(null);

               try {
                    const coreValueData = await goalCategoryApi.getOne(parseInt(id, 10));
                    setCoreValue(coreValueData);
                    const goalsData = await getGoalsByCategory(parseInt(id, 10));
                    setGoals(goalsData || []);
               } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch data');
                    console.error('Failed to fetch core value goals:', err);
               } finally {
                    setLoading(false);
               }
          };

          if (id) {
               fetchData();
          }
     }, [id, getGoalsByCategory]);

     const handleBack = () => {
          router.push('/resources/goals');
     };

     if (loading) {
          return (
               <Container css={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh'
               }}>
                    <Loading size="xl" />
               </Container>
          );
     }

     if (error || !coreValue) {
          return (
               <Container css={{
                    textAlign: 'center',
                    py: '$20'
               }}>
                    <Text h3 color="error">
                         {error || 'Core value not found'}
                    </Text>
                    <Button
                         auto
                         ghost
                         onClick={handleBack}
                         css={{ mt: '$4' }}
                    >
                         Back to Goals
                    </Button>
               </Container>
          );
     }

     return (
          <Container css={{ py: '$10' }}>
               {/* Header */}
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <Button
                         auto
                         light
                         css={{ minWidth: 'auto', px: '$2' }}
                         onClick={handleBack}
                    >
                         ← Back
                    </Button>
                    <Text h2 css={{ m: 0 }}>
                         {coreValue.title || coreValue.name}
                    </Text>
               </div>

               {/* Core Value Info Card */}
               <Card css={{ mb: '$8', p: '$6' }}>
                    <Card.Body>
                         <Text css={{ mb: '$4' }}>{coreValue.description}</Text>
                         <Text small css={{ color: '$gray600' }}>
                              Age Group: {coreValue.age_range || 'Not specified'} • {goals.length} {goals.length === 1 ? 'Goal' : 'Goals'}
                         </Text>
                    </Card.Body>
               </Card>

               {/* Goals Table */}
               {goalsLoading ? (
                    <Container css={{ display: 'flex', justifyContent: 'center', py: '$10' }}>
                         <Loading />
                    </Container>
               ) : (
                    <GoalsTable goals={goals} />
               )}
          </Container>
     );
};

export default CoreValueGoalsPage;