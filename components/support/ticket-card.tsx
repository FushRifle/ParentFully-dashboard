import React from 'react';
import { Card, Text, Badge } from '@nextui-org/react';
import { Flex } from '../../components/styles/flex';
import { Ticket } from './data';
import { UserAvatar } from './user-avatar';

interface TicketCardProps {
     ticket: Ticket;
     isSelected?: boolean;
     onClick?: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
     ticket,
     isSelected = false,
     onClick
}) => {
     const getStatusColor = (status: Ticket['status']) => {
          switch (status) {
               case 'urgent': return 'error';
               case 'open': return 'primary';
               case 'closed': return 'success';
               default: return 'default';
          }
     };

     const getPriorityColor = (priority?: Ticket['priority']) => {
          switch (priority) {
               case 'high': return 'error';
               case 'medium': return 'warning';
               case 'low': return 'success';
               default: return 'default';
          }
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
                    transition: 'all 0.2s ease'
               }}
               onClick={onClick}
          >
               <Flex justify="between" align="center">
                    <UserAvatar
                         name={ticket.user}
                         avatar={ticket.avatar}
                         size="sm"
                    />
                    <Badge
                         color={getStatusColor(ticket.status)}
                         variant="flat"
                         size="sm"
                    >
                         {ticket.status.toUpperCase()}
                    </Badge>
               </Flex>

               <Text b size="$sm" css={{ mt: '$4' }}>{ticket.issue}</Text>

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
                              color={getPriorityColor(ticket.priority)}
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