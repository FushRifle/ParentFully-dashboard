import React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { ArrowRight, Baby, CalendarCheck, Home, LucideIcon, ScrollText, Target, Users } from 'lucide-react';
import type { AdminDashboardStats } from '../../types/api';

type StatItem = {
   id: string;
   label: string;
   description: string;
   value: number;
   icon: LucideIcon;
   href: string;
   color: string;
   tint: string;
   illustration: string;
   illustrationAlt: string;
};

export const OverviewStats = ({ dashboardStats, loading, error }: { dashboardStats: AdminDashboardStats | null; loading: boolean; error: string | null }) => {
   const items: StatItem[] = [
      { id: 'users', label: 'Total Users', description: 'Registered customer accounts', value: dashboardStats?.total_users ?? 0, icon: Users, href: '/customers', color: '#f97316', tint: 'rgba(249,115,22,.1)', illustration: '/illustrations/overview/users.webp', illustrationAlt: 'ParentFully customer community' },
      { id: 'families', label: 'Active Families', description: 'Families currently active', value: dashboardStats?.active_families ?? 0, icon: Home, href: '/families', color: '#10b981', tint: 'rgba(16,185,129,.1)', illustration: '/illustrations/overview/families.webp', illustrationAlt: 'A family together at home' },
      { id: 'children', label: 'Total Children', description: 'Children across all families', value: dashboardStats?.total_children ?? 0, icon: Baby, href: '/customers', color: '#ec4899', tint: 'rgba(236,72,153,.1)', illustration: '/illustrations/overview/children.svg', illustrationAlt: 'Children learning together' },
      { id: 'goals', label: 'Goals Created', description: 'Goals created by families', value: dashboardStats?.total_goals ?? 0, icon: Target, href: '/goal-categories', color: '#3b82f6', tint: 'rgba(59,130,246,.1)', illustration: '/illustrations/overview/goals.svg', illustrationAlt: 'Personal goals' },
      { id: 'routines', label: 'Active Routines', description: 'Available routine templates', value: dashboardStats?.total_system_routines ?? 0, icon: CalendarCheck, href: '/routines', color: '#14b8a6', tint: 'rgba(20,184,166,.1)', illustration: '/illustrations/overview/routines.svg', illustrationAlt: 'Routine scheduling' },
      { id: 'plans', label: 'Discipline Plans', description: 'Active discipline templates', value: dashboardStats?.total_plans_active ?? 0, icon: ScrollText, href: '/discipline-plans', color: '#a855f7', tint: 'rgba(168,85,247,.1)', illustration: '/illustrations/overview/discipline.svg', illustrationAlt: 'Supportive conversation' },
   ];

   return <section aria-label="Platform statistics">
      {error && <div className="overview-error"><span />{error}</div>}
      <div className="overview-stat-grid">
         {items.map((item) => {
            const Icon = item.icon;
            return <NextLink key={item.id} href={item.href} passHref legacyBehavior><a className="overview-stat-card">
               <div className="overview-stat-top">
                  <span className="overview-stat-icon" style={{ color: item.color, background: item.tint }}><Icon size={19} strokeWidth={2} /></span>
                  <ArrowRight className="overview-stat-arrow" size={17} />
               </div>
               <div>
                  {loading ? <span className="overview-stat-skeleton" /> : <strong>{item.value.toLocaleString()}</strong>}
                  <h3>{item.label}</h3>
                  <p>{item.description}</p>
               </div>
               <span className="overview-stat-illustration"><Image src={item.illustration} alt={item.illustrationAlt} layout="fill" objectFit="contain" objectPosition="right bottom" loading="lazy" /></span>
            </a></NextLink>;
         })}
      </div>
   </section>;
};
