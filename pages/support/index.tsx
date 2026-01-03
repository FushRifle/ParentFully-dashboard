import React, { useState, useEffect } from 'react';
import { Text, Card, Badge, Button, Spacer } from '@nextui-org/react';
import { Box } from '../../components/styles/box';
import { Flex } from '../../components/styles/flex';

import {
     tickets as initialTickets,
     chatMessages as initialMessages,
     currentUser
} from '../../components/support/data';

import { TicketCard } from '../../components/support/ticket-card';
import { ChatHeader } from '../../components/support/chat-header';
import { ChatBubble } from '../../components/support/chat-bubble';
import { ChatInput } from '../../components/support/chat-input';

import { Select } from '../../components/styles/select';
import { useIsMobile } from '../../components/hooks/useMediaQuery';

import { Menu } from '../../components/icons/support/menu';
import { ChevronDown } from '../../components/icons/support/chevron-down';

const SupportPage = () => {
     const [selectedTicket, setSelectedTicket] = useState(1);
     const [message, setMessage] = useState('');
     const [tickets, setTickets] = useState(initialTickets);
     const [chatMessages, setChatMessages] = useState(initialMessages);
     const [isTicketClosed, setIsTicketClosed] = useState(false);
     const [showTicketList, setShowTicketList] = useState(false);

     const isMobile = useIsMobile();

     useEffect(() => {
          // On mobile, hide list by default. On desktop, keep it visible.
          setShowTicketList(!isMobile);
     }, [isMobile]);

     const handleSendMessage = () => {
          if (!message.trim()) return;

          const newMessage = {
               id: Date.now(),
               message: message.trim(),
               sender: 'support' as const,
               time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
               isRead: true
          };

          setChatMessages([...chatMessages, newMessage]);
          setMessage('');
     };

     const handleCloseTicket = () => {
          setIsTicketClosed(true);
          setTickets(tickets.map(ticket =>
               ticket.id === selectedTicket ? { ...ticket, status: 'closed' } : ticket
          ));
     };

     const handleTicketSelect = (ticketId: number) => {
          const ticket = tickets.find(t => t.id === ticketId);
          setSelectedTicket(ticketId);
          setIsTicketClosed(ticket?.status === 'closed');
          if (isMobile) setShowTicketList(false);
     };

     const selectedTicketData = tickets.find(ticket => ticket.id === selectedTicket);
     const activeTicketsCount = tickets.filter(t => t.status !== 'closed').length;

     return (
          <Flex
               css={{
                    height: 'calc(100vh - 100px)',
                    width: '100%',
                    padding: '$4',
                    '@sm': {
                         padding: '$6'
                    },
                    '@md': {
                         padding: '$10'
                    },
                    gap: '$8',
                    overflow: 'hidden',
                    position: 'relative'
               }}
          >
               {/* LEFT PANEL: TICKET LIST */}
               <Flex
                    direction="column"
                    css={{
                         flex: '0 0 350px',
                         display: isMobile && !showTicketList ? 'none' : 'flex',
                         height: '100%',
                         zIndex: isMobile ? 1000 : 1,
                         bg: '$background',
                         '@xsMax': {
                              position: 'absolute',
                              inset: 0,
                              p: '$8',
                              flex: '1 1 100%',
                         }
                    }}
               >
                    <Flex justify="between" align="center" css={{ mb: '$8' }}>
                         <Box>
                              <Text h3>Tickets</Text>
                              <Text size="$xs" color="$accents7">{activeTicketsCount} active conversations</Text>
                         </Box>
                         {isMobile && (
                              <Button auto light icon={<ChevronDown size={24} />} onPress={() => setShowTicketList(false)} />
                         )}
                    </Flex>

                    <Box css={{ flex: 1, overflowY: 'auto', pr: '$2' }}>
                         <Flex direction="column" css={{ gap: '$4' }}>
                              {tickets.map((ticket) => (
                                   <TicketCard
                                        key={ticket.id}
                                        ticket={ticket}
                                        isSelected={ticket.id === selectedTicket}
                                        onClick={() => handleTicketSelect(ticket.id)}
                                   />
                              ))}
                         </Flex>
                    </Box>
               </Flex>

               {/* RIGHT PANEL: CHAT WINDOW */}
               <Flex
                    direction="column"
                    css={{
                         flex: 1,
                         bg: '$accents0',
                         borderRadius: '$2xl',
                         overflow: 'hidden',
                         border: '1px solid $border',
                         display: isMobile && showTicketList ? 'none' : 'flex',
                    }}
               >
                    {/* Header: Mobile Context Switcher */}
                    <Flex
                         align="center"
                         css={{
                              p: '$6',
                              bg: '$background',
                              borderBottom: '1px solid $border',
                              display: isMobile ? 'flex' : 'none',
                              gap: '$4'
                         }}
                    >
                         <Button
                              auto
                              flat
                              icon={<Menu size={20} />}
                              onPress={() => setShowTicketList(true)}
                              color="primary"
                         />
                         <Box>
                              <Text b size="$sm" css={{ lineHeight: 1 }}>{selectedTicketData?.user || "Support"}</Text>
                              <Text size="$tiny" color="$accents7">Ticket #{selectedTicket}</Text>
                         </Box>
                    </Flex>

                    {/* Header: Desktop Info */}
                    {!isMobile && selectedTicketData && (
                         <ChatHeader
                              user={currentUser}
                              onCloseTicket={handleCloseTicket}
                              isClosed={isTicketClosed}
                         />
                    )}

                    {/* Chat Messages Area */}
                    <Box css={{ flex: 1, padding: '$6', '@md': { padding: '$10' }, overflowY: 'auto' }}>
                         {selectedTicketData ? (
                              <>
                                   <Card css={{ mb: '$10', border: 'none', bg: '$background' }}>
                                        <Card.Body>
                                             <Text size="$xs" color="$primary" b css={{ tt: 'uppercase' }}>Issue Reported</Text>
                                             <Text size="$sm">{selectedTicketData.issue}</Text>
                                        </Card.Body>
                                   </Card>

                                   {chatMessages.map((msg) => (
                                        <ChatBubble key={msg.id} {...msg} />
                                   ))}
                              </>
                         ) : (
                              <Flex align="center" justify="center" css={{ height: '100%' }}>
                                   <Text color="$accents6">Select a ticket to view messages</Text>
                              </Flex>
                         )}
                    </Box>

                    {/* Footer: Input Area */}
                    {selectedTicketData && !isTicketClosed && (
                         <Box css={{ p: '$8', bg: '$background', borderTop: '1px solid $border' }}>
                              <ChatInput
                                   value={message}
                                   onChange={setMessage}
                                   onSend={handleSendMessage}
                                   placeholder="Type a reply..."
                              />
                         </Box>
                    )}

                    {isTicketClosed && (
                         <Box css={{ p: '$6', bg: '$warningLight', textAlign: 'center' }}>
                              <Text color="$warning" size="$sm">Ticket closed by Agent</Text>
                         </Box>
                    )}
               </Flex>
          </Flex>
     );
};

export default SupportPage;