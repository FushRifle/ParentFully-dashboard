import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Badge, Button, Loading, Text } from '@nextui-org/react';
import { ArrowLeft, CalendarDays, CreditCard, Hash, RefreshCw, ShieldCheck, UserRound } from 'lucide-react';
import { api } from '../../lib';
import { Box } from '../../components/styles/box';
import { Flex } from '../../components/styles/flex';

interface SubscriptionDetail {
   id: number | string;
   user: { id: number | string; name: string | null; email: string | null } | null;
   plan_type: string | null;
   status: string | null;
   amount: number | string | null;
   start_date: string | null;
   end_date: string | null;
   cancelled_at: string | null;
   payment_method: string | null;
   auto_renewal: boolean;
   created_at: string | null;
   transaction_id?: string | null;
   trial_ends_at?: string | null;
   features?: string[] | Record<string, unknown> | null;
}

const formatDate = (value?: string | null) => value
   ? new Date(value.length === 10 ? `${value}T00:00:00` : value).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
   : 'Not provided';
const label = (value?: string | null) => value ? value.replace(/[_-]/g, ' ') : 'Not provided';

export default function SubscriptionDetailPage() {
   const router = useRouter();
   const id = typeof router.query.id === 'string' ? router.query.id : '';
   const [subscription, setSubscription] = useState<SubscriptionDetail | null>(null);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const load = useCallback(async () => {
      if (!id) return;
      setLoading(true); setError(null);
      try {
         const response = await api.get(`/v1/admin/subscriptions/${id}`);
         setSubscription(response.data?.data ?? response.data);
      } catch (err: any) {
         setSubscription(null);
         setError(err?.response?.data?.message ?? 'Unable to load subscription details.');
      } finally { setLoading(false); }
   }, [id]);
   useEffect(() => { load(); }, [load]);

   const status = String(subscription?.status ?? '').toLowerCase();
   const canReactivate = status === 'cancelled' && (!subscription?.end_date || new Date(`${subscription.end_date}T23:59:59`).getTime() >= Date.now());
   const canCancel = status === 'active' || status === 'trial';
   const features = useMemo(() => {
      if (Array.isArray(subscription?.features)) return subscription.features.map(String);
      if (subscription?.features && typeof subscription.features === 'object') return Object.entries(subscription.features).filter(([, enabled]) => Boolean(enabled)).map(([name]) => name);
      return [];
   }, [subscription]);

   const changeStatus = async () => {
      if (!subscription || (!canCancel && !canReactivate)) return;
      const action = canReactivate ? 'reactivate' : 'cancel';
      if (!window.confirm(`${canReactivate ? 'Reactivate' : 'Cancel'} this subscription?`)) return;
      setSaving(true); setError(null);
      try { await api.post(`/v1/admin/subscriptions/${subscription.id}/${action}`); await load(); }
      catch (err: any) { setError(err?.response?.data?.message ?? `Unable to ${action} this subscription.`); }
      finally { setSaving(false); }
   };

   if (loading) return <Box className="glass-panel admin-empty-state"><Loading size="sm">Loading subscription…</Loading></Box>;
   if (error && !subscription) return <Box className="glass-panel admin-empty-state"><Text color="error">{error}</Text><Button auto flat onPress={() => router.push('/subscriptions')}>Back to subscriptions</Button></Box>;
   if (!subscription) return null;

   return <Box className="admin-page subscription-detail-page">
      <button className="admin-back-link" type="button" onClick={() => router.push('/subscriptions')}><ArrowLeft size={15} />Back to subscriptions</button>
      <Box className="glass-panel glass-hero subscription-detail-hero"><Flex justify="between" align="center" css={{ gap: '$5', flexWrap: 'wrap' }}>
         <Flex align="center" css={{ gap: '$4' }}><span className="subscriptions-hero-mark"><CreditCard size={21} /></span><Box><Text className="section-kicker">Subscription #{subscription.id}</Text><Text h2 css={{ m: 0, mt: '$1', fontSize: '1.4rem' }}>{subscription.user?.name || 'Unnamed account'}</Text><Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>{subscription.user?.email || 'Email unavailable'}</Text></Box></Flex>
         <Flex align="center" css={{ gap: '$3' }}><Badge color={status === 'active' ? 'success' : status === 'trial' ? 'primary' : 'error'} variant="flat">{label(subscription.status)}</Badge>{(canCancel || canReactivate) && <Button auto flat color={canReactivate ? 'success' : 'error'} disabled={saving} icon={saving ? <RefreshCw className="spin" size={14} /> : undefined} onPress={changeStatus}>{saving ? 'Updating…' : canReactivate ? 'Reactivate' : 'Cancel subscription'}</Button>}</Flex>
      </Flex></Box>
      {error && <div className="feedback-error">{error}</div>}

      <div className="subscription-detail-grid">
         <section className="glass-panel subscription-detail-card"><header><CreditCard size={17} /><div><Text b>Billing information</Text><Text size="$xs" css={{ color: '$accents7' }}>Plan and payment data from the API</Text></div></header><dl>
            <div><dt>Plan</dt><dd>{label(subscription.plan_type)}</dd></div><div><dt>Amount</dt><dd>{subscription.amount ?? 'Not provided'}</dd></div><div><dt>Payment method</dt><dd>{label(subscription.payment_method)}</dd></div><div><dt>Auto renewal</dt><dd>{subscription.auto_renewal ? 'Enabled' : 'Disabled'}</dd></div>
         </dl></section>
         <section className="glass-panel subscription-detail-card"><header><CalendarDays size={17} /><div><Text b>Subscription timeline</Text><Text size="$xs" css={{ color: '$accents7' }}>Recorded lifecycle dates</Text></div></header><dl>
            <div><dt>Started</dt><dd>{formatDate(subscription.start_date)}</dd></div><div><dt>Ends</dt><dd>{formatDate(subscription.end_date)}</dd></div><div><dt>Trial ends</dt><dd>{formatDate(subscription.trial_ends_at)}</dd></div><div><dt>Cancelled</dt><dd>{formatDate(subscription.cancelled_at)}</dd></div>
         </dl></section>
         <section className="glass-panel subscription-detail-card"><header><UserRound size={17} /><div><Text b>Account</Text><Text size="$xs" css={{ color: '$accents7' }}>Registered Parentfully account</Text></div></header><dl>
            <div><dt>User ID</dt><dd>{subscription.user?.id ?? 'Not linked'}</dd></div><div><dt>Name</dt><dd>{subscription.user?.name || 'Not provided'}</dd></div><div><dt>Email</dt><dd>{subscription.user?.email || 'Not provided'}</dd></div><div><dt>Record created</dt><dd>{formatDate(subscription.created_at)}</dd></div>
         </dl></section>
         <section className="glass-panel subscription-detail-card"><header><Hash size={17} /><div><Text b>Transaction</Text><Text size="$xs" css={{ color: '$accents7' }}>Provider reference and enabled features</Text></div></header><dl><div><dt>Transaction ID</dt><dd className="subscription-transaction-id">{subscription.transaction_id || 'Not provided'}</dd></div></dl>{features.length ? <div className="subscription-feature-list">{features.map((feature) => <Badge variant="flat" key={feature}><ShieldCheck size={11} />{label(feature)}</Badge>)}</div> : <div className="family-inline-empty">No features were returned.</div>}</section>
      </div>
   </Box>;
}
