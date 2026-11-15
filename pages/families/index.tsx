import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Baby, Home, UsersRound } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { api } from '@/lib';
import { getFamilyStatistics } from '@/services/adminService';
import type { AdminFamilyStatistics, PaginationMeta } from '@/types/api';
import { usePageSearch } from '@/lib/context/searchContext';
import { OverviewCard, OverviewCardGrid } from '@/components/shared/overview-card';
import { TableExport } from '@/components/shared/table-export';
import { AppLoadingState } from '@/components/shared/app-loading-state';

type FamilyRow = {
   id: number;
   name: string;
   members_count: number;
   pending_invitations_count: number;
   children_count: number;
   created_at: string | null;
};
type FamilyResponse = { data: FamilyRow[]; meta: PaginationMeta };

const EMPTY_META: PaginationMeta = { current_page: 1, per_page: 20, total: 0, last_page: 1 };

const initials = (name?: string) =>
   (name || 'Family')
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

const formatDate = (value: string | null) =>
   value
      ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      : '—';

export default function FamiliesPage() {
   const { search: query, clearSearch } = usePageSearch();
   const [search, setSearch] = useState('');
   const [page, setPage] = useState(1);

   useEffect(() => {
      const timer = window.setTimeout(() => {
         setSearch(query.trim());
         setPage(1);
      }, 300);
      return () => window.clearTimeout(timer);
   }, [query]);

   const statistics = useQuery<AdminFamilyStatistics>({
      queryKey: ['family-statistics'],
      queryFn: getFamilyStatistics,
      retry: false,
   });

   const families = useQuery<FamilyResponse>({
      queryKey: ['families', page, search],
      queryFn: async () =>
         (
            await api.get<FamilyResponse>('/v1/admin/families', {
               params: { page, per_page: 20, ...(search ? { search } : {}) },
            })
         ).data,
      placeholderData: (previous) => previous,
   });

   const rows = families.data?.data ?? [];
   const meta = families.data?.meta ?? EMPTY_META;
   const error = (families.error as any)?.response?.data?.message ?? '';
   const statisticsUnavailable = statistics.isError;

   return (
      <div className="admin-page families-page">
         <div className="glass-panel glass-hero">
            <div className="flex flex-wrap items-center justify-between gap-5">
               <div className="flex items-center gap-4">
                  <span className="families-hero-mark">
                     <Home size={20} />
                  </span>
                  <div>
                     <p className="section-kicker">Family directory</p>
                     <h2 className="m-0 mt-1 text-[1.4rem] font-semibold">Families</h2>
                     <p className="mt-1 text-sm text-muted-foreground">
                        Households and children from the live Parentfully API.
                     </p>
                  </div>
               </div>

               <OverviewCardGrid columns={2}>
                  <OverviewCard
                     label="Families"
                     value={(statistics.data?.families_count ?? meta.total).toLocaleString()}
                     loading={statistics.isLoading && families.isLoading}
                     description="Family records"
                     icon={Home}
                     color="#10b981"
                  />
                  <OverviewCard
                     label="Children"
                     value={statisticsUnavailable ? '—' : (statistics.data?.children_count ?? 0).toLocaleString()}
                     loading={statistics.isLoading}
                     description={statisticsUnavailable ? 'Summary unavailable' : 'Children linked to families'}
                     icon={Baby}
                     color="#ec4899"
                  />
               </OverviewCardGrid>
            </div>
         </div>

         {error ? (
            <div className="feedback-error mt-4 rounded-lg border border-red-300 bg-red-500/10 p-4 text-sm text-red-500">
               {error}
            </div>
         ) : families.isLoading ? (
            <div className="glass-panel admin-empty-state">
               <AppLoadingState message="Loading families…" />
            </div>
         ) : rows.length === 0 ? (
            <div className="glass-panel admin-empty-state flex flex-col items-center gap-3 py-12 text-center">
               <span className="grid h-12 w-12 place-items-center rounded-full bg-muted">
                  <UsersRound size={22} />
               </span>
               <p className="font-semibold">No families found</p>
               <p className="text-sm text-muted-foreground">
                  {search ? 'No family matches this search.' : 'Family records will appear here after registration.'}
               </p>
               {search && (
                  <Button variant="secondary" size="sm" onClick={clearSearch}>Clear search</Button>
               )}
            </div>
         ) : (
            <>
               <div className="glass-panel families-table-shell">
                  <div className="flex justify-end border-b p-3">
                     <TableExport
                        rows={rows}
                        filename="families"
                        title="Families report"
                        columns={[
                           { key: 'name', label: 'Family' },
                           { key: 'members_count', label: 'Members' },
                           { key: 'pending_invitations_count', label: 'Pending invitations' },
                           { key: 'children_count', label: 'Children' },
                           { key: 'created_at', label: 'Created' },
                        ]}
                     />
                  </div>
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>FAMILY</TableHead>
                           <TableHead>MEMBER RECORDS</TableHead>
                           <TableHead>PENDING</TableHead>
                           <TableHead>CHILDREN</TableHead>
                           <TableHead>CREATED</TableHead>
                           <TableHead>ACTION</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {rows.map((family) => (
                           <TableRow key={family.id}>
                              <TableCell>
                                 <NextLink href={`/families/${family.id}`} className="family-name-link flex items-center gap-3">
                                    <span className="grid h-9 w-9 place-items-center rounded-full bg-muted text-xs font-semibold">
                                       {initials(family.name)}
                                    </span>
                                    <div>
                                       <strong className="block text-sm">{family.name || `Family #${family.id}`}</strong>
                                       <small className="text-xs text-muted-foreground">Family ID · {family.id}</small>
                                    </div>
                                 </NextLink>
                              </TableCell>
                              <TableCell>
                                 <Count value={family.members_count} label="additional" />
                              </TableCell>
                              <TableCell>
                                 <Count value={family.pending_invitations_count} label="pending" />
                              </TableCell>
                              <TableCell>
                                 <Count value={family.children_count} label="children" child />
                              </TableCell>
                              <TableCell>
                                 <div className="family-date-cell">
                                    <strong className="block text-sm">{formatDate(family.created_at)}</strong>
                                    <small className="text-xs text-muted-foreground">
                                       {family.created_at
                                          ? new Date(family.created_at).toLocaleDateString(undefined, { weekday: 'short' })
                                          : 'Date unavailable'}
                                    </small>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <NextLink href={`/families/${family.id}`} className="family-open-link">
                                    View family <span>→</span>
                                 </NextLink>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </div>

               <Pagination meta={meta} page={page} loading={families.isFetching} onPage={setPage} />
            </>
         )}
      </div>
   );
}

const Count = ({ value, label, child = false }: { value?: number; label: string; child?: boolean }) => (
   <span className={`family-count-pill${child ? ' child' : ''} inline-flex items-center gap-1.5`}>
      <b className="text-sm font-semibold">{Number(value ?? 0).toLocaleString()}</b>
      <small className="text-xs text-muted-foreground">{label}</small>
   </span>
);

const Pagination = ({
   meta,
   page,
   loading,
   onPage,
}: {
   meta: PaginationMeta;
   page: number;
   loading: boolean;
   onPage: (page: number) => void;
}) => (
   <nav className="admin-pagination mt-4 flex items-center justify-center gap-4" aria-label="Family pages">
      <Button variant="secondary" size="sm" disabled={page <= 1 || loading} onClick={() => onPage(page - 1)}>
         Previous
      </Button>
      <span className="text-sm">
         Page {meta.current_page} of {Math.max(meta.last_page, 1)}
      </span>
      <Button variant="secondary" size="sm" disabled={page >= meta.last_page || loading} onClick={() => onPage(page + 1)}>
         Next
      </Button>
   </nav>
);