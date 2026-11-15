import React from 'react';
import { useSidebarContext } from '@/components/layout/layout-context';
import { StyledBurgerButton } from '@/components/navbar/navbar.styles';

export const BurguerButton = () => {
   const { collapsed, setCollapsed } = useSidebarContext();

   return (
      <button
         onClick={setCollapsed}
         aria-label="Toggle sidebar"
         className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md p-2 transition-colors hover:bg-muted"
      >
         <div className={`h-0.5 w-5 rounded-full bg-foreground transition-transform duration-200 ${collapsed ? 'translate-y-2 rotate-45' : ''}`} />
         <div className={`h-0.5 w-5 rounded-full bg-foreground transition-opacity duration-200 ${collapsed ? 'opacity-0' : ''}`} />
         <div className={`h-0.5 w-5 rounded-full bg-foreground transition-transform duration-200 ${collapsed ? '-translate-y-2 -rotate-45' : ''}`} />
      </button>
   );
};