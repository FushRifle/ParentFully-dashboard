import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Card, Input, Loading, Modal, Table, Text, Textarea } from '@nextui-org/react';
import { ArrowDown, ArrowLeft, ArrowUp, Edit2, Plus, Sparkles, Trash2 } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { api } from '../../../../lib';
import { Box } from '../../../../components/styles/box';
import { Flex } from '../../../../components/styles/flex';
import { Select } from '../../../../components/styles/select';

type FocusSkill = {
   id: number;
   title: string;
   description?: string | null;
   smart_section: string;
   section_label?: string;
   target_progress?: number | null;
   mastery_points?: number | null;
   order: number;
   is_active: boolean;
};

type SkillForm = {
   title: string;
   description: string;
   smart_section: string;
   target_progress: string;
   mastery_points: string;
   is_active: string;
};

const emptyForm: SkillForm = {
   title: '', description: '', smart_section: 'general', target_progress: '1', mastery_points: '0', is_active: '1',
};

const unwrapSkills = (payload: any): FocusSkill[] => {
   const value = payload?.data?.data ?? payload?.data ?? payload;
   return Array.isArray(value) ? value : [];
};

export default function GoalFocusSkillsPage() {
   const router = useRouter();
   const categoryId = Number(router.query.id);
   const goalId = Number(router.query.goalId);
   const [goal, setGoal] = useState<any>(null);
   const [skills, setSkills] = useState<FocusSkill[]>([]);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [open, setOpen] = useState(false);
   const [editing, setEditing] = useState<FocusSkill | null>(null);
   const [form, setForm] = useState<SkillForm>(emptyForm);

   const load = useCallback(async () => {
      if (!goalId) return;
      setLoading(true);
      setError(null);
      try {
         const [goalResponse, skillsResponse] = await Promise.all([
            api.get('/v1/admin/goals', { params: { category_id: categoryId, per_page: 100 } }),
            api.get(`/v2/admin/goals/${goalId}/focus-skills`),
         ]);
         const goalRows = goalResponse.data?.data ?? [];
         setGoal(goalRows.find((item: any) => Number(item.id) === goalId) ?? null);
         setSkills(unwrapSkills(skillsResponse.data).sort((a, b) => a.order - b.order));
      } catch (err: any) {
         setError(err?.response?.data?.message ?? err?.message ?? 'Unable to load goal skills.');
      } finally {
         setLoading(false);
      }
   }, [categoryId, goalId]);

   useEffect(() => { void load(); }, [load]);

   const showCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
   const showEdit = (skill: FocusSkill) => {
      setEditing(skill);
      setForm({
         title: skill.title,
         description: skill.description ?? '',
         smart_section: skill.smart_section,
         target_progress: String(skill.target_progress ?? 1),
         mastery_points: String(skill.mastery_points ?? 0),
         is_active: skill.is_active ? '1' : '0',
      });
      setOpen(true);
   };

   const save = async () => {
      if (!form.title.trim()) return;
      setSaving(true);
      setError(null);
      const payload = {
         title: form.title.trim(),
         description: form.description.trim() || null,
         smart_section: form.smart_section,
         target_progress: Number(form.target_progress),
         mastery_points: form.mastery_points === '' ? null : Number(form.mastery_points),
         is_active: form.is_active === '1',
      };
      try {
         if (editing) await api.put(`/v2/admin/goals/${goalId}/focus-skills/${editing.id}`, payload);
         else await api.post(`/v2/admin/goals/${goalId}/focus-skills`, { ...payload, order: skills.length });
         setOpen(false);
         await load();
      } catch (err: any) {
         const validation = err?.response?.data?.errors;
         setError(validation ? Object.values(validation).flat().join(' ') : err?.response?.data?.message ?? 'Unable to save skill.');
      } finally { setSaving(false); }
   };

   const remove = async (skill: FocusSkill) => {
      if (!window.confirm(`Remove “${skill.title}”? Existing child history will be preserved.`)) return;
      try { await api.delete(`/v2/admin/goals/${goalId}/focus-skills/${skill.id}`); await load(); }
      catch (err: any) { setError(err?.response?.data?.message ?? 'Unable to remove skill.'); }
   };

   const move = async (index: number, direction: -1 | 1) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= skills.length) return;
      const next = [...skills];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      setSkills(next);
      try {
         await api.put(`/v2/admin/goals/${goalId}/focus-skills/reorder`, {
            items: next.map((skill, order) => ({ id: skill.id, order })),
         });
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Unable to reorder skills.');
         await load();
      }
   };

   if (!router.isReady) return null;

   return (
      <Box className="admin-page">
         <NextLink href={`/goal-categories/${categoryId}`} passHref legacyBehavior>
            <a className="admin-back-link"><ArrowLeft size={15} />Back to goals</a>
         </NextLink>
         <Box className="glass-panel glass-hero">
            <Flex justify="between" align="center" css={{ gap: '$5', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
               <Flex align="center" css={{ gap: '$4' }}>
                  <Box css={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', color: '#8b83ff', bg: 'rgba(99,91,255,.12)' }}><Sparkles size={20} /></Box>
                  <Box><Text className="section-kicker">Goal library</Text><Text h2 css={{ m: 0, fontSize: '1.35rem' }}>{goal?.title ?? 'Focus Skills'}</Text><Text size="$xs" css={{ color: '$accents7' }}>Manage the predefined skills offered with this goal.</Text></Box>
               </Flex>
               <Button auto color="primary" icon={<Plus size={16} />} onPress={showCreate}>Add skill</Button>
            </Flex>
         </Box>
         {error && <Text color="error" size="$sm" css={{ mb: '$4' }}>{error}</Text>}
         <Card><Card.Body css={{ p: 0 } as any}>
            {loading ? <Box css={{ p: '$10', textAlign: 'center' }}><Loading size="sm">Loading focus skills…</Loading></Box> : skills.length === 0 ? (
               <Box css={{ p: '$12', textAlign: 'center' }}><Text b>No focus skills yet</Text><Text size="$sm" css={{ color: '$accents7', mt: '$2' }}>Add the first predefined skill for this goal.</Text></Box>
            ) : (
               <Table aria-label="Goal focus skills" css={{ minWidth: 760 }}>
                  <Table.Header><Table.Column>SKILL</Table.Column><Table.Column>SECTION</Table.Column><Table.Column>TIMES</Table.Column><Table.Column>POINTS</Table.Column><Table.Column>STATUS</Table.Column><Table.Column>ACTIONS</Table.Column></Table.Header>
                  <Table.Body>{skills.map((skill, index) => (
                     <Table.Row key={skill.id}>
                        <Table.Cell><Text b size="$sm">{skill.title}</Text><Text size="$xs" css={{ color: '$accents7', maxW: 340 }}>{skill.description || 'No description'}</Text></Table.Cell>
                        <Table.Cell>{skill.section_label ?? skill.smart_section.replaceAll('_', ' ')}</Table.Cell>
                        <Table.Cell>{skill.target_progress ?? '—'}</Table.Cell>
                        <Table.Cell>{skill.mastery_points ?? '—'}</Table.Cell>
                        <Table.Cell><Badge color={skill.is_active ? 'success' : 'default'} variant="flat">{skill.is_active ? 'Active' : 'Inactive'}</Badge></Table.Cell>
                        <Table.Cell><Flex css={{ gap: '$2' }}>
                           <Button auto light size="sm" disabled={index === 0} onPress={() => move(index, -1)} aria-label="Move up"><ArrowUp size={15} /></Button>
                           <Button auto light size="sm" disabled={index === skills.length - 1} onPress={() => move(index, 1)} aria-label="Move down"><ArrowDown size={15} /></Button>
                           <Button auto light size="sm" onPress={() => showEdit(skill)} aria-label="Edit"><Edit2 size={15} /></Button>
                           <Button auto light color="error" size="sm" onPress={() => remove(skill)} aria-label="Remove"><Trash2 size={15} /></Button>
                        </Flex></Table.Cell>
                     </Table.Row>
                  ))}</Table.Body>
               </Table>
            )}
         </Card.Body></Card>
         <Modal closeButton open={open} onClose={() => setOpen(false)} width="580px">
            <Modal.Header><Text b>{editing ? 'Edit focus skill' : 'Add focus skill'}</Text></Modal.Header>
            <Modal.Body css={{ gap: '$5' }}>
               <Input fullWidth label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
               <Textarea fullWidth label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
               <Flex css={{ gap: '$4', flexWrap: 'wrap' }}>
                  <Select
                     value={form.smart_section}
                     onChange={(value) => setForm({ ...form, smart_section: value })}
                     aria-label="SMART section"
                     options={['general','specific','measurable','achievable','relevant','time_bound'].map((value) => ({ value, label: value.replaceAll('_', ' ') }))}
                     css={{ flex: '1 1 220px' }}
                  />
                  <Select
                     value={form.is_active}
                     onChange={(value) => setForm({ ...form, is_active: value })}
                     aria-label="Status"
                     options={[{ value: '1', label: 'Active' }, { value: '0', label: 'Inactive' }]}
                     css={{ flex: '1 1 220px' }}
                  />
               </Flex>
               <Flex css={{ gap: '$4' }}><Input fullWidth type="number" min={1} label="Times" value={form.target_progress} onChange={(e) => setForm({ ...form, target_progress: e.target.value })} /><Input fullWidth type="number" min={0} label="Points" value={form.mastery_points} onChange={(e) => setForm({ ...form, mastery_points: e.target.value })} /></Flex>
            </Modal.Body>
            <Modal.Footer><Button auto flat onPress={() => setOpen(false)}>Cancel</Button><Button auto color="primary" disabled={saving || !form.title.trim()} onPress={save}>{saving ? <Loading size="xs" color="currentColor" /> : 'Save skill'}</Button></Modal.Footer>
         </Modal>
      </Box>
   );
}
