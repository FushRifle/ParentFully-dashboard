import React from 'react';
import { Flex } from '../styles/flex';
import { Text } from '@nextui-org/react';

interface SidebarMenuProps {
   title: string;
   defaultOpen?: boolean;
   compact?: boolean;
   children: React.ReactNode;
}

export const SidebarMenu = ({ title, compact = false, children }: SidebarMenuProps) => {
   return (
      <Flex direction="column" css={{ mb: '$4' }}>
         {!compact && <Flex
            align="center"
            css={{
               px: '$4',
               pb: '$2',
               userSelect: 'none',
            }}
         >
            <Text
               size="11px"
               weight="semibold"
               css={{
                  color: 'var(--pf-text-subtle)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
               }}
            >
               {title}
            </Text>
         </Flex>}
         <Flex direction="column" css={{ gap: '3px' }}>{children}</Flex>
      </Flex>
   );
};
