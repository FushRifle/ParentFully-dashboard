import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Badge, Button, Card, Loading, Table, Text } from '@nextui-org/react';
import { Activity, ArrowLeft, Baby, CircleDollarSign, Flag, UserRound } from 'lucide-react';
import { api } from '../../lib';
import { Box } from '../../components/styles/box';
import { Flex } from '../../components/styles/flex';

const collection = (value: any) => Array.isArray(value) ? value : Array.isArray(value?.data) ? value.data : [];

export default function CustomerDetailPage() {
   const router = useRouter();
   const id = Number(router.query.id);
   const [data, setData] = useState<any>(null);
   const [sessions, setSessions] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

   const load = useCallback(async () => {
      if (!id) return;
      setLoading(true); setError('');
      try {
         const [profile, family, goals, children, finance, sessionPage] = await Promise.all([
            api.get(`/v1/admin/app-users/${id}`), api.get(`/v1/admin/app-users/${id}/family`),
            api.get(`/v1/admin/app-users/${id}/goals`), api.get(`/v1/admin/app-users/${id}/children`),
            api.get(`/v1/admin/app-users/${id}/finance`),
            api.get('/v1/admin/analytics/sessions', { params: { period: 'all', page: 1, per_page: 100 } }),
         ]);
         const customer = profile.data;
         setData({ customer, family: family.data?.data ?? family.data, goals: goals.data?.data ?? goals.data, children: children.data?.data ?? children.data, finance: finance.data?.data ?? finance.data });
         setSessions((sessionPage.data?.data?.data ?? []).filter((session: any) => session.user_email?.toLowerCase() === customer.email?.toLowerCase()));
      } catch (err: any) { setError(err?.response?.data?.message ?? 'Unable to load customer journey.'); }
      finally { setLoading(false); }
   }, [id]);

   useEffect(() => { load(); }, [load]);
   const setStatus = async (status: 'active' | 'suspended') => { try { await api.patch(`/v1/admin/app-users/${id}/status`, { status }); await load(); } catch (err: any) { setError(err?.response?.data?.message ?? 'Status update failed.'); } };
   const remove = async () => { if (!window.confirm('Permanently anonymize and remove this customer?')) return; try { await api.delete(`/v1/admin/app-users/${id}`); router.push('/customers'); } catch (err: any) { setError(err?.response?.data?.message ?? 'Customer removal failed.'); } };

   if (loading) return <Box className="glass-panel" css={{ p: '$12', textAlign: 'center' }}><Loading size="sm">Loading customer journey…</Loading></Box>;
   if (error && !data) return <Box className="glass-panel" css={{ p: '$8' }}><Text color="error">{error}</Text></Box>;
   if (!data) return null;

   const c = data.customer;
   const subscription = c.subscriptions?.[0] ?? c.active_subscription;
   const lastSession = sessions[0];
   const stats = [
      ['Account status', c.status ?? '—', '#10b981'],
      ['Subscription', subscription?.plan_type ?? 'Free', '#8b5cf6'],
      ['Onboarding', c.has_completed_onboarding ? 'Complete' : 'Incomplete', '#3b82f6'],
      ['Last app use', lastSession?.opened_at ? new Date(lastSession.opened_at).toLocaleDateString() : 'No activity', '#f97316'],
   ];

   return <Box className="admin-page">
      <Box className="glass-panel glass-hero"><Flex justify="between" align="center" css={{ gap: '$5', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
         <Flex align="center" css={{ gap: '$4' }}><Box css={{ width: 48, height: 48, borderRadius: 15, display: 'grid', placeItems: 'center', color: '#8b83ff', bg: 'rgba(99,91,255,.12)', border: '1px solid rgba(139,131,255,.25)' }}><UserRound size={21} /></Box><Box><Text className="section-kicker">Customer profile</Text><Text h2 css={{ m: 0, mt: '$1', fontSize: '1.4rem' }}>{c.name}</Text><Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>{c.email} · Joined {c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</Text></Box></Flex>
         <Flex css={{ gap: '$2', flexWrap: 'wrap' }}><Button auto flat icon={<ArrowLeft size={15}/>} onPress={() => router.push('/customers')}>Customers</Button><Button auto flat color={c.status === 'suspended' ? 'success' : 'warning'} onPress={() => setStatus(c.status === 'suspended' ? 'active' : 'suspended')}>{c.status === 'suspended' ? 'Reactivate' : 'Suspend'}</Button><Button auto flat color="error" onPress={remove}>Delete</Button></Flex>
      </Flex></Box>
      {error && <Text color="error" size="$sm" css={{ mb: '$4' }}>{error}</Text>}
      <div className="metric-grid">{stats.map(([label, value, color]) => <Box key={String(label)} className="glass-panel metric-tile" css={{ '--tile-accent': color } as any}><Text className="section-kicker">{label}</Text><Text h3 css={{ m: 0, mt: '$3', fontSize: '1.1rem' }}>{value}</Text></Box>)}</div>
      <div className="content-grid" style={{ marginBottom: '1rem' }}>
         <Card css={{ gridColumn: 'span 4' }}><Card.Header css={{ gap: '$3' }}><Baby size={17} color="#ec4899"/><Text b>Children ({collection(data.children).length})</Text></Card.Header><Card.Body css={{ gap: '$3' } as any}>{collection(data.children).length ? collection(data.children).map((child: any) => <Flex key={child.id} justify="between"><Text size="$sm">{child.name}</Text><Text size="$xs" css={{ color: '$accents7' }}>{child.dob ?? 'DOB unavailable'}</Text></Flex>) : <Text size="$sm" css={{ color: '$accents7' }}>No children linked.</Text>}</Card.Body></Card>
         <Card css={{ gridColumn: 'span 4' }}><Card.Header css={{ gap: '$3' }}><Flag size={17} color="#3b82f6"/><Text b>Goals ({collection(data.goals).length})</Text></Card.Header><Card.Body css={{ gap: '$3' } as any}>{collection(data.goals).length ? collection(data.goals).map((goal: any) => <Flex key={goal.id} justify="between"><Text size="$sm">{goal.title ?? goal.name}</Text><Badge variant="flat">{goal.status ?? '—'}</Badge></Flex>) : <Text size="$sm" css={{ color: '$accents7' }}>No goals created.</Text>}</Card.Body></Card>
         <Card css={{ gridColumn: 'span 4' }}><Card.Header css={{ gap: '$3' }}><CircleDollarSign size={17} color="#10b981"/><Text b>Finance snapshot</Text></Card.Header><Card.Body css={{ gap: '$3' } as any}>{Object.entries(data.finance ?? {}).slice(0, 7).map(([key, value]) => <Flex key={key} justify="between"><Text size="$sm" css={{ textTransform: 'capitalize' }}>{key.replaceAll('_', ' ')}</Text><Text b size="$sm">{typeof value === 'object' ? Array.isArray(value) ? value.length : 'Available' : String(value ?? '—')}</Text></Flex>)}</Card.Body></Card>
      </div>
      <Box className="glass-panel" css={{ p: '$5' }}><Flex align="center" css={{ gap: '$3', mb: '$4' }}><Activity size={18} color="#14b8a6"/><Box><Text b>Activity history</Text><Text size="$xs" css={{ color: '$accents7' }}>Chronological app sessions and feature navigation · {sessions.length} sessions</Text></Box></Flex>
         {sessions.length ? <Table aria-label="Customer activity history" shadow={false}><Table.Header><Table.Column>OPENED</Table.Column><Table.Column>PLATFORM</Table.Column><Table.Column>DEVICE</Table.Column><Table.Column>LAST SCREEN</Table.Column><Table.Column>DURATION</Table.Column></Table.Header><Table.Body items={sessions}>{(session) => <Table.Row key={session.id}><Table.Cell>{new Date(session.opened_at).toLocaleString()}</Table.Cell><Table.Cell>{session.platform ?? '—'}</Table.Cell><Table.Cell>{session.device_model ?? '—'}</Table.Cell><Table.Cell>{session.last_screen ?? '—'}</Table.Cell><Table.Cell>{session.duration_seconds ?? 0}s</Table.Cell></Table.Row>}</Table.Body></Table> : <Box css={{ p: '$8', textAlign: 'center' }}><Text size="$sm" css={{ color: '$accents7' }}>No recorded app sessions for this customer.</Text></Box>}
      </Box>
   </Box>;
}
