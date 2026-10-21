import React from 'react';
import { Dropdown, Text } from '@nextui-org/react';
import { Bell } from 'lucide-react';
import { Box } from '../styles/box';

export const NotificationsDropdown = () => {
   return (
      <Dropdown placement="bottom-right">
         <Dropdown.Trigger>
            <div
               style={{
                  position: 'relative',
                  cursor: 'pointer',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--pf-glass-soft)',
                  border: '1px solid var(--pf-border)',
                  transition: 'all 0.2s ease',
               }}
               className="nav-action-btn"
            >
               <Bell size={18} color="var(--pf-text)" />
            </div>
         </Dropdown.Trigger>

         <Dropdown.Menu
            aria-label="Notification actions"
            css={{
               '$$dropdownMenuWidth': '360px',
               '$$dropdownItemHeight': 'auto',
               'bg': 'var(--pf-glass-strong) !important',
               'backdropFilter': 'blur(20px)',
               'border': '1px solid var(--pf-border)',
               'borderRadius': '16px',
               'p': '$3',
               'boxShadow': '0 20px 40px -15px rgba(0,0,0,0.7)',
               '& .nextui-dropdown-item': {
                  'py': '$3',
                  'px': '$3',
                  'borderRadius': '10px',
                  'transition': 'all 0.2s ease',
                  '&:hover': {
                     bg: 'var(--pf-hover) !important',
                  },
               },
            }}
         >
            <Dropdown.Section title="Notifications">
               <Dropdown.Item key="empty" textValue="No notifications" css={{ cursor: 'default' }}>
                  <Box css={{ py: '$6', textAlign: 'center' }}>
                     <Text b size="$sm" css={{ color: 'var(--pf-text)' }}>No notifications</Text>
                     <Text size="$xs" css={{ color: 'var(--pf-text-muted)', mt: '$1' }}>New system activity will appear here.</Text>
                  </Box>
               </Dropdown.Item>
            </Dropdown.Section>
         </Dropdown.Menu>
      </Dropdown>
   );
};
