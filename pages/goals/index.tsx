import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCorePlanHandlers } from '@/hooks/goals/useCorePlan';
import { Card, Grid, Text, Loading, Button } from '@nextui-org/react';

const GoalsPage: NextPage = () => {
     const router = useRouter();
     const {
          coreValues,
          goals,
          loading,
          error,
          activeTab,
          ageGroups,
          fetchCoreValues,
          handleTabChange,
          handleCardClick,
     } = useCorePlanHandlers('3-5');

     useEffect(() => {
          fetchCoreValues();
     }, [fetchCoreValues]);

     const onCardClick = (coreValue: any) => {
          router.push(`/goals/${coreValue.id}`);
     };

     return (
          <div>
               <Text h3>Goals</Text>

               {/* Age Group Tabs */}
               <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {ageGroups.map((group) => (
                         <Button
                              key={group}
                              auto
                              flat={activeTab !== group}
                              color={activeTab === group ? "primary" : "default"}
                              onPress={() => handleTabChange(group)}
                              size="sm"
                         >
                              {group}
                         </Button>
                    ))}
               </div>

               {/* Error Display */}
               {error && (
                    <Text color="error" css={{ marginBottom: '1rem' }}>
                         Error: {error}
                    </Text>
               )}

               {/* Core Values Grid */}
               <Grid.Container gap={2}>
                    {loading && coreValues.length === 0 ? (
                         <Grid xs={12} css={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                              <Loading size="xl" />
                         </Grid>
                    ) : coreValues.length === 0 ? (
                         <Grid xs={12} css={{ textAlign: 'center', padding: '2rem' }}>
                              <Text>No core values found for this age group</Text>
                         </Grid>
                    ) : (
                         coreValues.map((cv) => (
                              <Grid key={cv.id} xs={12} sm={6} md={4}>
                                   <Card
                                        isPressable
                                        onClick={() => onCardClick(cv)}
                                        css={{
                                             backgroundColor: cv.color,
                                             color: cv.iconColor || '$white',
                                             padding: '$6',
                                             borderRadius: '$xl',
                                             minHeight: '200px',
                                             transition: 'transform 0.2s',
                                             '&:hover': {
                                                  transform: 'scale(1.02)',
                                                  boxShadow: '$lg',
                                             },
                                        }}
                                   >
                                        <Card.Body css={{
                                             textAlign: 'center',
                                             display: 'flex',
                                             flexDirection: 'column',
                                             gap: '$4',
                                             justifyContent: 'center',
                                             alignItems: 'center'
                                        }}>
                                             <Text css={{
                                                  color: '$black',
                                                  fontWeight: '$bold'
                                             }} h4>
                                                  {cv.title || cv.name}
                                             </Text>
                                             <Text css={{ color: '$black' }}>
                                                  {cv.description}
                                             </Text>
                                        </Card.Body>
                                   </Card>
                              </Grid>
                         ))
                    )}
               </Grid.Container>

               {/* Loading indicator for goals fetch */}
               {loading && goals.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                         <Loading size="md" />
                    </div>
               )}
          </div>
     );
};

export default GoalsPage;