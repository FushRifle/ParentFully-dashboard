import { Badge, Card, Text } from '@nextui-org/react';
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
            position: 'relative',
            overflow: 'hidden',
            width: '100%', // Allows the card to shrink when sidebar opens
         }}
      >
         <Card.Body css={{ py: '$10', zIndex: 1 } as any}>
            <Flex css={{ gap: '$6', py: '$4' }} align="center">
               <Box css={{ bg: 'rgba(255,255,255,0.2)', p: '$2', borderRadius: '$lg' }}>
                  <Community />
               </Box>
               <Flex direction={'column'}>
                  <Text span css={{ color: 'white', fontWeight: '$semibold' }}>
                     Premium Revenue
                  </Text>
                  <Text span css={{ color: 'rgba(255,255,255,0.8)' }} size={'$xs'}>
                     1,500 Active Subs
                  </Text>
               </Flex>
            </Flex>
            <Flex
               align="center"
               css={{
                  gap: '$4',
                  py: '$6',
                  px: '$6',
                  borderRadius: '$xl',
                  zIndex: 2, // Keeps text readable above the illustration
                  position: 'relative',
                  background: `
                        linear-gradient(
                            90deg,
                            rgba(255,255,255,0.95) 0%,
                            rgba(255,255,255,0.75) 60%,
                            rgba(255,255,255,0.35) 85%,
                            rgba(255,255,255,0.0) 100%
                        )
                    `,
                  backdropFilter: 'blur(12px)',
                  boxShadow: `
                        inset 0 1px 0 rgba(255,255,255,0.55),
                        0 8px 24px rgba(0,0,0,0.08)
                    `,
               }}
            >
               <Text
                  span
                  size="30px"
                  weight="bold"
                  css={{
                     color: '$black',
                     letterSpacing: '-0.02em',
                  }}
               >
                  $15,300
               </Text>
            </Flex>
         </Card.Body>

         {/* --- Responsive Premium Family Illustration --- */}
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
               src="https://png.pngtree.com/png-vector/20240820/ourmid/pngtree-happy-family-clipart-illustration-cartoon-parents-and-child-together-png-image_13550277.png"
               alt="Premium Family"
               style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
         </Box>
      </Card>
   );
};