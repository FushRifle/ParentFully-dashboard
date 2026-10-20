import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { Navbar, Text, Input } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { MessageSquare, HelpCircle, Search, Menu, X, ChevronRight } from 'lucide-react';

import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import { BurguerButton } from './burguer-button';
import { NotificationsDropdown } from './notifications-dropdown';
import { UserDropdown } from './user-dropdown';
import { getPageMeta } from '../../lib/pageMeta';

interface Props {
   children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
   const router = useRouter();
   const meta = getPageMeta(router.pathname);
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

   const collapseItems = [
      'Profile',
      'Dashboard',
      'Activity',
      'Analytics',
      'System',
      'Deployments',
      'My Settings',
      'Log Out',
   ];

   return (
      <Box css={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
         <Navbar
            isBordered
            variant="sticky"
            css={{
               borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
               height: '70px',
               background: 'rgba(12, 12, 15, 0.75) !important',
               backdropFilter: 'blur(20px)',
               '& .nextui-navbar-container': {
                  maxWidth: '100%',
                  gap: '$6',
                  bg: 'transparent',
               },
            }}
         >
            {/* Left Section: Brand & Page Title */}
            <Navbar.Content css={{ minWidth: '220px', gap: '$4' }}>
               <Navbar.Item>
                  <BurguerButton />
               </Navbar.Item>
               <Navbar.Item>
                  <Box>
                     <Text h4 css={{ m: 0, lineHeight: '$sm', fontSize: '1rem', color: '$white' }}>
                        {meta.title}
                     </Text>
                     <Text size="$xs" css={{ color: '$accents6', '@xsMax': { display: 'none' } }}>
                        {meta.subtitle}
                     </Text>
                  </Box>
               </Navbar.Item>
            </Navbar.Content>

            {/* Search Input */}
            <Navbar.Content css={{ flex: 1, '@smMax': { display: 'none' } }}>
               <Navbar.Item css={{ width: '100%', maxWidth: '420px' }}>
                  <Input
                     clearable
                     contentLeft={<Search size={16} color="rgba(255,255,255,0.4)" />}
                     placeholder="Quick search... (Cmd + K)"
                     bordered
                     width="100%"
                     css={{
                        '& .nextui-input-wrapper': {
                           bg: 'rgba(20, 20, 26, 0.65)',
                           borderRadius: '$pill',
                           px: '$6',
                           py: '$3',
                           border: '1px solid rgba(255, 255, 255, 0.08)',
                        },
                     }}
                  />
               </Navbar.Item>
            </Navbar.Content>

            {/* Right Section: Actions */}
            <Navbar.Content css={{ gap: '$4', alignItems: 'center' }}>
               {/* Feedback */}
               <Navbar.Item css={{ '@mdMax': { display: 'none' } }}>
                  <NextLink href="/feedback" passHref legacyBehavior>
                     <Flex align="center" css={{ gap: '$2', cursor: 'pointer', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                        <MessageSquare size={16} color="white" />
                        <Text span size="$xs" b css={{ color: '$white' }}>
                           Feedback
                        </Text>
                     </Flex>
                  </NextLink>
               </Navbar.Item>

               {/* Notifications */}
               <Navbar.Item>
                  <NotificationsDropdown />
               </Navbar.Item>

               {/* Support */}
               <Navbar.Item css={{ '@mdMax': { display: 'none' } }}>
                  <NextLink href="#" passHref legacyBehavior>
                     <Flex align="center" css={{ cursor: 'pointer', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                        <HelpCircle size={18} color="white" />
                     </Flex>
                  </NextLink>
               </Navbar.Item>

               {/* User Profile */}
               <Navbar.Item>
                  <UserDropdown />
               </Navbar.Item>
            </Navbar.Content>

            {/* Mobile Collapse Menu */}
            <Navbar.Collapse>
               {collapseItems.map((item, index) => (
                  <Navbar.CollapseItem
                     key={item}
                     activeColor="secondary"
                     css={{ color: index === collapseItems.length - 1 ? '$error' : '$foreground' }}
                     isActive={index === 2}
                  >
                     <NextLink href="#" style={{ minWidth: '100%', color: 'inherit', textDecoration: 'none' }}>
                        {item}
                     </NextLink>
                  </Navbar.CollapseItem>
               ))}
            </Navbar.Collapse>
         </Navbar>

         {/* Main Layout Container */}
         <Box className="admin-canvas" css={{ p: '$6', '@xsMax': { p: '$4' }, flex: 1, overflowY: 'auto' }}>
            {children}
         </Box>
      </Box>
   );
};
