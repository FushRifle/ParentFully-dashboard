import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/api';
import ChatAvatarWrapper from '@/components/Avatar/ChatAvatarWrapper';

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
     showOnlineStatus = true,
}) => {
     const handleViewDetails = () => {
          if (onViewDetails) onViewDetails();
          else console.log('View details clicked for user:', user.id);
     };

     return (
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-6 shadow-sm sm:p-8">
               <div className="flex items-center gap-4">
                    <div className="relative">
                         <ChatAvatarWrapper
                              profile_image={user?.user?.profile_image as any}
                              contactName={user?.user?.name}
                              phoneNumber={user?.user?.phone_number}
                              size={48}
                              variant={isAgent ? 'primary' : 'secondary'}
                              borderWidth={2}
                              borderColor={isAgent ? '#17C964' : '#F5A623'}
                         />
                         {showOnlineStatus && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                         )}
                    </div>

                    <div>
                         <div className="mb-2 flex items-center gap-2">
                              <span className="text-base font-semibold leading-none">
                                   {user?.user?.name || 'Support User'}
                              </span>
                              {isAgent && (
                                   <Badge variant="secondary" className="text-xs">Agent</Badge>
                              )}
                         </div>

                         <div className="flex items-center gap-4">
                              <span className="text-xs text-muted-foreground">
                                   {user?.email || 'No email provided'}
                              </span>
                              {showOnlineStatus && (
                                   <>
                                        <span className="text-xs text-muted-foreground">•</span>
                                        <span className="flex items-center gap-1 text-xs text-emerald-500">
                                             <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                             Active now
                                        </span>
                                   </>
                              )}
                         </div>
                    </div>
               </div>

               <div className="flex items-center gap-2">
                    {!isClosed && (
                         <Button
                              size="sm"
                              variant="destructive"
                              onClick={onCloseTicket}
                              className="min-w-auto sm:min-w-[100px]"
                         >
                              Close
                         </Button>
                    )}
                    <Button
                         size="sm"
                         variant="ghost"
                         onClick={handleViewDetails}
                         className="min-w-auto sm:min-w-[100px]"
                    >
                         Details
                    </Button>
               </div>
          </div>
     );
};

export default ChatHeader;