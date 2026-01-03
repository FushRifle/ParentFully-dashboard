import React from 'react';
import { Text, Badge } from '@nextui-org/react';

import { Box } from '../styles/box';
import { Flex } from '../../components/styles/flex';
import { ChatMessage } from './data';

interface ChatBubbleProps extends ChatMessage {
     showTime?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
     message,
     sender,
     time,
     isRead = true,
     showTime = true
}) => {
     const isUser = sender === 'user';

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
                         {sender === 'user' ? 'You' : 'Support Agent'}
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
                    boxShadow: '$sm'
               }}>
                    <Text css={{ lineHeight: 1.6 }}>{message}</Text>
               </Box>

               {showTime && (
                    <Text
                         size="$tiny"
                         color="$accents7"
                         css={{
                              mt: '$2',
                              alignSelf: isUser ? 'flex-end' : 'flex-start'
                         }}
                    >
                         {time}
                    </Text>
               )}
          </Flex>
     );
};