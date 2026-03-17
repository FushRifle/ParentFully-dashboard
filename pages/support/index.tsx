import React, { useState, useEffect } from 'react';
import { Text, Card, Button, Loading } from '@nextui-org/react';
import { Box } from '../../components/styles/box';
import { Flex } from '../../components/styles/flex';
import { TicketCard } from '../../components/support/ticket-card';
import { ChatHeader } from '../../components/support/chat-header';
import { ChatBubble } from '../../components/support/chat-bubble';
import { ChatInput } from '../../components/support/chat-input';
import { useIsMobile } from '../../components/hooks/useMediaQuery';
import { Menu } from '../../components/icons/support/menu';
import { ChevronDown } from '../../components/icons/support/chevron-down';
import { useSupport } from '@/hooks/support/useSupport';
import { useUser } from '@/hooks/auth/useGetUserList';
import { User } from '@/types/api';

const SupportPage = () => {
     const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
     const [message, setMessage] = useState('');
     const [showTicketList, setShowTicketList] = useState(false);
     const [selectedUser, setSelectedUser] = useState<User | null>(null);
     const [activeTickets, setActiveTickets] = useState<Array<{
          id: number;
          user: string;
          issue: string;
          time: string;
          status: 'open' | 'closed' | 'urgent';
          avatar?: string;
     }>>([]);

     const isMobile = useIsMobile();
     const {
          messages,
          conversationId,
          conversationStatus,
          supportUserId,
          loading: supportLoading,
          error: supportError,
          startChat,
          sendMessage,
          clearChat,
          loadConversation
     } = useSupport();

     const {
          users,
          loading: usersLoading,
          error: usersError,
          refresh: refreshUsers
     } = useUser();

     useEffect(() => {
          setShowTicketList(!isMobile);
     }, [isMobile]);

     useEffect(() => {
          // If we have an active conversation, add it to tickets
          if (conversationId && supportUserId && messages.length > 0) {
               const lastMessage = messages[messages.length - 1];
               const existingTicket = activeTickets.find(t => t.id === supportUserId);

               if (!existingTicket) {
                    // Find user details
                    const user = users.find(u => u.id === supportUserId);

                    setActiveTickets(prev => [{
                         id: supportUserId,
                         user: user?.user?.name || 'Support User',
                         issue: lastMessage?.text.substring(0, 50) || 'Support conversation',
                         time: formatMessageTime(lastMessage?.createdAt) || 'Just now',
                         status: conversationStatus === 'open' ? 'open' : 'closed',
                         avatar: user?.user?.profile_image as any || '/avatars/default.jpg'
                    }, ...prev]);
               }
          }
     }, [conversationId, supportUserId, messages, conversationStatus, users]);

     useEffect(() => {
          // Clear selected ticket when chat is cleared
          if (!conversationId && !supportUserId) {
               setSelectedTicket(null);
               setSelectedUser(null);
          }
     }, [conversationId, supportUserId]);

     useEffect(() => {
          // Find the user associated with the selected ticket
          if (selectedTicket && users.length > 0) {
               const user = users.find(u => u.id === selectedTicket);
               if (user) {
                    setSelectedUser(user);
               }
          }
     }, [selectedTicket, users]);

     const handleStartChat = async () => {
          const chat = await startChat();
          if (chat) {
               setSelectedTicket(chat.support_user_id);
               refreshUsers();
          }
     };

     const handleSendMessage = () => {
          if (!message.trim() || !selectedTicket) return;
          sendMessage(message.trim());
          setMessage('');
     };

     const handleCloseTicket = () => {
          clearChat();
          setSelectedTicket(null);
          setSelectedUser(null);
     };

     const handleTicketSelect = async (ticketId: number) => {
          setSelectedTicket(ticketId);
          // If this is an existing conversation, load it
          if (conversationId) {
               await loadConversation();
          }
          if (isMobile) setShowTicketList(false);
     };

     const handleViewDetails = () => {
          console.log('Viewing details for user:', selectedUser);
     };

     const formatMessageTime = (timestamp?: string) => {
          if (!timestamp) return '';
          const date = new Date(timestamp);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
     };

     // Transform chat messages to match ChatBubble props
     const transformedMessages = messages.map(msg => ({
          id: msg.id,
          text: msg.text,
          sender: msg.sender,
          createdAt: msg.createdAt,
          isRead: true
     }));

     if (supportLoading.supportData) {
          return (
               <Flex align="center" justify="center" css={{ height: 'calc(100vh - 100px)' }}>
                    <Loading size="xl" />
               </Flex>
          );
     }

     const error = supportError || usersError;

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
                              <Text h3>Support Tickets</Text>
                              <Text size="$xs" color="$accents7">
                                   {activeTickets.length > 0 ? `${activeTickets.length} active tickets` : 'No tickets'}
                              </Text>
                         </Box>
                         {isMobile && activeTickets.length > 0 && (
                              <Button auto light icon={<ChevronDown size={24} />} onPress={() => setShowTicketList(false)} />
                         )}
                    </Flex>

                    <Box css={{ flex: 1, overflowY: 'auto', pr: '$2' }}>
                         <Flex direction="column" css={{ gap: '$4' }}>
                              {/* Tickets from Active Conversations */}
                              {activeTickets.length > 0 ? (
                                   activeTickets.map((ticket) => (
                                        <TicketCard
                                             key={ticket.id}
                                             ticket={ticket}
                                             isSelected={selectedTicket === ticket.id}
                                             onClick={() => handleTicketSelect(ticket.id)}
                                        />
                                   ))
                              ) : (
                                   <Flex direction="column" align="center" css={{ py: '$10', gap: '$4' }}>
                                        <Text color="$accents6">No active conversations</Text>
                                        <Text size="$sm" color="$accents7" css={{ textAlign: 'center', maxWidth: '250px' }}>
                                             Start a new chat to get help from our support team
                                        </Text>
                                   </Flex>
                              )}
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
                              <Text b size="$sm" css={{ lineHeight: 1 }}>
                                   {selectedUser?.user?.name || 'No Conversation Selected'}
                              </Text>
                              {selectedTicket && (
                                   <Text size="$tiny" color="$accents7">Ticket #{selectedTicket}</Text>
                              )}
                         </Box>
                    </Flex>

                    {/* Header: Desktop Info with Real User Data */}
                    {!isMobile && selectedUser && (
                         <ChatHeader
                              user={selectedUser}
                              onCloseTicket={handleCloseTicket}
                              onViewDetails={handleViewDetails}
                              isClosed={conversationStatus === 'closed' || conversationStatus === 'resolved'}
                              isAgent={false}
                              showOnlineStatus={true}
                         />
                    )}

                    {/* Chat Messages Area */}
                    <Box css={{ flex: 1, padding: '$6', '@md': { padding: '$10' }, overflowY: 'auto' }}>
                         {selectedUser ? (
                              <>
                                   {transformedMessages.length > 0 ? (
                                        transformedMessages.map((msg) => (
                                             <ChatBubble key={msg.id} {...msg} />
                                        ))
                                   ) : (
                                        <Flex align="center" justify="center" css={{ height: '100%' }}>
                                             <Text color="$accents6">No messages yet. Start the conversation!</Text>
                                        </Flex>
                                   )}
                              </>
                         ) : (
                              <Flex direction="column" align="center" justify="center" css={{ height: '100%', gap: '$6' }}>
                                   <Text h4 color="$accents6">Welcome to Support</Text>
                                   <Text color="$accents7" css={{ textAlign: 'center', maxWidth: '400px' }}>
                                        {activeTickets.length > 0
                                             ? 'Select a ticket from the left to view the conversation.'
                                             : 'No active conversations. Start a new chat to get help from our support team.'}
                                   </Text>
                              </Flex>
                         )}
                    </Box>

                    {/* Footer: Input Area */}
                    {selectedUser && conversationStatus === 'open' && (
                         <Box css={{ p: '$8', bg: '$background', borderTop: '1px solid $border' }}>
                              <ChatInput
                                   value={message}
                                   onChange={setMessage}
                                   onSend={handleSendMessage}
                                   placeholder="Type a reply..."
                                   disabled={supportLoading.chat}
                              />
                         </Box>
                    )}

                    {selectedUser && conversationStatus !== 'open' && (
                         <Box css={{ p: '$6', bg: '$warningLight', textAlign: 'center' }}>
                              <Text color="$warning" size="$sm">This conversation is {conversationStatus}</Text>
                         </Box>
                    )}

                    {error && (
                         <Box css={{ p: '$4', bg: '$errorLight', textAlign: 'center' }}>
                              <Text color="$error" size="$sm">{error}</Text>
                         </Box>
                    )}
               </Flex>
          </Flex>
     );
};

export default SupportPage;