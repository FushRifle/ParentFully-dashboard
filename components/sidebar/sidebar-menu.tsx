import React, { useState } from 'react';
import { Flex } from '../styles/flex';
import { Text } from '@nextui-org/react';
import { ChevronDown } from 'lucide-react';

interface SidebarMenuProps {
   title: string;
   defaultOpen?: boolean;
   children: React.ReactNode;
}

export const SidebarMenu = ({ title, defaultOpen = false, children }: SidebarMenuProps) => {
   const [open, setOpen] = useState(defaultOpen);

   return (
      <Flex direction="column" css={{ mb: '$3' }}>
         <Flex
            align="center"
            justify="between"
            css={{
               cursor: 'pointer',
               px: '$3',
               py: '$2',
               borderRadius: '8px',
               userSelect: 'none',
               transition: 'background 0.2s ease',
               '&:hover': {
                  background: 'rgba(255, 255, 255, 0.03)',
               },
            }}
            onClick={() => setOpen((v) => !v)}
         >
            <Text
               size="11px"
               weight="semibold"
               css={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
               }}
            >
               {title}
            </Text>
            <ChevronDown
               size={13}
               color="rgba(255, 255, 255, 0.3)"
               style={{
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
               }}
            />
         </Flex>
         {open && (
            <Flex direction="column" css={{ mt: '2px', gap: '2px' }}>
               {children}
            </Flex>
         )}
      </Flex>
   );
};