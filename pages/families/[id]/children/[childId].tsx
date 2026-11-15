import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Baby, CalendarDays, Heart, Home, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib';
import { AppLoadingState } from '@/components/shared/app-loading-state';

const formatDate = (value?: string | null) =>
   value
      ? new Date(value.length === 10 ? `${value}T00:00:00` : value).toLocaleDateString(undefined, {
         month: 'long',
         day: 'numeric',
         year: 'numeric',
      })
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

   useEffect(() => {
      load();
   }, [load]);

   const interests = useMemo(() => {
      if (Array.isArray(child?.child_interest)) return child.child_interest.filter(Boolean);
      if (typeof child?.child_interest === 'string' && child.child_interest.trim()) {
         try {
            const parsed = JSON.parse(child.child_interest);
            return Array.isArray(parsed) ? parsed.filter(Boolean) : [child.child_interest];
         } catch {
            return child.child_interest
               .split(',')
               .map((item: string) => item.trim())
               .filter(Boolean);
         }
      }
      return [];
   }, [child]);

   const backToFamily = () => router.push(`/families/${child?.family?.id ?? familyId}`);

   if (loading)
      return (
         <div className="glass-panel">
            <AppLoadingState message="Loading child profile…" />
         </div>
      );

   if (error || !child)
      return (
         <div className="glass-panel admin-empty-state flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-red-500">{error ?? 'Child not found.'}</p>
            <Button variant="secondary" onClick={backToFamily}>Back to family</Button>
         </div>
      );

   return (
      <div className="admin-page child-detail-page">
         <button className="admin-back-link" type="button" onClick={backToFamily}>
            <ArrowLeft size={15} />
            Back to family
         </button>

         <div className="glass-panel glass-hero child-profile-hero">
            <div className="flex flex-wrap items-center gap-4">
               <span className="child-profile-avatar">
                  {child.photo ? <img src={child.photo} alt="" /> : <Baby size={25} />}
               </span>
               <div>
                  <p className="section-kicker">Child profile · #{child.id}</p>
                  <h2 className="m-0 mt-1 text-[1.4rem] font-semibold">{child.name || 'Unnamed child'}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Account information</p>
               </div>
            </div>
         </div>

         <div className="child-profile-grid">
            <section className="glass-panel child-profile-card">
               <header className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-muted"><CalendarDays size={17} /></span>
                  <div>
                     <p className="text-sm font-semibold">Profile details</p>
                     <p className="text-xs text-muted-foreground">Personal information saved for this child</p>
                  </div>
               </header>
               <dl className="mt-4 flex flex-col gap-3">
                  <div className="flex justify-between gap-4">
                     <dt className="text-sm text-muted-foreground">Date of birth</dt>
                     <dd className="text-sm font-medium">{formatDate(child.dob)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                     <dt className="text-sm text-muted-foreground">Gender</dt>
                     <dd className="text-sm font-medium">{child.gender || 'Not provided'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                     <dt className="text-sm text-muted-foreground">Profile created</dt>
                     <dd className="text-sm font-medium">{formatDate(child.created_at)}</dd>
                  </div>
               </dl>
            </section>

            <section className="glass-panel child-profile-card">
               <header className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-muted"><Home size={17} /></span>
                  <div>
                     <p className="text-sm font-semibold">Family account</p>
                     <p className="text-xs text-muted-foreground">Household connected to this profile</p>
                  </div>
               </header>
               {child.family ? (
                  <div className="child-family-summary mt-4 flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3">
                     <div>
                        <strong className="block text-sm">{child.family.name || `Family #${child.family.id}`}</strong>
                        <small className="text-xs text-muted-foreground">Family ID · {child.family.id}</small>
                     </div>
                     <Badge variant="secondary">Linked</Badge>
                  </div>
               ) : (
                  <div className="family-inline-empty mt-4 text-sm text-muted-foreground">
                     No family is linked to this child.
                  </div>
               )}
               {child.family?.owner && (
                  <div className="child-family-owner mt-3 flex items-center gap-2">
                     <UserRound size={16} className="text-muted-foreground" />
                     <div>
                        <small className="block text-xs text-muted-foreground">Family owner</small>
                        <strong className="text-sm">{child.family.owner.name || 'Unnamed owner'}</strong>
                     </div>
                  </div>
               )}
            </section>

            <section className="glass-panel child-profile-card child-interests-card">
               <header className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-muted"><Heart size={17} /></span>
                  <div>
                     <p className="text-sm font-semibold">Interests</p>
                     <p className="text-xs text-muted-foreground">Interests recorded on this profile</p>
                  </div>
               </header>
               {interests.length ? (
                  <div className="child-interest-list mt-4 flex flex-wrap gap-2">
                     {interests.map((interest: string, index: number) => (
                        <Badge variant="secondary" key={`${interest}-${index}`}>{interest}</Badge>
                     ))}
                  </div>
               ) : (
                  <div className="family-inline-empty mt-4 text-sm text-muted-foreground">
                     No interests have been recorded.
                  </div>
               )}
               {child.notes && (
                  <div className="child-notes mt-4 rounded-md border bg-muted/30 p-3">
                     <small className="block text-xs text-muted-foreground">Notes</small>
                     <p className="mt-1 text-sm">{child.notes}</p>
                  </div>
               )}
            </section>
         </div>
      </div>
   );
}