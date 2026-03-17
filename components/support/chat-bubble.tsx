import React from 'react';
import { Text, Badge } from '@nextui-org/react';
import { Box } from '../styles/box';
import { Flex } from '../../components/styles/flex';

interface ChatBubbleProps {
     id: string;
     text: string;
     sender: 'user' | 'support';
     createdAt?: string;
     isRead?: boolean;
     showTime?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
     text,
     sender,
     createdAt,
     isRead = true,
     showTime = true
}) => {
     const isUser = sender === 'user';

     const formatTime = (timestamp?: string) => {
          if (!timestamp) return '';
          const date = new Date(timestamp);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
     };

     const getSenderName = () => {
          switch (sender) {
               case 'user':
                    return 'You';
               case 'support':
                    return 'Support Agent';
               default:
                    return sender;
          }
     };

     return (
          <Flex direction="column" align={isUser ? 'end' : 'start'} css={{ mb: '$6' }}>
               <Flex
                    align="center"
                    css={{
                         gap: '$4',
                         mb: '$2',
                         justifyContent: isUser ? 'flex-end' : 'flex-start'
                    }}
               >
                    <Text
                         size="$xs"
                         color="$accents6"
                         css={{ order: isUser ? 2 : 1 }}
                    >
                         {getSenderName()}
                    </Text>
                    {!isRead && sender === 'support' && (
                         <Badge size="xs" color="primary" variant="flat">New</Badge>
                    )}
               </Flex>

               <Box css={{
                    maxWidth: '75%',
                    p: '$6',
                    borderRadius: '$lg',
                    bg: isUser ? '$primary' : '$accents1',
                    color: isUser ? '$white' : '$text',
                    borderTopRightRadius: isUser ? '0' : '$lg',
                    borderTopLeftRadius: isUser ? '$lg' : '0',
                    position: 'relative',
                    boxShadow: '$sm',
                    wordBreak: 'break-word'
               }}>
                    <Text css={{ lineHeight: 1.6 }}>{text}</Text>
               </Box>

               {showTime && createdAt && (
                    <Text
                         size="$tiny"
                         color="$accents7"
                         css={{
                              mt: '$2',
                              alignSelf: isUser ? 'flex-end' : 'flex-start'
                         }}
                    >
                         {formatTime(createdAt)}
                    </Text>
               )}
          </Flex>
     );
};