import React from 'react';
import { Text, Button, Badge, Tooltip } from '@nextui-org/react';
import { Flex } from '../../components/styles/flex';
import { Box } from '../../components/styles/box';
import { User } from '@/types/api';
import ChatAvatarWrapper from '../Avatar/ChatAvatarWrapper';

interface ChatHeaderProps {
     user: User;
     onCloseTicket?: () => void;
     onViewDetails?: () => void;
     isClosed?: boolean;
     isAgent?: boolean;
     showOnlineStatus?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
     user,
     onCloseTicket,
     onViewDetails,
     isClosed = false,
     isAgent = false,
     showOnlineStatus = true
}) => {

     const formatLastSeen = () => {
          return 'Active now';
     };

     const handleCloseTicket = () => {
          if (onCloseTicket) {
               onCloseTicket();
          }
     };

     const handleViewDetails = () => {
          if (onViewDetails) {
               onViewDetails();
          } else {
               console.log('View details clicked for user:', user.id);
          }
     };

     return (
          <Flex
               align="center"
               justify="between"
               css={{
                    p: '$6',
                    '@sm': { p: '$8' },
                    bg: '$background',
                    borderBottom: '1px solid $border',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
               }}
          >
               <Flex align="center" css={{ gap: '$4' }}>
                    <Badge
                         variant={showOnlineStatus ? "dot" : "flat"}
                         placement="bottom-right"
                         color="default"
                         size="md"
                         css={{
                              '& .nextui-badge': {
                                   transform: 'scale(1)',
                                   border: '2px solid $background'
                              }
                         }}
                    >
                         <ChatAvatarWrapper
                              profile_image={user?.user?.profile_image as any}
                              contactName={user?.user?.name}
                              phoneNumber={user?.user?.phone_number}
                              size={48}
                              variant={isAgent ? 'primary' : 'secondary'}
                              borderWidth={2}
                              borderColor={isAgent ? '#17C964' : '#F5A623'}
                         />
                    </Badge>

                    <Box>
                         <Flex align="center" css={{ gap: '$2', mb: '$2' }}>
                              <Text b size="$md" css={{ lineHeight: 1 }}>
                                   {user?.user?.name || 'Support User'}
                              </Text>
                              {isAgent && (
                                   <Badge size="xs" color="success" variant="flat">
                                        Agent
                                   </Badge>
                              )}
                         </Flex>

                         <Flex align="center" css={{ gap: '$4' }}>
                              <Text size="$xs" color="$accents7">
                                   {user?.email || 'No email provided'}
                              </Text>
                              {showOnlineStatus && (
                                   <>
                                        <Text size="$xs" color="$accents5">•</Text>
                                        <Text
                                             size="$xs"
                                             color="$success"
                                             css={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: '$1'
                                             }}
                                        >
                                             <Badge
                                                  variant="dot"
                                                  color="primary"
                                                  size="xs"
                                                  css={{ mr: '$1' }}
                                             />
                                             {formatLastSeen()}
                                        </Text>
                                   </>
                              )}
                         </Flex>
                    </Box>
               </Flex>

               <Flex align="center" css={{ gap: '$2' }}>
                    {!isClosed && (
                         <Tooltip content="Close this ticket" placement="bottom">
                              <Button
                                   size="sm"
                                   flat
                                   color="error"
                                   auto
                                   onPress={handleCloseTicket}
                                   css={{
                                        minWidth: 'auto',
                                        '@sm': { minWidth: '100px' }
                                   }}
                              >
                                   Close
                              </Button>
                         </Tooltip>
                    )}

                    <Tooltip content="View user details" placement="bottom">
                         <Button
                              size="sm"
                              light
                              color="primary"
                              auto
                              onPress={handleViewDetails}
                              css={{
                                   minWidth: 'auto',
                                   '@sm': { minWidth: '100px' }
                              }}
                         >
                              Details
                         </Button>
                    </Tooltip>
               </Flex>
          </Flex>
     );
};

export default ChatHeader;