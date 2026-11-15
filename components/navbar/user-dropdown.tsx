import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Settings, Users, LogOut } from 'lucide-react';
import ChatAvatarWrapper from '@/components/Avatar/ChatAvatarWrapper';
import { useAuth } from '@/lib/context/authContext';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const UserDropdown = () => {
   const { logout, user } = useAuth();
   const router = useRouter();
   const [mounted, setMounted] = useState(false);
   const [isLoggingOut, setIsLoggingOut] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   const handleLogout = async () => {
      try {
         setIsLoggingOut(true);
         await logout();
         router.push('/login');
      } catch (error) {
         console.error('Logout failed:', error);
         setIsLoggingOut(false);
      }
   };

   if (!mounted || !user) return null;

   const profile = user?.user ? { ...user, ...user.user } : user;
   const displayEmail = profile?.email || 'admin@parentfully.com';
   const displayName = profile?.name || 'Admin User';
   const avatar = profile?.profile_image;

   return (
      <DropdownMenu>
         <DropdownMenuTrigger
            className="inline-flex cursor-pointer items-center rounded-full p-0.5 transition-transform hover:scale-105"
            aria-label="User menu"
         >
            <ChatAvatarWrapper
               profile_image={avatar as any}
               contactName={displayName}
               size={40}
               variant="secondary"
               borderWidth={2}
               borderColor="rgba(245, 166, 35, 0.8)"
            />
         </DropdownMenuTrigger>

         <DropdownMenuContent align="end" className="w-[260px] rounded-2xl p-2 backdrop-blur-xl">
            <DropdownMenuLabel className="font-normal">
               <div className="flex items-center justify-between pb-1">
                  <p className="m-0 text-[13px] font-semibold text-foreground">{displayName}</p>
                  <span className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-emerald-500">
                     PRO
                  </span>
               </div>
               <p className="m-0 truncate text-[11px] text-muted-foreground">{displayEmail}</p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push('/settings')} className="flex cursor-pointer items-center gap-3">
               <Settings size={15} className="text-muted-foreground" />
               <span className="text-[13px]">My Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => router.push('/team')} className="flex cursor-pointer items-center gap-3">
               <Users size={15} className="text-muted-foreground" />
               <span className="text-[13px]">Team Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
               onClick={handleLogout}
               disabled={isLoggingOut}
               className={`flex items-center gap-3 ${isLoggingOut ? 'cursor-not-allowed opacity-50' : 'cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400'}`}
            >
               <LogOut size={15} className={isLoggingOut ? 'text-muted-foreground' : 'text-red-400'} />
               <span className="text-[13px] font-medium">{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};
