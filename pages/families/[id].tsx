import React, { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Baby, ChevronRight, Home, Mail, UserRound, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import ChatAvatarWrapper from '@/components/Avatar/ChatAvatarWrapper';

export default function FamilyDetailPage() {
   const router = useRouter();
   const id = Number(router.query.id);
   const [family, setFamily] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [updatingMember, setUpdatingMember] = useState<number | null>(null);

   const load = useCallback(async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
         const response = await api.get(`/v1/admin/families/${id}`);
         setFamily(response.data?.data ?? response.data);
      } catch (err: any) {
         setFamily(null);
         setError(err?.response?.data?.message ?? 'Unable to load family.');
      } finally {
         setLoading(false);
      }
   }, [id]);

   useEffect(() => {
      load();
   }, [load]);

   const updateRole = async (memberId: number, role: string) => {
      setUpdatingMember(memberId);
      setError(null);
      try {
         await api.put(`/v1/admin/families/${id}/members/${memberId}`, { role });
         await load();
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Unable to update member role.');
      } finally {
         setUpdatingMember(null);
      }
   };

   const removeMember = async (member: any) => {
      if (!window.confirm(`Remove ${member.user?.name ?? 'this invitation'} from the family?`)) return;
      setUpdatingMember(member.id);
      setError(null);
      try {
         await api.delete(`/v1/admin/families/${id}/members/${member.id}`);
         await load();
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Unable to remove member.');
      } finally {
         setUpdatingMember(null);
      }
   };

   const members = useMemo(() => family?.members ?? [], [family]);
   const acceptedMembers = useMemo(
      () =>
         members.filter(
            (member: any) =>
               member.status === 'accepted' &&
               member.user?.id &&
               member.user.id !== family?.owner?.id,
         ),
      [family, members],
   );
   const invitations = useMemo(
      () => members.filter((member: any) => member.status !== 'accepted' || !member.user?.id),
      [members],
   );
   const peopleCount = (family?.owner ? 1 : 0) + acceptedMembers.length;
   const childrenCount = (family?.children ?? []).length;

   if (loading)
      return (
         <div className="glass-panel admin-empty-state">
            <AppLoadingState message="Loading family…" />
         </div>
      );

   if (error && !family)
      return (
         <div className="glass-panel admin-empty-state flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-red-500">{error}</p>
            <Button variant="secondary" onClick={() => router.push('/families')}>Back to families</Button>
         </div>
      );

   if (!family) return null;

   return (
      <div className="admin-page family-detail-page">
         <button className="admin-back-link" type="button" onClick={() => router.push('/families')}>
            <ArrowLeft size={15} />
            Back to families
         </button>

         <div className="glass-panel glass-hero">
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
               <div className="flex min-w-0 items-center gap-4">
                  <span className="families-hero-mark">
                     <Home size={20} />
                  </span>
                  <div className="min-w-0">
                     <p className="section-kicker">Family #{family.id}</p>
                     <h2 className="m-0 mt-1 text-[1.4rem] font-semibold">
                        {family.name || `Family #${family.id}`}
                     </h2>
                     <p className="mt-1 text-sm text-muted-foreground">
                        Created{' '}
                        {family.created_at
                           ? new Date(family.created_at).toLocaleDateString()
                           : 'date unavailable'}
                     </p>
                  </div>
               </div>

               <div className="ml-auto shrink-0">
                  <NextLink href={`/family-activity?familyId=${family.id}`} className="inline-flex h-9 items-center rounded-xl border border-primary/40 bg-primary/10 px-4 text-sm font-semibold">View activity</NextLink>
               </div>
            </div>
               <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border/60 pt-4">
                  <StatChip label="Members" value={peopleCount} hint="Owner + accepted members" />
                  <StatChip label="Invitations" value={invitations.length} hint="Pending or declined" />
                  <StatChip label="Children" value={childrenCount} hint="Linked children" />
               </div>
         </div>

         {error && (
            <div className="mt-4 rounded-lg border border-red-300 bg-red-500/10 p-4 text-sm text-red-500">
               {error}
            </div>
         )}

         <div className="family-detail-grid">
            <section className="glass-panel family-section">
               <SectionHeader
                  title="Family people"
                  hint="Owner is listed separately from additional members."
                  count={`${peopleCount} ${peopleCount === 1 ? 'person' : 'people'}`}
               />
               <div className="family-section-body">
                  {family.owner ? (
                     <article className="family-person-row">
                        <span className="family-person-avatar">
                           <ChatAvatarWrapper profile_image={family.owner.profile_image} contactName={family.owner.name} size={36} />
                        </span>
                        <div className="family-person-identity">
                           <strong>{family.owner.name || 'Unnamed owner'}</strong>
                           <small>{family.owner.email || 'Email unavailable'}</small>
                        </div>
                        <div className="family-person-actions">
                           <Badge variant="default">Owner</Badge>
                        </div>
                     </article>
                  ) : (
                     <div className="family-inline-empty">This family has no linked owner.</div>
                  )}

                  {acceptedMembers.map((member: any) => (
                     <article className="family-person-row" key={member.id}>
                        <span className="family-person-avatar">
                           <ChatAvatarWrapper profile_image={member.user?.profile_image} contactName={member.user?.name} size={36} />
                        </span>
                        <div className="family-person-identity">
                           <strong>{member.user?.name ?? 'Unnamed member'}</strong>
                           <small>
                              {member.user?.email ?? 'Email unavailable'} · Joined{' '}
                              {member.joined_at
                                 ? new Date(member.joined_at).toLocaleDateString()
                                 : 'date unavailable'}
                           </small>
                        </div>
                        <div className="family-person-actions">
                           <select
                              className="family-role-select rounded-md border bg-background px-2 py-1 text-sm"
                              aria-label={`Role for ${member.user?.name ?? 'member'}`}
                              value={member.role ?? ''}
                              disabled={updatingMember === member.id}
                              onChange={(event) => updateRole(member.id, event.target.value)}
                           >
                              <option value="co_parent">Co-parent</option>
                              <option value="third_party">Third party</option>
                           </select>
                           <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              disabled={updatingMember === member.id}
                              onClick={() => removeMember(member)}
                           >
                              Remove
                           </Button>
                        </div>
                     </article>
                  ))}

                  {!acceptedMembers.length && (
                     <div className="family-inline-empty">No additional accepted members.</div>
                  )}
               </div>
            </section>

            <section className="glass-panel family-section">
               <SectionHeader
                  title="Children"
                  hint="Children connected through this family ID."
                  count={childrenCount}
               />
               <div className="family-section-body">
                  {(family.children ?? []).map((child: any) => (
                     <NextLink
                        href={`/families/${family.id}/children/${child.id}`}
                        key={child.id}
                        className="family-person-row family-child-link"
                     >
                        <span className="family-person-avatar child">
                           <ChatAvatarWrapper photo={child.photo} profile_image={child.profile_image} contactName={child.name} size={36} />
                        </span>
                        <div className="family-person-identity">
                           <strong>{child.name || 'Unnamed child'}</strong>
                           <small>
                              {child.dob
                                 ? `Born ${new Date(`${child.dob}T00:00:00`).toLocaleDateString()}`
                                 : 'Date of birth unavailable'}
                           </small>
                        </div>
                        <div className="family-person-actions">
                           <span className="family-child-open">
                              View profile <ChevronRight size={15} />
                           </span>
                        </div>
                     </NextLink>
                  ))}
                  {!childrenCount && (
                     <div className="family-inline-empty">No children linked to this family.</div>
                  )}
               </div>
            </section>

            <section className="glass-panel family-section family-invitations">
               <SectionHeader
                  title="Member invitations"
                  hint="These records are not counted as active household people."
                  count={invitations.length}
               />
               <div className="family-section-body">
                  {invitations.map((member: any) => (
                     <article className="family-person-row" key={member.id}>
                        <span className="family-person-avatar pending">
                           <Mail size={17} />
                        </span>
                        <div className="family-person-identity">
                           <strong>{member.user?.name ?? 'Pending invitation'}</strong>
                           <small>{member.user?.email ?? 'Invite email is not returned by the API'}</small>
                        </div>
                        <div className="family-person-actions">
                           <Badge variant={member.status === 'declined' ? 'destructive' : 'secondary'}>
                              {member.status ?? 'pending'}
                           </Badge>
                           <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              disabled={updatingMember === member.id}
                              onClick={() => removeMember(member)}
                           >
                              Remove
                           </Button>
                        </div>
                     </article>
                  ))}
                  {!invitations.length && (
                     <div className="family-inline-empty">No pending or declined invitations.</div>
                  )}
               </div>
            </section>
         </div>
      </div>
   );
}

const StatChip = ({ label, value, hint }: { label: string; value: number; hint?: string }) => (
   <div className="flex min-w-[120px] flex-col gap-0.5 rounded-lg border border-indigo-300/20 bg-white/[0.04] px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-xl font-semibold leading-none">{String(value ?? 0)}</span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
   </div>
);

const SectionHeader = ({ title, hint, count }: { title: string; hint: string; count: number | string }) => (
   <header className="family-section-header flex items-start justify-between gap-3">
      <div className="flex flex-col">
         <span className="text-sm font-semibold">{title}</span>
         <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
      <Badge variant="secondary">{count}</Badge>
   </header>
);
