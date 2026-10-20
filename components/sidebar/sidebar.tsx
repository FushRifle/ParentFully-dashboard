import React from 'react';
import { Text } from '@nextui-org/react';
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
   Users,
   UsersRound,
   CalendarCheck,
} from 'lucide-react';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import { CompaniesDropdown } from './companies-dropdown';
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
         { title: 'Customers', href: '/customers', icon: Users },
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
   const { collapsed, setCollapsed } = useSidebarContext();

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
            background: 'rgba(10, 10, 12, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.06)',
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

         {collapsed && <Sidebar.Overlay onClick={setCollapsed} />}

         <Sidebar collapsed={collapsed}>
            {/* Header Brand / Company Select */}
            <Sidebar.Header
               css={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  padding: '16px 20px',
               }}
            >
               <CompaniesDropdown />
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
                     py: '$4',
                     px: '$3',
                     overflowY: 'auto',
                     flex: 1,
                  }}
               >
                  {navSections.map((section) => (
                     <SidebarMenu
                        key={section.title}
                        title={section.title}
                        defaultOpen={isSectionActive(section)}
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
                     borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                     padding: '16px 24px',
                     background: 'rgba(12, 12, 16, 0.4)',
                  }}
               >
                  <Text size="11px" css={{ color: 'rgba(255, 255, 255, 0.35)', fontWeight: 500, letterSpacing: '0.03em' }}>
                     © 2026 ParentFully
                  </Text>
               </Sidebar.Footer>
            </Flex>
         </Sidebar>
      </Box>
   );
};