import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon } from '@/components/icons/support/send-icon';

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
     placeholder = 'Type your message...',
     disabled = false,
}) => {
     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter' && !e.shiftKey) {
               e.preventDefault();
               onSend();
          }
     };

     return (
          <div className="flex items-center gap-4">
               <Input
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    aria-label="Message input"
                    className="h-12 rounded-xl bg-muted px-6 transition-all focus-within:bg-accent focus-within:shadow-md"
               />
               <Button
                    onClick={onSend}
                    disabled={disabled || !value.trim()}
                    aria-label="Send message"
                    className="h-12 w-12 shrink-0 rounded-xl p-0"
               >
                    <SendIcon />
               </Button>
          </div>
     );
};