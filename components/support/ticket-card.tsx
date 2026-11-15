import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ChatAvatarWrapper from '@/components/Avatar/ChatAvatarWrapper';

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

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, isSelected = false, onClick }) => {
     const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
          switch (status) {
               case 'urgent':
                    return 'destructive';
               case 'open':
                    return 'default';
               case 'closed':
                    return 'secondary';
               default:
                    return 'outline';
          }
     };

     const getPriorityVariant = (priority?: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
          switch (priority) {
               case 'high':
                    return 'destructive';
               case 'medium':
                    return 'default';
               case 'low':
                    return 'secondary';
               default:
                    return 'outline';
          }
     };

     return (
          <Card
               onClick={onClick}
               className={`w-full cursor-pointer p-6 transition-all ${isSelected ? 'border-2 border-primary bg-muted' : 'border bg-background'
                    }`}
          >
               <CardContent className="p-0">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                              <ChatAvatarWrapper
                                   profile_image={ticket.avatar}
                                   contactName={ticket.user}
                                   size={40}
                                   variant="secondary"
                                   borderWidth={2}
                                   borderColor={ticket.status === 'open' ? '#17C964' : '#F5A623'}
                              />
                              <span className="text-sm font-semibold">{ticket.user}</span>
                         </div>
                         <Badge variant={getStatusVariant(ticket.status)} className="text-sm">
                              {ticket.status.toUpperCase()}
                         </Badge>
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">{ticket.issue}</p>

                    {ticket.tags && ticket.tags.length > 0 && (
                         <div className="mt-2 flex flex-wrap gap-2">
                              {ticket.tags.map((tag, index) => (
                                   <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                   </Badge>
                              ))}
                         </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                         <span className="text-xs text-muted-foreground">{ticket.time}</span>
                         {ticket.priority && (
                              <Badge variant={getPriorityVariant(ticket.priority)} className="text-xs">
                                   {ticket.priority} priority
                              </Badge>
                         )}
                    </div>
               </CardContent>
          </Card>
     );
};