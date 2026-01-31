import { Badge, Card, Text } from '@nextui-org/react';
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
            position: 'relative',
            overflow: 'hidden',
            width: '100%', // Allows card to shrink
         }}
      >
         <Card.Body css={{ py: '$10', zIndex: 1 } as any}>
            <Flex css={{ gap: '$6', py: '$4' }} align="center">
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

            <Flex
               align="center"
               css={{
                  gap: '$6',
                  py: '$6',
                  px: '$6',
                  borderRadius: '$xl',
                  zIndex: 12,
                  position: 'relative',
                  background: `
            linear-gradient(
                90deg,
                rgba(0,0,0,0.65) 0%,
                rgba(0,0,0,0.45) 60%,
                rgba(0,0,0,0.25) 85%,
                rgba(0,0,0,0.0) 100%
            )
        `,
                  backdropFilter: 'blur(14px)',
                  boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.06),
            0 10px 28px rgba(0,0,0,0.45)
        `,
               }}
            >
               <Text
                  span
                  size="32px"
                  weight="bold"
                  css={{
                     color: '$success',
                     letterSpacing: '-0.02em',
                  }}
               >
                  3,562
               </Text>
            </Flex>
         </Card.Body>

         {/* --- Responsive Community Illustration --- */}
         <Box
            css={{
               position: 'absolute',
               bottom: '-15px',
               right: '-10px',
               width: '35%',
               minWidth: '100px',
               maxWidth: '150px',
               aspectRatio: '1 / 1',
               zIndex: 10,
               opacity: 0.8,
               pointerEvents: 'none',
               transition: 'width 0.3s ease',
               '@md': {
                  animation: 'subtleFloat 8s ease-in-out infinite',
                  '@keyframes subtleFloat': {
                     '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                     '50%': { transform: 'translateY(-8px) rotate(2deg)' },
                  },
               }
            }}
         >
            <img
               src="https://png.pngtree.com/png-vector/20230728/ourmid/pngtree-community-service-vector-png-image_6991320.png"
               alt="Community"
               style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
         </Box>
      </Card>
   );
};