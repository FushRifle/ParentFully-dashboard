import { createContext, useContext } from 'react';

interface SidebarContext {
   collapsed: boolean;
   setCollapsed: () => void;
   showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

export const SidebarContext = createContext<SidebarContext>({
   collapsed: false,
   setCollapsed: () => { },
   showToast: () => { },
});

export const useSidebarContext = () => {
   return useContext(SidebarContext);
};