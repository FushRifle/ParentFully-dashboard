import { Card, Text } from '@nextui-org/react';
import React from 'react';
import { Community } from '../icons/community';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';

export const CardUsersOverview = () => {
   return (
      <Card
         css={{
            mw: '375px',
            bg: '$blue600',
            borderRadius: '$xl',
            px: '$6',
         }}
      >
         <Card.Body css={{ py: '$10' }}>
            <Flex css={{ gap: '$5' }}>
               <Community />
               <Flex direction={'column'}>
                  <Text span css={{ color: 'white' }}>
                     Total Users
                  </Text>
                  <Text span css={{ color: 'white' }} size={'$xs'}>
                     8,201 Active Today
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
                  45,910
               </Text>
               <Text span css={{ color: '$green600' }} size={'$xs'}>
                  + 12.5%
               </Text>
            </Flex>
            <Flex css={{ gap: '$12' }} align={'center'}>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{ color: '$green600' }}
                     weight={'semibold'}
                  >
                     {'↑'}
                  </Text>
                  <Text span size={'$xs'} css={{ color: '$white' }}>
                     3,420 New
                  </Text>
               </Box>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{ color: '$red600' }}
                     weight={'semibold'}
                  >
                     {'↓'}
                  </Text>
                  <Text span size={'$xs'} css={{ color: '$white' }}>
                     120 Churn
                  </Text>
               </Box>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{ color: '$yellow600' }}
                     weight={'semibold'}
                  >
                     {'⭐'}
                  </Text>
                  <Text span size={'$xs'} css={{ color: '$white' }}>
                     1,205 VIP
                  </Text>
               </Box>
            </Flex>
         </Card.Body>
      </Card>
   );
};