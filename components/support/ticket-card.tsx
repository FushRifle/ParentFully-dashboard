import React from 'react';
import { Card, Text, Badge } from '@nextui-org/react';
import { Flex } from '../../components/styles/flex';
import ChatAvatarWrapper from '../Avatar/ChatAvatarWrapper';

interface TicketCardProps {
     ticket: {
          id: number;
          user: string;
          issue: string;
          time: string;
          status: 'open' | 'closed' | 'urgent';
          priority?: 'high' | 'medium' | 'low';
          avatar?: string;
          tags?: string[];
     };
     isSelected?: boolean;
     onClick?: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
     ticket,
     isSelected = false,
     onClick
}) => {
     const getStatusColor = (status: string) => {
          switch (status) {
               case 'urgent': return 'error';
               case 'open': return 'primary';
               case 'closed': return 'success';
               default: return 'default';
          }
     };

     const getPriorityColor = (priority?: string) => {
          switch (priority) {
               case 'high': return 'error';
               case 'medium': return 'warning';
               case 'low': return 'success';
               default: return 'default';
          }
     };

     const getInitials = (name: string) => {
          return name
               .split(' ')
               .map(word => word[0])
               .join('')
               .toUpperCase()
               .slice(0, 2);
     };

     return (
          <Card
               isPressable
               isHoverable
               variant="flat"
               css={{
                    p: '$6',
                    bg: isSelected ? '$accents0' : '$background',
                    border: isSelected ? '2px solid $primary' : '1px solid $border',
                    transition: 'all 0.2s ease',
                    width: '100%'
               }}
               onClick={onClick}
          >
               <Flex justify="between" align="center">
                    <Flex align="center" css={{ gap: '$3' }}>
                         <ChatAvatarWrapper
                              profile_image={ticket.avatar}
                              contactName={ticket.user}
                              size={40}
                              variant="secondary"
                              borderWidth={2}
                              borderColor={ticket.status === 'open' ? '#17C964' : '#F5A623'}
                         />
                         <Text b size="$sm">{ticket.user}</Text>
                    </Flex>
                    <Badge
                         color={getStatusColor(ticket.status) as any}
                         variant="flat"
                         size="sm"
                    >
                         {ticket.status.toUpperCase()}
                    </Badge>
               </Flex>

               <Text size="$sm" css={{ mt: '$4', color: '$accents8' }}>{ticket.issue}</Text>

               {ticket.tags && ticket.tags.length > 0 && (
                    <Flex css={{ mt: '$2', gap: '$2' }} wrap="wrap">
                         {ticket.tags.map((tag, index) => (
                              <Badge
                                   key={index}
                                   variant="flat"
                                   size="xs"
                                   css={{ bg: '$accents1' }}
                              >
                                   {tag}
                              </Badge>
                         ))}
                    </Flex>
               )}

               <Flex justify="between" align="center" css={{ mt: '$4' }}>
                    <Text size="$xs" color="$accents7">{ticket.time}</Text>
                    {ticket.priority && (
                         <Badge
                              color={getPriorityColor(ticket.priority) as any}
                              variant="flat"
                              size="xs"
                         >
                              {ticket.priority} priority
                         </Badge>
                    )}
               </Flex>
          </Card>
     );
};