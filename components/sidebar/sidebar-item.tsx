import { Text, Link } from '@nextui-org/react';
import NextLink from 'next/link';
import React from 'react';
import { useSidebarContext } from '../layout/layout-context';
import { Flex } from '../styles/flex';

interface Props {
   title: string;
   icon: React.ReactNode;
   isActive?: boolean;
   href?: string;
}

export const SidebarItem = ({ icon, title, isActive, href = '' }: Props) => {
   const { setCollapsed } = useSidebarContext();

   const handleClick = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
         setCollapsed();
      }
   };

   return (
      <NextLink href={href} passHref legacyBehavior>
         <Link
            css={{
               color: '$accents9',
               maxWidth: '100%',
               width: '100%',
               textDecoration: 'none',
               display: 'flex',
            }}
            onClick={handleClick}
         >
            <Flex
               css={{
                  'gap': '$6',
                  'width': '100%',
                  'minHeight': '48px',
                  'alignItems': 'center',
                  'px': '$7',
                  'borderRadius': '12px',
                  'cursor': 'pointer',
                  'position': 'relative',
                  'transition': 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  ...(isActive
                     ? {
                        'bg': '$blue100',
                        '& svg path': {
                           fill: '$blue600',
                        },
                        '&:before': {
                           content: '""',
                           position: 'absolute',
                           left: '0',
                           width: '4px',
                           height: '24px',
                           borderRadius: '0 4px 4px 0',
                           bg: '$blue600',
                        },
                     }
                     : {
                        '&:hover': {
                           bg: '$accents1',
                           transform: 'translateX(4px)',
                        },
                     }),

                  '&:active': {
                     transform: 'scale(0.97)',
                  },
               }}
               align={'center'}
            >
               <Flex
                  css={{
                     'display': 'flex',
                     'alignItems': 'center',
                     '& svg': {
                        transition: 'transform 0.2s ease',
                     }
                  }}
               >
                  {icon}
               </Flex>

               <Text
                  span
                  size={'$base'}
                  css={{
                     color: isActive ? '$blue600' : '$accents9',
                     fontWeight: isActive ? '$semibold' : '$normal',
                     transition: 'color 0.2s ease',
                  }}
               >
                  {title}
               </Text>
            </Flex>
         </Link>
      </NextLink>
   );
};