import React from 'react';
import { Badge } from '@/components/ui/badge';

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
     showTime = true,
}) => {
     const isUser = sender === 'user';

     const formatTime = (timestamp?: string) => {
          if (!timestamp) return '';
          return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
     };

     const getSenderName = () => (sender === 'user' ? 'You' : 'Support Agent');

     return (
          <div className={`mb-6 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
               <div className={`mb-2 flex items-center gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {!isRead && sender === 'support' && (
                         <Badge variant="default" className="text-xs">New</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{getSenderName()}</span>
               </div>

               <div
                    className={`max-w-[75%] break-words rounded-lg p-6 shadow-sm ${isUser
                         ? 'rounded-tr-none bg-primary text-primary-foreground'
                         : 'rounded-tl-none bg-muted text-foreground'
                         }`}
               >
                    <p className="leading-relaxed">{text}</p>
               </div>

               {showTime && createdAt && (
                    <span className={`mt-2 text-[10px] text-muted-foreground ${isUser ? 'self-end' : 'self-start'}`}>
                         {formatTime(createdAt)}
                    </span>
               )}
          </div>
     );
};