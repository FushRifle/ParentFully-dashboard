import { Dropdown, Text } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { DarkModeSwitch } from './darkmodeswitch';
import NextLink from 'next/link';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { useProfileData } from '@/hooks/auth/useProfileData';
import ChatAvatarWrapper from '../Avatar/ChatAvatarWrapper';
import { useAuth } from '@/lib/context/authContext';
import { useRouter } from 'next/router';
import { Settings, Users, BarChart3, LogOut, Moon } from 'lucide-react';

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

   const profile = user?.user ? { ...user, ...user.user } : user;
   const displayEmail = profile?.email || 'admin@parentfully.com';
   const displayName = profile?.name || 'Admin User';
   const avatar = profile?.profile_image;

   return (
      <Dropdown placement="bottom-right">
         <Dropdown.Trigger>
            <div
               style={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px',
                  borderRadius: '50%',
                  transition: 'transform 0.2s ease',
               }}
            >
               <ChatAvatarWrapper
                  profile_image={avatar as any}
                  contactName={displayName}
                  size={40}
                  variant="secondary"
                  borderWidth={2}
                  borderColor="rgba(245, 166, 35, 0.8)"
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
            css={{
               '$$dropdownMenuWidth': '260px',
               'bg': 'rgba(14, 14, 18, 0.9) !important',
               'backdropFilter': 'blur(20px)',
               'border': '1px solid rgba(255, 255, 255, 0.08)',
               'borderRadius': '16px',
               'p': '$2',
               'boxShadow': '0 20px 40px -15px rgba(0,0,0,0.7)',
               '& .nextui-dropdown-item': {
                  'py': '$3',
                  'px': '$3',
                  'borderRadius': '10px',
                  'color': 'rgba(255, 255, 255, 0.8)',
                  'transition': 'all 0.2s ease',
                  '&:hover': {
                     bg: 'rgba(255, 255, 255, 0.05) !important',
                     color: '$white',
                  },
               },
            }}
         >
            {/* Profile Identity Card Header */}
            <Dropdown.Item key="profile" textValue="Profile Header" css={{ height: 'auto', py: '$3', cursor: 'default' }}>
               <Box css={{ pb: '$1' }}>
                  <Flex align="center" justify="between" css={{ mb: '$1' }}>
                     <Text weight="semibold" css={{ color: '$white', m: 0, fontSize: '13px' }}>
                        {displayName}
                     </Text>
                     <span
                        style={{
                           fontSize: '9px',
                           padding: '2px 6px',
                           borderRadius: '6px',
                           background: 'rgba(16, 185, 129, 0.12)',
                           border: '1px solid rgba(16, 185, 129, 0.25)',
                           color: '#10b981',
                           fontWeight: 600,
                           letterSpacing: '0.04em',
                        }}
                     >
                        PRO
                     </span>
                  </Flex>
                  <Text size="11px" css={{ color: '$accents6', m: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                     {displayEmail}
                  </Text>
               </Box>
            </Dropdown.Item>

            <Dropdown.Item key="settings" withDivider textValue="My Settings">
               <NextLink href="/settings" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  <Flex align="center" css={{ gap: '$3' }}>
                     <Settings size={15} color="rgba(255,255,255,0.6)" />
                     <Text size="13px" css={{ color: 'inherit', m: 0 }}>
                        My Settings
                     </Text>
                  </Flex>
               </NextLink>
            </Dropdown.Item>

            <Dropdown.Item key="teams" textValue="Team Settings">
               <NextLink href="/team" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  <Flex align="center" css={{ gap: '$3' }}>
                     <Users size={15} color="rgba(255,255,255,0.6)" />
                     <Text size="13px" css={{ color: 'inherit', m: 0 }}>
                        Team Settings
                     </Text>
                  </Flex>
               </NextLink>
            </Dropdown.Item>

            <Dropdown.Item key="analytics" textValue="Analytics">
               <NextLink href="/analytics" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  <Flex align="center" css={{ gap: '$3' }}>
                     <BarChart3 size={15} color="rgba(255,255,255,0.6)" />
                     <Text size="13px" css={{ color: 'inherit', m: 0 }}>
                        Analytics
                     </Text>
                  </Flex>
               </NextLink>
            </Dropdown.Item>

            <Dropdown.Item key="switch" withDivider textValue="Dark Mode Switch">
               <Flex align="center" justify="between" css={{ width: '100%' }}>
                  <Flex align="center" css={{ gap: '$3' }}>
                     <Moon size={15} color="rgba(255,255,255,0.6)" />
                     <Text size="13px" css={{ color: 'inherit', m: 0 }}>
                        Dark Mode
                     </Text>
                  </Flex>
                  <DarkModeSwitch />
               </Flex>
            </Dropdown.Item>

            <Dropdown.Item
               key="logout"
               withDivider
               color="error"
               textValue="Log Out"
               css={{
                  color: isLoggingOut ? '$accents5' : '#f87171 !important',
                  cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                  '&:hover': {
                     bg: 'rgba(239, 68, 68, 0.12) !important',
                  },
               }}
            >
               <Flex align="center" css={{ gap: '$3' }}>
                  <LogOut size={15} color={isLoggingOut ? 'rgba(255,255,255,0.3)' : '#f87171'} />
                  <Text size="13px" css={{ color: 'inherit', m: 0, weight: '$medium' }}>
                     {isLoggingOut ? 'Logging out...' : 'Log Out'}
                  </Text>
               </Flex>
            </Dropdown.Item>
         </Dropdown.Menu>
      </Dropdown>
   );
};