import React from 'react';
import { Input, Link, Navbar, Text, Button } from '@nextui-org/react';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import { BurguerButton } from './burguer-button';
import { NotificationsDropdown } from './notifications-dropdown';
import { UserDropdown } from './user-dropdown';
import { FeedbackIcon } from '../icons/navbar/feedback-icon';
import { SupportIcon } from '../icons/navbar/support-icon';
import { SearchIcon } from '../icons/searchicon';

interface Props {
   children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
   const collapseItems = [
      'Profile', 'Dashboard', 'Activity', 'Analytics',
      'System', 'Deployments', 'My Settings', 'Log Out',
   ];

   return (
      <Box css={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
         <Navbar
            isBordered
            variant="sticky"
            css={{
               borderBottom: '1px solid $border',
               height: '72px',
               '& .nextui-navbar-container': {
                  maxWidth: '100%',
                  gap: '$10',
                  bg: '$background',
               },
            }}
         >
            {/* Left Side: Brand & Search */}
            <Navbar.Content>
               <Navbar.Content showIn="md">
                  <BurguerButton />
               </Navbar.Content>
            </Navbar.Content>

            <Navbar.Content css={{ ml: '$10', '@mdMax': { ml: '$7' }, flex: 2, minWidth: '400px' }}>
               <Input
                  clearable
                  contentLeft={<SearchIcon fill="var(--nextui-colors-accents6)" size={16} />}
                  placeholder="Quick search... (Cmd + K)"
                  bordered
                  width='50%'
                  css={{
                     '& .nextui-input-wrapper': {
                        bc: '$accents1',
                        borderRadius: '$pill',
                        px: '$6',
                        py: '$3',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                     },
                  }}
               />
            </Navbar.Content>

            {/* Right Side: Actions */}
            <Navbar.Content css={{ gap: '$6', alignItems: 'center' }}>
               {/* Feedback */}
               <Navbar.Content hideIn={'md'}>
                  <Flex align="center" css={{ gap: '$2', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}>
                     <FeedbackIcon />
                     <Text span size="$sm" b>Feedback</Text>
                  </Flex>
               </Navbar.Content>

               {/* Notifications */}
               <Navbar.Content>
                  <NotificationsDropdown />
               </Navbar.Content>

               {/* Support */}
               <Navbar.Content hideIn={'md'}>
                  <Link href="#"><SupportIcon /></Link>
               </Navbar.Content>

               {/* User */}
               <Navbar.Content>
                  <UserDropdown />
               </Navbar.Content>
            </Navbar.Content>

            {/* Collapse Items */}
            <Navbar.Collapse>
               {collapseItems.map((item, index) => (
                  <Navbar.CollapseItem
                     key={item}
                     activeColor="secondary"
                     css={{ color: index === collapseItems.length - 1 ? '$error' : '$foreground' }}
                     isActive={index === 2}
                  >
                     <Link color="inherit" css={{ minWidth: '100%' }} href="#">{item}</Link>
                  </Navbar.CollapseItem>
               ))}
            </Navbar.Collapse>
         </Navbar>

         {/* Main Content */}
         <Box css={{ p: '$8', '@xsMax': { p: '$4' }, flex: 1, overflowY: 'auto' }}>
            {children}
         </Box>
      </Box>
   );
};
