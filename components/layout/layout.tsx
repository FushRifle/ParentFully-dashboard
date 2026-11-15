import React from 'react';
import { useLockedBody } from '../hooks/useBodyLock';
import { NavbarWrapper } from '@/components/navbar/navbar';
import { SidebarWrapper } from '@/components/sidebar/sidebar';
import { SidebarContext } from '@/components/layout/layout-context';
import { WrapperLayout } from '@/components/layout/layout.styles';
import { Toaster, toast } from 'sonner';

interface Props {
   children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
   const [sidebarOpen, setSidebarOpen] = React.useState(false);
   const [mobileOpen, setMobileOpen] = React.useState(false);
   const [_, setLocked] = useLockedBody(false);

   const handleToggleSidebar = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 960) {
         setMobileOpen((open) => {
            setLocked(!open);
            return !open;
         });
         return;
      }
      setSidebarOpen((open) => !open);
   };

   const showToast = React.useCallback(
      (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
         if (type === 'error') toast.error(message);
         else if (type === 'warning') toast.warning(message);
         else toast.success(message);
      },
      []
   );

   return (
      <SidebarContext.Provider
         value={{
            collapsed: sidebarOpen,
            mobileOpen,
            setCollapsed: handleToggleSidebar,
            showToast,
         }}
      >
         <WrapperLayout>
            <Toaster position="top-right" richColors />
            <SidebarWrapper />
            <NavbarWrapper>{children}</NavbarWrapper>
         </WrapperLayout>
      </SidebarContext.Provider>
   );
};