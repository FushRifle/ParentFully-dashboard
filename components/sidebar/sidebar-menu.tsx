import React from 'react';

interface SidebarMenuProps {
   title: string;
   defaultOpen?: boolean;
   compact?: boolean;
   children: React.ReactNode;
}

export const SidebarMenu = ({ title, compact = false, children }: SidebarMenuProps) => {
   return (
      <div className="mb-4 flex flex-col">
         {!compact && (
            <div className="flex select-none items-center px-4 pb-2">
               <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {title}
               </span>
            </div>
         )}
         <div className="flex flex-col gap-[3px]">{children}</div>
      </div>
   );
};