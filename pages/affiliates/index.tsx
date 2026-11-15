import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib';
import { usePageSearch } from '@/lib/context/searchContext';
import { SegmentedTabs } from '@/components/shared/segmented-tabs';
import { TableExport } from '@/components/shared/table-export';
import { AppLoadingState } from '@/components/shared/app-loading-state';

const tabs = [
   'applications',
   'school_applications',
   'partners',
   'referrals',
   'commissions',
   'payouts',
] as const;
type Tab = (typeof tabs)[number];

const endpoints: Record<Tab, string> = {
   applications: '/v1/admin/affiliate-applications',
   school_applications: '/v1/admin/affiliate-applications',
   partners: '/v1/admin/affiliate-partners',
   referrals: '/v1/admin/affiliate-referrals',
   commissions: '/v1/admin/affiliate-commissions',
   payouts: '/v1/admin/affiliate-payouts',
};

const tabLabels: Record<Tab, string> = {
   applications: 'Parent applications',
   school_applications: 'School applications',
   partners: 'Partners',
   referrals: 'Referrals',
   commissions: 'Commissions',
   payouts: 'Payouts',
};

const tabOptions = tabs.map((value) => ({ value, label: tabLabels[value] }));

const columnLabels: Record<Tab, string[]> = {
   applications: ['Applicant', 'Email', 'Affiliate type', 'Requested rate', 'Status', 'Applied'],
   school_applications: ['School', 'Email', 'Country', 'Requested rate', 'Status', 'Applied'],
   partners: ['Partner', 'Email', 'Commission rate', 'Codes', 'Referrals', 'Status'],
   referrals: ['Partner', 'Code', 'Referred user', 'Status', 'Created', 'Paid'],
   commissions: ['Partner', 'Customer', 'Payment amount', 'Commission', 'Rate', 'Status'],
   payouts: ['Partner', 'Amount', 'Currency', 'Status', 'Requested', 'Reference'],
};

const badgeIndexes: Record<Tab, number[]> = {
   applications: [4],
   school_applications: [4],
   partners: [5],
   referrals: [3, 5],
   commissions: [5],
   payouts: [3],
};

const rowsFrom = (payload: any) =>
   Array.isArray(payload?.data?.data)
      ? payload.data.data
      : Array.isArray(payload?.data)
         ? payload.data
         : Array.isArray(payload)
            ? payload
            : [];

const displayValue = (value: unknown) => {
   if (value === null || value === undefined || value === '') return '—';
   return String(value).replaceAll('_', ' ');
};

const normalizeStatus = (value: unknown) =>
   String(value ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_');

const valuesForRow = (tab: Tab, row: any): unknown[] => {
   switch (tab) {
      case 'applications':
         return [row.name, row.email, row.affiliate_type, row.requested_commission_rate, row.status, row.created_at];
      case 'school_applications':
         return [row.name, row.email, row.country, row.requested_commission_rate, row.status, row.created_at];
      case 'partners':
         return [row.name, row.email, row.commission_rate, row.codes_count, row.referrals_count, row.status];
      case 'referrals':
         return [row.partner?.name, row.code?.code, row.referred_user?.name, row.status, row.created_at, row.paid_at];
      case 'commissions':
         return [row.partner?.name, row.referral?.referred_user?.name, row.payment_amount_minor, row.amount_minor, row.rate, row.status];
      case 'payouts':
         return [row.partner?.name, row.amount_minor, row.currency, row.status, row.requested_at, row.payment_reference];
   }
};

export default function AffiliatesPage() {
   const { search } = usePageSearch();
   const [tab, setTab] = useState<Tab>('applications');
   const [rows, setRows] = useState<any[]>([]);
   const [status, setStatus] = useState('');
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

   const load = useCallback(async () => {
      setLoading(true);
      setError('');
      try {
         const params: Record<string, string | number> = { per_page: 100 };
         if (status) params.status = status;
         if (tab === 'applications') params.affiliate_type = 'parent';
         if (tab === 'school_applications') params.affiliate_type = 'school';
         const response = await api.get(endpoints[tab], { params });
         setRows(rowsFrom(response.data));
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Unable to load affiliate records.');
      } finally {
         setLoading(false);
      }
   }, [tab, status]);

   useEffect(() => {
      load();
   }, [load]);

   useEffect(() => {
      setError('');
   }, [tab, status]);

   const visibleRows = useMemo(() => {
      const query = search.trim().toLowerCase();
      const statusKey = normalizeStatus(status);
      return rows.filter((row) => {
         const matchesStatus = !statusKey || normalizeStatus(row.status) === statusKey;
         const matchesSearch = !query || JSON.stringify(row).toLowerCase().includes(query);
         return matchesStatus && matchesSearch;
      });
   }, [rows, search, status]);

   const approve = async (row: any) => {
      const rate = window.prompt('Commission rate (%)', String(row.requested_commission_rate ?? 20));
      if (rate === null || rate.trim() === '') return;
      try {
         await api.post(`/v1/admin/affiliate-applications/${row.id}/approve`, {
            type: 'standard',
            commission_rate: Number(rate),
            default_currency: 'USD',
            minimum_payout_minor: 2500,
         });
         await load();
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Approval failed.');
      }
   };

   const reject = async (row: any) => {
      if (!window.confirm(`Reject ${row.name}?`)) return;
      const notes = window.prompt('Review notes', '') ?? '';
      try {
         await api.post(`/v1/admin/affiliate-applications/${row.id}/reject`, {
            review_notes: notes || null,
         });
         await load();
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Rejection failed.');
      }
   };

   const createPartner = async () => {
      const name = window.prompt('Partner name');
      if (!name) return;
      const email = window.prompt('Partner email');
      if (!email) return;
      try {
         await api.post('/v1/admin/affiliate-partners', {
            name,
            email,
            affiliate_type: 'parent',
            type: 'standard',
            commission_rate: 20,
            default_currency: 'USD',
            minimum_payout_minor: 2500,
         });
         await load();
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Partner creation failed.');
      }
   };

   const editPartner = async (row: any) => {
      const name = window.prompt('Partner name', row.name);
      if (!name) return;
      const rate = window.prompt('Commission rate (%)', String(row.commission_rate ?? 20));
      if (rate === null) return;
      try {
         await api.put(`/v1/admin/affiliate-partners/${row.id}`, {
            name,
            commission_rate: Number(rate),
         });
         await load();
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Partner update failed.');
      }
   };

   const createCode = async (row: any) => {
      const code = window.prompt('Custom code (leave blank to generate)', '');
      if (code === null) return;
      try {
         await api.post(`/v1/admin/affiliate-partners/${row.id}/codes`, code ? { code } : {});
         await load();
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Code creation failed.');
      }
   };

   const togglePartner = async (row: any) => {
      try {
         if (row.status === 'active') {
            await api.post(`/v1/admin/affiliate-partners/${row.id}/disable`);
         } else {
            await api.put(`/v1/admin/affiliate-partners/${row.id}`, { status: 'active' });
            await api.post(`/v1/admin/affiliate-partners/${row.id}/codes`, {});
         }
         await load();
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Partner status update failed.');
      }
   };

   const updatePayout = async (row: any, paid = false) => {
      if (!window.confirm(paid ? 'Mark this payout paid?' : 'Approve this payout?')) return;
      const reference = paid ? window.prompt('Payment reference', row.payment_reference ?? '') : null;
      if (paid && reference === null) return;
      try {
         await api.post(
            `/v1/admin/affiliate-payouts/${row.id}/${paid ? 'mark-paid' : 'approve'}`,
            paid ? { payment_reference: reference || null } : {},
         );
         await load();
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Payout update failed.');
      }
   };

   const showActions = ['applications', 'school_applications', 'partners', 'payouts'].includes(tab);

   return (
      <div className="mx-auto max-w-[1440px] p-6">
         <div className="glass-panel glass-hero">
            <div className="flex flex-wrap items-center justify-between gap-5">
               <div>
                  <p className="section-kicker">Partner operations</p>
                  <h2 className="m-0 mt-1 text-[1.4rem] font-semibold">Affiliates</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                     Applications, partners, commissions and payouts in one workspace.
                  </p>
               </div>
               {tab === 'partners' && (
                  <Button onClick={createPartner}>Add partner</Button>
               )}
            </div>
         </div>

         <div className="glass-panel affiliate-toolbar mt-4 flex flex-wrap items-end justify-between gap-4 p-4">
            <SegmentedTabs
               tabs={tabOptions}
               value={tab}
               onChange={(next) => {
                  setTab(next);
                  setStatus('');
               }}
               ariaLabel="Affiliate sections"
               className="affiliate-tabs"
            />
            <div className="flex flex-wrap items-end gap-3">
               <div className="affiliate-status-filter flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <Select value={status || '__all__'} onValueChange={(v: any) => setStatus(v === '__all__' ? '' : v)}>
                     <SelectTrigger className="h-9 w-44">
                        <SelectValue placeholder="All statuses" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="__all__">All statuses</SelectItem>
                        <SelectItem value="pending_review">Pending review</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <TableExport
                  rows={visibleRows}
                  filename={`affiliates-${tab}`}
                  title={`${tabLabels[tab]} report`}
                  columns={columnLabels[tab].map((label, index) => ({
                     key: String(index),
                     label,
                     value: (row: any) => valuesForRow(tab, row)[index],
                  }))}
               />
            </div>
         </div>

         {error && (
            <div className="mt-4 rounded-lg border border-red-300 bg-red-500/10 p-4 text-sm text-red-500">
               {error}
            </div>
         )}

         {loading ? (
            <div className="glass-panel mt-4">
               <AppLoadingState message={`Loading ${tabLabels[tab].toLowerCase()}…`} />
            </div>
         ) : visibleRows.length === 0 ? (
            <div className="glass-panel admin-empty-state mt-4 flex flex-col items-center gap-3 py-12 text-center">
               <span className="grid h-12 w-12 place-items-center rounded-full bg-muted text-lg">0</span>
               <p className="font-semibold">No {tabLabels[tab].toLowerCase()} found</p>
               <p className="text-sm text-muted-foreground">
                  {status ? 'No records match the selected status.' : 'Records will appear here when they become available.'}
               </p>
               {status && (
                  <Button variant="secondary" size="sm" onClick={() => setStatus('')}>
                     Clear filter
                  </Button>
               )}
            </div>
         ) : (
            <div className="glass-panel glass-table mt-4">
               <Table>
                  <TableHeader>
                     <TableRow>
                        {[...columnLabels[tab], ...(showActions ? ['Actions'] : [])].map((heading) => (
                           <TableHead key={heading}>{heading.toUpperCase()}</TableHead>
                        ))}
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {visibleRows.map((row) => {
                        const cells = valuesForRow(tab, row);
                        const badgeCols = badgeIndexes[tab];
                        return (
                           <TableRow key={row.id}>
                              {cells.map((value, index) =>
                                 badgeCols.includes(index) ? (
                                    <TableCell key={`${tab}-${index}`}>
                                       <Badge variant="secondary">{displayValue(value)}</Badge>
                                    </TableCell>
                                 ) : (
                                    <TableCell key={`${tab}-${index}`}>
                                       <span className="text-sm capitalize">{displayValue(value)}</span>
                                    </TableCell>
                                 ),
                              )}
                              {showActions && (
                                 <TableCell>
                                    <div className="flex flex-wrap gap-2">
                                       {(tab === 'applications' || tab === 'school_applications') && (
                                          <>
                                             <Button
                                                variant="secondary"
                                                size="sm"
                                                disabled={row.status !== 'pending_review'}
                                                onClick={() => approve(row)}
                                             >
                                                Approve
                                             </Button>
                                             <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500"
                                                disabled={row.status !== 'pending_review'}
                                                onClick={() => reject(row)}
                                             >
                                                Reject
                                             </Button>
                                          </>
                                       )}
                                       {tab === 'partners' && (
                                          <>
                                             <Button variant="ghost" size="sm" onClick={() => editPartner(row)}>
                                                Edit
                                             </Button>
                                             <Button variant="ghost" size="sm" onClick={() => createCode(row)}>
                                                Create code
                                             </Button>
                                             <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500"
                                                onClick={() => togglePartner(row)}
                                             >
                                                {row.status === 'active' ? 'Disable' : 'Enable'}
                                             </Button>
                                          </>
                                       )}
                                       {tab === 'payouts' && (
                                          <>
                                             <Button
                                                variant="secondary"
                                                size="sm"
                                                disabled={row.status !== 'pending'}
                                                onClick={() => updatePayout(row)}
                                             >
                                                Approve
                                             </Button>
                                             <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={row.status === 'paid'}
                                                onClick={() => updatePayout(row, true)}
                                             >
                                                Mark paid
                                             </Button>
                                          </>
                                       )}
                                    </div>
                                 </TableCell>
                              )}
                           </TableRow>
                        );
                     })}
                  </TableBody>
               </Table>
            </div>
         )}
      </div>
   );
}