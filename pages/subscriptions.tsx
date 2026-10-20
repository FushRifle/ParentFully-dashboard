import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, Grid, Input, Loading, Table, Text } from '@nextui-org/react';
import { CreditCard, RefreshCw, ShieldCheck } from 'lucide-react';
import { api } from '../lib';
import { API_V2_BASE_URL } from '../config';
import { Box } from '../components/styles/box';
import { Flex } from '../components/styles/flex';

const text = (value: any) => String(value ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_');
const statusOf = (r: any) => r.cancelled_at || text(r.status).includes('cancel') ? 'cancelled' : text(r.status).includes('expire') ? 'expired' : text(r.status) || 'active';
const categoryOf = (r: any) => {
   const status = statusOf(r); const plan = text(r.plan_code ?? r.plan_type); const gateway = text(r.gateway ?? r.source); const payment = text(r.payment_method);
   if (['cancelled', 'expired'].includes(status)) return 'inactive';
   if (text(r.status).includes('trial') || plan.includes('trial')) return 'trial';
   if (payment.includes('manual_premium_grant') || plan.includes('manual_grant') || (gateway === 'system' && plan.includes('premium'))) return 'manual';
   if (gateway === 'revenuecat' || (Number(r.amount ?? 0) > 0 && status === 'active')) return 'paid';
   return 'free';
};
const getRows = (payload: any) => Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.data?.data) ? payload.data.data : Array.isArray(payload) ? payload : [];
const fmtDate = (value: any) => value ? new Date(value).toLocaleDateString() : '—';

export default function SubscriptionsPage() {
   const [records, setRecords] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
   const [query, setQuery] = useState(''); const [category, setCategory] = useState('all'); const [status, setStatus] = useState('all');
   const [email, setEmail] = useState(''); const [months, setMonths] = useState(12); const [reason, setReason] = useState(''); const [saving, setSaving] = useState(false);
   const load = useCallback(async () => {
      setLoading(true); setError(null);
      try {
         const first = await api.get('/v1/admin/subscriptions', { params: { page: 1, per_page: 100 } });
         const rows = getRows(first.data); const last = Number(first.data?.meta?.last_page ?? first.data?.data?.meta?.last_page ?? 1);
         if (last > 1) { const rest = await Promise.all(Array.from({ length: last - 1 }, (_, i) => api.get('/v1/admin/subscriptions', { params: { page: i + 2, per_page: 100 } }))); rest.forEach((res) => rows.push(...getRows(res.data))); }
         setRecords(rows);
      } catch (err: any) { setError(err?.response?.data?.message ?? 'Unable to load subscriptions.'); }
      finally { setLoading(false); }
   }, []);
   useEffect(() => { load(); }, [load]);
   const filtered = useMemo(() => records.filter((r) => {
      const haystack = [r.user?.name, r.user?.email, r.country, r.plan_type, r.status, categoryOf(r)].join(' ').toLowerCase();
      return (!query || haystack.includes(query.toLowerCase())) && (category === 'all' || categoryOf(r) === category) && (status === 'all' || statusOf(r) === status);
   }), [records, query, category, status]);
   const counts = Object.fromEntries(['paid','manual','trial','inactive','free'].map((key) => [key, records.filter((r) => categoryOf(r) === key).length]));
   const override = async (mode: 'grant' | 'downgrade') => {
      if (!email) return setError('A customer email is required.');
      if (mode === 'downgrade' && !window.confirm(`Downgrade ${email} to Free?`)) return;
      setSaving(true); setError(null);
      try {
         await api.post(`${API_V2_BASE_URL}/admin/subscription-overrides/${mode === 'grant' ? 'grant-premium' : 'downgrade-free'}`, { email, reason: reason || undefined, ...(mode === 'grant' ? { months } : {}) });
         setEmail(''); setReason(''); await load();
      } catch (err: any) { setError(err?.response?.data?.message ?? 'Subscription override failed.'); }
      finally { setSaving(false); }
   };
   const cancel = async (r: any) => { if (!window.confirm(`Cancel ${r.user?.name ?? 'this'} subscription?`)) return; try { await api.post(`/v1/admin/subscriptions/${r.id}/cancel`); await load(); } catch (err: any) { setError(err?.response?.data?.message ?? 'Cancellation failed.'); } };
   return <Box className="admin-page">
      <Box className="glass-panel glass-hero"><Flex justify="between" align="center" css={{ gap: '$5', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}><Flex align="center" css={{ gap: '$4' }}><Box css={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', color: '#f97316', bg: 'rgba(249,115,22,.12)', border: '1px solid rgba(249,115,22,.28)' }}><CreditCard size={20} /></Box><Box><Text className="section-kicker">Revenue & access</Text><Text h2 css={{ m: 0, mt: '$1', fontSize: '1.35rem' }}>Subscriptions</Text><Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>Paying, manual, trial, inactive, and free access in one reconciled view.</Text></Box></Flex><Button auto flat icon={<RefreshCw size={15} />} onPress={load}>Refresh data</Button></Flex></Box>
      <Grid.Container gap={1.2} css={{ p: 0, mb: '$5' }}>{[['Paying',counts.paid,'#10b981'],['Manual Premium',counts.manual,'#8b5cf6'],['Trials',counts.trial,'#3b82f6'],['Expired / cancelled',counts.inactive,'#ef4444'],['Free',counts.free,'#64748b']].map(([label,value,color]) => <Grid key={String(label)} xs={12} sm={6} md={2.4 as any}><Card className="metric-tile" css={{ width: '100%', '--tile-accent': color } as any}><Card.Body><Text className="section-kicker">{label}</Text><Text h3 css={{ m: 0, mt: '$2', fontSize: '1.45rem' }}>{Number(value).toLocaleString()}</Text></Card.Body></Card></Grid>)}</Grid.Container>
      <div className="content-grid" style={{ marginBottom: '1rem' }}><Card css={{ gridColumn: 'span 8' }}><Card.Header css={{ gap: '$3' }}><ShieldCheck size={17} color="#8b83ff"/><Box><Text b>Manual access controls</Text><Text size="$xs" css={{ color: '$accents7' }}>Manual grants remain separate from paid revenue.</Text></Box></Card.Header><Card.Body><Flex css={{ gap: '$3', flexWrap: 'wrap' }}><Input bordered aria-label="Customer email" placeholder="Customer email" value={email} onChange={(e) => setEmail(e.target.value)} /><Input bordered aria-label="Months" type="number" value={String(months)} onChange={(e) => setMonths(Number(e.target.value))} /><Input bordered aria-label="Reason" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} /><Button auto color="primary" disabled={saving} onPress={() => override('grant')}>Grant Premium</Button><Button auto color="error" flat disabled={saving} onPress={() => override('downgrade')}>Downgrade Free</Button></Flex></Card.Body></Card><Card css={{ gridColumn: 'span 4' }}><Card.Body css={{ justifyContent: 'center' } as any}><Text className="section-kicker">Reconciliation</Text><Text h3 css={{ m: 0, mt: '$2' }}>{counts.paid.toLocaleString()} verified payers</Text><Text size="$sm" css={{ color: '$accents7', mt: '$2' }}>{counts.manual.toLocaleString()} manual grants are excluded from paid totals.</Text></Card.Body></Card></div>
      {error && <Text color="error" size="$sm" css={{ mb: '$4' }}>{error}</Text>}
      <Box className="glass-panel glass-toolbar"><Flex justify="between" align="center" css={{ gap: '$4', flexWrap: 'wrap' }}><Box><Text b>Subscriber directory</Text><Text size="$xs" css={{ color: '$accents7' }}>{filtered.length} matching records</Text></Box><Flex css={{ gap: '$3', flexWrap: 'wrap' }}><Input bordered aria-label="Search subscriptions" placeholder="Search subscriptions" value={query} onChange={(e) => setQuery(e.target.value)} /><select value={category} onChange={(e) => setCategory(e.target.value)}>{['all','paid','manual','trial','inactive','free'].map((x) => <option key={x} value={x}>{x}</option>)}</select><select value={status} onChange={(e) => setStatus(e.target.value)}>{['all','active','cancelled','expired'].map((x) => <option key={x} value={x}>{x}</option>)}</select></Flex></Flex></Box>
      {loading ? <Box className="glass-panel" css={{ p: '$10', textAlign: 'center' }}><Loading size="sm">Loading subscriptions…</Loading></Box> : <Box className="glass-panel glass-table"><Table aria-label="Subscriptions" shadow={false}><Table.Header><Table.Column>SUBSCRIBER</Table.Column><Table.Column>ACCESS</Table.Column><Table.Column>PLAN</Table.Column><Table.Column>STATUS</Table.Column><Table.Column>AMOUNT</Table.Column><Table.Column>START</Table.Column><Table.Column>RENEWS / ENDS</Table.Column><Table.Column>ACTIONS</Table.Column></Table.Header><Table.Body items={filtered}>{(r) => <Table.Row key={r.id}><Table.Cell><Text b size="$sm">{r.user?.name ?? 'Unknown'}</Text><Text size="$xs">{r.user?.email ?? '—'}</Text></Table.Cell><Table.Cell><Badge variant="flat">{categoryOf(r)}</Badge></Table.Cell><Table.Cell>{r.plan_type ?? '—'}</Table.Cell><Table.Cell>{statusOf(r)}</Table.Cell><Table.Cell>{r.currency ? `${r.currency} ${r.amount}` : r.amount ?? '—'}</Table.Cell><Table.Cell>{fmtDate(r.start_date)}</Table.Cell><Table.Cell>{fmtDate(r.renews_at ?? r.expires_at ?? r.end_date)}</Table.Cell><Table.Cell><Flex css={{ gap: '$2' }}><Button auto light onPress={() => setEmail(r.user?.email ?? '')}>Override</Button><Button auto light color="error" disabled={statusOf(r) === 'cancelled'} onPress={() => cancel(r)}>Cancel</Button></Flex></Table.Cell></Table.Row>}</Table.Body></Table></Box>}
   </Box>;
}
