import React from 'react';
import { Avatar, Text } from '@nextui-org/react';
import { Flex } from '../../components/styles/flex';
import { Box } from '../styles/box';

interface UserAvatarProps {
     name: string;
     avatar?: string;
     size?: 'sm' | 'md' | 'lg';
     showName?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
     name,
     avatar,
     size = 'md',
     showName = true
}) => {
     const getSize = () => {
          switch (size) {
               case 'sm': return 32;
               case 'md': return 40;
               case 'lg': return 48;
          }
     };

     return (
          <Flex align="center" css={{ gap: '$3' }}>
               <Avatar
                    size={size}
                    src={avatar}
                    text={name.charAt(0)}
                    bordered
                    color="primary"
               />
               {showName && (
                    <Box>
                         <Text b size="$sm">{name}</Text>
                    </Box>
               )}
          </Flex>
     );
};