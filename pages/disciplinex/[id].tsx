import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
     getSinglePlan,
     getRules,
     updatePlan,
     deletePlan,
     createRule,
     updateRule,
     deleteRule,
} from '@/services/disciplineService';
import { Card, Text, Loading, Button, Container, Modal, Input, Textarea, Badge } from '@nextui-org/react';
import type { DisciplinePlan, Rule } from '@/types/api';

const DisciplinePlanDetailPage: NextPage = () => {
     const router = useRouter();
     const { id } = router.query;

     const [plan, setPlan] = useState<DisciplinePlan | null>(null);
     const [rules, setRules] = useState<Rule[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     // Edit plan state
     const [editingPlan, setEditingPlan] = useState(false);
     const [editName, setEditName] = useState('');
     const [editDescription, setEditDescription] = useState('');
     const [editNotes, setEditNotes] = useState('');
     const [savingPlan, setSavingPlan] = useState(false);

     // Edit rule state (tracked by rule id)
     const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
     const [editRuleName, setEditRuleName] = useState('');
     const [editRuleConsequences, setEditRuleConsequences] = useState('');
     const [editRuleNotes, setEditRuleNotes] = useState('');
     const [savingRule, setSavingRule] = useState(false);

     // Add rule modal state
     const [addRuleModalOpen, setAddRuleModalOpen] = useState(false);
     const [newRuleName, setNewRuleName] = useState('');
     const [newRuleConsequences, setNewRuleConsequences] = useState('');
     const [newRuleNotes, setNewRuleNotes] = useState('');
     const [submittingRule, setSubmittingRule] = useState(false);

     const planId = id ? parseInt(id as string, 10) : undefined;

     const fetchData = async () => {
          if (!planId) return;
          setLoading(true);
          setError(null);
          try {
               const [planData, rulesData] = await Promise.all([
                    getSinglePlan(planId),
                    getRules(planId),
               ]);
               setPlan(planData);
               setRules(rulesData);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to fetch plan data');
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          if (id) {
               fetchData();
          }
     }, [id]);

     // --- Plan editing ---
     const startEditPlan = () => {
          if (!plan) return;
          setEditName(plan.name);
          setEditDescription(plan.description || '');
          setEditNotes(plan.notes || '');
          setEditingPlan(true);
     };

     const cancelEditPlan = () => {
          setEditingPlan(false);
     };

     const saveEditPlan = async () => {
          if (!planId || !editName.trim()) return;
          setSavingPlan(true);
          try {
               const updated = await updatePlan(planId, {
                    name: editName.trim(),
                    description: editDescription.trim() || undefined,
                    notes: editNotes.trim() || undefined,
               });
               setPlan(updated);
               setEditingPlan(false);
          } catch (err) {
               console.error('Failed to update plan:', err);
          } finally {
               setSavingPlan(false);
          }
     };

     const handleDeletePlan = async () => {
          if (!planId) return;
          if (!window.confirm('Are you sure you want to delete this plan?')) return;
          try {
               await deletePlan(planId);
               router.push('/disciplinex');
          } catch (err) {
               console.error('Failed to delete plan:', err);
          }
     };

     // --- Rule editing ---
     const startEditRule = (rule: Rule) => {
          setEditingRuleId(rule.id);
          setEditRuleName(rule.name);
          setEditRuleConsequences(rule.consiquences || rule.consequences || '');
          setEditRuleNotes(rule.notes || '');
     };

     const cancelEditRule = () => {
          setEditingRuleId(null);
     };

     const saveEditRule = async () => {
          if (editingRuleId === null || !editRuleName.trim()) return;
          setSavingRule(true);
          try {
               const updated = await updateRule(editingRuleId, {
                    name: editRuleName.trim(),
                    consiquences: editRuleConsequences.trim() || undefined,
                    notes: editRuleNotes.trim() || undefined,
               });
               setRules((prev) => prev.map((r) => (r.id === editingRuleId ? updated : r)));
               setEditingRuleId(null);
          } catch (err) {
               console.error('Failed to update rule:', err);
          } finally {
               setSavingRule(false);
          }
     };

     const handleDeleteRule = async (ruleId: number) => {
          if (!window.confirm('Are you sure you want to delete this rule?')) return;
          try {
               await deleteRule(ruleId);
               setRules((prev) => prev.filter((r) => r.id !== ruleId));
          } catch (err) {
               console.error('Failed to delete rule:', err);
          }
     };

     // --- Add rule ---
     const handleAddRule = async () => {
          if (!planId || !newRuleName.trim()) return;
          setSubmittingRule(true);
          try {
               const created = await createRule({
                    plan_id: planId,
                    name: newRuleName.trim(),
                    consiquences: newRuleConsequences.trim() || undefined,
                    notes: newRuleNotes.trim() || undefined,
               });
               setRules((prev) => [...prev, created]);
               setAddRuleModalOpen(false);
               setNewRuleName('');
               setNewRuleConsequences('');
               setNewRuleNotes('');
          } catch (err) {
               console.error('Failed to create rule:', err);
          } finally {
               setSubmittingRule(false);
          }
     };

     // --- Loading / Error states ---
     if (loading) {
          return (
               <Container css={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
               }}>
                    <Loading size="xl" />
               </Container>
          );
     }

     if (error || !plan) {
          return (
               <Container css={{ textAlign: 'center', py: '$20' }}>
                    <Text h3 color="error">
                         {error || 'Plan not found'}
                    </Text>
                    <Button auto ghost onPress={fetchData} css={{ mt: '$4' }}>
                         Retry
                    </Button>
                    <Button auto light onPress={() => router.push('/disciplinex')} css={{ mt: '$4', ml: '$4' }}>
                         Back to Plans
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
                         onPress={() => router.back()}
                    >
                         ← Back
                    </Button>
                    <div style={{ flex: 1 }}>
                         {editingPlan ? (
                              <Input
                                   fullWidth
                                   bordered
                                   size="xl"
                                   value={editName}
                                   onChange={(e) => setEditName(e.target.value)}
                                   placeholder="Plan name"
                              />
                         ) : (
                              <Text h2 css={{ m: 0 }}>{plan.name}</Text>
                         )}
                    </div>
                    <Badge variant="flat" color={plan.type === 'preset' ? 'secondary' : 'primary'}>
                         {plan.type === 'preset' ? 'Template' : 'Custom'}
                    </Badge>
               </div>

               {/* Plan Info Card */}
               <Card css={{ mb: '$8', p: '$6' }}>
                    <Card.Body>
                         {editingPlan ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                   <Textarea
                                        fullWidth
                                        bordered
                                        label="Description"
                                        placeholder="Plan description"
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                   />
                                   <Textarea
                                        fullWidth
                                        bordered
                                        label="Notes"
                                        placeholder="Additional notes"
                                        value={editNotes}
                                        onChange={(e) => setEditNotes(e.target.value)}
                                   />
                                   <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Button auto shadow color="primary" onPress={saveEditPlan} disabled={savingPlan || !editName.trim()}>
                                             {savingPlan ? <Loading size="xs" /> : 'Save'}
                                        </Button>
                                        <Button auto flat color="error" onPress={cancelEditPlan}>
                                             Cancel
                                        </Button>
                                   </div>
                              </div>
                         ) : (
                              <>
                                   {plan.description && (
                                        <Text css={{ mb: '$4' }}>{plan.description}</Text>
                                   )}
                                   {plan.notes && (
                                        <Text small css={{ color: '$gray600', mb: '$4' }}>
                                             Notes: {plan.notes}
                                        </Text>
                                   )}
                                   <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <Button auto flat color="primary" size="sm" onPress={startEditPlan}>
                                             Edit Plan
                                        </Button>
                                        <Button auto flat color="error" size="sm" onPress={handleDeletePlan}>
                                             Delete Plan
                                        </Button>
                                   </div>
                              </>
                         )}
                    </Card.Body>
               </Card>

               {/* Rules Section */}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <Text h3 css={{ m: 0 }}>Rules</Text>
                    <Button auto shadow color="primary" onPress={() => setAddRuleModalOpen(true)}>
                         + Add Rule
                    </Button>
               </div>

               {rules.length === 0 ? (
                    <Card css={{ p: '$6', textAlign: 'center' }}>
                         <Card.Body>
                              <Text css={{ color: '$gray600' }}>No rules yet. Add a rule to get started.</Text>
                         </Card.Body>
                    </Card>
               ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                         {rules.map((rule) => (
                              <Card key={rule.id} css={{ p: '$6' }}>
                                   <Card.Body>
                                        {editingRuleId === rule.id ? (
                                             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                  <Input
                                                       fullWidth
                                                       bordered
                                                       label="Rule Name"
                                                       value={editRuleName}
                                                       onChange={(e) => setEditRuleName(e.target.value)}
                                                  />
                                                  <Textarea
                                                       fullWidth
                                                       bordered
                                                       label="Consequences"
                                                       value={editRuleConsequences}
                                                       onChange={(e) => setEditRuleConsequences(e.target.value)}
                                                  />
                                                  <Textarea
                                                       fullWidth
                                                       bordered
                                                       label="Notes"
                                                       value={editRuleNotes}
                                                       onChange={(e) => setEditRuleNotes(e.target.value)}
                                                  />
                                                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                       <Button auto shadow color="primary" onPress={saveEditRule} disabled={savingRule || !editRuleName.trim()}>
                                                            {savingRule ? <Loading size="xs" /> : 'Save'}
                                                       </Button>
                                                       <Button auto flat color="error" onPress={cancelEditRule}>
                                                            Cancel
                                                       </Button>
                                                  </div>
                                             </div>
                                        ) : (
                                             <>
                                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                       <Text b>{rule.name}</Text>
                                                       <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <Button auto flat color="primary" size="xs" onPress={() => startEditRule(rule)}>
                                                                 Edit
                                                            </Button>
                                                            <Button
                                                                 auto
                                                                 flat
                                                                 color="error"
                                                                 size="xs"
                                                                 css={{ minWidth: 'auto', px: '$4' }}
                                                                 onPress={() => handleDeleteRule(rule.id)}
                                                            >
                                                                 ✕
                                                            </Button>
                                                       </div>
                                                  </div>
                                                  {(rule.consiquences || rule.consequences) && (
                                                       <Text small css={{ color: '$gray700', mt: '$2' }}>
                                                            <Text b small>Consequences:</Text> {rule.consiquences || rule.consequences}
                                                       </Text>
                                                  )}
                                                  {rule.notes && (
                                                       <Text small css={{ color: '$gray600', mt: '$2' }}>
                                                            <Text b small>Notes:</Text> {rule.notes}
                                                       </Text>
                                                  )}
                                             </>
                                        )}
                                   </Card.Body>
                              </Card>
                         ))}
                    </div>
               )}

               {/* Add Rule Modal */}
               <Modal
                    open={addRuleModalOpen}
                    onClose={() => setAddRuleModalOpen(false)}
                    closeButton
                    aria-labelledby="add-rule-modal"
               >
                    <Modal.Header>
                         <Text h4 id="add-rule-modal">Add Rule</Text>
                    </Modal.Header>
                    <Modal.Body>
                         <Input
                              fullWidth
                              bordered
                              label="Rule Name"
                              placeholder="Enter rule name"
                              value={newRuleName}
                              onChange={(e) => setNewRuleName(e.target.value)}
                              required
                         />
                         <Textarea
                              fullWidth
                              bordered
                              label="Consequences"
                              placeholder="What happens when the rule is broken?"
                              value={newRuleConsequences}
                              onChange={(e) => setNewRuleConsequences(e.target.value)}
                         />
                         <Textarea
                              fullWidth
                              bordered
                              label="Notes"
                              placeholder="Additional notes (optional)"
                              value={newRuleNotes}
                              onChange={(e) => setNewRuleNotes(e.target.value)}
                         />
                    </Modal.Body>
                    <Modal.Footer>
                         <Button auto flat color="error" onPress={() => setAddRuleModalOpen(false)}>
                              Cancel
                         </Button>
                         <Button auto shadow color="primary" onPress={handleAddRule} disabled={submittingRule || !newRuleName.trim()}>
                              {submittingRule ? <Loading size="xs" /> : 'Create Rule'}
                         </Button>
                    </Modal.Footer>
               </Modal>
          </Container>
     );
};

export default DisciplinePlanDetailPage;
