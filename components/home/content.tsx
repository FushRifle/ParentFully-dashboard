import React from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
   ArrowRight,
   BadgeDollarSign,
   BarChart3,
   Clock3,
   CreditCard,
   Handshake,
   LifeBuoy,
} from 'lucide-react';
import { api } from '../../lib';
import { TableExport } from '../shared/table-export';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import { OverviewStats } from './overview-stats';
import { useUserStats } from '../../hooks/user/useUserStats';

type OverviewSession = {
   id: number;
   user_name: string | null;
   user_email: string | null;
   platform: string | null;
   last_screen: string | null;
   duration_seconds: number | null;
   opened_at: string | null;
};

type OverviewData = {
   sessions: OverviewSession[];
   totalSessions: number;
   affiliatesTotal: number;
};

const loadOverviewData = async (): Promise<OverviewData> => {
   const [sessionsResponse, affiliatesResponse] = await Promise.all([
      api.get('/v1/admin/analytics/sessions', {
         params: { period: '30d', page: 1, per_page: 7 },
      }),
      api.get('/v1/admin/affiliate-partners', { params: { page: 1, per_page: 1 } }),
   ]);
   return {
      sessions: sessionsResponse.data?.data?.data ?? [],
      totalSessions: Number(sessionsResponse.data?.data?.total ?? 0),
      affiliatesTotal: Number(affiliatesResponse.data?.data?.total ?? 0),
   };
};

export const Content = () => {
   const { stats, loading, error } = useUserStats();
   const overview = useQuery<OverviewData>({
      queryKey: ['overview-sessions-and-feedback'],
      queryFn: loadOverviewData,
      retry: 1,
   });

   const quickActions = [
      {
         label: 'Subscriptions',
         detail: 'Manage billing and premium access',
         value: stats?.total_premium_users ?? stats?.active_subscriptions ?? 0,
         valueLabel: 'premium accounts',
         href: '/subscriptions',
         icon: CreditCard,
         illustration: '',
         color: '#0ea5e9',
         remote: false,
      },
      {
         label: 'Affiliates',
         detail: 'Manage partners and commissions',
         value: overview.data?.affiliatesTotal ?? 0,
         valueLabel: 'partners',
         href: '/affiliates',
         icon: Handshake,
         illustration: '/illustrations/overview/goals.svg',
         color: '#f97316',
         remote: true,
      },
      {
         label: 'Support',
         detail: 'Open customer conversations',
         value: stats?.open_support_tickets ?? 0,
         valueLabel: 'open tickets',
         href: '/support',
         icon: LifeBuoy,
         illustration: '/illustrations/overview/discipline.svg',
         color: '#8b5cf6',
         remote: false,
      },
   ];

   return (
      <Box
         className="overview-page"
         css={{ width: '100%', maxW: '1440px', mx: 'auto', pb: '$12' }}
      >
         <Flex
            justify="between"
            align="end"
            css={{ mb: '$6', flexWrap: 'wrap', gap: '$4' }}
         >
            <Box>
               <TextLabel>PLATFORM OVERVIEW</TextLabel>
               <h2 className="overview-intro">
                  Customer, family, subscription and engagement data from ParentFully.
               </h2>
            </Box>
            <span className="overview-live">
               <i />
               {loading ? 'Syncing' : error ? 'Unavailable' : 'Live'}
            </span>
         </Flex>

         <OverviewStats dashboardStats={stats} loading={loading} error={error} />

         <div className="overview-detail-grid overview-operations-grid">
            <section className="overview-panel overview-quick-panel">
               <header className="overview-panel-header">
                  <div className="overview-panel-heading">
                     <span className="overview-panel-icon blue">
                        <BarChart3 size={17} />
                     </span>
                     <div>
                        <h2>Quick actions</h2>
                        <p>Live operational shortcuts</p>
                     </div>
                  </div>
               </header>
               <div className="overview-quick-grid">
                  {quickActions.map((action) => {
                     const Icon = action.icon;
                     return (
                        <NextLink
                           href={action.href}
                           passHref
                           legacyBehavior
                           key={action.label}
                        >
                           <a
                              className="overview-quick-card"
                              style={
                                 { '--quick-color': action.color } as React.CSSProperties
                              }
                           >
                              <div className="overview-quick-copy">
                                 <span>
                                    <Icon size={16} />
                                 </span>
                                 <h3>{action.label}</h3>
                                 <strong>
                                    {action.remote && overview.isLoading
                                       ? '—'
                                       : action.value.toLocaleString()}
                                 </strong>
                                 <small>{action.valueLabel}</small>
                                 <p>{action.detail}</p>
                              </div>
                              <span className="overview-quick-illustration">
                                 {action.illustration ? (
                                    <Image
                                       src={action.illustration}
                                       alt=""
                                       layout="fill"
                                       objectFit="contain"
                                       objectPosition="right bottom"
                                       loading="lazy"
                                    />
                                 ) : (
                                    <BadgeDollarSign
                                       className="overview-quick-dollar"
                                       aria-hidden="true"
                                    />
                                 )}
                              </span>
                              <ArrowRight
                                 className="overview-quick-arrow"
                                 size={15}
                              />
                           </a>
                        </NextLink>
                     );
                  })}
               </div>
            </section>

            <section className="overview-panel overview-sessions-panel">
               <header className="overview-panel-header">
                  <div className="overview-panel-heading">
                     <span className="overview-panel-icon green">
                        <Clock3 size={17} />
                     </span>
                     <div>
                        <h2>Recent app sessions</h2>
                        <p>Latest sessions recorded by analytics</p>
                     </div>
                  </div>
                  <Flex align="center" css={{ gap: '$3' }}>{overview.data?.sessions?.length ? <TableExport rows={overview.data.sessions} filename="recent-app-sessions" title="Recent app sessions" columns={[{ key: 'user_name', label: 'User' }, { key: 'user_email', label: 'Email' }, { key: 'platform', label: 'Platform' }, { key: 'last_screen', label: 'Last screen', value: (session) => formatScreenName(session.last_screen) }, { key: 'duration_seconds', label: 'Duration', value: (session) => formatDuration(session.duration_seconds) }, { key: 'opened_at', label: 'Opened' }]} /> : null}<NextLink href="/analytics" passHref legacyBehavior><a className="overview-panel-link">View analytics <ArrowRight size={14} /></a></NextLink></Flex>
               </header>
               {overview.isLoading ? (
                  <PanelSkeleton />
               ) : overview.isError ? (
                  <EmptyState
                     icon={<Clock3 size={18} />}
                     text="Sessions are temporarily unavailable."
                  />
               ) : overview.data?.sessions.length ? (
                  <div className="overview-session-table-wrap">
                     <table className="overview-session-table">
                        <thead>
                           <tr>
                              <th>User</th>
                              <th>Platform</th>
                              <th>Last screen</th>
                              <th>Duration</th>
                              <th>Opened</th>
                           </tr>
                        </thead>
                        <tbody>
                           {overview.data.sessions.map((session) => (
                              <tr key={session.id}>
                                 <td>
                                    <strong>
                                       {session.user_name || 'Unknown user'}
                                    </strong>
                                    <small>
                                       {session.user_email || 'Email unavailable'}
                                    </small>
                                 </td>
                                 <td>
                                    <span>{session.platform || '—'}</span>
                                 </td>
                                 <td>{formatScreenName(session.last_screen)}</td>
                                 <td>{formatDuration(session.duration_seconds)}</td>
                                 <td>{formatSessionDate(session.opened_at)}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               ) : (
                  <EmptyState
                     icon={<Clock3 size={18} />}
                     text="No sessions recorded in the last 30 days."
                  />
               )}
            </section>
         </div>
      </Box>
   );
};

const formatDuration = (seconds: number | null) => {
   const total = Number(seconds);
   if (!Number.isFinite(total)) return '—';
   if (total < 60) return `${Math.max(0, Math.round(total))}s`;
   const minutes = Math.floor(total / 60);
   const remainder = Math.round(total % 60);
   return remainder ? `${minutes}m ${remainder}s` : `${minutes}m`;
};

const formatSessionDate = (value: string | null) => {
   if (!value) return '—';
   const date = new Date(value);
   return Number.isNaN(date.getTime())
      ? '—'
      : date.toLocaleString([], {
         month: 'short',
         day: 'numeric',
         hour: 'numeric',
         minute: '2-digit',
      });
};

const formatScreenName = (value: string | null) =>
   value?.trim() === '/' ? 'Homescreen' : value || '—';

const TextLabel = ({ children }: { children: React.ReactNode }) => (
   <span className="overview-kicker">{children}</span>
);

const EmptyState = ({
   icon,
   text,
}: {
   icon: React.ReactNode;
   text: string;
}) => (
   <div className="overview-empty">
      <span>{icon}</span>
      <p>{text}</p>
   </div>
);

const PanelSkeleton = () => (
   <div className="overview-panel-skeleton">
      <i />
      <i />
      <i />
   </div>
);
