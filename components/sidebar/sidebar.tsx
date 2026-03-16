import React from 'react';
import { useRouter } from 'next/router';
import { Box } from '../styles/box';
import { Sidebar } from './sidebar.styles';
import { Text } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { CompaniesDropdown } from './companies-dropdown';
import { SidebarItem } from './sidebar-item';
import { SidebarMenu } from './sidebar-menu';
import { CollapseItems } from './collapse-items';
import { HomeIcon } from '../icons/sidebar/home-icon';
import { AccountsIcon } from '../icons/sidebar/accounts-icon';
import { PaymentsIcon } from '../icons/sidebar/payments-icon';
import { CustomersIcon } from '../icons/sidebar/customers-icon';
import { DevIcon } from '../icons/sidebar/dev-icon';
import { ViewIcon } from '../icons/sidebar/view-icon';
import { SettingsIcon } from '../icons/sidebar/settings-icon';
import { AnalyticsIcon } from '../icons/sidebar/analytics-icon';
import { useSidebarContext } from '../layout/layout-context';
import { SupportIcon } from '../icons/navbar/support-icon';
import { AlignHorizontalJustifyCenter, BookAlert, BriefcaseBusiness, GroupIcon, Headphones, HeartPulseIcon, NotebookTabs, Settings2, SuperscriptIcon, User2, UserCheck2, UserPlus2Icon, Users2, Wallet2Icon } from 'lucide-react';

import { BalanceIcon } from '../icons/sidebar/balance-icon';
import { ChildrenIcon } from '../icons/sidebar/children-icon';
import { FilterIcon } from '../icons/sidebar/filter-icon';
import { ChangeLogIcon } from '../icons/sidebar/changelog-icon';
import { ProductsIcon } from '../icons/sidebar/products-icon';
import { ReportsIcon } from '../icons/sidebar/reports-icon';
import { SecurityIcon } from '../icons/sidebar/security-icon';


export const SidebarWrapper = () => {
   const router = useRouter();
   const { collapsed, setCollapsed } = useSidebarContext();
   const activePath = router.pathname;

   return (
      <Box
         as="aside"
         css={{
            height: '100vh',
            zIndex: 202,
            position: 'sticky',
            top: '0',
         }}
      >
         {collapsed && <Sidebar.Overlay onClick={setCollapsed} />}

         <Sidebar collapsed={collapsed}>
            <Sidebar.Header>
               <CompaniesDropdown />
            </Sidebar.Header>

            <Flex direction="column" justify="between" css={{ height: '100%' }}>
               <Sidebar.Body className="body sidebar">
                  {/* Main Navigation */}
                  <SidebarItem
                     title="Home"
                     icon={<HomeIcon />}
                     isActive={activePath === '/dashboard'}
                     href="/dashboard"
                  />

                  {/* User & Family Management */}
                  <SidebarMenu title="USER & FAMILY MANAGEMENT">
                     <SidebarItem
                        title="Users"
                        icon={<Users2 />}
                        href="/accounts"
                        isActive={activePath.startsWith('/accounts')}
                     />
                     <CollapseItems
                        title="Invites & Referrals"
                        icon={<UserPlus2Icon />}
                        items={['Referals', 'Invites']}
                     />
                  </SidebarMenu>

                  {/* Resources */}
                  <SidebarMenu title="APP RESOURCES">
                     <SidebarItem
                        title="Community"
                        icon={<GroupIcon />}
                        href="/community"
                        isActive={activePath.startsWith('/community')}
                     />
                     <SidebarItem
                        title="Experts"
                        icon={<BriefcaseBusiness />}
                        href="/experts"
                        isActive={activePath.startsWith('/experts')}
                     />
                     <CollapseItems
                        title="Resources"
                        icon={<NotebookTabs />}
                        items={['Goals', 'Routine', 'Discipline']}
                     />
                  </SidebarMenu>

                  {/* Subscription & Payments */}
                  <SidebarMenu title="SUBSCRIPTION & PAYMENTS">
                     <SidebarItem
                        title="Payments History"
                        icon={<Wallet2Icon />}
                        href="/payments"
                        isActive={activePath.startsWith('/payments')}
                     />
                  </SidebarMenu>

                  {/* Analytics & Reports 
                    <SidebarItem
                        title="User Feedbacks"
                        icon={<BookAlert />}
                        href="/feedbacks"
                        isActive={activePath.startsWith('/feedbacks')}
                     />
                  */}
                  <SidebarMenu title="ANALYTICS & REPORTS">
                     <SidebarItem
                        title="Usage Analytics"
                        icon={<AlignHorizontalJustifyCenter />}
                        href="/analytics"
                        isActive={activePath.startsWith('/analytics')}
                     />
                  </SidebarMenu>

                  {/* Settings & Config */}
                  <SidebarMenu title="SETTINGS & CONFIGURATION">
                     <SidebarItem
                        title="Profile"
                        icon={<User2 />}
                        href="/profile"
                        isActive={activePath.startsWith('/profile')}
                     />
                     <SidebarItem
                        title="Settings"
                        icon={<Settings2 />}
                        href="/settings"
                        isActive={activePath.startsWith('/settings')}
                     />
                     <SidebarItem
                        title="Roles & Permissions"
                        icon={<UserCheck2 />}
                        href="/teams"
                        isActive={activePath.startsWith('/teams')}
                     />
                  </SidebarMenu>

                  {/* Optional / Advanced */}
                  <SidebarMenu title="SUPPORT">
                     <SidebarItem
                        title="Support Tickets"
                        icon={<Headphones />}
                        href="/support"
                        isActive={activePath.startsWith('/support')}
                     />

                     <SidebarItem
                        title="System Health"
                        icon={<HeartPulseIcon />}
                        href="/system"
                        isActive={activePath.startsWith('/system')}
                     />
                  </SidebarMenu>
               </Sidebar.Body>

               <Sidebar.Footer>
                  <Text size="$sm" css={{ color: '$accents6' }}>
                     © 2024 ParentFully
                  </Text>
               </Sidebar.Footer>
            </Flex>
         </Sidebar>
      </Box>
   );
};
