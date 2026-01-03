import { Avatar, Dropdown, Navbar, Text } from '@nextui-org/react';
import React from 'react';
import { DarkModeSwitch } from './darkmodeswitch';
import NextLink from 'next/link';
import { Flex } from '../styles/flex';

export const UserDropdown = () => {
   return (
      <Dropdown placement="bottom-right">
         <Navbar.Item>
            <Dropdown.Trigger>
               <Avatar
                  bordered
                  as="button"
                  color="secondary"
                  size="md"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  css={{ cursor: 'pointer' }}
               />
            </Dropdown.Trigger>
         </Navbar.Item>

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
                  admin@parentfully.com
               </Text>
            </Dropdown.Item>

            <Dropdown.Item key="settings" withDivider>
               <NextLink href="/settings">
                  <div style={{ width: '100%' }}>My Settings</div>
               </NextLink>
            </Dropdown.Item>

            <Dropdown.Item key="teams">
               <NextLink href="/team">
                  <div style={{ width: '100%' }}>Team Settings</div>
               </NextLink>
            </Dropdown.Item>

            <Dropdown.Item key="analytics" withDivider>
               <NextLink href="/analytics">
                  <div style={{ width: '100%' }}>Analytics</div>
               </NextLink>
            </Dropdown.Item>

            <Dropdown.Item key="logout" withDivider color="error">
               <NextLink href="/">
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