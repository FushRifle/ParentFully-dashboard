import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
     name: string;
     avatar?: string;
     size?: 'sm' | 'md' | 'lg';
     showName?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
     name,
     avatar,
     size = 'md',
     showName = true,
}) => {
     const sizeMap = { sm: 32, md: 40, lg: 48 };
     const px = sizeMap[size];

     return (
          <div className="flex items-center gap-3">
               <Avatar
                    style={{ width: px, height: px, minWidth: px, minHeight: px }}
                    className="border-2 border-primary"
               >
                    {avatar && <AvatarImage src={avatar} alt={name} className="object-cover" />}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                         {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
               </Avatar>
               {showName && <span className="text-sm font-semibold">{name}</span>}
          </div>
     );
};