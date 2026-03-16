import { Dropdown, Text } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { DarkModeSwitch } from './darkmodeswitch';
import NextLink from 'next/link';
import { Flex } from '../styles/flex';
import { useProfileData } from '@/hooks/auth/useProfileData';
import ChatAvatarWrapper from '../Avatar/ChatAvatarWrapper';

export const UserDropdown = () => {
   const { user, loading } = useProfileData();
   const [mounted, setMounted] = useState(false);

   // ensure we only render client-side
   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted || loading) return null;

   const profile = user?.user
      ? { ...user, ...user.user }
      : user;

   const displayEmail = profile?.email || 'admin@parentfully.com';
   const avatar = profile?.profile_image;

   return (
      <Dropdown placement="bottom-right">
         <Dropdown.Trigger>
            {/* Wrap the avatar in a button/div to make it clickable */}
            <div style={{ cursor: 'pointer', display: 'inline-block' }}>
               <ChatAvatarWrapper
                  profile_image={avatar as any}
                  contactName={profile?.name}
                  size={45}
                  variant='secondary'
                  borderWidth={2}
                  borderColor='#F5A623'
               />
            </div>
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