import React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { ArrowRight, Baby, CircleDollarSign, Home, LucideIcon, ScrollText, Target, Users } from 'lucide-react';
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
      { id: 'users', label: 'Total Users', description: 'People registered across families', value: dashboardStats?.total_users ?? 0, icon: Users, href: '/families', color: '#f97316', tint: 'rgba(249,115,22,.1)', illustration: '/illustrations/overview/users.webp', illustrationAlt: 'ParentFully customer community' },
      { id: 'families', label: 'Active Families', description: 'Families currently active', value: dashboardStats?.active_families ?? 0, icon: Home, href: '/families', color: '#10b981', tint: 'rgba(16,185,129,.1)', illustration: '/illustrations/overview/families.webp', illustrationAlt: 'A family together at home' },
      { id: 'children', label: 'Total Children', description: 'Children across all families', value: dashboardStats?.total_children ?? 0, icon: Baby, href: '/families', color: '#ec4899', tint: 'rgba(236,72,153,.1)', illustration: '/illustrations/overview/children.svg', illustrationAlt: 'Children learning together' },
      { id: 'premium', label: 'Total Premium Users', description: 'Accounts with active premium access', value: dashboardStats?.active_subscriptions ?? 0, icon: CircleDollarSign, href: '/subscriptions', color: '#14b8a6', tint: 'rgba(20,184,166,.1)', illustration: '', illustrationAlt: 'Premium subscriptions' },
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
               <span className="overview-stat-illustration">{item.illustration ? <Image src={item.illustration} alt={item.illustrationAlt} layout="fill" objectFit="contain" objectPosition="right bottom" loading="lazy" /> : <CircleDollarSign className="overview-dollar-illustration" aria-label={item.illustrationAlt} />}</span>
            </a></NextLink>;
         })}
      </div>
   </section>;
};
