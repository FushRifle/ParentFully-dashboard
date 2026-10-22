import React, { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Badge, Button, Input, Loading, Table, Text } from '@nextui-org/react';
import { AlertCircle, CalendarClock, Check, CircleHelp, CreditCard, Eye, Inbox, Plus, RefreshCw, Search, ShieldCheck, Sparkles, UserX } from 'lucide-react';
import { api } from '../lib';
import { Box } from '../components/styles/box';
import { Flex } from '../components/styles/flex';

interface SubscriptionUser { id: number | string; name: string | null; email: string | null; }
interface SubscriptionRecord {
   id: number | string; user: SubscriptionUser | null; plan_type: string | null; status: string | null;
   amount: number | string | null; start_date: string | null; end_date: string | null;
   cancelled_at: string | null; payment_method: string | null; auto_renewal: boolean; created_at: string | null;
}
type CategoryKey = 'paid' | 'manual' | 'trial' | 'inactive' | 'unverified';
type StatusKey = 'active' | 'trial' | 'cancelled' | 'expired' | 'billing_issue';

const CATEGORY_META: Record<CategoryKey, { label: string; description: string; icon: typeof CreditCard; color: string }> = {
   paid: { label: 'Paid', description: 'Active billed subscriptions', icon: CreditCard, color: '#10b981' },
   manual: { label: 'Manual Premium', description: 'Complimentary access', icon: ShieldCheck, color: '#8b5cf6' },
   trial: { label: 'Free Trials', description: 'Trial access in progress', icon: Sparkles, color: '#3b82f6' },
   inactive: { label: 'Inactive', description: 'Expired or cancelled', icon: UserX, color: '#ef4444' },
   unverified: { label: 'Unverified', description: 'Billing source not confirmed', icon: CircleHelp, color: '#f59e0b' },
};
const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_');
const dateHasPassed = (value: string | null) => {
   if (!value) return false;
   const timestamp = new Date(value.length === 10 ? `${value}T23:59:59` : value).getTime();
   return !Number.isNaN(timestamp) && timestamp < Date.now();
};
const getStatus = (record: SubscriptionRecord): StatusKey => {
   const status = normalize(record.status);
   if (status.includes('billing') || status.includes('past_due') || status.includes('grace')) return 'billing_issue';
   if (record.cancelled_at || status.includes('cancel')) return 'cancelled';
   if (status.includes('expire') || dateHasPassed(record.end_date)) return 'expired';
   if (status.includes('trial')) return 'trial';
   return 'active';
};
const isVerifiedPaid = (record: SubscriptionRecord) => {
   const paymentMethod = normalize(record.payment_method);
   const plan = normalize(record.plan_type);
   const paidMethods = ['revenuecat', 'app_store', 'apple', 'play_store', 'google_play', 'stripe', 'paddle', 'card'];
   const manualMethods = ['manual', 'override', 'system'];
   const recognizedPaidPlan = ['premium', 'monthly', 'yearly', 'annual'].some((paidPlan) => plan.includes(paidPlan));
   const explicitlyManual = manualMethods.some((method) => paymentMethod.includes(method));
   return Number(record.amount) > 0 && !explicitlyManual &&
      (recognizedPaidPlan || paidMethods.some((method) => paymentMethod.includes(method)));
};
const isManualGrant = (record: SubscriptionRecord) => {
   const paymentMethod = normalize(record.payment_method);
   const plan = normalize(record.plan_type);
   const zeroValuePremium = record.amount !== null && Number(record.amount) === 0 && getStatus(record) !== 'trial';
   return paymentMethod.includes('manual') || paymentMethod.includes('override') || paymentMethod.includes('system') || plan.includes('manual_grant') || zeroValuePremium;
};
const getCategory = (record: SubscriptionRecord): CategoryKey => {
   const status = getStatus(record);
   if (status === 'cancelled' || status === 'expired') return 'inactive';
   if (status === 'trial') return 'trial';
   if (isManualGrant(record)) return 'manual';
   if (isVerifiedPaid(record)) return 'paid';
   return 'unverified';
};
const extractRows = (payload: any): SubscriptionRecord[] => {
   if (Array.isArray(payload?.data)) return payload.data;
   if (Array.isArray(payload?.data?.data)) return payload.data.data;
   if (Array.isArray(payload)) return payload;
   return [];
};
const formatDate = (value: string | null) => value
   ? new Date(value.length === 10 ? `${value}T00:00:00` : value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const formatAmount = (value: SubscriptionRecord['amount']) => {
   if (value === null || value === undefined || value === '') return '—';
   const number = Number(value);
   return Number.isFinite(number) ? number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : String(value);
};

export default function SubscriptionsPage() {
   const router = useRouter();
   const [records, setRecords] = useState<SubscriptionRecord[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [query, setQuery] = useState('');
   const [category, setCategory] = useState<'all' | CategoryKey>('all');
   const [status, setStatus] = useState<'all' | StatusKey>('all');
   const [renewal, setRenewal] = useState<'all' | 'on' | 'off'>('all');
   const [updatingId, setUpdatingId] = useState<string | number | null>(null);

   useEffect(() => {
      if (!router.isReady) return;
      const requestedCategory = typeof router.query.category === 'string' ? router.query.category : 'all';
      setCategory(['paid', 'manual', 'trial', 'inactive', 'unverified'].includes(requestedCategory) ? requestedCategory as CategoryKey : 'all');
   }, [router.isReady, router.query.category]);

   const load = useCallback(async () => {
      setLoading(true); setError(null);
      try {
         const first = await api.get('/v1/admin/subscriptions', { params: { page: 1, per_page: 100 } });
         let rows = extractRows(first.data);
         const lastPage = Number(first.data?.meta?.last_page ?? first.data?.data?.meta?.last_page ?? 1);
         if (lastPage > 1) {
            const responses = await Promise.all(Array.from({ length: lastPage - 1 }, (_, index) => api.get('/v1/admin/subscriptions', { params: { page: index + 2, per_page: 100 } })));
            responses.forEach((response) => { rows = rows.concat(extractRows(response.data)); });
         }
         setRecords(Array.from(new Map(rows.map((record) => [String(record.id), record])).values()));
      } catch (err: any) { setError(err?.response?.data?.message ?? 'Unable to load subscriptions.'); }
      finally { setLoading(false); }
   }, []);
   useEffect(() => { load(); }, [load]);

   const counts = useMemo(() => records.reduce<Record<CategoryKey, number>>((result, record) => {
      result[getCategory(record)] += 1; return result;
   }, { paid: 0, manual: 0, trial: 0, inactive: 0, unverified: 0 }), [records]);
   const filteredRecords = useMemo(() => {
      const search = query.trim().toLowerCase();
      return records.filter((record) => {
         const searchable = [record.user?.name, record.user?.email, record.plan_type, record.payment_method, record.id].join(' ').toLowerCase();
         return (!search || searchable.includes(search)) && (category === 'all' || getCategory(record) === category) &&
            (status === 'all' || getStatus(record) === status) && (renewal === 'all' || record.auto_renewal === (renewal === 'on'));
      });
   }, [records, query, category, status, renewal]);
   const hasFilters = Boolean(query.trim()) || category !== 'all' || status !== 'all' || renewal !== 'all';
   const selectCategory = (nextCategory: 'all' | CategoryKey) => {
      setCategory(nextCategory); setStatus('all'); setRenewal('all');
      router.replace({ pathname: '/subscriptions', query: nextCategory === 'all' ? {} : { category: nextCategory } }, undefined, { shallow: true });
   };
   const selectStatus = (nextStatus: 'all' | StatusKey) => {
      setStatus(nextStatus); setCategory('all'); setRenewal('all');
      router.replace({ pathname: '/subscriptions', query: {} }, undefined, { shallow: true });
   };
   const clearFilters = () => { setQuery(''); selectCategory('all'); };

   const updateSubscription = async (record: SubscriptionRecord) => {
      const currentStatus = getStatus(record);
      const action = currentStatus === 'cancelled' ? 'reactivate' : 'cancel';
      const verb = action === 'cancel' ? 'Cancel' : 'Reactivate';
      if (!window.confirm(`${verb} the subscription for ${record.user?.name ?? 'this account'}?`)) return;
      setUpdatingId(record.id); setError(null);
      try { await api.post(`/v1/admin/subscriptions/${record.id}/${action}`); await load(); }
      catch (err: any) { setError(err?.response?.data?.message ?? `Unable to ${action} this subscription.`); }
      finally { setUpdatingId(null); }
   };

   return <Box className="admin-page subscriptions-page">
      <Box className="glass-panel glass-hero subscriptions-hero"><Flex justify="between" align="center" css={{ gap: '$5', flexWrap: 'wrap' }}>
         <Flex align="center" css={{ gap: '$4' }}><span className="subscriptions-hero-mark"><CreditCard size={21} /></span><Box><Text className="section-kicker">Revenue & access</Text><Text h2 css={{ m: 0, mt: '$1', fontSize: '1.4rem' }}>Subscriptions</Text><Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>Billing records and premium access returned by the Parentfully API.</Text></Box></Flex>
         <Flex align="center" css={{ gap: '$3', flexWrap: 'wrap' }}>
            <Input bordered clearable aria-label="Search subscriptions" placeholder="Search name, email, plan…" contentLeft={<Search size={15} />} value={query} onChange={(event) => setQuery(event.target.value)} css={{ width: '280px' }} />
            <Button auto color="secondary" icon={<Plus size={15} />} disabled title="Requires the admin manual-subscription API endpoint">Add manual subscription</Button>
         </Flex>
      </Flex></Box>

      <nav className="subscriptions-view-tabs" aria-label="Subscription views">
         <button type="button" className={category !== 'manual' ? 'active' : ''} onClick={() => selectCategory('all')}>All subscriptions</button>
         <button type="button" className={category === 'manual' ? 'active' : ''} onClick={() => selectCategory('manual')}><ShieldCheck size={14} />Manual premium</button>
      </nav>

      <div className="subscriptions-metric-grid">{(Object.keys(CATEGORY_META) as CategoryKey[]).map((key) => {
         const meta = CATEGORY_META[key]; const Icon = meta.icon;
         return <button type="button" className={`glass-panel subscription-metric ${category === key ? 'active' : ''}`} style={{ '--subscription-accent': meta.color } as React.CSSProperties} key={key} onClick={() => selectCategory(category === key ? 'all' : key)}><span className="subscription-metric-icon"><Icon size={18} /></span><div><small>{meta.label}</small><strong>{loading ? '—' : counts[key].toLocaleString()}</strong><p>{meta.description}</p></div></button>;
      })}</div>

      <Box className="glass-panel subscriptions-audit-note"><AlertCircle size={17} /><div><Text b size="$sm">Database subscription view</Text><Text size="$xs" css={{ color: '$accents7' }}>Positive-value premium, monthly, yearly and annual plans count as paid unless their payment method explicitly identifies a manual grant.</Text></div></Box>
      {error && <div className="feedback-error">{error}</div>}

      <Box className="glass-panel subscriptions-toolbar"><div><Text b size="$sm">Subscription records</Text><Text size="$xs" css={{ color: '$accents7', mt: '$1' }}>{filteredRecords.length.toLocaleString()} of {records.length.toLocaleString()} records</Text></div><div className="subscriptions-filters">
         <label>Category<select value={category} onChange={(event) => selectCategory(event.target.value as 'all' | CategoryKey)}><option value="all">All categories</option><option value="paid">Paid</option><option value="manual">Manual premium</option><option value="trial">Free trials</option><option value="inactive">Inactive</option><option value="unverified">Unverified source</option></select></label>
         <label>Status<select value={status} onChange={(event) => selectStatus(event.target.value as 'all' | StatusKey)}><option value="all">All statuses</option><option value="active">Active</option><option value="trial">Trial</option><option value="cancelled">Cancelled</option><option value="expired">Expired</option><option value="billing_issue">Billing issue</option></select></label>
         <label>Renewal<select value={renewal} onChange={(event) => setRenewal(event.target.value as 'all' | 'on' | 'off')}><option value="all">All renewal states</option><option value="on">Auto-renew on</option><option value="off">Auto-renew off</option></select></label>
         {hasFilters && <button type="button" className="subscriptions-clear" onClick={clearFilters}>Clear</button>}
      </div></Box>

      {loading ? <Box className="glass-panel admin-empty-state"><Loading size="sm">Loading subscriptions…</Loading></Box> : filteredRecords.length === 0 ? <Box className="glass-panel admin-empty-state"><span><Inbox size={22} /></span><Text b>No subscriptions found</Text><Text size="$sm" css={{ color: '$accents7' }}>{hasFilters ? 'No subscription matches the selected filters.' : 'No subscription records were returned by the API.'}</Text>{hasFilters && <Button auto flat size="sm" onPress={clearFilters}>Clear filters</Button>}</Box> : <Box className="glass-panel subscriptions-table-shell"><Table className="subscriptions-table" aria-label="Subscriptions" shadow={false} css={{ minWidth: '100%' }}>
         <Table.Header><Table.Column>SUBSCRIBER</Table.Column><Table.Column>ACCESS</Table.Column><Table.Column>PLAN</Table.Column><Table.Column>AMOUNT</Table.Column><Table.Column>PERIOD</Table.Column><Table.Column>PAYMENT</Table.Column><Table.Column>RENEWAL</Table.Column><Table.Column hideHeader>ACTIONS</Table.Column></Table.Header>
         <Table.Body items={filteredRecords}>{(record) => {
            const recordCategory = getCategory(record); const recordStatus = getStatus(record); const actionAvailable = recordStatus === 'active' || recordStatus === 'cancelled';
            return <Table.Row key={record.id}>
               <Table.Cell><NextLink href={`/subscriptions/${record.id}`}><a className="subscription-cell-link"><div className="subscription-person"><span>{(record.user?.name || record.user?.email || '?').slice(0, 1).toUpperCase()}</span><div><strong>{record.user?.name || 'Unnamed account'}</strong><small>{record.user?.email || 'Account unavailable'}</small></div></div></a></NextLink></Table.Cell>
               <Table.Cell><NextLink href={`/subscriptions/${record.id}`}><a className="subscription-cell-link"><div className={`subscription-access ${recordCategory}`}><strong>{CATEGORY_META[recordCategory].label}</strong><small>{recordStatus.replace('_', ' ')}</small></div></a></NextLink></Table.Cell>
               <Table.Cell><NextLink href={`/subscriptions/${record.id}`}><a className="subscription-cell-link"><span className="subscription-plan">{record.plan_type || 'Not specified'}</span></a></NextLink></Table.Cell>
               <Table.Cell><NextLink href={`/subscriptions/${record.id}`}><a className="subscription-cell-link"><strong className="subscription-amount">{formatAmount(record.amount)}</strong></a></NextLink></Table.Cell>
               <Table.Cell><NextLink href={`/subscriptions/${record.id}`}><a className="subscription-cell-link"><div className="subscription-period"><strong>{formatDate(record.start_date)}</strong><small>to {formatDate(record.end_date)}</small></div></a></NextLink></Table.Cell>
               <Table.Cell><NextLink href={`/subscriptions/${record.id}`}><a className="subscription-cell-link"><span className="subscription-payment">{record.payment_method || 'Not specified'}</span></a></NextLink></Table.Cell>
               <Table.Cell><NextLink href={`/subscriptions/${record.id}`}><a className="subscription-cell-link">{record.auto_renewal ? <Badge color="success" variant="flat"><Check size={11} /> On</Badge> : <Badge variant="flat"><CalendarClock size={11} /> Off</Badge>}</a></NextLink></Table.Cell>
               <Table.Cell><div className="subscription-actions"><NextLink href={`/subscriptions/${record.id}`}><a className="subscription-view-action" aria-label={`View subscription ${record.id}`}><Eye size={14} /></a></NextLink>{actionAvailable ? <button type="button" className={`subscription-row-action ${recordStatus === 'cancelled' ? 'reactivate' : ''}`} disabled={updatingId === record.id} onClick={() => updateSubscription(record)}>{updatingId === record.id ? <RefreshCw size={14} className="spin" /> : recordStatus === 'cancelled' ? 'Reactivate' : 'Cancel'}</button> : <span className="subscription-no-action">—</span>}</div></Table.Cell>
            </Table.Row>;
         }}</Table.Body>
      </Table></Box>}
   </Box>;
}
