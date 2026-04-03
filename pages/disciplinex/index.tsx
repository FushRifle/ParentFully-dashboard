import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { getPlans, getTemplatePlans, createPlan, deletePlan } from '@/services/disciplineService';
import { Card, Grid, Text, Loading, Button, Modal, Input, Textarea, Badge } from '@nextui-org/react';
import type { DisciplinePlan } from '@/types/api';

type FilterTab = 'all' | 'custom' | 'templates';

const DisciplinePlansPage: NextPage = () => {
     const router = useRouter();

     const [customPlans, setCustomPlans] = useState<DisciplinePlan[]>([]);
     const [templatePlans, setTemplatePlans] = useState<DisciplinePlan[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [activeTab, setActiveTab] = useState<FilterTab>('all');

     // Create modal state
     const [addModalOpen, setAddModalOpen] = useState(false);
     const [formName, setFormName] = useState('');
     const [formDescription, setFormDescription] = useState('');
     const [formNotes, setFormNotes] = useState('');
     const [submitting, setSubmitting] = useState(false);

     const fetchAllPlans = async () => {
          setLoading(true);
          setError(null);
          try {
               const [custom, templates] = await Promise.all([
                    getPlans(),
                    getTemplatePlans(),
               ]);
               setCustomPlans(custom);
               setTemplatePlans(templates);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to fetch discipline plans');
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchAllPlans();
     }, []);

     const handleDeletePlan = async (id: number) => {
          if (!window.confirm('Are you sure you want to delete this plan?')) return;
          try {
               await deletePlan(id);
               setCustomPlans((prev) => prev.filter((p) => p.id !== id));
               setTemplatePlans((prev) => prev.filter((p) => p.id !== id));
          } catch (err) {
               console.error('Failed to delete plan:', err);
          }
     };

     const handleCreatePlan = async () => {
          if (!formName.trim()) return;
          setSubmitting(true);
          try {
               await createPlan({
                    name: formName.trim(),
                    description: formDescription.trim() || undefined,
                    notes: formNotes.trim() || undefined,
                    type: 'custom',
               });
               setAddModalOpen(false);
               setFormName('');
               setFormDescription('');
               setFormNotes('');
               fetchAllPlans();
          } catch (err) {
               console.error('Failed to create plan:', err);
          } finally {
               setSubmitting(false);
          }
     };

     const handleCardClick = (plan: DisciplinePlan) => {
          router.push(`/disciplinex/${plan.id}`);
     };

     const getDisplayedPlans = (): { plan: DisciplinePlan; isTemplate: boolean }[] => {
          if (activeTab === 'custom') {
               return customPlans.map((p) => ({ plan: p, isTemplate: false }));
          }
          if (activeTab === 'templates') {
               return templatePlans.map((p) => ({ plan: p, isTemplate: true }));
          }
          return [
               ...customPlans.map((p) => ({ plan: p, isTemplate: false })),
               ...templatePlans.map((p) => ({ plan: p, isTemplate: true })),
          ];
     };

     const displayedPlans = getDisplayedPlans();
     const tabs: { key: FilterTab; label: string }[] = [
          { key: 'all', label: 'All' },
          { key: 'custom', label: 'My Plans' },
          { key: 'templates', label: 'Templates' },
     ];

     const getRuleCount = (plan: DisciplinePlan): number => {
          if (Array.isArray(plan.rules)) return plan.rules.length;
          if (plan.rules) return 1;
          return 0;
     };

     return (
          <div>
               {/* Header */}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <Text h3 css={{ m: 0 }}>Discipline Plans</Text>
                    <Button auto shadow color="primary" onPress={() => setAddModalOpen(true)}>
                         + Create Plan
                    </Button>
               </div>

               {/* Filter Tabs */}
               <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {tabs.map((tab) => (
                         <Button
                              key={tab.key}
                              auto
                              flat={activeTab !== tab.key}
                              color={activeTab === tab.key ? 'primary' : 'default'}
                              onPress={() => setActiveTab(tab.key)}
                              size="sm"
                         >
                              {tab.label}
                         </Button>
                    ))}
               </div>

               {/* Error Display */}
               {error && (
                    <Text color="error" css={{ marginBottom: '1rem' }}>
                         Error: {error}
                    </Text>
               )}

               {/* Plans Grid */}
               <Grid.Container gap={2}>
                    {loading && displayedPlans.length === 0 ? (
                         <Grid xs={12} css={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                              <Loading size="xl" />
                         </Grid>
                    ) : displayedPlans.length === 0 ? (
                         <Grid xs={12} css={{ textAlign: 'center', padding: '2rem' }}>
                              <Text>No discipline plans found</Text>
                         </Grid>
                    ) : (
                         displayedPlans.map(({ plan, isTemplate }) => (
                              <Grid key={`${isTemplate ? 'tpl' : 'cst'}-${plan.id}`} xs={12} sm={6} md={4}>
                                   <div style={{ position: 'relative', width: '100%' }}>
                                        <Button
                                             auto
                                             size="xs"
                                             color="error"
                                             flat
                                             css={{
                                                  position: 'absolute',
                                                  top: 8,
                                                  right: 8,
                                                  zIndex: 10,
                                                  minWidth: 'auto',
                                                  px: '$4',
                                             }}
                                             onPress={() => handleDeletePlan(plan.id)}
                                        >
                                             ✕
                                        </Button>
                                        <Card
                                             isPressable
                                             onClick={() => handleCardClick(plan)}
                                             css={{
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
                                                  display: 'flex',
                                                  flexDirection: 'column',
                                                  gap: '$4',
                                                  justifyContent: 'center',
                                                  alignItems: 'center',
                                                  textAlign: 'center',
                                             }}>
                                                  <Text h4 css={{ color: '#FF8C01', fontWeight: '$bold' }}>
                                                       {plan.name}
                                                  </Text>
                                                  {plan.description && (
                                                       <Text css={{ color: '$gray700' }}>
                                                            {plan.description}
                                                       </Text>
                                                  )}
                                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                       {isTemplate && (
                                                            <Badge variant="flat" color="secondary">Template</Badge>
                                                       )}
                                                       <Text small css={{ color: '$gray600' }}>
                                                            {getRuleCount(plan)} {getRuleCount(plan) === 1 ? 'Rule' : 'Rules'}
                                                       </Text>
                                                  </div>
                                             </Card.Body>
                                        </Card>
                                   </div>
                              </Grid>
                         ))
                    )}
               </Grid.Container>

               {/* Create Plan Modal */}
               <Modal
                    open={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    closeButton
                    aria-labelledby="create-plan-modal"
               >
                    <Modal.Header>
                         <Text h4 id="create-plan-modal">Create Discipline Plan</Text>
                    </Modal.Header>
                    <Modal.Body>
                         <Input
                              fullWidth
                              bordered
                              label="Plan Name"
                              placeholder="Enter plan name"
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              required
                         />
                         <Textarea
                              fullWidth
                              bordered
                              label="Description"
                              placeholder="Plan description (optional)"
                              value={formDescription}
                              onChange={(e) => setFormDescription(e.target.value)}
                         />
                         <Textarea
                              fullWidth
                              bordered
                              label="Notes"
                              placeholder="Additional notes (optional)"
                              value={formNotes}
                              onChange={(e) => setFormNotes(e.target.value)}
                         />
                    </Modal.Body>
                    <Modal.Footer>
                         <Button auto flat color="error" onPress={() => setAddModalOpen(false)}>
                              Cancel
                         </Button>
                         <Button auto shadow color="primary" onPress={handleCreatePlan} disabled={submitting || !formName.trim()}>
                              {submitting ? <Loading size="xs" /> : 'Create'}
                         </Button>
                    </Modal.Footer>
               </Modal>
          </div>
     );
};

export default DisciplinePlansPage;
