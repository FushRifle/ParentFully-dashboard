import React from 'react';
import { Avatar, Text, Button, Badge } from '@nextui-org/react';
import { Flex } from '../../components/styles/flex';
import { Box } from '../../components/styles/box';
import { User } from './data';

interface ChatHeaderProps {
     user: User;
     onCloseTicket?: () => void;
     isClosed?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
     user,
     onCloseTicket,
     isClosed = false
}) => {
     const getStatusColor = (status: User['status']) => {
          switch (status) {
               case 'online': return 'success';
               case 'away': return 'warning';
               default: return 'error';
          }
     };

     return (
          <Flex
               align="center"
               justify="between"
               css={{
                    p: '$8',
                    bg: '$background',
                    borderBottom: '1px solid $border',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
               }}
          >
               <Flex align="center" css={{ gap: '$4' }}>
                    <Badge
                         color={getStatusColor(user.status)}
                         variant="dot"
                         placement="bottom-right"
                    >
                         <Avatar
                              src={user.avatar}
                              bordered
                              color="primary"
                              size="lg"
                         />
                    </Badge>
                    <Box>
                         <Flex align="center" css={{ gap: '$2', mb: '$1' }}>
                              <Text css={{ lineHeight: 1 }}>{user.name}</Text>
                              <Badge
                                   size="xs"
                                   variant="flat"
                                   color={user.membership === 'premium' ? 'primary' : 'default'}
                              >
                                   {user.membership}
                              </Badge>
                         </Flex>
                         <Text size="$xs" color="$accents6">
                              {user.status === 'online' ? 'Online' : 'Last seen recently'} • {user.email}
                         </Text>
                    </Box>
               </Flex>

               <Flex align="center" css={{ gap: '$4' }}>
                    {!isClosed && (
                         <Button
                              size="sm"
                              flat
                              color="error"
                              auto
                              onPress={onCloseTicket}
                         >
                              Close Ticket
                         </Button>
                    )}
                    <Button
                         size="sm"
                         light
                         color="primary"
                         auto
                    >
                         View Details
                    </Button>
               </Flex>
          </Flex>
     );
};