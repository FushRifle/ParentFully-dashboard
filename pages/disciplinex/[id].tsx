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
import type { DisciplinePlan, Rule } from '@/types/api';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
     Dialog,
     DialogContent,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from '@/components/ui/dialog';

const DisciplinePlanDetailPage: NextPage = () => {
     const router = useRouter();
     const { id } = router.query;

     const [plan, setPlan] = useState<DisciplinePlan | null>(null);
     const [rules, setRules] = useState<Rule[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     const [editingPlan, setEditingPlan] = useState(false);
     const [editName, setEditName] = useState('');
     const [editDescription, setEditDescription] = useState('');
     const [editNotes, setEditNotes] = useState('');
     const [savingPlan, setSavingPlan] = useState(false);

     const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
     const [editRuleName, setEditRuleName] = useState('');
     const [editRuleConsequences, setEditRuleConsequences] = useState('');
     const [editRuleNotes, setEditRuleNotes] = useState('');
     const [savingRule, setSavingRule] = useState(false);

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
               const [planData, rulesData] = await Promise.all([getSinglePlan(planId), getRules(planId)]);
               setPlan(planData);
               setRules(rulesData);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to fetch plan data');
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          if (id) fetchData();
     }, [id]);

     const startEditPlan = () => {
          if (!plan) return;
          setEditName(plan.name);
          setEditDescription(plan.description || '');
          setEditNotes(plan.notes || '');
          setEditingPlan(true);
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

     const startEditRule = (rule: Rule) => {
          setEditingRuleId(rule.id);
          setEditRuleName(rule.name);
          setEditRuleConsequences(rule.consiquences || rule.consequences || '');
          setEditRuleNotes(rule.notes || '');
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

     if (loading) {
          return (
               <div className="flex min-h-[60vh] items-center justify-center">
                    <AppLoadingState message="Loading discipline plan…" />
               </div>
          );
     }

     if (error || !plan) {
          return (
               <div className="py-20 text-center">
                    <h3 className="text-xl font-semibold text-red-500">{error || 'Plan not found'}</h3>
                    <div className="mt-4 flex justify-center gap-4">
                         <Button variant="secondary" onClick={fetchData}>Retry</Button>
                         <Button variant="ghost" onClick={() => router.push('/disciplinex')}>Back to Plans</Button>
                    </div>
               </div>
          );
     }

     return (
          <div className="py-10">
               <div className="mb-8 flex items-center gap-4">
                    <Button variant="ghost" className="px-2" onClick={() => router.back()}>
                         ← Back
                    </Button>
                    <div className="flex-1">
                         {editingPlan ? (
                              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Plan name" />
                         ) : (
                              <h2 className="m-0 text-2xl font-semibold">{plan.name}</h2>
                         )}
                    </div>
                    <Badge variant={plan.type === 'preset' ? 'secondary' : 'default'}>
                         {plan.type === 'preset' ? 'Template' : 'Custom'}
                    </Badge>
               </div>

               <Card className="mb-8 p-6">
                    <CardContent className="p-0">
                         {editingPlan ? (
                              <div className="flex flex-col gap-4">
                                   <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="plan-description">Description</Label>
                                        <Textarea
                                             id="plan-description"
                                             placeholder="Plan description"
                                             value={editDescription}
                                             onChange={(e) => setEditDescription(e.target.value)}
                                        />
                                   </div>
                                   <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="plan-notes">Notes</Label>
                                        <Textarea
                                             id="plan-notes"
                                             placeholder="Additional notes"
                                             value={editNotes}
                                             onChange={(e) => setEditNotes(e.target.value)}
                                        />
                                   </div>
                                   <div className="flex gap-2">
                                        <Button onClick={saveEditPlan} disabled={savingPlan || !editName.trim()}>
                                             {savingPlan ? 'Saving…' : 'Save'}
                                        </Button>
                                        <Button variant="secondary" onClick={() => setEditingPlan(false)}>Cancel</Button>
                                   </div>
                              </div>
                         ) : (
                              <>
                                   {plan.description && <p className="mb-4">{plan.description}</p>}
                                   {plan.notes && <p className="mb-4 text-sm text-muted-foreground">Notes: {plan.notes}</p>}
                                   <div className="mt-2 flex gap-2">
                                        <Button variant="secondary" size="sm" onClick={startEditPlan}>Edit Plan</Button>
                                        <Button variant="destructive" size="sm" onClick={handleDeletePlan}>Delete Plan</Button>
                                   </div>
                              </>
                         )}
                    </CardContent>
               </Card>

               <div className="mb-4 flex items-center justify-between">
                    <h3 className="m-0 text-xl font-semibold">Rules</h3>
                    <Button onClick={() => setAddRuleModalOpen(true)}>+ Add Rule</Button>
               </div>

               {rules.length === 0 ? (
                    <Card className="p-6 text-center">
                         <CardContent className="p-0 text-muted-foreground">
                              No rules yet. Add a rule to get started.
                         </CardContent>
                    </Card>
               ) : (
                    <div className="flex flex-col gap-4">
                         {rules.map((rule) => (
                              <Card key={rule.id} className="p-6">
                                   <CardContent className="p-0">
                                        {editingRuleId === rule.id ? (
                                             <div className="flex flex-col gap-4">
                                                  <div className="flex flex-col gap-1.5">
                                                       <Label htmlFor={`rule-name-${rule.id}`}>Rule Name</Label>
                                                       <Input
                                                            id={`rule-name-${rule.id}`}
                                                            value={editRuleName}
                                                            onChange={(e) => setEditRuleName(e.target.value)}
                                                       />
                                                  </div>
                                                  <div className="flex flex-col gap-1.5">
                                                       <Label htmlFor={`rule-consequences-${rule.id}`}>Consequences</Label>
                                                       <Textarea
                                                            id={`rule-consequences-${rule.id}`}
                                                            value={editRuleConsequences}
                                                            onChange={(e) => setEditRuleConsequences(e.target.value)}
                                                       />
                                                  </div>
                                                  <div className="flex flex-col gap-1.5">
                                                       <Label htmlFor={`rule-notes-${rule.id}`}>Notes</Label>
                                                       <Textarea
                                                            id={`rule-notes-${rule.id}`}
                                                            value={editRuleNotes}
                                                            onChange={(e) => setEditRuleNotes(e.target.value)}
                                                       />
                                                  </div>
                                                  <div className="flex gap-2">
                                                       <Button onClick={saveEditRule} disabled={savingRule || !editRuleName.trim()}>
                                                            {savingRule ? 'Saving…' : 'Save'}
                                                       </Button>
                                                       <Button variant="secondary" onClick={() => setEditingRuleId(null)}>Cancel</Button>
                                                  </div>
                                             </div>
                                        ) : (
                                             <>
                                                  <div className="flex items-start justify-between">
                                                       <span className="font-semibold">{rule.name}</span>
                                                       <div className="flex gap-2">
                                                            <Button variant="secondary" size="sm" onClick={() => startEditRule(rule)}>Edit</Button>
                                                            <Button
                                                                 variant="ghost"
                                                                 size="icon"
                                                                 className="h-7 w-7 text-red-500 hover:text-red-500"
                                                                 onClick={() => handleDeleteRule(rule.id)}
                                                                 aria-label="Delete rule"
                                                            >
                                                                 ✕
                                                            </Button>
                                                       </div>
                                                  </div>
                                                  {(rule.consiquences || rule.consequences) && (
                                                       <p className="mt-2 text-sm text-muted-foreground">
                                                            <strong>Consequences:</strong> {rule.consiquences || rule.consequences}
                                                       </p>
                                                  )}
                                                  {rule.notes && (
                                                       <p className="mt-2 text-sm text-muted-foreground">
                                                            <strong>Notes:</strong> {rule.notes}
                                                       </p>
                                                  )}
                                             </>
                                        )}
                                   </CardContent>
                              </Card>
                         ))}
                    </div>
               )}

               <Dialog open={addRuleModalOpen} onOpenChange={setAddRuleModalOpen}>
                    <DialogContent>
                         <DialogHeader>
                              <DialogTitle>Add Rule</DialogTitle>
                         </DialogHeader>
                         <div className="flex flex-col gap-4 py-4">
                              <div className="flex flex-col gap-1.5">
                                   <Label htmlFor="new-rule-name">Rule Name</Label>
                                   <Input
                                        id="new-rule-name"
                                        placeholder="Enter rule name"
                                        value={newRuleName}
                                        onChange={(e) => setNewRuleName(e.target.value)}
                                        required
                                   />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                   <Label htmlFor="new-rule-consequences">Consequences</Label>
                                   <Textarea
                                        id="new-rule-consequences"
                                        placeholder="What happens when the rule is broken?"
                                        value={newRuleConsequences}
                                        onChange={(e) => setNewRuleConsequences(e.target.value)}
                                   />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                   <Label htmlFor="new-rule-notes">Notes</Label>
                                   <Textarea
                                        id="new-rule-notes"
                                        placeholder="Additional notes (optional)"
                                        value={newRuleNotes}
                                        onChange={(e) => setNewRuleNotes(e.target.value)}
                                   />
                              </div>
                         </div>
                         <DialogFooter>
                              <Button variant="secondary" onClick={() => setAddRuleModalOpen(false)}>Cancel</Button>
                              <Button onClick={handleAddRule} disabled={submittingRule || !newRuleName.trim()}>
                                   {submittingRule ? 'Creating…' : 'Create Rule'}
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>
          </div>
     );
};

export default DisciplinePlanDetailPage;