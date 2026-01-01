import { Card, Text, Badge } from '@nextui-org/react';
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
            borderRadius: '$2xl',
            px: '$6',
            position: 'relative',
            overflow: 'hidden',
            border: 'none',
            boxShadow: '0 10px 20px -5px rgba(0, 114, 245, 0.3)',
            // Ensure the card can shrink gracefully
            width: '100%',
         }}
      >
         <Card.Body css={{ py: '$10', zIndex: 1 } as any}>
            <Flex css={{ gap: '$6', py: '$4' }} align="center">
               <Box css={{ bg: 'rgba(255,255,255,0.2)', p: '$3', borderRadius: '$lg' }}>
                  <Community />
               </Box>
               <Flex direction={'column'}>
                  <Text b span css={{ color: 'white', lineHeight: '$xs', fontWeight: '$bold' }}>
                     Total Families
                  </Text>
                  <Text span css={{ color: 'rgba(255,255,255,0.7)' }} size={'$xs'}>
                     8,201 Active Today
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
                  zIndex: 2, // Keeps text above the shrinking image
                  position: 'relative',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.35) 85%, rgba(255,255,255,0.0) 100%)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 8px 24px rgba(0,0,0,0.08)',
               }}
            >
               <Text
                  span
                  size="32px"
                  weight="bold"
                  css={{ color: '$black', letterSpacing: '-0.02em' }}
               >
                  45,910
               </Text>

               <Text span size="$sm" weight="bold" css={{ color: '$black' }}>
                  + 12.5%
               </Text>
            </Flex>
         </Card.Body>

         {/* --- Responsive Family Illustration --- */}
         <Box
            css={{
               position: 'absolute',
               bottom: '-10px',
               right: '-5px',
               width: '35%',
               minWidth: '100px',
               maxWidth: '150px',
               aspectRatio: '1 / 1',
               zIndex: 10,
               opacity: 0.9,
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
               src="https://png.pngtree.com/png-vector/20250118/ourmid/pngtree-happy-family-clipart-cute-cartoon-parents-hugging-children-illustration-png-image_15253024.png"
               alt="Family"
               style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
         </Box>
      </Card>
   );
};