import React from 'react';
import { Input, Button } from '@nextui-org/react';
import { Flex } from '../../components/styles/flex';
import { SendIcon } from '../../components/icons/support/send-icon';

interface ChatInputProps {
     value: string;
     onChange: (value: string) => void;
     onSend: () => void;
     placeholder?: string;
     disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
     value,
     onChange,
     onSend,
     placeholder = "Type your message...",
     disabled = false
}) => {
     const handleKeyPress = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' && !e.shiftKey) {
               e.preventDefault();
               onSend();
          }
     };

     return (
          <Flex css={{ gap: '$4' }} align="center">
               <Input
                    fullWidth
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={disabled}
                    aria-label="Message input"
                    css={{
                         '& .nextui-input-wrapper': {
                              borderRadius: '$xl',
                              bg: '$accents0',
                              transition: 'all 0.2s ease',
                              '&:focus-within': {
                                   bg: '$accents1',
                                   boxShadow: '$md'
                              }
                         },
                         '& .nextui-input': {
                              px: '$6',
                              py: '$8'
                         }
                    }}
               />
               <Button
                    auto
                    color="primary"
                    css={{
                         borderRadius: '$xl',
                         px: '$10',
                         height: '48px',
                         minWidth: '48px'
                    }}
                    onPress={onSend}
                    disabled={disabled || !value.trim()}
                    aria-label="Send message"
               >
                    <SendIcon />
               </Button>
          </Flex>
     );
};