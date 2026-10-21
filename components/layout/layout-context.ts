import { createContext, useContext } from 'react';

interface SidebarContext {
   collapsed: boolean;
   mobileOpen: boolean;
   setCollapsed: () => void;
   showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

export const SidebarContext = createContext<SidebarContext>({
   collapsed: false,
   mobileOpen: false,
   setCollapsed: () => { },
   showToast: () => { },
});

export const useSidebarContext = () => {
   return useContext(SidebarContext);
};
