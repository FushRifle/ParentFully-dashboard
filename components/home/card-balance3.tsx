import { Card, Text } from '@nextui-org/react';
import React from 'react';
import { Community } from '../icons/community';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';

export const CardPremium = () => {
   return (
      <Card
         css={{
            mw: '375px',
            bg: '$green600',
            borderRadius: '$xl',
            px: '$6',
         }}
      >
         <Card.Body css={{ py: '$10' }}>
            <Flex css={{ gap: '$5' }}>
               <Community />
               <Flex direction={'column'}>
                  <Text span css={{ color: 'white' }}>
                     Premium Revenue
                  </Text>
                  <Text span css={{ color: 'white' }} size={'$xs'}>
                     1,500 Active Subs
                  </Text>
               </Flex>
            </Flex>
            <Flex css={{ gap: '$6', py: '$4' }} align={'center'}>
               <Text
                  span
                  size={'$xl'}
                  css={{ color: 'white' }}
                  weight={'semibold'}
               >
                  $15,300
               </Text>
               <Text span css={{ color: '$white' }} size={'$xs'}>
                  + 12.4%
               </Text>
            </Flex>
            <Flex css={{ gap: '$12' }} align={'center'}>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{ color: '$white' }}
                     weight={'semibold'}
                  >
                     {'M'}
                  </Text>
                  <Text span size={'$xs'} css={{ color: '$white' }}>
                     $12k MRR
                  </Text>
               </Box>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{ color: '$white' }}
                     weight={'semibold'}
                  >
                     {'Y'}
                  </Text>
                  <Text span size={'$xs'} css={{ color: '$white' }}>
                     $180k ARR
                  </Text>
               </Box>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{ color: '$yellow600' }}
                     weight={'semibold'}
                  >
                     {'💎'}
                  </Text>
                  <Text span size={'$xs'} css={{ color: '$white' }}>
                     98% Pro
                  </Text>
               </Box>
            </Flex>
         </Card.Body>
      </Card>
   );
};