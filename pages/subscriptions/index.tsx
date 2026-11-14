import React, { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
   Badge,
   Button,
   Input,
   Loading,
   Modal,
   Table,
   Text,
   Textarea,
} from '@nextui-org/react';
import {
   CalendarClock,
   CreditCard,
   Eye,
   Inbox,
   Plus,
   RefreshCw,
   ShieldCheck,
   Sparkles,
   UserX,
} from 'lucide-react';
import { api } from '@/lib';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSubscriptionStatistics } from '@/services/adminService';
import type { AdminSubscriptionStatistics, PaginationMeta } from '@/types/api';
import { Box } from '@/components/styles/box';
import { Flex } from '@/components/styles/flex';
import { usePageSearch } from '@/lib/context/searchContext';
import { OverviewCard, OverviewCardGrid } from '@/components/shared/overview-card';
import { SegmentedTabs } from '@/components/shared/segmented-tabs';

interface SubscriptionUser {
   id: number | string;
   name: string | null;
   email: string | null;
}

interface SubscriptionRecord {
   id: number | string;
   user: SubscriptionUser | null;
   plan_type: string | null;
   status: string | null;
   amount: number | string | null;
   start_date: string | null;
   end_date: string | null;
   cancelled_at: string | null;
   payment_method: string | null;
   auto_renewal: boolean;
   created_at: string | null;
   subscription_owner?: SubscriptionUser | null;
   effective_subscription?: {
      id: number | null;
      plan_type: string;
      plan_code: string;
      status: string;
      has_premium_access: boolean;
      expires_at: string | null;
   };
}

type CategoryKey = 'paid' | 'manual' | 'trial' | 'inactive';
type StatusKey =
   | 'active'
   | 'trial'
   | 'free'
   | 'cancelled'
   | 'expired'
   | 'billing_issue';
type ViewKey = 'all' | 'manual';

const VIEW_TABS: Array<{ value: ViewKey; label: React.ReactNode }> = [
   { value: 'all', label: 'All subscriptions' },
   {
      value: 'manual',
      label: (
         <>
            <ShieldCheck size={14} />
            Manual premium
         </>
      ),
   },
];

const CATEGORY_META: Record<
   CategoryKey,
   { label: string; description: string; icon: typeof CreditCard; color: string }
> = {
   paid: {
      label: 'Paid',
      description: 'Active billed subscriptions',
      icon: CreditCard,
      color: '#10b981',
   },
   manual: {
      label: 'Manual Premium',
      description: 'Complimentary access',
      icon: ShieldCheck,
      color: '#8b5cf6',
   },
   trial: {
      label: 'Free Trials',
      description: 'Trial access in progress',
      icon: Sparkles,
      color: '#3b82f6',
   },
   inactive: {
      label: 'Inactive',
      description: 'Free, expired or cancelled',
      icon: UserX,
      color: '#ef4444',
   },
};

const normalize = (value: unknown) =>
   String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, '_');

const dateHasPassed = (value: string | null) => {
   if (!value) return false;
   const timestamp = new Date(value.length === 10 ? `${value}T23:59:59` : value).getTime();
   return !Number.isNaN(timestamp) && timestamp < Date.now();
};

const getStatus = (record: SubscriptionRecord): StatusKey => {
   const status = normalize(record.effective_subscription?.status ?? record.status);
   if (status.includes('billing') || status.includes('past_due') || status.includes('grace'))
      return 'billing_issue';
   if (status === 'free') return 'free';
   if (status.includes('cancel') || (!record.effective_subscription && record.cancelled_at))
      return 'cancelled';
   if (
      status.includes('expire') ||
      dateHasPassed(record.effective_subscription?.expires_at ?? record.end_date)
   )
      return 'expired';
   if (status.includes('trial')) return 'trial';
   return 'active';
};

const isManualGrant = (record: SubscriptionRecord) => {
   const paymentMethod = normalize(record.payment_method);
   const plan = normalize(record.effective_subscription?.plan_code ?? record.plan_type);
   return paymentMethod === 'manual_premium_grant' || plan === 'premium_manual_grant';
};

const getCategory = (record: SubscriptionRecord): CategoryKey => {
   const status = getStatus(record);
   if (
      status === 'free' ||
      status === 'cancelled' ||
      status === 'expired' ||
      status === 'billing_issue'
   )
      return 'inactive';
   if (status === 'trial') return 'trial';
   if (isManualGrant(record)) return 'manual';
   if (record.effective_subscription?.has_premium_access) return 'paid';
   return 'inactive';
};

const canonicalizeByBillingOwner = (rows: SubscriptionRecord[]) => {
   const recordsByOwner = new Map<string, SubscriptionRecord>();
   rows.forEach((record) => {
      const ownerKey = String(
         record.subscription_owner?.id ?? record.user?.id ?? `subscription:${record.id}`,
      );
      const existing = recordsByOwner.get(ownerKey);
      const isEffectiveRecord =
         String(record.id) === String(record.effective_subscription?.id ?? '');
      const existingIsEffective =
         existing && String(existing.id) === String(existing.effective_subscription?.id ?? '');
      if (!existing || (isEffectiveRecord && !existingIsEffective))
         recordsByOwner.set(ownerKey, record);
   });
   return Array.from(recordsByOwner.values());
};

const extractRows = (payload: any): SubscriptionRecord[] => {
   if (Array.isArray(payload?.data)) return payload.data;
   if (Array.isArray(payload?.data?.data)) return payload.data.data;
   if (Array.isArray(payload)) return payload;
   return [];
};

const formatDate = (value: string | null) =>
   value
      ? new Date(value.length === 10 ? `${value}T00:00:00` : value).toLocaleDateString(undefined, {
         month: 'short',
         day: 'numeric',
         year: 'numeric',
      })
      : '—';

const formatAmount = (value: SubscriptionRecord['amount']) => {
   if (value === null || value === undefined || value === '') return '—';
   const number = Number(value);
   return Number.isFinite(number)
      ? number.toLocaleString(undefined, {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
      })
      : String(value);
};

const formatPaymentMethod = (value: string | null) => {
   if (!value) return 'Not specified';
   const normalized = normalize(value);
   const knownMethods: Record<string, string> = {
      revenuecat: 'RevenueCat',
      app_store: 'App Store',
      apple: 'Apple',
      apple_pay: 'Apple Pay',
      google_play: 'Google Play',
      play_store: 'Google Play',
      stripe: 'Stripe',
      card: 'Card',
      manual_premium_grant: 'Manual premium',
      free: 'Free plan',
      system: 'System',
   };
   return (
      knownMethods[normalized] ??
      normalized
         .split('_')
         .filter(Boolean)
         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' ')
   );
};

export default function SubscriptionsPage() {
   const router = useRouter();
   const [records, setRecords] = useState<SubscriptionRecord[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const { search: query, clearSearch } = usePageSearch();
   const [category, setCategory] = useState<'all' | CategoryKey>('all');
   const [status, setStatus] = useState<'all' | StatusKey>('all');
   const [renewal, setRenewal] = useState<'all' | 'on' | 'off'>('all');
   const [updatingId, setUpdatingId] = useState<string | number | null>(null);
   const [page, setPage] = useState(1);
   const [manualOpen, setManualOpen] = useState(false);
   const [manualEmail, setManualEmail] = useState('');
   const [manualMonths, setManualMonths] = useState('12');
   const [manualReason, setManualReason] = useState('');
   const [manualSaving, setManualSaving] = useState(false);
   const queryClient = useQueryClient();
   const statistics = useQuery<AdminSubscriptionStatistics>({
      queryKey: ['subscription-statistics'],
      queryFn: getSubscriptionStatistics,
   });

   useEffect(() => {
      if (!router.isReady) return;
      const requestedCategory =
         typeof router.query.category === 'string' ? router.query.category : 'all';
      setCategory(
         ['paid', 'manual', 'trial', 'inactive'].includes(requestedCategory)
            ? (requestedCategory as CategoryKey)
            : 'all',
      );
   }, [router.isReady, router.query.category]);

   const load = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
         const first = await api.get('/v1/admin/subscriptions', {
            params: { page: 1, per_page: 100 },
         });
         let rows = extractRows(first.data);
         const lastPage = Number(first.data?.meta?.last_page ?? 1);
         if (lastPage > 1) {
            const remaining = await Promise.all(
               Array.from({ length: lastPage - 1 }, (_, index) =>
                  api.get('/v1/admin/subscriptions', {
                     params: { page: index + 2, per_page: 100 },
                  }),
               ),
            );
            rows = rows.concat(...remaining.map((response) => extractRows(response.data)));
         }
         const uniqueRows = Array.from(
            new Map(rows.map((record) => [String(record.id), record])).values(),
         );
         setRecords(canonicalizeByBillingOwner(uniqueRows));
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Unable to load subscriptions.');
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      load();
   }, [load]);

   const counts: Record<CategoryKey, number> = {
      paid: (statistics.data?.paid ?? 0) + (statistics.data?.unverified ?? 0),
      manual: statistics.data?.manual_premium ?? 0,
      trial: statistics.data?.free_trials ?? 0,
      inactive: statistics.data?.inactive ?? 0,
   };

   const filteredRecords = useMemo(() => {
      const search = query.trim().toLowerCase();
      return records.filter((record) => {
         const owner = record.subscription_owner ?? record.user;
         const searchable = [
            owner?.name,
            owner?.email,
            record.effective_subscription?.plan_type,
            record.plan_type,
            record.payment_method,
            record.id,
         ]
            .join(' ')
            .toLowerCase();
         return (
            (!search || searchable.includes(search)) &&
            (category === 'all' || getCategory(record) === category) &&
            (status === 'all' || getStatus(record) === status) &&
            (renewal === 'all' || record.auto_renewal === (renewal === 'on'))
         );
      });
   }, [records, query, category, status, renewal]);

   const perPage = 20;
   const lastPage = Math.max(1, Math.ceil(filteredRecords.length / perPage));
   const visibleRecords = filteredRecords.slice((page - 1) * perPage, page * perPage);
   const meta: PaginationMeta = {
      current_page: Math.min(page, lastPage),
      per_page: perPage,
      total: filteredRecords.length,
      last_page: lastPage,
   };

   useEffect(() => {
      if (page > lastPage) setPage(lastPage);
   }, [lastPage, page]);

   useEffect(() => {
      setPage(1);
   }, [query, category, status, renewal]);

   const hasFilters =
      Boolean(query.trim()) || category !== 'all' || status !== 'all' || renewal !== 'all';

   const view: ViewKey = category === 'manual' ? 'manual' : 'all';

   const selectCategory = (nextCategory: 'all' | CategoryKey) => {
      setCategory(nextCategory);
      setPage(1);
      router.replace(
         {
            pathname: '/subscriptions',
            query: nextCategory === 'all' ? {} : { category: nextCategory },
         },
         undefined,
         { shallow: true },
      );
   };

   const selectStatus = (nextStatus: 'all' | StatusKey) => {
      setStatus(nextStatus);
      setPage(1);
   };

   const clearFilters = () => {
      clearSearch();
      setCategory('all');
      setStatus('all');
      setRenewal('all');
      setPage(1);
      router.replace({ pathname: '/subscriptions', query: {} }, undefined, { shallow: true });
   };

   const updateSubscription = async (record: SubscriptionRecord) => {
      const currentStatus = getStatus(record);
      const action = currentStatus === 'cancelled' ? 'reactivate' : 'cancel';
      const verb = action === 'cancel' ? 'Cancel' : 'Reactivate';
      const owner = record.subscription_owner ?? record.user;
      const effectiveId = record.effective_subscription?.id ?? record.id;
      if (!window.confirm(`${verb} the subscription for ${owner?.name ?? 'this account'}?`))
         return;
      setUpdatingId(record.id);
      setError(null);
      try {
         await api.post(`/v1/admin/subscriptions/${effectiveId}/${action}`);
         await load();
      } catch (err: any) {
         setError(err?.response?.data?.message ?? `Unable to ${action} this subscription.`);
      } finally {
         setUpdatingId(null);
      }
   };

   const grantManualPremium = async () => {
      setManualSaving(true);
      setError(null);
      try {
         await api.post('/v2/admin/subscription-overrides/grant-premium', {
            email: manualEmail.trim(),
            months: Number(manualMonths),
            reason: manualReason.trim() || null,
         });
         setManualOpen(false);
         setManualEmail('');
         setManualReason('');
         setManualMonths('12');
         await Promise.all([
            load(),
            queryClient.invalidateQueries({ queryKey: ['subscription-statistics'] }),
            queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
         ]);
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Unable to grant manual premium access.');
      } finally {
         setManualSaving(false);
      }
   };

   return (
      <Box className="admin-page subscriptions-page">
         <Box className="glass-panel glass-hero subscriptions-hero">
            <Flex justify="between" align="center" css={{ gap: '$6', flexWrap: 'wrap' }}>
               <Flex align="center" css={{ gap: '$4' }}>
                  <span className="subscriptions-hero-mark">
                     <CreditCard size={21} />
                  </span>
                  <Box>
                     <Text className="section-kicker">Subscriptions</Text>
                     <Text h2 css={{ m: 0, mt: '$1', fontSize: '1.4rem' }}>
                        Subscription records
                     </Text>
                     <Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>
                        {visibleRecords.length.toLocaleString()} shown ·{' '}
                        {filteredRecords.length.toLocaleString()} matching ·{' '}
                        {records.length.toLocaleString()} total
                     </Text>
                  </Box>
               </Flex>
               <SegmentedTabs
                  tabs={VIEW_TABS}
                  value={view}
                  onChange={(next) => selectCategory(next === 'manual' ? 'manual' : 'all')}
                  ariaLabel="Subscription views"
                  className="subscriptions-view-tabs"
               />
            </Flex>
         </Box>

         <OverviewCardGrid>
            {(Object.keys(CATEGORY_META) as CategoryKey[]).map((key) => {
               const cardMeta = CATEGORY_META[key];
               const Icon = cardMeta.icon;
               return (
                  <OverviewCard
                     key={key}
                     label={cardMeta.label}
                     value={counts[key].toLocaleString()}
                     description={cardMeta.description}
                     icon={Icon}
                     color={cardMeta.color}
                     active={category === key}
                     loading={statistics.isLoading}
                     onClick={() => selectCategory(category === key ? 'all' : key)}
                  />
               );
            })}
         </OverviewCardGrid>

         {error && <div className="feedback-error">{error}</div>}

         <Box className="glass-panel subscriptions-toolbar">
            <div className="subscriptions-filters">
               <label>
                  Category
                  <select
                     value={category}
                     onChange={(event) =>
                        selectCategory(event.target.value as 'all' | CategoryKey)
                     }
                  >
                     <option value="all">All categories</option>
                     <option value="paid">Paid</option>
                     <option value="manual">Manual premium</option>
                     <option value="trial">Free trials</option>
                     <option value="inactive">Inactive</option>
                  </select>
               </label>
               <label>
                  Status
                  <select
                     value={status}
                     onChange={(event) => selectStatus(event.target.value as 'all' | StatusKey)}
                  >
                     <option value="all">All statuses</option>
                     <option value="active">Active premium</option>
                     <option value="trial">Trial</option>
                     <option value="free">Free</option>
                     <option value="cancelled">Cancelled</option>
                     <option value="expired">Expired</option>
                     <option value="billing_issue">Billing issue</option>
                  </select>
               </label>
               <label>
                  Renewal
                  <select
                     value={renewal}
                     onChange={(event) =>
                        setRenewal(event.target.value as 'all' | 'on' | 'off')
                     }
                  >
                     <option value="all">All renewal states</option>
                     <option value="on">Auto-renew on</option>
                     <option value="off">Auto-renew off</option>
                  </select>
               </label>
               {hasFilters && (
                  <button type="button" className="subscriptions-clear" onClick={clearFilters}>
                     Clear
                  </button>
               )}
               {category === 'manual' && (
                  <Button
                     className="subscriptions-filter-action"
                     auto
                     color="secondary"
                     size="sm"
                     icon={<Plus size={14} />}
                     onPress={() => setManualOpen(true)}
                  >
                     Add manual subscription
                  </Button>
               )}
            </div>
         </Box>

         {loading ? (
            <Box className="glass-panel admin-empty-state">
               <Loading size="sm">Loading subscriptions…</Loading>
            </Box>
         ) : filteredRecords.length === 0 ? (
            <Box className="glass-panel admin-empty-state">
               <span>
                  <Inbox size={22} />
               </span>
               <Text b>No subscriptions found</Text>
               <Text size="$sm" css={{ color: '$accents7' }}>
                  {hasFilters
                     ? 'No subscription matches the selected filters.'
                     : 'No subscription records were returned by the API.'}
               </Text>
               {hasFilters && (
                  <Button auto flat size="sm" onPress={clearFilters}>
                     Clear filters
                  </Button>
               )}
            </Box>
         ) : (
            <Box className="glass-panel subscriptions-table-shell">
               <Table
                  className="subscriptions-table"
                  aria-label="Subscriptions"
                  shadow={false}
                  css={{ minWidth: '100%' }}
               >
                  <Table.Header>
                     <Table.Column>SUBSCRIBER</Table.Column>
                     <Table.Column>ACCESS</Table.Column>
                     <Table.Column>PLAN</Table.Column>
                     <Table.Column>AMOUNT</Table.Column>
                     <Table.Column>PERIOD</Table.Column>
                     <Table.Column>PAYMENT</Table.Column>
                     <Table.Column>RENEWAL</Table.Column>
                     <Table.Column hideHeader>ACTIONS</Table.Column>
                  </Table.Header>
                  <Table.Body items={visibleRecords}>
                     {(record) => {
                        const recordCategory = getCategory(record);
                        const recordStatus = getStatus(record);
                        const actionAvailable =
                           recordStatus === 'active' || recordStatus === 'cancelled';
                        const owner = record.subscription_owner ?? record.user;
                        const effective = record.effective_subscription;
                        const detailId = effective?.id ?? record.id;
                        return (
                           <Table.Row key={record.id}>
                              <Table.Cell>
                                 <NextLink href={`/subscriptions/${detailId}`}>
                                    <a className="subscription-cell-link">
                                       <div className="subscription-person">
                                          <span>
                                             {(owner?.name || owner?.email || '?')
                                                .slice(0, 1)
                                                .toUpperCase()}
                                          </span>
                                          <div>
                                             <strong>{owner?.name || 'Unnamed account'}</strong>
                                             <small>{owner?.email || 'Account unavailable'}</small>
                                          </div>
                                       </div>
                                    </a>
                                 </NextLink>
                              </Table.Cell>
                              <Table.Cell>
                                 <NextLink href={`/subscriptions/${detailId}`}>
                                    <a className="subscription-cell-link">
                                       <div className={`subscription-access ${recordCategory}`}>
                                          <strong>{CATEGORY_META[recordCategory].label}</strong>
                                          <small>{recordStatus.replace('_', ' ')}</small>
                                       </div>
                                    </a>
                                 </NextLink>
                              </Table.Cell>
                              <Table.Cell>
                                 <NextLink href={`/subscriptions/${detailId}`}>
                                    <a className="subscription-cell-link">
                                       <span className="subscription-plan">
                                          {effective?.plan_type ||
                                             record.plan_type ||
                                             'Not specified'}
                                       </span>
                                    </a>
                                 </NextLink>
                              </Table.Cell>
                              <Table.Cell>
                                 <NextLink href={`/subscriptions/${detailId}`}>
                                    <a className="subscription-cell-link">
                                       <strong className="subscription-amount">
                                          {formatAmount(record.amount)}
                                       </strong>
                                    </a>
                                 </NextLink>
                              </Table.Cell>
                              <Table.Cell>
                                 <NextLink href={`/subscriptions/${detailId}`}>
                                    <a className="subscription-cell-link">
                                       <div className="subscription-period">
                                          <strong>{formatDate(record.start_date)}</strong>
                                          <small>
                                             to{' '}
                                             {formatDate(
                                                effective?.expires_at ?? record.end_date,
                                             )}
                                          </small>
                                       </div>
                                    </a>
                                 </NextLink>
                              </Table.Cell>
                              <Table.Cell>
                                 <NextLink href={`/subscriptions/${detailId}`}>
                                    <a className="subscription-cell-link">
                                       <span className="subscription-payment">
                                          {formatPaymentMethod(record.payment_method)}
                                       </span>
                                    </a>
                                 </NextLink>
                              </Table.Cell>
                              <Table.Cell>
                                 <NextLink href={`/subscriptions/${detailId}`}>
                                    <a className="subscription-cell-link">
                                       <span
                                          className={`subscription-renewal ${record.auto_renewal ? 'on' : 'off'
                                             }`}
                                       >
                                          <span>
                                             {record.auto_renewal ? (
                                                <RefreshCw size={13} />
                                             ) : (
                                                <CalendarClock size={13} />
                                             )}
                                          </span>
                                          <span>
                                             <strong>
                                                {record.auto_renewal
                                                   ? 'Auto renew'
                                                   : 'Renewal off'}
                                             </strong>
                                             <small>
                                                {record.auto_renewal
                                                   ? 'Enabled'
                                                   : 'Ends at expiry'}
                                             </small>
                                          </span>
                                       </span>
                                    </a>
                                 </NextLink>
                              </Table.Cell>
                              <Table.Cell>
                                 <div className="subscription-actions">
                                    <NextLink href={`/subscriptions/${detailId}`}>
                                       <a
                                          className="subscription-view-action"
                                          aria-label={`View subscription ${detailId}`}
                                       >
                                          <Eye size={14} />
                                       </a>
                                    </NextLink>
                                    {actionAvailable ? (
                                       <button
                                          type="button"
                                          className={`subscription-row-action ${recordStatus === 'cancelled' ? 'reactivate' : ''
                                             }`}
                                          disabled={updatingId === record.id}
                                          onClick={() => updateSubscription(record)}
                                       >
                                          {updatingId === record.id ? (
                                             <RefreshCw size={14} className="spin" />
                                          ) : recordStatus === 'cancelled' ? (
                                             'Reactivate'
                                          ) : (
                                             'Cancel'
                                          )}
                                       </button>
                                    ) : (
                                       <span className="subscription-no-action">—</span>
                                    )}
                                 </div>
                              </Table.Cell>
                           </Table.Row>
                        );
                     }}
                  </Table.Body>
               </Table>
            </Box>
         )}

         {meta.last_page > 1 && (
            <nav className="admin-pagination" aria-label="Subscription pages">
               <Button
                  auto
                  flat
                  size="sm"
                  disabled={page <= 1 || loading}
                  onPress={() => setPage((value) => value - 1)}
               >
                  Previous
               </Button>
               <span>
                  Page {meta.current_page} of {meta.last_page}
               </span>
               <Button
                  auto
                  flat
                  size="sm"
                  disabled={page >= meta.last_page || loading}
                  onPress={() => setPage((value) => value + 1)}
               >
                  Next
               </Button>
            </nav>
         )}

         <Modal
            closeButton
            open={manualOpen}
            onClose={() => !manualSaving && setManualOpen(false)}
            aria-labelledby="manual-premium-title"
         >
            <Modal.Header>
               <Text id="manual-premium-title" b>
                  Grant manual premium
               </Text>
            </Modal.Header>
            <Modal.Body>
               <Text size="$sm" css={{ color: '$accents7' }}>
                  Premium will be applied to the family billing owner resolved by the API.
               </Text>
               <Input
                  bordered
                  fullWidth
                  label="Account email"
                  type="email"
                  value={manualEmail}
                  onChange={(event) => setManualEmail(event.target.value)}
               />
               <Input
                  bordered
                  fullWidth
                  label="Duration in months"
                  type="number"
                  min="1"
                  max="120"
                  value={manualMonths}
                  onChange={(event) => setManualMonths(event.target.value)}
               />
               <Textarea
                  bordered
                  fullWidth
                  label="Reason (optional)"
                  value={manualReason}
                  onChange={(event) => setManualReason(event.target.value)}
               />
            </Modal.Body>
            <Modal.Footer>
               <Button auto flat disabled={manualSaving} onPress={() => setManualOpen(false)}>
                  Cancel
               </Button>
               <Button
                  auto
                  color="secondary"
                  disabled={!manualEmail.trim() || Number(manualMonths) < 1 || manualSaving}
                  onPress={grantManualPremium}
               >
                  {manualSaving ? 'Granting…' : 'Grant premium'}
               </Button>
            </Modal.Footer>
         </Modal>
      </Box>
   );
}
