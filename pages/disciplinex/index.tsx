import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { getPlans, getTemplatePlans, createPlan, deletePlan } from '@/services/disciplineService';
import type { DisciplinePlan } from '@/types/api';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
     Dialog,
     DialogContent,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from '@/components/ui/dialog';

type FilterTab = 'all' | 'custom' | 'templates';

const DisciplinePlansPage: NextPage = () => {
     const router = useRouter();

     const [customPlans, setCustomPlans] = useState<DisciplinePlan[]>([]);
     const [templatePlans, setTemplatePlans] = useState<DisciplinePlan[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [activeTab, setActiveTab] = useState<FilterTab>('all');

     const [addModalOpen, setAddModalOpen] = useState(false);
     const [formName, setFormName] = useState('');
     const [formDescription, setFormDescription] = useState('');
     const [formNotes, setFormNotes] = useState('');
     const [submitting, setSubmitting] = useState(false);

     const fetchAllPlans = async () => {
          setLoading(true);
          setError(null);
          try {
               const [custom, templates] = await Promise.all([getPlans(), getTemplatePlans()]);
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

     const getDisplayedPlans = (): { plan: DisciplinePlan; isTemplate: boolean }[] => {
          if (activeTab === 'custom') return customPlans.map((p) => ({ plan: p, isTemplate: false }));
          if (activeTab === 'templates') return templatePlans.map((p) => ({ plan: p, isTemplate: true }));
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
               <div className="mb-4 flex items-center justify-between">
                    <h3 className="m-0 text-xl font-semibold">Discipline Plans</h3>
                    <Button onClick={() => setAddModalOpen(true)}>+ Create Plan</Button>
               </div>

               <div className="mb-4 flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                         <Button
                              key={tab.key}
                              variant={activeTab === tab.key ? 'default' : 'secondary'}
                              size="sm"
                              onClick={() => setActiveTab(tab.key)}
                         >
                              {tab.label}
                         </Button>
                    ))}
               </div>

               {error && <p className="mb-4 text-red-500">Error: {error}</p>}

               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {loading && displayedPlans.length === 0 ? (
                         <div className="col-span-full flex justify-center p-8">
                              <AppLoadingState message="Loading discipline plans…" />
                         </div>
                    ) : displayedPlans.length === 0 ? (
                         <div className="col-span-full p-8 text-center text-muted-foreground">
                              No discipline plans found
                         </div>
                    ) : (
                         displayedPlans.map(({ plan, isTemplate }) => (
                              <div key={`${isTemplate ? 'tpl' : 'cst'}-${plan.id}`} className="relative w-full">
                                   <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute right-2 top-2 z-10 h-7 w-7 p-0"
                                        onClick={(e) => {
                                             e.stopPropagation();
                                             handleDeletePlan(plan.id);
                                        }}
                                        aria-label="Delete plan"
                                   >
                                        ✕
                                   </Button>
                                   <Card
                                        className="min-h-[200px] cursor-pointer rounded-xl p-6 transition-transform hover:scale-[1.02]"
                                        onClick={() => router.push(`/disciplinex/${plan.id}`)}
                                   >
                                        <CardContent className="flex flex-col items-center justify-center gap-4 p-0 text-center">
                                             <h4 className="text-lg font-bold" style={{ color: '#FF8C01' }}>{plan.name}</h4>
                                             {plan.description && <p className="text-muted-foreground">{plan.description}</p>}
                                             <div className="flex flex-wrap items-center justify-center gap-2">
                                                  {isTemplate && <Badge variant="secondary">Template</Badge>}
                                                  <span className="text-sm text-muted-foreground">
                                                       {getRuleCount(plan)} {getRuleCount(plan) === 1 ? 'Rule' : 'Rules'}
                                                  </span>
                                             </div>
                                        </CardContent>
                                   </Card>
                              </div>
                         ))
                    )}
               </div>

               <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                    <DialogContent>
                         <DialogHeader>
                              <DialogTitle>Create Discipline Plan</DialogTitle>
                         </DialogHeader>
                         <div className="flex flex-col gap-4 py-4">
                              <div className="flex flex-col gap-1.5">
                                   <Label htmlFor="plan-name">Plan Name</Label>
                                   <Input
                                        id="plan-name"
                                        placeholder="Enter plan name"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        required
                                   />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                   <Label htmlFor="plan-description">Description</Label>
                                   <Textarea
                                        id="plan-description"
                                        placeholder="Plan description (optional)"
                                        value={formDescription}
                                        onChange={(e) => setFormDescription(e.target.value)}
                                   />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                   <Label htmlFor="plan-notes">Notes</Label>
                                   <Textarea
                                        id="plan-notes"
                                        placeholder="Additional notes (optional)"
                                        value={formNotes}
                                        onChange={(e) => setFormNotes(e.target.value)}
                                   />
                              </div>
                         </div>
                         <DialogFooter>
                              <Button variant="secondary" onClick={() => setAddModalOpen(false)}>Cancel</Button>
                              <Button onClick={handleCreatePlan} disabled={submitting || !formName.trim()}>
                                   {submitting ? 'Creating…' : 'Create'}
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>
          </div>
     );
};

export default DisciplinePlansPage;