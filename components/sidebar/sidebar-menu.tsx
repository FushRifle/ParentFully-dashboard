import { Text } from '@nextui-org/react';
import React from 'react';
import { Flex } from '../styles/flex';

interface Props {
   title: string;
   children?: React.ReactNode;
}

export const SidebarMenu = ({ title, children }: Props) => {
   return (
      <Flex css={{ gap: '$2' }} direction={'column'}>
         <Text
            span
            size={'$xs'}
            weight={'semibold'}
            css={{
               'letterSpacing': '0.1rem',
               'lineHeight': '$xs',
               'textTransform': 'uppercase',
               'color': '$accents6',
               'px': '$8',
               'mb': '$2',
               'opacity': 0.8
            }}
         >
            {title}
         </Text>
         <Flex direction={'column'} css={{ gap: '$2' }}>
            {children}
         </Flex>
      </Flex>
   );
};