import React from 'react';
import { useRouter } from 'next/router';
import {
   BadgeHelp,
   BarChart3,
   CircleDollarSign,
   ClipboardList,
   Gift,
   Handshake,
   Home,
   House,
   MessageSquareText,
   Settings,
   ShieldCheck,
   Target,
   UserCircle,
   UsersRound,
   CalendarCheck,
   Menu,
} from 'lucide-react';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import { ParentfullyIcon } from '../icons/parentfully-icon';
import { SidebarItem } from './sidebar-item';
import { SidebarMenu } from './sidebar-menu';
import { Sidebar } from './sidebar.styles';
import { useSidebarContext } from '../layout/layout-context';

const navSections = [
   {
      title: 'Dashboard',
      items: [{ title: 'Overview', href: '/overview', icon: Home }],
   },
   {
      title: 'People',
      items: [
         { title: 'Admin Users', href: '/admin-users', icon: ShieldCheck },
         { title: 'Families', href: '/families', icon: House },
      ],
   },
   {
      title: 'App Library',
      items: [
         { title: 'Goal Categories', href: '/goal-categories', icon: Target },
         { title: 'Routines & Tasks', href: '/routines', icon: CalendarCheck },
         { title: 'Discipline Plans', href: '/discipline-plans', icon: ClipboardList },
      ],
   },
   {
      title: 'Revenue & Growth',
      items: [
         { title: 'Subscriptions', href: '/subscriptions', icon: CircleDollarSign },
         { title: 'Rewards', href: '/rewards', icon: Gift },
         { title: 'Referrals', href: '/referrals', icon: UsersRound },
         { title: 'Affiliates', href: '/affiliates', icon: Handshake },
      ],
   },
   {
      title: 'Insights',
      items: [
         { title: 'Feedback', href: '/feedback', icon: MessageSquareText },
         { title: 'Analytics', href: '/analytics', icon: BarChart3 },
         { title: 'FAQs', href: '/faqs', icon: BadgeHelp },
      ],
   },
   {
      title: 'Account',
      items: [
         { title: 'Settings', href: '/settings', icon: Settings },
         { title: 'Profile', href: '/profile', icon: UserCircle },
      ],
   },
] as const;

export const SidebarWrapper = () => {
   const router = useRouter();
   const { collapsed, mobileOpen, setCollapsed } = useSidebarContext();

   const isActive = (href: string) => {
      if (href === '/overview') return ['/', '/dashboard', '/overview'].includes(router.pathname);
      return router.pathname === href || router.pathname.startsWith(`${href}/`);
   };

   const isSectionActive = (section: (typeof navSections)[number]) =>
      section.items.some((item) => isActive(item.href));

   return (
      <Box
         as="aside"
         css={{
            height: '100vh',
            zIndex: 202,
            position: 'sticky',
            top: 0,
            background: 'var(--pf-sidebar-bg)',
            borderRight: '1px solid var(--pf-border)',
            '&::after': {
               content: '',
               position: 'absolute',
               top: 0,
               right: '-1px',
               width: '1px',
               height: '110px',
               background: 'rgba(242,140,24,.7)',
               pointerEvents: 'none',
            },
         }}
      >
         {/* Global Custom Sidebar & Active Glow Animations */}
         <style>{`
            .sidebar-body::-webkit-scrollbar {
               width: 4px;
            }
            .sidebar-body::-webkit-scrollbar-track {
               background: transparent;
            }
            .sidebar-body::-webkit-scrollbar-thumb {
               background: rgba(255, 255, 255, 0.1);
               border-radius: 4px;
            }
            .sidebar-body::-webkit-scrollbar-thumb:hover {
               background: rgba(255, 255, 255, 0.2);
            }
         `}</style>

         {mobileOpen && <Sidebar.Overlay onClick={setCollapsed} />}

         {!mobileOpen && (
            <button
               type="button"
               aria-label="Open sidebar"
               onClick={setCollapsed}
               className="sidebar-mobile-trigger"
               style={{ position: 'fixed', top: 16, left: 14, zIndex: 203, width: 40, height: 40, borderRadius: 12, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(12,12,16,.86)', backdropFilter: 'blur(18px)', color: 'white', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
               <Menu size={20} />
            </button>
         )}

         <Sidebar open={mobileOpen} compact={collapsed}>
            {/* Header Brand / Company Select */}
            <Sidebar.Header
               css={{
                  borderBottom: '1px solid var(--pf-border)',
               padding: collapsed ? '14px 12px' : '14px 12px 14px 18px',
               }}
            >
               <div className={`sidebar-brand${collapsed ? ' compact' : ''}`}>
                  <span className="sidebar-brand-mark"><ParentfullyIcon /></span>
                  {!collapsed && <span className="sidebar-brand-copy"><strong>ParentFully</strong><small>Admin workspace</small></span>}
               </div>
               <button
                  type="button"
                  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  onClick={setCollapsed}
                  className="sidebar-collapse-button"
                  style={{ marginLeft: collapsed ? 4 : 'auto' }}
               >
                  <Menu size={18} />
               </button>
            </Sidebar.Header>

            <Flex
               direction="column"
               justify="between"
               css={{
                  height: 'calc(100% - 73px)',
                  minHeight: 0,
               }}
            >
               {/* Scrollable Navigation Sections */}
               <Sidebar.Body
                  className="sidebar-body"
                  css={{
                     py: '$5',
                     px: '$3',
                     overflowY: 'auto',
                     flex: 1,
                  }}
               >
                  {navSections.map((section) => section.title === 'Dashboard' ? (
                     <Box key={section.title} css={{ mb: '$3' }}>
                        {section.items.map((item) => {
                           const Icon = item.icon;
                           return <SidebarItem key={item.href} title={item.title} icon={<Icon size={16} strokeWidth={2} />} href={item.href} isActive={isActive(item.href)} />;
                        })}
                     </Box>
                  ) : (
                     <SidebarMenu
                        key={section.title}
                        title={section.title}
                        defaultOpen={isSectionActive(section)}
                        compact={collapsed}
                     >
                        {section.items.map((item) => {
                           const Icon = item.icon;
                           return (
                              <SidebarItem
                                 key={item.href}
                                 title={item.title}
                                 icon={<Icon size={16} strokeWidth={2} />}
                                 href={item.href}
                                 isActive={isActive(item.href)}
                              />
                           );
                        })}
                     </SidebarMenu>
                  ))}
               </Sidebar.Body>

               {/* Footer copyright */}
               <Sidebar.Footer
                  css={{
                     borderTop: '1px solid var(--pf-border)',
                     padding: collapsed ? '14px 10px' : '14px 18px',
                     background: 'transparent',
                  }}
               >
                  {!collapsed ? <div className="sidebar-footer-status"><span /><div><strong>Admin console</strong><small>Connected to live data</small></div></div> : <span className="sidebar-footer-dot" title="Connected to live data" />}
               </Sidebar.Footer>
            </Flex>
         </Sidebar>
      </Box>
   );
};
