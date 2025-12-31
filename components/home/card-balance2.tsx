import { Card, Text } from '@nextui-org/react';
import React from 'react';
import { Community } from '../icons/community';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';

export const CardNewUsers = () => {
   return (
      <Card
         css={{
            mw: '375px',
            bg: '$accents0',
            borderRadius: '$xl',
            px: '$6',
         }}
      >
         <Card.Body css={{ py: '$10' }}>
            <Flex css={{ gap: '$5' }}>
               {/* Using accents9 for the icon to stand out against the light bg */}
               <Community color={'$accents9'} />
               <Flex direction={'column'}>
                  <Text span weight={'medium'}>
                     New Registrations
                  </Text>
                  <Text span size={'$xs'}>
                     Last 30 days
                  </Text>
               </Flex>
            </Flex>
            <Flex css={{ gap: '$6', py: '$4' }} align={'center'}>
               <Text span size={'$xl'} weight={'semibold'}>
                  3,562
               </Text>
               <Text span css={{ color: '$green600' }} size={'$xs'}>
                  + 8.2%
               </Text>
            </Flex>
            <Flex css={{ gap: '$12' }} align={'center'}>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{ color: '$blue600' }}
                     weight={'semibold'}
                  >
                     {'📱'}
                  </Text>
                  <Text span size={'$xs'}>
                     1,230 iOS
                  </Text>
               </Box>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{ color: '$green600' }}
                     weight={'semibold'}
                  >
                     {'🤖'}
                  </Text>
                  <Text span size={'$xs'}>
                     2,332 Android
                  </Text>
               </Box>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{ color: '$purple600' }}
                     weight={'semibold'}
                  >
                     {'🔗'}
                  </Text>
                  <Text span size={'$xs'}>
                     450 Ref
                  </Text>
               </Box>
            </Flex>
         </Card.Body>
      </Card>
   );
};