import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Loading, Table, Text } from '@nextui-org/react';
import { api } from '../lib';
import { Box } from '../components/styles/box';
import { Flex } from '../components/styles/flex';
import { usePageSearch } from '../lib/context/searchContext';
import { SegmentedTabs } from '@/components/shared/segmented-tabs';

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

/** Indexes (within `columnLabels[tab]`) that should render as a flat badge. */
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
         return [
            row.name,
            row.email,
            row.affiliate_type,
            row.requested_commission_rate,
            row.status,
            row.created_at,
         ];
      case 'school_applications':
         return [
            row.name,
            row.email,
            row.country,
            row.requested_commission_rate,
            row.status,
            row.created_at,
         ];
      case 'partners':
         return [
            row.name,
            row.email,
            row.commission_rate,
            row.codes_count,
            row.referrals_count,
            row.status,
         ];
      case 'referrals':
         return [
            row.partner?.name,
            row.code?.code,
            row.referred_user?.name,
            row.status,
            row.created_at,
            row.paid_at,
         ];
      case 'commissions':
         return [
            row.partner?.name,
            row.referral?.referred_user?.name,
            row.payment_amount_minor,
            row.amount_minor,
            row.rate,
            row.status,
         ];
      case 'payouts':
         return [
            row.partner?.name,
            row.amount_minor,
            row.currency,
            row.status,
            row.requested_at,
            row.payment_reference,
         ];
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

   // Clear stale errors when the user changes tab or status.
   useEffect(() => {
      setError('');
   }, [tab, status]);

   const visibleRows = useMemo(() => {
      const query = search.trim().toLowerCase();
      const statusKey = normalizeStatus(status);
      return rows.filter((row) => {
         const matchesStatus = !statusKey || normalizeStatus(row.status) === statusKey;
         const matchesSearch =
            !query || JSON.stringify(row).toLowerCase().includes(query);
         return matchesStatus && matchesSearch;
      });
   }, [rows, search, status]);

   const approve = async (row: any) => {
      const rate = window.prompt(
         'Commission rate (%)',
         String(row.requested_commission_rate ?? 20),
      );
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
      const rate = window.prompt(
         'Commission rate (%)',
         String(row.commission_rate ?? 20),
      );
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
         await api.post(
            `/v1/admin/affiliate-partners/${row.id}/codes`,
            code ? { code } : {},
         );
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
            await api.put(`/v1/admin/affiliate-partners/${row.id}`, {
               status: 'active',
            });
            await api.post(`/v1/admin/affiliate-partners/${row.id}/codes`, {});
         }
         await load();
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Partner status update failed.');
      }
   };

   const updatePayout = async (row: any, paid = false) => {
      if (!window.confirm(paid ? 'Mark this payout paid?' : 'Approve this payout?'))
         return;
      const reference = paid
         ? window.prompt('Payment reference', row.payment_reference ?? '')
         : null;
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

   const showActions = [
      'applications',
      'school_applications',
      'partners',
      'payouts',
   ].includes(tab);

   return (
      <Box className="admin-page affiliates-page" css={{ maxW: '1440px', mx: 'auto' }}>
         <Box className="glass-panel glass-hero">
            <Flex justify="between" align="center" css={{ gap: '$5', flexWrap: 'wrap' }}>
               <Box>
                  <Text className="section-kicker">Partner operations</Text>
                  <Text h2 css={{ m: 0, mt: '$1', fontSize: '1.4rem' }}>
                     Affiliates
                  </Text>
                  <Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>
                     Applications, partners, commissions and payouts in one workspace.
                  </Text>
               </Box>
               {tab === 'partners' && (
                  <Button auto color="primary" onPress={createPartner}>
                     Add partner
                  </Button>
               )}
            </Flex>
         </Box>

         <Box className="glass-panel affiliate-toolbar">
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
            <label className="affiliate-status-filter">
               <span>Status</span>
               <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="">All statuses</option>
                  <option value="pending_review">Pending review</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
               </select>
            </label>
         </Box>

         {error && <div className="feedback-error">{error}</div>}

         {loading ? (
            <Box className="glass-panel admin-empty-state">
               <Loading size="sm">Loading {tabLabels[tab].toLowerCase()}…</Loading>
            </Box>
         ) : visibleRows.length === 0 ? (
            <Box className="glass-panel admin-empty-state">
               <span aria-hidden="true">0</span>
               <Text b>No {tabLabels[tab].toLowerCase()} found</Text>
               <Text size="$sm" css={{ color: '$accents7' }}>
                  {status
                     ? 'No records match the selected status.'
                     : 'Records will appear here when they become available.'}
               </Text>
               {status && (
                  <Button auto flat size="sm" onPress={() => setStatus('')}>
                     Clear filter
                  </Button>
               )}
            </Box>
         ) : (
            <Box className="glass-panel affiliate-table-wrap">
               <Table
                  key={tab}
                  aria-label={`${tabLabels[tab]} records`}
                  shadow={false}
                  css={{ minWidth: '100%' }}
               >
                  <Table.Header>
                     {[
                        ...columnLabels[tab],
                        ...(showActions ? ['Actions'] : []),
                     ].map((heading) => (
                        <Table.Column key={heading}>{heading.toUpperCase()}</Table.Column>
                     ))}
                  </Table.Header>
                  <Table.Body items={visibleRows}>
                     {(row) => {
                        const cells = valuesForRow(tab, row);
                        const badgeCols = badgeIndexes[tab];
                        return (
                           <Table.Row key={row.id}>
                              {cells.map((value, index) =>
                                 badgeCols.includes(index) ? (
                                    <Table.Cell key={`${tab}-${index}`}>
                                       <Badge variant="flat">{displayValue(value)}</Badge>
                                    </Table.Cell>
                                 ) : (
                                    <Table.Cell key={`${tab}-${index}`}>
                                       <Text size="$sm" css={{ textTransform: 'capitalize' }}>
                                          {displayValue(value)}
                                       </Text>
                                    </Table.Cell>
                                 ),
                              )}
                              {showActions && (
                                 <Table.Cell>
                                    <Flex css={{ gap: '$2', flexWrap: 'wrap' }}>
                                       {(tab === 'applications' ||
                                          tab === 'school_applications') && (
                                             <>
                                                <Button
                                                   auto
                                                   flat
                                                   size="xs"
                                                   disabled={row.status !== 'pending_review'}
                                                   onPress={() => approve(row)}
                                                >
                                                   Approve
                                                </Button>
                                                <Button
                                                   auto
                                                   light
                                                   size="xs"
                                                   color="error"
                                                   disabled={row.status !== 'pending_review'}
                                                   onPress={() => reject(row)}
                                                >
                                                   Reject
                                                </Button>
                                             </>
                                          )}
                                       {tab === 'partners' && (
                                          <>
                                             <Button auto light size="xs" onPress={() => editPartner(row)}>
                                                Edit
                                             </Button>
                                             <Button auto light size="xs" onPress={() => createCode(row)}>
                                                Create code
                                             </Button>
                                             <Button
                                                auto
                                                light
                                                size="xs"
                                                color="error"
                                                onPress={() => togglePartner(row)}
                                             >
                                                {row.status === 'active' ? 'Disable' : 'Enable'}
                                             </Button>
                                          </>
                                       )}
                                       {tab === 'payouts' && (
                                          <>
                                             <Button
                                                auto
                                                flat
                                                size="xs"
                                                disabled={row.status !== 'pending'}
                                                onPress={() => updatePayout(row)}
                                             >
                                                Approve
                                             </Button>
                                             <Button
                                                auto
                                                light
                                                size="xs"
                                                disabled={row.status === 'paid'}
                                                onPress={() => updatePayout(row, true)}
                                             >
                                                Mark paid
                                             </Button>
                                          </>
                                       )}
                                    </Flex>
                                 </Table.Cell>
                              )}
                           </Table.Row>
                        );
                     }}
                  </Table.Body>
               </Table>
            </Box>
         )}
      </Box>
   );
}