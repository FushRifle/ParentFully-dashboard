import React, { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Badge, Button, Text } from '@nextui-org/react';
import {
   ArrowLeft,
   Baby,
   ChevronRight,
   Home,
   Mail,
   UserRound,
   UsersRound,
} from 'lucide-react';
import { api } from '../../lib';
import { Box } from '../../components/styles/box';
import { Flex } from '../../components/styles/flex';
import { AppLoadingState } from '../../components/shared/app-loading-state';

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
      if (
         !window.confirm(
            `Remove ${member.user?.name ?? 'this invitation'} from the family?`,
         )
      )
         return;
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
      () =>
         members.filter(
            (member: any) => member.status !== 'accepted' || !member.user?.id,
         ),
      [members],
   );
   const peopleCount = (family?.owner ? 1 : 0) + acceptedMembers.length;
   const childrenCount = (family?.children ?? []).length;

   if (loading)
      return (
         <Box className="glass-panel admin-empty-state">
            <AppLoadingState message="Loading family…" />
         </Box>
      );
   if (error && !family)
      return (
         <Box className="glass-panel admin-empty-state">
            <Text color="error">{error}</Text>
            <Button auto flat onPress={() => router.push('/families')}>
               Back to families
            </Button>
         </Box>
      );
   if (!family) return null;

   return (
      <Box className="admin-page family-detail-page">
         <button
            className="admin-back-link"
            type="button"
            onClick={() => router.push('/families')}
         >
            <ArrowLeft size={15} />
            Back to families
         </button>

         {/* ---- Hero with inline stats ---- */}
         <Box className="glass-panel glass-hero">
            <Flex
               justify="between"
               align="center"
               css={{ gap: '$5', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}
            >
               <Flex align="center" css={{ gap: '$4', minWidth: 0 }}>
                  <span className="families-hero-mark">
                     <Home size={20} />
                  </span>
                  <Box css={{ minWidth: 0 }}>
                     <Text className="section-kicker">Family #{family.id}</Text>
                     <Text h2 css={{ m: 0, mt: '$1', fontSize: '1.4rem' }}>
                        {family.name || `Family #${family.id}`}
                     </Text>
                     <Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>
                        Created{' '}
                        {family.created_at
                           ? new Date(family.created_at).toLocaleDateString()
                           : 'date unavailable'}
                     </Text>
                  </Box>
               </Flex>

               {/* Inline stat chips replace the separate metric grid */}
               <Flex css={{ gap: '$3', flexWrap: 'wrap' }} align="center">
                  <StatChip
                     label="Members"
                     value={peopleCount}
                     hint="Owner + accepted members"
                  />
                  <StatChip
                     label="Invitations"
                     value={invitations.length}
                     hint="Pending or declined"
                  />
                  <StatChip label="Children" value={childrenCount} hint="Linked children" />
               </Flex>
            </Flex>
         </Box>

         {error && <div className="feedback-error">{error}</div>}

         <div className="family-detail-grid">
            {/* ---- People ---- */}
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
                           <UserRound size={17} />
                        </span>
                        <div className="family-person-identity">
                           <strong>{family.owner.name || 'Unnamed owner'}</strong>
                           <small>{family.owner.email || 'Email unavailable'}</small>
                        </div>
                        <div className="family-person-actions">
                           <Badge color="success" variant="flat">
                              Owner
                           </Badge>
                        </div>
                     </article>
                  ) : (
                     <div className="family-inline-empty">
                        This family has no linked owner.
                     </div>
                  )}

                  {acceptedMembers.map((member: any) => (
                     <article className="family-person-row" key={member.id}>
                        <span className="family-person-avatar">
                           <UsersRound size={17} />
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
                              className="family-role-select"
                              aria-label={`Role for ${member.user?.name ?? 'member'}`}
                              value={member.role ?? ''}
                              disabled={updatingMember === member.id}
                              onChange={(event) =>
                                 updateRole(member.id, event.target.value)
                              }
                           >
                              <option value="co_parent">Co-parent</option>
                              <option value="third_party">Third party</option>
                           </select>
                           <Button
                              auto
                              light
                              size="sm"
                              color="error"
                              disabled={updatingMember === member.id}
                              onPress={() => removeMember(member)}
                           >
                              Remove
                           </Button>
                        </div>
                     </article>
                  ))}

                  {!acceptedMembers.length && (
                     <div className="family-inline-empty">
                        No additional accepted members.
                     </div>
                  )}
               </div>
            </section>

            {/* ---- Children ---- */}
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
                     >
                        <a className="family-person-row family-child-link">
                           <span className="family-person-avatar child">
                              <Baby size={17} />
                           </span>
                           <div className="family-person-identity">
                              <strong>{child.name || 'Unnamed child'}</strong>
                              <small>
                                 {child.dob
                                    ? `Born ${new Date(
                                       `${child.dob}T00:00:00`,
                                    ).toLocaleDateString()}`
                                    : 'Date of birth unavailable'}
                              </small>
                           </div>
                           <div className="family-person-actions">
                              <span className="family-child-open">
                                 View profile <ChevronRight size={15} />
                              </span>
                           </div>
                        </a>
                     </NextLink>
                  ))}
                  {!childrenCount && (
                     <div className="family-inline-empty">
                        No children linked to this family.
                     </div>
                  )}
               </div>
            </section>

            {/* ---- Invitations (full width) ---- */}
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
                           <small>
                              {member.user?.email ??
                                 'Invite email is not returned by the API'}
                           </small>
                        </div>
                        <div className="family-person-actions">
                           <Badge
                              variant="flat"
                              color={member.status === 'declined' ? 'error' : 'warning'}
                           >
                              {member.status ?? 'pending'}
                           </Badge>
                           <Button
                              auto
                              light
                              size="sm"
                              color="error"
                              disabled={updatingMember === member.id}
                              onPress={() => removeMember(member)}
                           >
                              Remove
                           </Button>
                        </div>
                     </article>
                  ))}
                  {!invitations.length && (
                     <div className="family-inline-empty">
                        No pending or declined invitations.
                     </div>
                  )}
               </div>
            </section>
         </div>
      </Box>
   );
}

/* ---------- Small shared subcomponents ---------- */

const StatChip = ({
   label,
   value,
   hint,
}: {
   label: string;
   value: number;
   hint?: string;
}) => (
   <Flex
      direction="column"
      css={{
         gap: '2px',
         px: '$4',
         py: '$3',
         borderRadius: '$lg',
         minWidth: '120px',
         bg: 'rgba(255,255,255,.04)',
         border: '1px solid rgba(139,131,255,.18)',
      }}
   >
      <Text
         size="$xs"
         css={{
            color: '$accents7',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontWeight: 600,
         }}
      >
         {label}
      </Text>
      <Text h3 css={{ m: 0, fontSize: '1.25rem', lineHeight: 1.1 }}>
         {String(value ?? 0)}
      </Text>
      {hint && (
         <Text size="$xs" css={{ color: '$accents7' }}>
            {hint}
         </Text>
      )}
   </Flex>
);

const SectionHeader = ({
   title,
   hint,
   count,
}: {
   title: string;
   hint: string;
   count: number | string;
}) => (
   <header className="family-section-header">
      <div className="family-section-heading">
         <Text b>{title}</Text>
         <Text size="$xs" css={{ color: '$accents7' }}>
            {hint}
         </Text>
      </div>
      <Badge variant="flat">{count}</Badge>
   </header>
);
