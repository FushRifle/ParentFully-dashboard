import React from 'react';
import { useRouter } from 'next/router';
import { Box } from '../styles/box';
import { Sidebar } from './sidebar.styles';
import { Avatar, Tooltip, Text } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { CompaniesDropdown } from './companies-dropdown';
import { SidebarItem } from './sidebar-item';
import { SidebarMenu } from './sidebar-menu';
import { CollapseItems } from './collapse-items';

import { HomeIcon } from '../icons/sidebar/home-icon';
import { AccountsIcon } from '../icons/sidebar/accounts-icon';
import { PaymentsIcon } from '../icons/sidebar/payments-icon';
import { BalanceIcon } from '../icons/sidebar/balance-icon';
import { CustomersIcon } from '../icons/sidebar/customers-icon';
import { ProductsIcon } from '../icons/sidebar/products-icon';
import { ReportsIcon } from '../icons/sidebar/reports-icon';
import { SecurityIcon } from '../icons/sidebar/security-icon';
import { DevIcon } from '../icons/sidebar/dev-icon';
import { ViewIcon } from '../icons/sidebar/view-icon';
import { SettingsIcon } from '../icons/sidebar/settings-icon';
import { FilterIcon } from '../icons/sidebar/filter-icon';
import { ChangeLogIcon } from '../icons/sidebar/changelog-icon';
import { AnalyticsIcon } from '../icons/sidebar/analytics-icon';

import { useSidebarContext } from '../layout/layout-context';
import { ChildrenIcon } from '../icons/sidebar/children-icon';

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
                     isActive={activePath === '/'}
                     href="/"
                  />

                  {/* User & Family Management */}
                  <SidebarMenu title="USER & FAMILY MANAGEMENT">
                     <SidebarItem
                        title="Users"
                        icon={<CustomersIcon />}
                        href="/accounts"
                        isActive={activePath.startsWith('/accounts')}
                     />
                     <SidebarItem
                        title="Families"
                        icon={<ChildrenIcon />}
                        href="/children"
                        isActive={activePath.startsWith('/children')}
                     />
                     <CollapseItems
                        title="Invites & Connections"
                        icon={<AccountsIcon />}
                        items={['Referals', 'Invites']}
                     />
                  </SidebarMenu>

                  {/* Subscription & Payments */}
                  <SidebarMenu title="SUBSCRIPTION & PAYMENTS">
                     <SidebarItem
                        title="Plans Overview"
                        icon={<BalanceIcon />}
                        href="/plans"
                        isActive={activePath.startsWith('/plans')}
                     />
                     <SidebarItem
                        title="Payments History"
                        icon={<PaymentsIcon />}
                        href="/payments"
                        isActive={activePath.startsWith('/payments')}
                     />
                     <SidebarItem
                        title="Rewards & Points"
                        icon={<BalanceIcon />}
                        href="/balances"
                        isActive={activePath.startsWith('/balances')}
                     />
                  </SidebarMenu>

                  {/* Analytics & Reports */}
                  <SidebarMenu title="ANALYTICS & REPORTS">
                     <SidebarItem
                        title="Usage Analytics"
                        icon={<AnalyticsIcon />}
                        href="/analytics/usage"
                        isActive={activePath.startsWith('/analytics/usage')}
                     />
                     <SidebarItem
                        title="Child Engagement"
                        icon={<AnalyticsIcon />}
                        href="/analytics/engagement"
                        isActive={activePath.startsWith('/analytics/engagement')}
                     />
                     <SidebarItem
                        title="Financial Reports"
                        icon={<ReportsIcon />}
                        href="/analytics/financial"
                        isActive={activePath.startsWith('/analytics/financial')}
                     />
                  </SidebarMenu>

                  {/* Security & Logs */}
                  <SidebarMenu title="SECURITY & LOGS">
                     <SidebarItem
                        title="Security Logs"
                        icon={<SecurityIcon />}
                        href="/security"
                        isActive={activePath.startsWith('/security')}
                     />
                     <SidebarItem
                        title="Admin Activity"
                        icon={<ChangeLogIcon />}
                        href="/admin-activity"
                        isActive={activePath.startsWith('/admin-activity')}
                     />
                  </SidebarMenu>

                  {/* Settings & Config */}
                  <SidebarMenu title="SETTINGS & CONFIGURATION">
                     <SidebarItem
                        title="Profile"
                        icon={<SettingsIcon />}
                        href="/profile"
                        isActive={activePath.startsWith('/profile')}
                     />
                     <SidebarItem
                        title="Settings"
                        icon={<SettingsIcon />}
                        href="/settings"
                        isActive={activePath.startsWith('/settings')}
                     />
                     <SidebarItem
                        title="Roles & Permissions"
                        icon={<DevIcon />}
                        href="/roles"
                        isActive={activePath.startsWith('/roles')}
                     />
                     <SidebarItem
                        title="Templates & Messaging"
                        icon={<FilterIcon />}
                        href="/templates"
                        isActive={activePath.startsWith('/templates')}
                     />
                  </SidebarMenu>

                  {/* Optional / Advanced */}
                  <SidebarMenu title="ADVANCED">
                     <SidebarItem
                        title="Support Tickets"
                        icon={<ViewIcon />}
                        href="/support"
                        isActive={activePath.startsWith('/support')}
                     />
                     <SidebarItem
                        title="System Health"
                        icon={<AnalyticsIcon />}
                        href="/system-health"
                        isActive={activePath.startsWith('/system-health')}
                     />
                  </SidebarMenu>
               </Sidebar.Body>

               {/* Footer
               
               <Tooltip content="Settings" rounded color="primary">
                     <SettingsIcon />
                  </Tooltip>
                  <Tooltip content="Adjustments" rounded color="primary">
                     <FilterIcon />
                  </Tooltip>
                  <Tooltip content="Profile" rounded color="primary">
                     <Avatar
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        size="sm"
                     />
                  </Tooltip>
                  */}
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
