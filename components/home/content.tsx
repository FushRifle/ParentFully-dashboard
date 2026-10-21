import React, { useState } from 'react';
import NextLink from 'next/link';
import { ArrowRight, Clock3, ListFilter, Target } from 'lucide-react';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import { OverviewStats } from './overview-stats';
import { useUserStats } from '../../hooks/user/useUserStats';

const activityTitle = (activity: any) => activity.description || activity.action || activity.model_type || 'Platform activity';

export const Content = () => {
   const { stats, loading, error } = useUserStats();
   const [showAllActivity, setShowAllActivity] = useState(false);
   const categories = stats?.top_goal_categories ?? [];
   const activity = stats?.recent_activity ?? [];
   const visibleActivity = showAllActivity ? activity : activity.slice(0, 5);
   const largestCategory = Math.max(...categories.map((item) => item.goals_count), 1);

   return <Box className="overview-page" css={{ width: '100%', maxW: '1440px', mx: 'auto', pb: '$12' }}>
      <Flex justify="between" align="end" css={{ mb: '$6', flexWrap: 'wrap', gap: '$4' }}>
         <Box>
            <TextLabel>LIVE PLATFORM DATA</TextLabel>
            <h1>Platform overview</h1>
            <p className="overview-intro">Customer, family, content
               and activity totals from ParentFully.
            </p>
         </Box>
         <span className="overview-live"><i />Synced</span>
      </Flex>

      <OverviewStats dashboardStats={stats} loading={loading} error={error} />

      <div className="overview-detail-grid">
         <section className="overview-panel">
            <header className="overview-panel-header">
               <div className="overview-panel-heading"><span className="overview-panel-icon blue"><Target size={17} /></span><div><h2>Top goal categories</h2><p>Categories families use most</p></div></div>
               <NextLink href="/goal-categories" passHref legacyBehavior><a className="overview-panel-link">View all <ArrowRight size={14} /></a></NextLink>
            </header>
            <div className="overview-category-list">
               {categories.map((category, index) => <NextLink key={category.id} href={`/goal-categories/${category.id}`} passHref legacyBehavior><a className="overview-category-row">
                  <span className="overview-rank">{String(index + 1).padStart(2, '0')}</span>
                  <div className="overview-category-data"><div><strong>{category.name}</strong><span>{category.goals_count.toLocaleString()} goals</span></div><div className="overview-progress"><i style={{ width: `${Math.max((category.goals_count / largestCategory) * 100, 5)}%` }} /></div></div>
                  <ArrowRight size={15} />
               </a></NextLink>)}
               {!loading && !categories.length && <EmptyState icon={<ListFilter size={18} />} text="No category activity yet." />}
               {loading && <PanelSkeleton />}
            </div>
         </section>

         <section className="overview-panel">
            <header className="overview-panel-header">
               <div className="overview-panel-heading"><span className="overview-panel-icon green"><Clock3 size={17} /></span><div><h2>Recent activity</h2><p>Latest updates across ParentFully</p></div></div>
            </header>
            <div className="overview-activity-list">
               {visibleActivity.map((item, index) => <div className="overview-activity-row" key={item.id}>
                  <span className="overview-timeline"><i />{index < visibleActivity.length - 1 && <b />}</span>
                  <div><strong>{activityTitle(item)}</strong><p>{item.family_name || 'ParentFully account'}</p></div>
                  <time>{item.created_at ? new Date(item.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</time>
               </div>)}
               {!loading && !activity.length && <EmptyState icon={<Clock3 size={18} />} text="No recent activity." />}
               {loading && <PanelSkeleton />}
               {!loading && activity.length > 5 && <button className="overview-see-more" type="button" onClick={() => setShowAllActivity((current) => !current)}>{showAllActivity ? 'Show less' : `See more (${activity.length - 5})`}<ArrowRight size={14} /></button>}
            </div>
         </section>
      </div>
   </Box>;
};

const TextLabel = ({ children }: { children: React.ReactNode }) => <span className="overview-kicker">{children}</span>;
const EmptyState = ({ icon, text }: { icon: React.ReactNode; text: string }) => <div className="overview-empty"><span>{icon}</span><p>{text}</p></div>;
const PanelSkeleton = () => <div className="overview-panel-skeleton"><i /><i /><i /></div>;
