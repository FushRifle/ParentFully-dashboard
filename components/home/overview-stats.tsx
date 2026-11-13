import React from 'react';
import Image from 'next/image';
import { Baby, CircleDollarSign, DollarSign, Home, LucideIcon } from 'lucide-react';
import type { AdminDashboardStats } from '../../types/api';
import { OverviewCard, OverviewCardGrid } from '../shared/overview-card';

type StatItem = {
   id: string;
   label: string;
   description: string;
   value: number;
   icon: LucideIcon;
   href: string;
   color: string;
   tint: string;
   illustration: string | null;
   illustrationAlt: string;
};

export const OverviewStats = ({
   dashboardStats,
   loading,
   error,
}: {
   dashboardStats: AdminDashboardStats | null;
   loading: boolean;
   error: string | null;
}) => {
   const items: StatItem[] = [
      {
         id: 'families',
         label: 'Active Families',
         description: 'Families currently active',
         value: dashboardStats?.active_families ?? 0,
         icon: Home,
         href: '/families',
         color: '#10b981',
         tint: 'rgba(16,185,129,.1)',
         illustration: '/illustrations/overview/users.webp',
         illustrationAlt: 'A family together at home',
      },
      {
         id: 'children',
         label: 'Total Children',
         description: 'Children across all families',
         value: dashboardStats?.total_children ?? 0,
         icon: Baby,
         href: '/families',
         color: '#ec4899',
         tint: 'rgba(236,72,153,.1)',
         illustration: '/illustrations/overview/children.svg',
         illustrationAlt: 'Children learning together',
      },
      {
         id: 'premium',
         label: 'Total Premium Users',
         description: 'Billing owners with premium access',
         value:
            dashboardStats?.total_premium_users ??
            dashboardStats?.active_subscriptions ??
            0,
         icon: CircleDollarSign,
         href: '/subscriptions',
         color: '#14b8a6',
         tint: 'rgba(20,184,166,.1)',
         illustration: 'dollar-sign',
         illustrationAlt: 'Premium subscriptions',
      },
   ];

   return (
      <section aria-label="Platform statistics">
         {error && (
            <div className="overview-error">
               <span />
               {error}
            </div>
         )}
         <OverviewCardGrid columns={3}>
            {items.map((item) => (
               <OverviewCard
                  key={item.id}
                  label={item.label}
                  value={item.value.toLocaleString()}
                  description={item.description}
                  icon={item.icon}
                  color={item.color}
                  href={item.href}
                  loading={loading}
                  illustration={
                     item.illustration === 'dollar-sign' ? (
                        <DollarSign aria-hidden="true" />
                     ) : item.illustration ? (
                        <Image
                           src={item.illustration}
                           alt={item.illustrationAlt}
                           layout="fill"
                           objectFit="contain"
                           objectPosition="right bottom"
                           loading="lazy"
                           priority={false}
                        />
                     ) : undefined
                  }
               />
            ))}
         </OverviewCardGrid>
      </section>
   );
};