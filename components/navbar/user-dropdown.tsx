import { Avatar, Dropdown, Text } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { DarkModeSwitch } from './darkmodeswitch';
import NextLink from 'next/link';
import { Flex } from '../styles/flex';
import { useUser } from '../../hooks/user/useUser';

export const UserDropdown = () => {
   const { user, isLoading } = useUser();
   const [mounted, setMounted] = useState(false);

   // ensure we only render client-side
   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted || isLoading) return null;

   const avatarUrl =
      'https://png.pngtree.com/png-clipart/20240917/original/pngtree-administrator-admin-avatar-png-image_16031562.png';

   const displayEmail = user?.email || 'admin@parentfully.com';

   return (
      <Dropdown placement="bottom-right">
         <Dropdown.Trigger>
            <Avatar
               bordered
               as="button"
               color="secondary"
               size="md"
               src={avatarUrl}
               css={{ cursor: 'pointer' }}
            />
         </Dropdown.Trigger>

         <Dropdown.Menu
            aria-label="User menu actions"
            onAction={(actionKey) => {
               if (actionKey === 'logout') console.log('Logging out...');
            }}
         >
            <Dropdown.Item key="profile" css={{ height: '$18' }}>
               <Text b color="inherit" css={{ d: 'flex' }}>
                  Signed in as
               </Text>
               <Text b color="inherit" css={{ d: 'flex' }}>
                  {displayEmail}
               </Text>
            </Dropdown.Item>

            <Dropdown.Item key="settings" withDivider>
               <NextLink href="/settings" passHref>
                  <div style={{ width: '100%' }}>My Settings</div>
               </NextLink>
            </Dropdown.Item>

            <Dropdown.Item key="teams">
               <NextLink href="/team" passHref>
                  <div style={{ width: '100%' }}>Team Settings</div>
               </NextLink>
            </Dropdown.Item>

            <Dropdown.Item key="analytics" withDivider>
               <NextLink href="/analytics" passHref>
                  <div style={{ width: '100%' }}>Analytics</div>
               </NextLink>
            </Dropdown.Item>

            <Dropdown.Item key="logout" withDivider color="error">
               <NextLink href="/" passHref>
                  <div style={{ width: '100%' }}>Log Out</div>
               </NextLink>
            </Dropdown.Item>

            <Dropdown.Item key="switch" withDivider>
               <Flex align="center" justify="between" css={{ width: '100%' }}>
                  <Text span>Dark Mode</Text>
                  <DarkModeSwitch />
               </Flex>
            </Dropdown.Item>
         </Dropdown.Menu>
      </Dropdown>
   );
};
