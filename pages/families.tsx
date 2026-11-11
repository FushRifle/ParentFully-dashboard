import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Button, Input, Loading, Table, Text } from '@nextui-org/react';
import { Home, Search, UsersRound } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib';
import { getFamilyStatistics } from '../services/adminService';
import type { AdminFamilyStatistics, PaginationMeta } from '../types/api';
import { Box } from '../components/styles/box';
import { Flex } from '../components/styles/flex';

type FamilyRow = { id: number; name: string; members_count: number; pending_invitations_count: number; children_count: number; created_at: string | null };
type FamilyResponse = { data: FamilyRow[]; meta: PaginationMeta };
const EMPTY_META: PaginationMeta = { current_page: 1, per_page: 20, total: 0, last_page: 1 };
const initials = (name?: string) => (name || 'Family').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

export default function FamiliesPage() {
   const [query, setQuery] = useState('');
   const [search, setSearch] = useState('');
   const [page, setPage] = useState(1);
   useEffect(() => { const timer = window.setTimeout(() => { setSearch(query.trim()); setPage(1); }, 300); return () => window.clearTimeout(timer); }, [query]);

   const statistics = useQuery<AdminFamilyStatistics>({ queryKey: ['family-statistics'], queryFn: getFamilyStatistics, retry: false });
   const families = useQuery<FamilyResponse>({
      queryKey: ['families', page, search],
      queryFn: async () => (await api.get<FamilyResponse>('/v1/admin/families', { params: { page, per_page: 20, ...(search ? { search } : {}) } })).data,
      placeholderData: (previous) => previous,
   });
   const rows = families.data?.data ?? [];
   const meta = families.data?.meta ?? EMPTY_META;
   const error = (families.error as any)?.response?.data?.message ?? '';
   const statisticsUnavailable = statistics.isError;

   return <Box className="admin-page families-page">
      <Box className="glass-panel glass-hero"><Flex justify="between" align="center" css={{ gap: '$5', flexWrap: 'wrap' }}>
         <Flex align="center" css={{ gap: '$4' }}><span className="families-hero-mark"><Home size={20} /></span><Box><Text className="section-kicker">Family directory</Text><Text h2 css={{ m: 0, mt: '$1', fontSize: '1.4rem' }}>Families</Text><Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>Households and children from the live Parentfully API.</Text></Box></Flex>
         <Input bordered clearable aria-label="Search families" placeholder="Search family name…" contentLeft={<Search size={15} />} value={query} onChange={(event) => setQuery(event.target.value)} css={{ width: '290px' }} />
      </Flex></Box>

      <div className="families-metric-grid">
         <Metric label="Families" value={statistics.data?.families_count ?? meta.total} loading={statistics.isLoading && families.isLoading} detail="Family records" />
         <Metric label="Household" value={statistics.data?.household_count} loading={statistics.isLoading} unavailable={statisticsUnavailable} detail="Owners plus accepted members" />
         <Metric label="Children" value={statistics.data?.children_count} loading={statistics.isLoading} unavailable={statisticsUnavailable} detail="Children linked to families" />
      </div>
      <Box className="glass-panel glass-toolbar"><Box><Text b size="$sm">Family records</Text><Text size="$xs" css={{ color: '$accents7', mt: '$1' }}>{meta.total.toLocaleString()} {meta.total === 1 ? 'family' : 'families'}</Text></Box></Box>
      {error ? <div className="feedback-error">{error}</div> : families.isLoading ? <Box className="glass-panel admin-empty-state"><Loading size="sm">Loading families…</Loading></Box> : rows.length === 0 ? <Box className="glass-panel admin-empty-state"><span><UsersRound size={22} /></span><Text b>No families found</Text><Text size="$sm" css={{ color: '$accents7' }}>{search ? 'No family matches this search.' : 'Family records will appear here after registration.'}</Text>{search && <Button auto flat size="sm" onPress={() => setQuery('')}>Clear search</Button>}</Box> : <>
         <Box className="glass-panel families-table-shell"><Table className="families-table" aria-label="Families" shadow={false} css={{ minWidth: '100%' }}>
            <Table.Header><Table.Column>FAMILY</Table.Column><Table.Column>MEMBER RECORDS</Table.Column><Table.Column>PENDING</Table.Column><Table.Column>CHILDREN</Table.Column><Table.Column>CREATED</Table.Column><Table.Column hideHeader>ACTION</Table.Column></Table.Header>
            <Table.Body items={rows}>{(family) => <Table.Row key={family.id}>
               <Table.Cell><NextLink href={`/families/${family.id}`}><a className="family-name-link"><span>{initials(family.name)}</span><div><strong>{family.name || `Family #${family.id}`}</strong><small>Family ID · {family.id}</small></div></a></NextLink></Table.Cell>
               <Table.Cell><Count value={family.members_count} label="additional" /></Table.Cell>
               <Table.Cell><Count value={family.pending_invitations_count} label="pending" /></Table.Cell>
               <Table.Cell><Count value={family.children_count} label="children" child /></Table.Cell>
               <Table.Cell><div className="family-date-cell"><strong>{formatDate(family.created_at)}</strong><small>{family.created_at ? new Date(family.created_at).toLocaleDateString(undefined, { weekday: 'short' }) : 'Date unavailable'}</small></div></Table.Cell>
               <Table.Cell><NextLink href={`/families/${family.id}`}><a className="family-open-link">View family <span>→</span></a></NextLink></Table.Cell>
            </Table.Row>}</Table.Body>
         </Table></Box>
         <Pagination meta={meta} page={page} loading={families.isFetching} onPage={setPage} />
      </>}
   </Box>;
}

const Metric = ({ label, value, loading, unavailable = false, detail }: { label: string; value?: number; loading: boolean; unavailable?: boolean; detail: string }) => <div className="glass-panel families-metric"><span>{label}</span><strong>{loading || unavailable ? '—' : (value ?? 0).toLocaleString()}</strong><small>{unavailable ? 'Summary unavailable' : detail}</small></div>;
const Count = ({ value, label, child = false }: { value?: number; label: string; child?: boolean }) => <span className={`family-count-pill${child ? ' child' : ''}`}><b>{Number(value ?? 0).toLocaleString()}</b><small>{label}</small></span>;
const formatDate = (value: string | null) => value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const Pagination = ({ meta, page, loading, onPage }: { meta: PaginationMeta; page: number; loading: boolean; onPage: (page: number) => void }) => <nav className="admin-pagination" aria-label="Family pages"><Button auto flat size="sm" disabled={page <= 1 || loading} onPress={() => onPage(page - 1)}>Previous</Button><span>Page {meta.current_page} of {Math.max(meta.last_page, 1)}</span><Button auto flat size="sm" disabled={page >= meta.last_page || loading} onPress={() => onPage(page + 1)}>Next</Button></nav>;
