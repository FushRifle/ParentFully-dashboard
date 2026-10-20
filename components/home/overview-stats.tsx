import React from 'react';
import NextLink from 'next/link';
import {
   Users,
   Home,
   Baby,
   Target,
   CalendarCheck,
   ScrollText,
   LucideIcon,
   ArrowUpRight,
   TrendingUp,
} from 'lucide-react';
import type { AdminDashboardStats } from '../../types/api';

interface StatConfigItem {
   id: string;
   label: string;
   value: number;
   icon: LucideIcon;
   href: string;
   accent: {
      primary: string;
      glow: string;
      border: string;
      badgeBg: string;
   };
}

export const OverviewStats = ({ dashboardStats, loading, error }: { dashboardStats: AdminDashboardStats | null; loading: boolean; error: string | null }) => {

   const statConfig: StatConfigItem[] = [
      {
         id: 'total-users',
         label: 'Total Users',
         value: dashboardStats?.total_users ?? 0,
         icon: Users,
         href: '/customers',
         accent: {
            primary: '#f97316',
            glow: 'rgba(249, 115, 22, 0.15)',
            border: 'rgba(249, 115, 22, 0.35)',
            badgeBg: 'rgba(249, 115, 22, 0.1)',
         },
      },
      {
         id: 'active-families',
         label: 'Active Families',
         value: dashboardStats?.active_families ?? 0,
         icon: Home,
         href: '/customers',
         accent: {
            primary: '#10b981',
            glow: 'rgba(16, 185, 129, 0.15)',
            border: 'rgba(16, 185, 129, 0.35)',
            badgeBg: 'rgba(16, 185, 129, 0.1)',
         },
      },
      {
         id: 'total-children',
         label: 'Total Children',
         value: dashboardStats?.total_children ?? 0,
         icon: Baby,
         href: '/customers',
         accent: {
            primary: '#ec4899',
            glow: 'rgba(236, 72, 153, 0.15)',
            border: 'rgba(236, 72, 153, 0.35)',
            badgeBg: 'rgba(236, 72, 153, 0.1)',
         },
      },
      {
         id: 'goals-created',
         label: 'Goals Created',
         value: dashboardStats?.total_goals ?? 0,
         icon: Target,
         href: '/goal-categories',
         accent: {
            primary: '#3b82f6',
            glow: 'rgba(59, 130, 246, 0.15)',
            border: 'rgba(59, 130, 246, 0.35)',
            badgeBg: 'rgba(59, 130, 246, 0.1)',
         },
      },
      {
         id: 'active-routines',
         label: 'Active Routines',
         value: dashboardStats?.total_system_routines ?? 0,
         icon: CalendarCheck,
         href: '/routines',
         accent: {
            primary: '#14b8a6',
            glow: 'rgba(20, 184, 166, 0.15)',
            border: 'rgba(20, 184, 166, 0.35)',
            badgeBg: 'rgba(20, 184, 166, 0.1)',
         },
      },
      {
         id: 'discipline-plans',
         label: 'Discipline Plans',
         value: dashboardStats?.total_plans_active ?? 0,
         icon: ScrollText,
         href: '/discipline-plans',
         accent: {
            primary: '#a855f7',
            glow: 'rgba(168, 85, 247, 0.15)',
            border: 'rgba(168, 85, 247, 0.35)',
            badgeBg: 'rgba(168, 85, 247, 0.1)',
         },
      },
   ];

   return (
      <div style={{ width: '100%', marginBottom: '2rem' }}>
         {/* Premium CSS Keyframe Injector */}
         <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .stat-card-glow {
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-card:hover .stat-card-glow {
          opacity: 1 !important;
        }
        .stat-card:hover .stat-arrow {
          transform: translate(2px, -2px) !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }
        .stat-card:hover .stat-icon-wrapper {
          transform: scale(1.05);
        }
      `}</style>

         {error && (
            <div
               style={{
                  padding: '12px 16px',
                  marginBottom: '20px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  fontSize: '13px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
               }}
            >
               <span style={{ height: '6px', width: '6px', borderRadius: '50%', background: '#ef4444' }} />
               {error}
            </div>
         )}

         <div
            style={{
               display: 'grid',
               gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
               gap: '16px',
            }}
         >
            {statConfig.map((stat) => {
               const Icon = stat.icon;

               return (
                  <NextLink
                     key={stat.id}
                     href={stat.href}
                     style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                     <div
                        className="stat-card"
                        style={{
                           position: 'relative',
                           height: '156px',
                           padding: '20px 22px',
                           borderRadius: '20px',
                           background: 'rgba(18, 18, 22, 0.65)',
                           backdropFilter: 'blur(16px)',
                           WebkitBackdropFilter: 'blur(16px)',
                           border: '1px solid rgba(255, 255, 255, 0.07)',
                           boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)',
                           display: 'flex',
                           flexDirection: 'column',
                           justifyContent: 'space-between',
                           cursor: 'pointer',
                           overflow: 'hidden',
                           transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                     >
                        {/* Soft Radial Ambient Glow On Hover */}
                        <div
                           className="stat-card-glow"
                           style={{
                              position: 'absolute',
                              top: '-40%',
                              left: '-20%',
                              width: '140%',
                              height: '140%',
                              background: `radial-gradient(circle at 20% 20%, ${stat.accent.glow} 0%, transparent 60%)`,
                              pointerEvents: 'none',
                              opacity: 0,
                              zIndex: 0,
                           }}
                        />

                        {/* Top Bar: Icon + Label + Action Indicator */}
                        <div
                           style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              position: 'relative',
                              zIndex: 1,
                           }}
                        >
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div
                                 className="stat-icon-wrapper"
                                 style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: stat.accent.badgeBg,
                                    border: `1px solid ${stat.accent.border}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'transform 0.2s ease',
                                 }}
                              >
                                 <Icon size={19} color={stat.accent.primary} strokeWidth={2} />
                              </div>

                              <div>
                                 <div
                                    style={{
                                       fontSize: '11px',
                                       fontWeight: 600,
                                       letterSpacing: '0.08em',
                                       textTransform: 'uppercase',
                                       color: 'rgba(255, 255, 255, 0.45)',
                                       fontFamily: 'system-ui, -apple-system, sans-serif',
                                    }}
                                 >
                                    {stat.label}
                                 </div>
                                 <div
                                    style={{
                                       fontSize: '10px',
                                       color: stat.accent.primary,
                                       display: 'flex',
                                       alignItems: 'center',
                                       gap: '3px',
                                       marginTop: '2px',
                                       fontWeight: 500,
                                    }}
                                 >
                                    <TrendingUp size={10} /> Active Metric
                                 </div>
                              </div>
                           </div>

                           {/* Corner Navigation Icon */}
                           <div
                              className="stat-arrow"
                              style={{
                                 color: 'rgba(255, 255, 255, 0.25)',
                                 transition: 'all 0.2s ease',
                              }}
                           >
                              <ArrowUpRight size={18} />
                           </div>
                        </div>

                        {/* Bottom Bar: Primary Metric Display */}
                        <div style={{ position: 'relative', zIndex: 1, marginTop: '12px' }}>
                           {loading ? (
                              <div
                                 style={{
                                    height: '38px',
                                    width: '50%',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 1.8s infinite linear',
                                 }}
                              />
                           ) : (
                              <div
                                 style={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: '8px',
                                 }}
                              >
                                 <span
                                    style={{
                                       fontSize: '2.4rem',
                                       fontWeight: 700,
                                       lineHeight: 1,
                                       letterSpacing: '-0.04em',
                                       color: '#ffffff',
                                       fontFamily: 'Inter, system-ui, sans-serif',
                                       textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                                    }}
                                 >
                                    {stat.value.toLocaleString()}
                                 </span>
                              </div>
                           )}
                        </div>
                     </div>
                  </NextLink>
               );
            })}
         </div>
      </div>
   );
};
