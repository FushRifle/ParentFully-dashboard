import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { GoalsTable } from '@/components/resources/goals/table';
import { goalCategoryApi, goalApi } from '@/services/goalService';
import { useGoals } from '@/hooks/goals/useGoalsData';
import { useAddGoal, SMART_FIELDS_CONFIG, FREQUENCY_UNITS } from '@/hooks/goals/useAddGoals';
import { Card, Text, Loading, Button, Container, Modal, Input, Textarea } from '@nextui-org/react';
import type { CoreValue, Goal } from '@/types/api';

const CoreValueGoalsPage: NextPage = () => {
     const router = useRouter();
     const { id } = router.query;

     const [coreValue, setCoreValue] = useState<CoreValue | null>(null);
     const [goals, setGoals] = useState<Goal[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [addModalOpen, setAddModalOpen] = useState(false);

     const { getGoalsByCategory, loading: goalsLoading } = useGoals();
     const {
          formState,
          smart,
          reward,
          loading: addLoading,
          children,
          updateFormState,
          updateSmartField,
          updateRewardField,
          resetForm,
          submitGoal,
     } = useAddGoal();

     const categoryId = id ? parseInt(id as string, 10) : undefined;

     const fetchData = async () => {
          if (!categoryId) return;

          setLoading(true);
          setError(null);

          try {
               const coreValueData = await goalCategoryApi.getOne(categoryId);
               setCoreValue(coreValueData);
               const goalsData = await getGoalsByCategory(categoryId);
               setGoals(goalsData || []);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to fetch data');
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          if (id) {
               fetchData();
          }
     }, [id]);

     const handleBack = () => {
          router.push('/resources/goals');
     };

     const handleDeleteGoal = async (goalId: number) => {
          if (!window.confirm('Are you sure you want to delete this goal?')) return;
          try {
               await goalApi.delete(goalId);
               setGoals((prev) => prev.filter((g) => g.id !== goalId));
          } catch (err) {
               console.error('Failed to delete goal:', err);
          }
     };

     const handleSubmitGoal = async () => {
          if (!categoryId) return;
          try {
               await submitGoal(categoryId);
               setAddModalOpen(false);
               resetForm();
               fetchData();
          } catch (err) {
               console.error('Failed to create goal:', err);
          }
     };

     const toggleChildSelection = (childId: number) => {
          const current = formState.selectedChild;
          if (current.includes(childId)) {
               updateFormState('selectedChild', current.filter((c: number) => c !== childId));
          } else {
               updateFormState('selectedChild', [...current, childId]);
          }
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
                    <Text h2 css={{ m: 0, flex: 1 }}>
                         {coreValue.title || coreValue.name}
                    </Text>
                    <Button auto shadow color="primary" onPress={() => setAddModalOpen(true)}>
                         + Add Goal
                    </Button>
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
                    <GoalsTable goals={goals} onDelete={handleDeleteGoal} />
               )}

               {/* Add Goal Modal */}
               <Modal
                    open={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    closeButton
                    width="600px"
                    scroll
                    aria-labelledby="add-goal-modal"
               >
                    <Modal.Header>
                         <Text h4 id="add-goal-modal">Add Goal</Text>
                    </Modal.Header>
                    <Modal.Body>
                         <Input
                              fullWidth
                              bordered
                              label="Title"
                              placeholder="Goal title / area"
                              value={formState.area}
                              onChange={(e) => updateFormState('area', e.target.value)}
                              required
                         />
                         <Textarea
                              fullWidth
                              bordered
                              label="Description"
                              placeholder="Describe the goal"
                              value={formState.goalText}
                              onChange={(e) => updateFormState('goalText', e.target.value)}
                              rows={3}
                         />

                         <Text h5 css={{ mt: '$6', mb: '$2' }}>SMART Fields</Text>
                         {SMART_FIELDS_CONFIG.map((field) => (
                              <Textarea
                                   key={field.key}
                                   fullWidth
                                   bordered
                                   label={field.Text}
                                   placeholder={field.placeholder}
                                   value={smart[field.key]}
                                   onChange={(e) => updateSmartField(field.key, e.target.value)}
                                   rows={2}
                              />
                         ))}

                         <Text h5 css={{ mt: '$6', mb: '$2' }}>Time Bound</Text>
                         <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                              <Input
                                   type="number"
                                   bordered
                                   label="Frequency Count"
                                   value={formState.frequencyCount.toString()}
                                   onChange={(e) => updateFormState('frequencyCount', parseInt(e.target.value) || 1)}
                                   css={{ flex: 1 }}
                              />
                              <Input
                                   type="number"
                                   bordered
                                   label="Duration"
                                   value={formState.frequencyDuration.toString()}
                                   onChange={(e) => updateFormState('frequencyDuration', parseInt(e.target.value) || 1)}
                                   css={{ flex: 1 }}
                              />
                              <div style={{ flex: 1 }}>
                                   <Text size="$xs" css={{ mb: '$2', ml: '$2' }}>Unit</Text>
                                   <select
                                        value={formState.frequencyUnit}
                                        onChange={(e) => updateFormState('frequencyUnit', e.target.value)}
                                        style={{
                                             width: '100%',
                                             height: '40px',
                                             border: '2px solid #e0e0e0',
                                             borderRadius: '12px',
                                             padding: '0 12px',
                                             fontFamily: 'inherit',
                                             fontSize: '14px',
                                             cursor: 'pointer',
                                             outline: 'none',
                                        }}
                                   >
                                        {FREQUENCY_UNITS.map((u) => (
                                             <option key={u.value} value={u.value}>{u.label}</option>
                                        ))}
                                   </select>
                              </div>
                         </div>

                         {children && children.length > 0 && (
                              <>
                                   <Text h5 css={{ mt: '$6', mb: '$2' }}>Assign to Children</Text>
                                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {children.map((child: any) => (
                                             <label key={child.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                  <input
                                                       type="checkbox"
                                                       checked={formState.selectedChild.includes(child.id)}
                                                       onChange={() => toggleChildSelection(child.id)}
                                                  />
                                                  <Text>{child.name}</Text>
                                             </label>
                                        ))}
                                   </div>
                              </>
                         )}

                         <Text h5 css={{ mt: '$6', mb: '$2' }}>Reward</Text>
                         <Input
                              fullWidth
                              bordered
                              label="Reward Name"
                              placeholder="What is the prize?"
                              value={reward.name}
                              onChange={(e) => updateRewardField('name', e.target.value)}
                         />
                         <Input
                              fullWidth
                              bordered
                              label="Notes"
                              placeholder="Incentive notes"
                              value={reward.notes}
                              onChange={(e) => updateRewardField('notes', e.target.value)}
                         />
                    </Modal.Body>
                    <Modal.Footer>
                         <Button auto flat color="error" onPress={() => { setAddModalOpen(false); resetForm(); }}>
                              Cancel
                         </Button>
                         <Button
                              auto
                              shadow
                              color="primary"
                              onPress={handleSubmitGoal}
                              disabled={addLoading || !formState.area.trim() || !formState.goalText.trim()}
                         >
                              {addLoading ? <Loading size="xs" /> : 'Create Goal'}
                         </Button>
                    </Modal.Footer>
               </Modal>
          </Container>
     );
};

export default CoreValueGoalsPage;
