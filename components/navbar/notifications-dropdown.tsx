import React from 'react';
import { Dropdown, Text } from '@nextui-org/react';
import { Bell, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';

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
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s ease',
               }}
               className="nav-action-btn"
            >
               <Bell size={18} color="rgba(255, 255, 255, 0.8)" />
               {/* Unread Glow Badge Indicator */}
               <span
                  style={{
                     position: 'absolute',
                     top: '8px',
                     right: '8px',
                     width: '7px',
                     height: '7px',
                     borderRadius: '50%',
                     backgroundColor: '#3b82f6',
                     boxShadow: '0 0 8px #3b82f6',
                  }}
               />
            </div>
         </Dropdown.Trigger>

         <Dropdown.Menu
            aria-label="Notification actions"
            css={{
               '$$dropdownMenuWidth': '360px',
               '$$dropdownItemHeight': 'auto',
               'bg': 'rgba(14, 14, 18, 0.9) !important',
               'backdropFilter': 'blur(20px)',
               'border': '1px solid rgba(255, 255, 255, 0.08)',
               'borderRadius': '16px',
               'p': '$3',
               'boxShadow': '0 20px 40px -15px rgba(0,0,0,0.7)',
               '& .nextui-dropdown-item': {
                  'py': '$3',
                  'px': '$3',
                  'borderRadius': '10px',
                  'transition': 'all 0.2s ease',
                  '&:hover': {
                     bg: 'rgba(255, 255, 255, 0.05) !important',
                  },
               },
            }}
         >
            <Dropdown.Section title="Notifications">
               <Dropdown.Item key="1" textValue="Edit information">
                  <Flex align="start" css={{ gap: '$3' }}>
                     <Box
                        css={{
                           p: '$2',
                           borderRadius: '8px',
                           bg: 'rgba(59, 130, 246, 0.12)',
                           border: '1px solid rgba(59, 130, 246, 0.25)',
                           color: '#3b82f6',
                           mt: '2px',
                        }}
                     >
                        <Sparkles size={15} />
                     </Box>
                     <Box css={{ flex: 1 }}>
                        <Flex justify="between" align="center">
                           <Text size="$xs" weight="semibold" css={{ color: '$white', m: 0 }}>
                              Profile Updated
                           </Text>
                           <Text size="10px" css={{ color: '$accents6' }}>
                              2m ago
                           </Text>
                        </Flex>
                        <Text size="12px" css={{ color: '$accents7', m: 0, mt: '$1', lineHeight: '1.4' }}>
                           Your account information and credentials were updated successfully.
                        </Text>
                     </Box>
                  </Flex>
               </Dropdown.Item>

               <Dropdown.Item key="2" textValue="Digital receipts">
                  <Flex align="start" css={{ gap: '$3' }}>
                     <Box
                        css={{
                           p: '$2',
                           borderRadius: '8px',
                           bg: 'rgba(16, 185, 129, 0.12)',
                           border: '1px solid rgba(16, 185, 129, 0.25)',
                           color: '#10b981',
                           mt: '2px',
                        }}
                     >
                        <CheckCircle2 size={15} />
                     </Box>
                     <Box css={{ flex: 1 }}>
                        <Flex justify="between" align="center">
                           <Text size="$xs" weight="semibold" css={{ color: '$white', m: 0 }}>
                              Digital Receipts Enabled
                           </Text>
                           <Text size="10px" css={{ color: '$accents6' }}>
                              1h ago
                           </Text>
                        </Flex>
                        <Text size="12px" css={{ color: '$accents7', m: 0, mt: '$1', lineHeight: '1.4' }}>
                           Paperless receipts are now active for all future billing events.
                        </Text>
                     </Box>
                  </Flex>
               </Dropdown.Item>

               <Dropdown.Item key="3" textValue="System Notice">
                  <Flex align="start" css={{ gap: '$3' }}>
                     <Box
                        css={{
                           p: '$2',
                           borderRadius: '8px',
                           bg: 'rgba(249, 115, 22, 0.12)',
                           border: '1px solid rgba(249, 115, 22, 0.25)',
                           color: '#f97316',
                           mt: '2px',
                        }}
                     >
                        <AlertCircle size={15} />
                     </Box>
                     <Box css={{ flex: 1 }}>
                        <Flex justify="between" align="center">
                           <Text size="$xs" weight="semibold" css={{ color: '$white', m: 0 }}>
                              System Routine Alert
                           </Text>
                           <Text size="10px" css={{ color: '$accents6' }}>
                              1d ago
                           </Text>
                        </Flex>
                        <Text size="12px" css={{ color: '$accents7', m: 0, mt: '$1', lineHeight: '1.4' }}>
                           Three discipline plans require administrative review today.
                        </Text>
                     </Box>
                  </Flex>
               </Dropdown.Item>
            </Dropdown.Section>
         </Dropdown.Menu>
      </Dropdown>
   );
};