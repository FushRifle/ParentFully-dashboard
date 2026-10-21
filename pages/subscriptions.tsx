import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
   Badge,
   Button,
   Card,
   Grid,
   Input,
   Loading,
   Modal,
   Table,
   Text,
   Dropdown,
} from '@nextui-org/react';
import {
   CreditCard,
   RefreshCw,
   ShieldCheck,
   Sparkles,
   Search,
   AlertCircle,
   Ban,
   Sliders,
   Inbox,
} from 'lucide-react';
import { api } from '../lib';
import { API_V2_BASE_URL } from '../config';
import { Box } from '../components/styles/box';
import { Flex } from '../components/styles/flex';

// ==========================================
// Types
// ==========================================
export interface User {
   id?: string | number;
   name?: string;
   email?: string;
}

export interface SubscriptionRecord {
   id: string | number;
   status?: string;
   cancelled_at?: string | null;
   plan_code?: string;
   plan_type?: string;
   gateway?: string;
   source?: string;
   provider?: string;
   store?: string;
   payment_method?: string;
   payment_status?: string;
   product_id?: string;
   revenuecat_app_user_id?: string;
   original_app_user_id?: string;
   is_manual?: boolean;
   is_trial?: boolean;
   amount?: number | string;
   currency?: string;
   country?: string;
   start_date?: string;
   renews_at?: string;
   expires_at?: string;
   end_date?: string;
   user?: User;
}

type CategoryKey = 'paid' | 'manual' | 'trial' | 'inactive' | 'free';
type StatusKey = 'active' | 'cancelled' | 'expired' | 'billing_issue';

// ==========================================
// Helpers
// ==========================================
const sanitizeText = (value: unknown): string =>
   String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, '_');

const getStatus = (r: SubscriptionRecord): StatusKey => {
   const rawStatus = sanitizeText(r.payment_status ?? r.status);
   const expiryValue = r.expires_at ?? r.end_date;
   const expiry = expiryValue ? new Date(expiryValue) : null;
   if (rawStatus.includes('billing') || rawStatus.includes('past_due') || rawStatus.includes('grace')) return 'billing_issue';
   if (rawStatus.includes('expire') || (expiry && !Number.isNaN(expiry.getTime()) && expiry.getTime() < Date.now())) return 'expired';
   if (r.cancelled_at || rawStatus.includes('cancel')) return 'cancelled';
   return 'active';
};

const isManualGrant = (r: SubscriptionRecord) => {
   const source = sanitizeText([r.gateway, r.source, r.provider, r.payment_method].filter(Boolean).join(' '));
   const plan = sanitizeText(r.plan_code ?? r.plan_type);
   return r.is_manual === true || source.includes('manual') || source.includes('override') ||
      plan.includes('manual_grant') || (source.includes('system') && plan.includes('premium'));
};

const isRevenueCat = (r: SubscriptionRecord) => {
   const billingSource = sanitizeText([r.gateway, r.source, r.provider].filter(Boolean).join(' '));
   return billingSource.includes('revenuecat') || Boolean(r.revenuecat_app_user_id || r.original_app_user_id);
};

const isLinked = (r: SubscriptionRecord) => Boolean(r.user?.id || r.user?.email);

const getCategory = (r: SubscriptionRecord): CategoryKey => {
   const status = getStatus(r);
   const plan = sanitizeText(r.plan_code ?? r.plan_type);

   if (['cancelled', 'expired'].includes(status)) return 'inactive';
   if (isManualGrant(r)) return 'manual';
   if (r.is_trial === true || sanitizeText(r.status).includes('trial') || plan.includes('trial')) return 'trial';
   if (isRevenueCat(r)) return 'paid';
   return 'free';
};

const extractRows = (payload: any): SubscriptionRecord[] => {
   if (Array.isArray(payload?.data)) return payload.data;
   if (Array.isArray(payload?.data?.data)) return payload.data.data;
   if (Array.isArray(payload)) return payload;
   return [];
};

const formatDate = (value?: string | null): string =>
   value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

const CATEGORY_META: Record<
   CategoryKey,
   { label: string; color: string; badgeVariant: 'success' | 'secondary' | 'primary' | 'error' | 'default' }
> = {
   paid: { label: 'Paying', color: '#10b981', badgeVariant: 'success' },
   manual: { label: 'Manual Premium', color: '#8b5cf6', badgeVariant: 'secondary' },
   trial: { label: 'Trials', color: '#3b82f6', badgeVariant: 'primary' },
   inactive: { label: 'Expired / Cancelled', color: '#ef4444', badgeVariant: 'error' },
   free: { label: 'Free', color: '#64748b', badgeVariant: 'default' },
};

// ==========================================
// Main Component
// ==========================================
export default function SubscriptionsPage() {
   const [records, setRecords] = useState<SubscriptionRecord[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   // Filters State
   const [query, setQuery] = useState('');
   const [category, setCategory] = useState<string>('all');
   const [statusFilter, setStatusFilter] = useState<string>('all');
   const [linkFilter, setLinkFilter] = useState<'all' | 'linked' | 'unmatched'>('all');

   // Modal State
   const [modalOpen, setModalOpen] = useState(false);
   const [email, setEmail] = useState('');
   const [months, setMonths] = useState(12);
   const [reason, setReason] = useState('');
   const [saving, setSaving] = useState(false);

   // Data Fetcher
   const load = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
         const firstRes = await api.get('/v1/admin/subscriptions', {
            params: { page: 1, per_page: 100 },
         });
         let rows = extractRows(firstRes.data);
         const lastPage = Number(
            firstRes.data?.meta?.last_page ?? firstRes.data?.data?.meta?.last_page ?? firstRes.data?.data?.last_page ?? 1
         );

         if (lastPage > 1) {
            const pages = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
            const restResponses = await Promise.all(
               pages.map((p) =>
                  api.get('/v1/admin/subscriptions', {
                     params: { page: p, per_page: 100 },
                  })
               )
            );
            restResponses.forEach((res) => {
               rows = rows.concat(extractRows(res.data));
            });
         }
         const uniqueRows = Array.from(new Map(rows.map((row) => [String(row.id), row])).values());
         setRecords(uniqueRows);
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Unable to load subscriptions.');
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      load();
   }, [load]);

   // Dynamic Filtering Logic
   const filteredRecords = useMemo(() => {
      const q = query.trim().toLowerCase();

      return records.filter((r) => {
         const userMatch =
            (r.user?.name ?? '').toLowerCase().includes(q) ||
            (r.user?.email ?? '').toLowerCase().includes(q) ||
            (r.plan_type ?? '').toLowerCase().includes(q) ||
            (r.plan_code ?? '').toLowerCase().includes(q) ||
            (r.product_id ?? '').toLowerCase().includes(q) ||
            (r.country ?? '').toLowerCase().includes(q) ||
            (r.revenuecat_app_user_id ?? '').toLowerCase().includes(q) ||
            (r.original_app_user_id ?? '').toLowerCase().includes(q);

         const categoryMatch = category === 'all' || getCategory(r) === category;
         const statusMatch = statusFilter === 'all' || getStatus(r) === statusFilter;
         const linkMatch = linkFilter === 'all' || (linkFilter === 'linked' ? isLinked(r) : !isLinked(r));

         return (q === '' || userMatch) && categoryMatch && statusMatch && linkMatch;
      });
   }, [records, query, category, statusFilter, linkFilter]);

   // Counts Calculation
   const counts = useMemo(() => {
      const initial: Record<CategoryKey, number> = {
         paid: 0,
         manual: 0,
         trial: 0,
         inactive: 0,
         free: 0,
      };
      records.forEach((r) => {
         const cat = getCategory(r);
         if (cat in initial) initial[cat]++;
      });
      return initial;
   }, [records]);
   const unmatchedCount = useMemo(() => records.filter((record) => isRevenueCat(record) && !isLinked(record)).length, [records]);
   const hasFilters = Boolean(query.trim()) || category !== 'all' || statusFilter !== 'all' || linkFilter !== 'all';
   const clearFilters = () => { setQuery(''); setCategory('all'); setStatusFilter('all'); setLinkFilter('all'); };

   // Modal Handlers
   const resetModal = () => {
      setEmail('');
      setMonths(12);
      setReason('');
   };

   const closeModal = () => {
      if (saving) return;
      setModalOpen(false);
      resetModal();
   };

   const handleOverride = async (mode: 'grant' | 'downgrade') => {
      if (!email) {
         setError('A customer email is required.');
         return;
      }
      if (mode === 'downgrade' && !window.confirm(`Downgrade ${email} to Free?`)) {
         return;
      }

      setSaving(true);
      setError(null);
      try {
         await api.post(
            `${API_V2_BASE_URL}/admin/subscription-overrides/${mode === 'grant' ? 'grant-premium' : 'downgrade-free'
            }`,
            {
               email,
               reason: reason || undefined,
               ...(mode === 'grant' ? { months } : {}),
            }
         );
         await load();
         closeModal();
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Subscription override failed.');
      } finally {
         setSaving(false);
      }
   };

   const handleCancel = async (r: SubscriptionRecord) => {
      if (!window.confirm(`Cancel subscription for ${r.user?.name ?? 'this user'}?`)) return;
      try {
         await api.post(`/v1/admin/subscriptions/${r.id}/cancel`);
         await load();
      } catch (err: any) {
         setError(err?.response?.data?.message ?? 'Cancellation failed.');
      }
   };

   return (
      <Box className="admin-page" css={{ p: '$8', maxW: '1440px', margin: '0 auto' }}>
         {/* Header */}
         <Box className="glass-panel glass-hero" css={{ p: '$8', mb: '$6', borderRadius: '$lg' }}>
            <Flex justify="between" align="center" css={{ gap: '$5', flexWrap: 'wrap' }}>
               <Flex align="center" css={{ gap: '$4' }}>
                  <Box
                     css={{
                        width: 48,
                        height: 48,
                        borderRadius: '$md',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#f97316',
                        bg: 'rgba(249,115,22,.12)',
                        border: '1px solid rgba(249,115,22,.28)',
                     }}
                  >
                     <CreditCard size={24} />
                  </Box>
                  <Box>
                     <Text className="section-kicker" css={{ color: '$accents7', textTransform: 'uppercase', fontSize: '$xs', fontWeight: '$semibold' }}>
                        Revenue & Access
                     </Text>
                     <Text h2 css={{ m: 0, fontSize: '1.5rem', fontWeight: '$bold' }}>
                        Subscriptions Directory
                     </Text>
                  </Box>
               </Flex>
               <Flex css={{ gap: '$3', flexWrap: 'wrap' }}>
                  <Button
                     auto
                     color="secondary"
                     onPress={() => setModalOpen(true)}
                  >
                     Add Manual Subscription
                  </Button>
                  <Button auto flat icon={<RefreshCw size={16} />} onPress={load}>
                     Refresh Data
                  </Button>
               </Flex>
            </Flex>
         </Box>

         {/* Metric Tiles */}
         <Grid.Container gap={1.5} css={{ p: 0, mb: '$6' }}>
            {(['paid', 'manual', 'trial', 'inactive', 'free'] as CategoryKey[]).map((key) => {
               const meta = CATEGORY_META[key];
               const value = counts[key] ?? 0;
               return (
                  <Grid key={key} xs={12} sm={6} md={2.4 as any}>
                     <Card className="metric-tile" borderWeight="normal" css={{ width: '100%', '--tile-accent': meta.color } as any}>
                        <Card.Body css={{ py: '$5' }}>
                           <Text className="section-kicker" css={{ color: '$accents7', fontSize: '$xs', fontWeight: '$semibold' }}>
                              {meta.label}
                           </Text>
                           <Text h3 css={{ m: 0, mt: '$2', fontSize: '1.5rem', color: meta.color }}>
                              {value.toLocaleString()}
                           </Text>
                        </Card.Body>
                     </Card>
                  </Grid>
               );
            })}
         </Grid.Container>

         {/* Reconciliation Audit Banner */}
         <Card css={{ mb: '$6', bg: '$accents0', border: '1px solid$border' }}>
            <Card.Body css={{ p: '$5' }}>
               <Flex justify="between" align="center" css={{ gap: '$4', flexWrap: 'wrap' }}>
                  <Flex align="center" css={{ gap: '$3' }}>
                     <ShieldCheck size={22} color="#8b5cf6" />
                     <Box>
                        <Text b css={{ fontSize: '$sm' }}>Reconciliation Audit</Text>
                        <Text size="$xs" css={{ color: '$accents7' }}>
                           Manual grants are flagged separately and excluded from revenue metrics.
                        </Text>
                     </Box>
                  </Flex>
                  <Flex css={{ gap: '$6' }}>
                     <Box css={{ textAlign: 'right' }}>
                        <Text className="section-kicker" css={{ color: '$accents7', fontSize: '$xs' }}>Verified Payers</Text>
                        <Text h4 css={{ m: 0, mt: '$1' }}>{counts.paid.toLocaleString()}</Text>
                     </Box>
                     <Box css={{ textAlign: 'right' }}>
                        <Text className="section-kicker" css={{ color: '$accents7', fontSize: '$xs' }}>Manual Grants</Text>
                        <Text h4 css={{ m: 0, mt: '$1' }}>{counts.manual.toLocaleString()}</Text>
                     </Box>
                     <Box css={{ textAlign: 'right' }}>
                        <Text className="section-kicker" css={{ color: '$accents7', fontSize: '$xs' }}>Unmatched RC</Text>
                        <Text h4 css={{ m: 0, mt: '$1', color: unmatchedCount ? '$warning' : '$success' }}>{unmatchedCount.toLocaleString()}</Text>
                     </Box>
                  </Flex>
               </Flex>
            </Card.Body>
         </Card>

         {/* Error Alert */}
         {error && (
            <Card css={{ mb: '$4', bg: '$errorLight', color: '$error' }}>
               <Card.Body css={{ p: '$4' }}>
                  <Flex align="center" css={{ gap: '$2' }}>
                     <AlertCircle size={18} />
                     <Text color="error" size="$sm">{error}</Text>
                  </Flex>
               </Card.Body>
            </Card>
         )}

         {/* Filters Toolbar */}
         <Box className="glass-panel glass-toolbar" css={{ p: '$4', mb: '$4', borderRadius: '$md' }}>
            <Flex justify="between" align="center" css={{ gap: '$4', flexWrap: 'wrap' }}>
               <Box>
                  <Text b size="$sm">Subscriber Directory</Text>
                  <Text size="$xs" css={{ color: '$accents7' }}>
                     Showing {filteredRecords.length} of {records.length} records
                  </Text>
               </Box>
               <Flex css={{ gap: '$3', flexWrap: 'wrap', alignContent: 'center' }}>
                  {/* Search Input */}
                  <Input
                     clearable
                     contentLeft={<Search size={16} />}
                     aria-label="Search subscriptions"
                     placeholder="Search user, email, plan..."
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                  />

                  {/* Category Filter */}
                  <Dropdown>
                     <Dropdown.Button flat auto css={{ textTransform: 'capitalize' }}>
                        Category: {category === 'all' ? 'All' : CATEGORY_META[category as CategoryKey]?.label ?? category}
                     </Dropdown.Button>
                     <Dropdown.Menu
                        aria-label="Category Filter"
                        selectionMode="single"
                        selectedKeys={new Set([category])}
                        onSelectionChange={(keys) => {
                           const selected = Array.from(keys)[0] as string;
                           if (selected) setCategory(selected);
                        }}
                     >
                        <Dropdown.Item key="all">All Categories</Dropdown.Item>
                        <Dropdown.Item key="paid">Paying</Dropdown.Item>
                        <Dropdown.Item key="manual">Manual Premium</Dropdown.Item>
                        <Dropdown.Item key="trial">Trials</Dropdown.Item>
                        <Dropdown.Item key="inactive">Expired / Cancelled</Dropdown.Item>
                        <Dropdown.Item key="free">Free</Dropdown.Item>
                     </Dropdown.Menu>
                  </Dropdown>

                  {/* Status Filter */}
                  <Dropdown>
                     <Dropdown.Button flat auto css={{ textTransform: 'capitalize' }}>
                        Status: {statusFilter}
                     </Dropdown.Button>
                     <Dropdown.Menu
                        aria-label="Status Filter"
                        selectionMode="single"
                        selectedKeys={new Set([statusFilter])}
                        onSelectionChange={(keys) => {
                           const selected = Array.from(keys)[0] as string;
                           if (selected) setStatusFilter(selected);
                        }}
                     >
                        <Dropdown.Item key="all">All Statuses</Dropdown.Item>
                        <Dropdown.Item key="active">Active</Dropdown.Item>
                        <Dropdown.Item key="cancelled">Cancelled</Dropdown.Item>
                        <Dropdown.Item key="expired">Expired</Dropdown.Item>
                        <Dropdown.Item key="billing_issue">Billing Issue</Dropdown.Item>
                     </Dropdown.Menu>
                  </Dropdown>

                  <Dropdown>
                     <Dropdown.Button flat auto>
                        Account: {linkFilter === 'all' ? 'All' : linkFilter === 'linked' ? 'Linked' : 'Unmatched'}
                     </Dropdown.Button>
                     <Dropdown.Menu
                        aria-label="Account Link Filter"
                        selectionMode="single"
                        selectedKeys={new Set([linkFilter])}
                        onSelectionChange={(keys) => {
                           const selected = Array.from(keys)[0] as 'all' | 'linked' | 'unmatched';
                           if (selected) setLinkFilter(selected);
                        }}
                     >
                        <Dropdown.Item key="all">All accounts</Dropdown.Item>
                        <Dropdown.Item key="linked">Linked accounts</Dropdown.Item>
                        <Dropdown.Item key="unmatched">Unmatched subscribers</Dropdown.Item>
                     </Dropdown.Menu>
                  </Dropdown>
                  {hasFilters && <Button auto flat size="sm" onPress={clearFilters}>Clear filters</Button>}
               </Flex>
            </Flex>
         </Box>

         {/* Table with Custom Column Width Ratios */}
         {loading ? (
            <Box className="glass-panel" css={{ p: '$12', textAlign: 'center' }}>
               <Loading size="md">Loading subscription data...</Loading>
            </Box>
         ) : filteredRecords.length === 0 ? (
            <Box className="glass-panel admin-empty-state">
               <span><Inbox size={22} /></span>
               <Text b>No subscriptions found</Text>
               <Text size="$sm" css={{ color: '$accents7' }}>{hasFilters ? 'No subscriber matches all selected filters.' : 'Subscription records will appear here after synchronization.'}</Text>
               {hasFilters && <Button auto flat size="sm" onPress={clearFilters}>Clear filters</Button>}
            </Box>
         ) : (
            <Box className="glass-panel glass-table">
               <Table aria-label="Subscriptions Table" shadow={false} css={{ minWidth: '100%', tableLayout: 'fixed' }}>
                  <Table.Header>
                     <Table.Column width="18%">SUBSCRIBER</Table.Column>
                     <Table.Column width="13%">CATEGORY</Table.Column>
                     <Table.Column width="11%">PLAN</Table.Column>
                     <Table.Column width="10%">STATUS</Table.Column>
                     <Table.Column width="10%">AMOUNT</Table.Column>
                     <Table.Column width="11%">START DATE</Table.Column>
                     <Table.Column width="11%">RENEWS / ENDS</Table.Column>
                     <Table.Column width="8%" align="center">OVERRIDE</Table.Column>
                     <Table.Column width="8%" align="center">CANCEL</Table.Column>
                  </Table.Header>
                  <Table.Body items={filteredRecords}>
                     {(item: SubscriptionRecord) => {
                        const categoryKey = getCategory(item);
                        const meta = CATEGORY_META[categoryKey];
                        const status = getStatus(item);

                        return (
                           <Table.Row key={item.id}>
                              {/* Subscriber Column with Controlled Width */}
                              <Table.Cell>
                                 <Box css={{ maxW: '200px', overflow: 'hidden' }}>
                                    <Text b size="$sm" css={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                       {item.user?.name ?? 'Unknown User'}
                                    </Text>
                                    <Text size="$xs" css={{ color: '$accents7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                       {item.user?.email ?? '—'}
                                    </Text>
                                    {!isLinked(item) && isRevenueCat(item) && <Badge color="warning" variant="flat">Unmatched account</Badge>}
                                 </Box>
                              </Table.Cell>
                              <Table.Cell>
                                 <Badge variant="flat" color={meta.badgeVariant}>
                                    {meta.label}
                                 </Badge>
                              </Table.Cell>
                              <Table.Cell>
                                 <Text size="$sm">{item.plan_type ?? item.plan_code ?? '—'}</Text>
                              </Table.Cell>
                              <Table.Cell>
                                 <Text
                                    size="$xs"
                                    css={{
                                       textTransform: 'capitalize',
                                       fontWeight: '$semibold',
                                       color: status === 'active' ? '$success' : '$accents7',
                                    }}
                                 >
                                    {status}
                                 </Text>
                              </Table.Cell>
                              <Table.Cell>
                                 <Text size="$sm">
                                    {item.currency
                                       ? `${item.currency.toUpperCase()} ${item.amount ?? 0}`
                                       : item.amount ?? '—'}
                                 </Text>
                              </Table.Cell>
                              <Table.Cell>
                                 <Text size="$sm">{formatDate(item.start_date)}</Text>
                              </Table.Cell>
                              <Table.Cell>
                                 <Text size="$sm">
                                    {formatDate(item.renews_at ?? item.expires_at ?? item.end_date)}
                                 </Text>
                              </Table.Cell>

                              {/* Override Button Column */}
                              <Table.Cell>
                                 <Flex justify="center">
                                    <Button
                                       auto
                                       bordered
                                       size="xs"
                                       color="secondary"
                                       onPress={() => {
                                          setEmail(item.user?.email ?? '');
                                          setModalOpen(true);
                                       }}
                                    >
                                       Override
                                    </Button>
                                 </Flex>
                              </Table.Cell>

                              {/* Cancel Button Column */}
                              <Table.Cell>
                                 <Flex justify="center">
                                    <Button
                                       auto
                                       flat
                                       size="xs"
                                       color="error"
                                       icon={<Ban size={14} />}
                                       disabled={status !== 'active'}
                                       onPress={() => handleCancel(item)}
                                    >
                                       Cancel
                                    </Button>
                                 </Flex>
                              </Table.Cell>
                           </Table.Row>
                        );
                     }}
                  </Table.Body>
               </Table>
            </Box>
         )}

         {/* Manual Subscription Modal */}
         <Modal
            closeButton
            aria-labelledby="manual-subscription-modal"
            open={modalOpen}
            onClose={closeModal}
            width="500px"
         >
            <Modal.Header>
               <Flex align="center" css={{ gap: '$3', width: '100%', textAlign: 'left' }}>
                  <Box
                     css={{
                        width: 40,
                        height: 40,
                        borderRadius: '$md',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#8b5cf6',
                        bg: 'rgba(139,92,246,.12)',
                        border: '1px solid rgba(139,92,246,.28)',
                     }}
                  >
                     <ShieldCheck size={20} />
                  </Box>
                  <Box>
                     <Text b size="$lg" id="manual-subscription-modal">
                        Manual Subscription Override
                     </Text>
                     <Text size="$xs" css={{ color: '$accents7' }}>
                        Grant or revoke premium access without processing payment.
                     </Text>
                  </Box>
               </Flex>
            </Modal.Header>
            <Modal.Body css={{ py: '$4' }}>
               <Flex direction="column" css={{ gap: '$4' }}>
                  <Input
                     bordered
                     fullWidth
                     aria-label="Customer Email"
                     label="Customer Email"
                     placeholder="customer@example.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                     bordered
                     fullWidth
                     aria-label="Duration (Months)"
                     label="Duration (Months)"
                     type="number"
                     min={1}
                     value={String(months)}
                     onChange={(e) => setMonths(Number(e.target.value))}
                  />
                  <Input
                     bordered
                     fullWidth
                     aria-label="Reason"
                     label="Reason (Optional)"
                     placeholder="e.g. VIP support credit, internal beta testing"
                     value={reason}
                     onChange={(e) => setReason(e.target.value)}
                  />
                  <Text size="$xs" css={{ color: '$accents7' }}>
                     Note: Grants are tagged as manual overrides in logs and are excluded from billing revenue metrics.
                  </Text>
               </Flex>
            </Modal.Body>
            <Modal.Footer>
               <Button auto light disabled={saving} onPress={closeModal}>
                  Cancel
               </Button>
               <Button
                  auto
                  flat
                  color="error"
                  disabled={saving}
                  onPress={() => handleOverride('downgrade')}
               >
                  Downgrade to Free
               </Button>
               <Button
                  auto
                  color="secondary"
                  disabled={saving}
                  onPress={() => handleOverride('grant')}
               >
                  {saving ? 'Saving...' : 'Grant Premium'}
               </Button>
            </Modal.Footer>
         </Modal>
      </Box>
   );
}
