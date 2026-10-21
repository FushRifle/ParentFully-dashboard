import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Loading, Table, Text } from '@nextui-org/react';
import { api } from '../lib';
import { Box } from '../components/styles/box';
import { Flex } from '../components/styles/flex';

export default function ReferralsPage() {
   const [rows, setRows] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [status, setStatus] = useState('');
   const [option, setOption] = useState('');

   const load = useCallback(async () => {
      setLoading(true); setError(null);
      try {
         const { data } = await api.get('/v1/admin/referral-reward-claims', { params: { per_page: 100, ...(status ? { status } : {}), ...(option ? { selected_option: option } : {}) } });
         const nextRows = Array.isArray(data?.data?.data) ? data.data.data : Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
         setRows(nextRows);
      } catch (err: any) { setError(err?.response?.data?.message ?? 'Unable to load referral claims.'); }
      finally { setLoading(false); }
   }, [status, option]);

   useEffect(() => { const timer = setTimeout(load, option ? 250 : 0); return () => clearTimeout(timer); }, [load, option]);
   const visibleRows = useMemo(() => rows.filter((row) => {
      const matchesStatus = !status || row.status === status;
      const matchesOption = !option.trim() || String(row.selected_option ?? '').toLowerCase().includes(option.trim().toLowerCase());
      return matchesStatus && matchesOption;
   }), [option, rows, status]);

   const fulfil = async (row: any) => {
      const reference = window.prompt('Optional fulfilment reference', row.fulfillment_reference ?? ''); if (reference === null) return;
      try { await api.post(`/v1/admin/referral-reward-claims/${row.id}/mark-fulfilled`, { fulfillment_reference: reference || null }); await load(); }
      catch (err: any) { setError(err?.response?.data?.message ?? 'Unable to fulfil claim.'); }
   };
   const cancel = async (row: any) => {
      if (!window.confirm('Cancel this referral reward claim?')) return;
      try { await api.patch(`/v1/admin/referral-reward-claims/${row.id}/status`, { status: 'cancelled' }); await load(); }
      catch (err: any) { setError(err?.response?.data?.message ?? 'Unable to cancel claim.'); }
   };
   const clearFilters = () => { setStatus(''); setOption(''); };

   return <Box className="admin-page" css={{ maxW: '1440px', mx: 'auto' }}>
      <Flex justify="between" align="end" css={{ mb: '$6', gap: '$4', flexWrap: 'wrap' }}>
         <Box><Text h2 css={{ m: 0, fontSize: '1.35rem' }}>Referrals</Text><Text size="$sm" css={{ color: '$accents7' }}>Parent Points reward claims and fulfilment.</Text></Box>
         <Flex css={{ gap: '$3', flexWrap: 'wrap' }}><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option><option value="pending_fulfillment">Pending</option><option value="credited">Credited</option><option value="fulfilled">Fulfilled</option><option value="cancelled">Cancelled</option></select><input aria-label="Filter by reward option" placeholder="Reward option" value={option} onChange={(event) => setOption(event.target.value)} /><Button auto flat onPress={load}>Refresh</Button></Flex>
      </Flex>
      {error && <Text color="error" size="$sm">{error}</Text>}
      {loading ? <Box className="glass-panel admin-empty-state"><Loading size="sm">Loading referral claims…</Loading></Box> : visibleRows.length === 0 ? (
         <Box className="glass-panel admin-empty-state"><span aria-hidden="true">0</span><Text b>No referral claims found</Text><Text size="$sm" css={{ color: '$accents7' }}>{status || option ? 'No claims match the selected filters.' : 'Reward claims will appear here when customers submit them.'}</Text>{(status || option) && <Button auto flat size="sm" onPress={clearFilters}>Clear filters</Button>}</Box>
      ) : <Box className="glass-panel glass-table"><Table aria-label="Referral reward claims" shadow={false}>
         <Table.Header><Table.Column>USER</Table.Column><Table.Column>FAMILY</Table.Column><Table.Column>REWARD</Table.Column><Table.Column>VALUE</Table.Column><Table.Column>STATUS</Table.Column><Table.Column>CLAIMED</Table.Column><Table.Column>ACTIONS</Table.Column></Table.Header>
         <Table.Body items={visibleRows}>{(row) => <Table.Row key={row.id}><Table.Cell>{row.user?.name ?? '—'}<Text size="$xs">{row.user?.email ?? '—'}</Text></Table.Cell><Table.Cell>{row.family?.name ?? '—'}</Table.Cell><Table.Cell>{row.selected_option ?? '—'}</Table.Cell><Table.Cell>{row.reward_value ?? row.points_value ?? '—'}</Table.Cell><Table.Cell><Badge variant="flat">{row.status}</Badge></Table.Cell><Table.Cell>{row.created_at ? new Date(row.created_at).toLocaleDateString() : '—'}</Table.Cell><Table.Cell><Flex css={{ gap: '$2' }}><Button auto light disabled={row.status === 'fulfilled'} onPress={() => fulfil(row)}>Fulfil</Button><Button auto light color="error" disabled={['fulfilled', 'credited', 'cancelled'].includes(row.status)} onPress={() => cancel(row)}>Cancel</Button></Flex></Table.Cell></Table.Row>}</Table.Body>
      </Table></Box>}
   </Box>;
}
