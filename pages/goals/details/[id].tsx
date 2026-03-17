import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { GoalPayload } from '@/types/api';
import { useGoalDetails } from '@/hooks/goals/useGoalsDetails';
import {
     Container,
     Card,
     Text,
     Loading,
     Button,
     Grid,
     Input,
     Textarea,
     Select,
     Checkbox,
     Row,
     Col,
     Spacer,
     Badge
} from '@nextui-org/react';

const GoalDetailsPage: NextPage = () => {
     const router = useRouter();
     const { id } = router.query;

     const {
          fetchedGoal: goal,
          isEditing,
          setIsEditing,
          apiLoading,
          profileLoading,
          frequencyCount,
          setFrequencyCount,
          frequencyDuration,
          setFrequencyDuration,
          frequencyUnit,
          setFrequencyUnit,
          reward,
          updateRewardField,
          handleSave,
          handleCancelEdit,
          goBack,
     } = useGoalDetails({
          goalId: id ? parseInt(id as string) : undefined
     });

     const [editedGoal, setEditedGoal] = useState<Partial<GoalPayload>>({});

     useEffect(() => {
          if (goal) {
               setEditedGoal({
                    title: goal.title,
                    description: goal.description,
                    smart_specific: goal.smart_specific,
                    smart_measurable: goal.smart_measurable,
                    smart_achievable: goal.smart_achievable,
                    smart_relevant: goal.smart_relevant,
                    status: goal.status,
                    target_date: goal.target_date,
               });
          }
     }, [goal]);

     const handleInputChange = (field: keyof GoalPayload, value: any) => {
          setEditedGoal(prev => ({ ...prev, [field]: value }));
     };

     const loading = apiLoading || profileLoading;

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

     if (!goal) {
          return (
               <Container css={{ textAlign: 'center', py: '$20' }}>
                    <Text h3 color="error">Goal not found</Text>
                    <Button auto ghost onClick={goBack} css={{ mt: '$4' }}>
                         Go Back
                    </Button>
               </Container>
          );
     }

     const statusColors = {
          'Working on': 'warning',
          'Mastered': 'success',
          'Expired': 'error'
     } as const;

     return (
          <Container css={{ py: '$10', maxWidth: '1200px' }}>
               {/* Header */}
               <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginBottom: '2rem',
                    flexWrap: 'wrap'
               }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <Button auto light css={{ minWidth: 'auto', px: '$2' }} onClick={goBack}>
                              ← Back
                         </Button>
                         <Text h1 css={{ m: 0, fontSize: '2rem' }}>
                              {isEditing ? 'Edit Goal' : goal.title}
                         </Text>
                         <Badge color={statusColors[goal.status as keyof typeof statusColors] || 'primary'} size="lg">
                              {goal.status || 'Draft'}
                         </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                         {isEditing ? (
                              <>
                                   <Button color="primary" onPress={handleSave}>
                                        Save Changes
                                   </Button>
                                   <Button color="error" flat onPress={handleCancelEdit}>
                                        Cancel
                                   </Button>
                              </>
                         ) : (
                              <Button color="primary" onPress={() => setIsEditing(true)}>
                                   Edit Goal
                              </Button>
                         )}
                    </div>
               </div>

               {/* Main Content */}
               <Grid.Container gap={2}>
                    {/* Left Column - Main Goal Info */}
                    <Grid xs={12} md={8}>
                         <Card css={{ width: '100%', p: '$6' }}>
                              <Card.Body>
                                   {/* Goal Title */}
                                   <div style={{ marginBottom: '2rem' }}>
                                        <Text h3 css={{ mb: '$2' }}>Goal</Text>
                                        {isEditing ? (
                                             <Input
                                                  fullWidth
                                                  labelPlaceholder="Goal Title"
                                                  value={editedGoal.title || ''}
                                                  onChange={(e) => handleInputChange('title', e.target.value)}
                                                  css={{ mb: '$4' }}
                                             />
                                        ) : (
                                             <Text css={{ fontSize: '1.2rem', color: '$gray700' }}>
                                                  {goal.title}
                                             </Text>
                                        )}

                                        {isEditing ? (
                                             <Textarea
                                                  fullWidth
                                                  labelPlaceholder="Description"
                                                  value={editedGoal.description || ''}
                                                  onChange={(e) => handleInputChange('description', e.target.value)}
                                                  rows={3}
                                             />
                                        ) : (
                                             goal.description && (
                                                  <Text css={{ color: '$gray600', mt: '$2' }}>
                                                       {goal.description}
                                                  </Text>
                                             )
                                        )}
                                   </div>

                                   {/* SMART Criteria */}
                                   <Text h3 css={{ mb: '$4' }}>SMART Criteria</Text>
                                   <Grid.Container gap={1}>
                                        <Grid xs={12} md={6}>
                                             <Card variant="flat" css={{ p: '$4', width: '100%' }}>
                                                  <Text h5 css={{ color: '$primary' }}>Specific</Text>
                                                  {isEditing ? (
                                                       <Textarea
                                                            fullWidth
                                                            value={editedGoal.smart_specific || ''}
                                                            onChange={(e) => handleInputChange('smart_specific', e.target.value)}
                                                            rows={2}
                                                       />
                                                  ) : (
                                                       <Text css={{ color: '$gray700' }}>
                                                            {goal.smart_specific || 'Not specified'}
                                                       </Text>
                                                  )}
                                             </Card>
                                        </Grid>
                                        <Grid xs={12} md={6}>
                                             <Card variant="flat" css={{ p: '$4', width: '100%' }}>
                                                  <Text h5 css={{ color: '$primary' }}>Measurable</Text>
                                                  {isEditing ? (
                                                       <Textarea
                                                            fullWidth
                                                            value={editedGoal.smart_measurable || ''}
                                                            onChange={(e) => handleInputChange('smart_measurable', e.target.value)}
                                                            rows={2}
                                                       />
                                                  ) : (
                                                       <Text css={{ color: '$gray700' }}>
                                                            {goal.smart_measurable || 'Not specified'}
                                                       </Text>
                                                  )}
                                             </Card>
                                        </Grid>
                                        <Grid xs={12} md={6}>
                                             <Card variant="flat" css={{ p: '$4', width: '100%' }}>
                                                  <Text h5 css={{ color: '$primary' }}>Achievable</Text>
                                                  {isEditing ? (
                                                       <Textarea
                                                            fullWidth
                                                            value={editedGoal.smart_achievable || ''}
                                                            onChange={(e) => handleInputChange('smart_achievable', e.target.value)}
                                                            rows={2}
                                                       />
                                                  ) : (
                                                       <Text css={{ color: '$gray700' }}>
                                                            {goal.smart_achievable || 'Not specified'}
                                                       </Text>
                                                  )}
                                             </Card>
                                        </Grid>
                                        <Grid xs={12} md={6}>
                                             <Card variant="flat" css={{ p: '$4', width: '100%' }}>
                                                  <Text h5 css={{ color: '$primary' }}>Relevant</Text>
                                                  {isEditing ? (
                                                       <Textarea
                                                            fullWidth
                                                            value={editedGoal.smart_relevant || ''}
                                                            onChange={(e) => handleInputChange('smart_relevant', e.target.value)}
                                                            rows={2}
                                                       />
                                                  ) : (
                                                       <Text css={{ color: '$gray700' }}>
                                                            {goal.smart_relevant || 'Not specified'}
                                                       </Text>
                                                  )}
                                             </Card>
                                        </Grid>
                                   </Grid.Container>

                                   <Spacer y={2} />

                                   {/* Time Bound */}
                                   <Text h3 css={{ mb: '$4' }}>Time Bound</Text>
                                   <Card variant="flat" css={{ p: '$4' }}>
                                        <Row align="center">
                                             {isEditing ? (
                                                  <>
                                                       <Input
                                                            type="number"
                                                            label="Count"
                                                            value={frequencyCount.toString()}
                                                            onChange={(e) => setFrequencyCount(parseInt(e.target.value) || 0)}
                                                            css={{ width: '100px', mr: '$4' }}
                                                       />
                                                       <Text css={{ mr: '$4' }}>times per</Text>
                                                       <Input
                                                            type="number"
                                                            label="Value"
                                                            value={frequencyDuration.toString()}
                                                            onChange={(e) => setFrequencyDuration(parseInt(e.target.value) || 1)}
                                                            css={{ width: '100px', mr: '$4' }}
                                                       />
                                                       <Select
                                                            value={frequencyUnit}
                                                            onChange={(e: any) => setFrequencyUnit(e.target.value as any)}
                                                            css={{ width: '120px' }}
                                                       >
                                                            <Select.Option value="daily">Day(s)</Select.Option>
                                                            <Select.Option value="weekly">Week(s)</Select.Option>
                                                            <Select.Option value="monthly">Month(s)</Select.Option>
                                                            <Select.Option value="yearly">Year(s)</Select.Option>
                                                       </Select>
                                                  </>
                                             ) : (
                                                  <Text>
                                                       {goal.time_bound_count} times per {goal.time_bound_value} {goal.time_bound_period}
                                                  </Text>
                                             )}
                                        </Row>
                                        {goal.target_date && (
                                             <Row css={{ mt: '$4' }}>
                                                  <Text small css={{ color: '$gray600' }}>
                                                       Target Date: {new Date(goal.target_date).toLocaleDateString()}
                                                  </Text>
                                             </Row>
                                        )}
                                   </Card>
                              </Card.Body>
                         </Card>
                    </Grid>

                    {/* Right Column - Assignment & Rewards */}
                    <Grid xs={12} md={4}>
                         <Card css={{ width: '100%', p: '$6' }}>
                              <Card.Body>

                                   <Spacer y={2} />

                                   {/* Reward Section */}
                                   <Text h3 css={{ mb: '$4' }}>Reward</Text>
                                   <Card variant="flat" css={{ p: '$4' }}>
                                        {isEditing ? (
                                             <>
                                                  <Input
                                                       fullWidth
                                                       labelPlaceholder="Reward Name"
                                                       value={reward.name}
                                                       onChange={(e) => updateRewardField('name', e.target.value)}
                                                       css={{ mb: '$4' }}
                                                  />
                                                  <Textarea
                                                       fullWidth
                                                       labelPlaceholder="Notes"
                                                       value={reward.notes}
                                                       onChange={(e) => updateRewardField('notes', e.target.value)}
                                                       rows={3}
                                                  />
                                             </>
                                        ) : (
                                             <>
                                                  {reward.name && (
                                                       <Text h5>{reward.name}</Text>
                                                  )}
                                                  {reward.notes && (
                                                       <Text css={{ color: '$gray600', mt: '$2' }}>
                                                            {reward.notes}
                                                       </Text>
                                                  )}
                                                  {!reward.name && !reward.notes && (
                                                       <Text css={{ color: '$gray600' }}>No reward set</Text>
                                                  )}
                                             </>
                                        )}
                                   </Card>

                                   <Spacer y={2} />
                              </Card.Body>
                         </Card>
                    </Grid>
               </Grid.Container>
          </Container>
     );
};

export default GoalDetailsPage;