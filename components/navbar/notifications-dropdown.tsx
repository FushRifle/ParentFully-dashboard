import React from 'react';
import { Bell } from 'lucide-react';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const NotificationsDropdown = () => {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger
            className="relative flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border bg-muted/50 transition-all duration-200 hover:bg-muted"
            aria-label="Notifications"
         >
            <Bell size={18} className="text-foreground" />
         </DropdownMenuTrigger>

         <DropdownMenuContent align="end" className="w-[360px] rounded-2xl p-3 backdrop-blur-xl">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="py-6 text-center">
               <p className="text-sm font-semibold text-foreground">No notifications</p>
               <p className="mt-1 text-xs text-muted-foreground">
                  New system activity will appear here.
               </p>
            </div>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};