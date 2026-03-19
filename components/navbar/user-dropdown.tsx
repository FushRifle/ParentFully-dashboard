import { Dropdown, Text } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { DarkModeSwitch } from './darkmodeswitch';
import NextLink from 'next/link';
import { Flex } from '../styles/flex';
import { useProfileData } from '@/hooks/auth/useProfileData';
import ChatAvatarWrapper from '../Avatar/ChatAvatarWrapper';
import { useAuth } from '@/lib/context/authContext';
import { useRouter } from 'next/router';

export const UserDropdown = () => {
   const { logout } = useAuth();
   const router = useRouter();
   const { user, loading } = useProfileData();
   const [mounted, setMounted] = useState(false);
   const [isLoggingOut, setIsLoggingOut] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   const handleLogout = async () => {
      try {
         setIsLoggingOut(true);
         await logout();
         router.push('/login');
      } catch (error) {
         console.error('Logout failed:', error);
         setIsLoggingOut(false);
      }
   };

   if (!mounted || loading) return null;

   const profile = user?.user
      ? { ...user, ...user.user }
      : user;

   const displayEmail = profile?.email || 'admin@parentfully.com';
   const avatar = profile?.profile_image;

   return (
      <Dropdown placement="bottom-right">
         <Dropdown.Trigger>
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
               if (actionKey === 'logout') {
                  handleLogout();
               }
            }}
            disabledKeys={isLoggingOut ? ['logout'] : []}
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

            <Dropdown.Item key="teams" withDivider>
               <NextLink href="/team" passHref>
                  <div style={{ width: '100%' }}>Team Settings</div>
               </NextLink>
            </Dropdown.Item>

            <Dropdown.Item key="analytics" withDivider>
               <NextLink href="/analytics" passHref>
                  <div style={{ width: '100%' }}>Analytics</div>
               </NextLink>
            </Dropdown.Item>

            <Dropdown.Item
               key="logout"
               withDivider
               color="error"
               css={{
                  color: isLoggingOut ? '$accents5' : '$error',
                  cursor: isLoggingOut ? 'not-allowed' : 'pointer',
               }}
            >
               {isLoggingOut ? 'Logging out...' : 'Log Out'}
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