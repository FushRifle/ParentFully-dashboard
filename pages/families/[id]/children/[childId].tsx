import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Badge, Button, Loading, Text } from '@nextui-org/react';
import { ArrowLeft, Baby, CalendarDays, Heart, Home, UserRound } from 'lucide-react';
import { api } from '../../../../lib';
import { Box } from '../../../../components/styles/box';
import { Flex } from '../../../../components/styles/flex';

const formatDate = (value?: string | null) => value
   ? new Date(value.length === 10 ? `${value}T00:00:00` : value).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
   : 'Not provided';

export default function ChildDetailPage() {
   const router = useRouter();
   const familyId = Number(router.query.id);
   const childId = Number(router.query.childId);
   const [child, setChild] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const load = useCallback(async () => {
      if (!childId) return;
      setLoading(true);
      setError(null);
      try {
         const response = await api.get(`/v1/admin/children/${childId}`);
         setChild(response.data?.data ?? response.data);
      } catch (err: any) {
         setChild(null);
         setError(err?.response?.data?.message ?? 'Unable to load this child profile.');
      } finally {
         setLoading(false);
      }
   }, [childId]);

   useEffect(() => { load(); }, [load]);

   const interests = useMemo(() => {
      if (Array.isArray(child?.child_interest)) return child.child_interest.filter(Boolean);
      if (typeof child?.child_interest === 'string' && child.child_interest.trim()) {
         try {
            const parsed = JSON.parse(child.child_interest);
            return Array.isArray(parsed) ? parsed.filter(Boolean) : [child.child_interest];
         } catch { return child.child_interest.split(',').map((item: string) => item.trim()).filter(Boolean); }
      }
      return [];
   }, [child]);

   const backToFamily = () => router.push(`/families/${child?.family?.id ?? familyId}`);

   if (loading) return <Box className="glass-panel admin-empty-state"><Loading size="sm">Loading child profile…</Loading></Box>;
   if (error || !child) return <Box className="glass-panel admin-empty-state"><Text color="error">{error ?? 'Child not found.'}</Text><Button auto flat onPress={backToFamily}>Back to family</Button></Box>;

   return <Box className="admin-page child-detail-page">
      <button className="admin-back-link" type="button" onClick={backToFamily}><ArrowLeft size={15} />Back to family</button>

      <Box className="glass-panel glass-hero child-profile-hero">
         <Flex align="center" css={{ gap: '$4', flexWrap: 'wrap' }}>
            <span className="child-profile-avatar">
               {child.photo ? <img src={child.photo} alt="" /> : <Baby size={25} />}
            </span>
            <Box>
               <Text className="section-kicker">Child profile · #{child.id}</Text>
               <Text h2 css={{ m: 0, mt: '$1', fontSize: '1.4rem' }}>{child.name || 'Unnamed child'}</Text>
               <Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>Live account information from the Parentfully API.</Text>
            </Box>
         </Flex>
      </Box>

      <div className="child-profile-grid">
         <section className="glass-panel child-profile-card">
            <header><span><CalendarDays size={17} /></span><div><Text b>Profile details</Text><Text size="$xs" css={{ color: '$accents7' }}>Personal information saved for this child</Text></div></header>
            <dl>
               <div><dt>Date of birth</dt><dd>{formatDate(child.dob)}</dd></div>
               <div><dt>Gender</dt><dd>{child.gender || 'Not provided'}</dd></div>
               <div><dt>Profile created</dt><dd>{formatDate(child.created_at)}</dd></div>
            </dl>
         </section>

         <section className="glass-panel child-profile-card">
            <header><span><Home size={17} /></span><div><Text b>Family account</Text><Text size="$xs" css={{ color: '$accents7' }}>Household connected to this profile</Text></div></header>
            {child.family ? <div className="child-family-summary"><div><strong>{child.family.name || `Family #${child.family.id}`}</strong><small>Family ID · {child.family.id}</small></div><Badge variant="flat">Linked</Badge></div> : <div className="family-inline-empty">No family is linked to this child.</div>}
            {child.family?.owner && <div className="child-family-owner"><UserRound size={16} /><div><small>Family owner</small><strong>{child.family.owner.name || 'Unnamed owner'}</strong></div></div>}
         </section>

         <section className="glass-panel child-profile-card child-interests-card">
            <header><span><Heart size={17} /></span><div><Text b>Interests</Text><Text size="$xs" css={{ color: '$accents7' }}>Interests recorded on this profile</Text></div></header>
            {interests.length ? <div className="child-interest-list">{interests.map((interest: string, index: number) => <Badge variant="flat" key={`${interest}-${index}`}>{interest}</Badge>)}</div> : <div className="family-inline-empty">No interests have been recorded.</div>}
            {child.notes && <div className="child-notes"><small>Notes</small><p>{child.notes}</p></div>}
         </section>
      </div>
   </Box>;
}
