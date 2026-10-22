import React, { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { Button, Input, Loading, Table, Text } from '@nextui-org/react';
import { Home, Search, UsersRound } from 'lucide-react';
import { api } from '../lib';
import { Box } from '../components/styles/box';
import { Flex } from '../components/styles/flex';

type FamilyRow = {
   id: number;
   name: string;
   owner?: { id: number; name: string; email: string } | null;
   members_count?: number;
   children_count?: number;
   created_at?: string;
};

const rowsFrom = (payload: any): FamilyRow[] => Array.isArray(payload?.data) ? payload.data : [];
const initials = (name?: string) => (name || 'Family').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

export default function FamiliesPage() {
   const [families, setFamilies] = useState<FamilyRow[]>([]);
   const [query, setQuery] = useState('');
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

   const load = useCallback(async () => {
      setLoading(true); setError('');
      try {
         const first = await api.get('/v1/admin/families', { params: { page: 1, per_page: 100 } });
         let rows = rowsFrom(first.data);
         const lastPage = Number(first.data?.meta?.last_page ?? 1);
         if (lastPage > 1) {
            const pages = await Promise.all(Array.from({ length: lastPage - 1 }, (_, index) =>
               api.get('/v1/admin/families', { params: { page: index + 2, per_page: 100 } })
            ));
            pages.forEach((response) => { rows = rows.concat(rowsFrom(response.data)); });
         }
         setFamilies(Array.from(new Map(rows.map((family) => [family.id, family])).values()));
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Unable to load families.');
         setFamilies([]);
      } finally { setLoading(false); }
   }, []);

   useEffect(() => { load(); }, [load]);

   const visibleFamilies = useMemo(() => {
      const search = query.trim().toLowerCase();
      if (!search) return families;
      return families.filter((family) => [family.name, family.owner?.name, family.owner?.email]
         .some((value) => String(value ?? '').toLowerCase().includes(search)));
   }, [families, query]);

   const totals = useMemo(() => families.reduce((result, family) => ({
      additionalMembers: result.additionalMembers + Number(family.members_count ?? 0),
      children: result.children + Number(family.children_count ?? 0),
   }), { additionalMembers: 0, children: 0 }), [families]);

   return <Box className="admin-page families-page">
      <Box className="glass-panel glass-hero">
         <Flex justify="between" align="center" css={{ gap: '$5', flexWrap: 'wrap' }}>
            <Flex align="center" css={{ gap: '$4' }}><span className="families-hero-mark"><Home size={20} /></span><Box><Text className="section-kicker">Family directory</Text><Text h2 css={{ m: 0, mt: '$1', fontSize: '1.4rem' }}>Families</Text><Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>Owners, additional family members and children from the live family API.</Text></Box></Flex>
            <Input bordered clearable aria-label="Search families" placeholder="Search family, owner or email…" contentLeft={<Search size={15} />} value={query} onChange={(event) => setQuery(event.target.value)} css={{ width: '290px' }} />
         </Flex>
      </Box>

      <div className="families-metric-grid">
         <div className="glass-panel families-metric"><span>Families</span><strong>{loading ? '—' : families.length.toLocaleString()}</strong><small>Family records</small></div>
         <div className="glass-panel families-metric"><span>Household</span><strong>{loading ? '—' : (families.filter((family) => family.owner).length + totals.additionalMembers).toLocaleString()}</strong><small>Owners plus member records</small></div>
         <div className="glass-panel families-metric"><span>Children</span><strong>{loading ? '—' : totals.children.toLocaleString()}</strong><small>Children linked to families</small></div>
      </div>

      <Box className="glass-panel glass-toolbar">
         <Box><Text b size="$sm">Family records</Text><Text size="$xs" css={{ color: '$accents7', mt: '$1' }}>{visibleFamilies.length.toLocaleString()} of {families.length.toLocaleString()} families</Text></Box>
      </Box>

      {error ? <div className="feedback-error">{error}</div> : loading ? (
         <Box className="glass-panel admin-empty-state"><Loading size="sm">Loading families…</Loading></Box>
      ) : visibleFamilies.length === 0 ? (
         <Box className="glass-panel admin-empty-state"><span><UsersRound size={22} /></span><Text b>No families found</Text><Text size="$sm" css={{ color: '$accents7' }}>{query ? 'No family or owner matches this search.' : 'Family records will appear here after registration.'}</Text>{query && <Button auto flat size="sm" onPress={() => setQuery('')}>Clear search</Button>}</Box>
      ) : <Box className="glass-panel families-table-shell"><Table className="families-table" aria-label="Families" shadow={false} css={{ minWidth: '100%' }}>
         <Table.Header><Table.Column>FAMILY</Table.Column><Table.Column>MEMBER RECORDS</Table.Column><Table.Column>CHILDREN</Table.Column><Table.Column>CREATED</Table.Column><Table.Column hideHeader>ACTION</Table.Column></Table.Header>
         <Table.Body items={visibleFamilies}>{(family) => <Table.Row key={family.id}>
            <Table.Cell><NextLink href={`/families/${family.id}`}><a className="family-name-link"><span>{initials(family.name)}</span><div><strong>{family.name || `Family #${family.id}`}</strong><small>Family ID · {family.id}</small></div></a></NextLink></Table.Cell>
            <Table.Cell><span className="family-count-pill"><b>{Number(family.members_count ?? 0).toLocaleString()}</b><small>additional</small></span></Table.Cell>
            <Table.Cell><span className="family-count-pill child"><b>{Number(family.children_count ?? 0).toLocaleString()}</b><small>children</small></span></Table.Cell>
            <Table.Cell><div className="family-date-cell"><strong>{family.created_at ? new Date(family.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</strong><small>{family.created_at ? new Date(family.created_at).toLocaleDateString(undefined, { weekday: 'short' }) : 'Date unavailable'}</small></div></Table.Cell>
            <Table.Cell><NextLink href={`/families/${family.id}`}><a className="family-open-link">View family <span>→</span></a></NextLink></Table.Cell>
         </Table.Row>}</Table.Body>
      </Table></Box>}
   </Box>;
}
