import React from 'react';
import { useLockedBody } from '../hooks/useBodyLock';
import { NavbarWrapper } from '../navbar/navbar';
import { SidebarWrapper } from '../sidebar/sidebar';
import { SidebarContext } from './layout-context';
import { WrapperLayout } from './layout.styles';
import { Box } from '../styles/box';
import { Card, Text } from '@nextui-org/react';

interface Props {
   children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
   const [sidebarOpen, setSidebarOpen] = React.useState(false);
   const [_, setLocked] = useLockedBody(false);

   const handleToggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
      setLocked(!sidebarOpen);
   };

   const [toast, setToast] = React.useState({
      visible: false,
      message: '',
      type: 'success'
   });

   const showToast = React.useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
      setToast({ visible: true, message, type });

      setTimeout(() => {
         setToast(prev => ({ ...prev, visible: false }));
      }, 3000);
   }, []);

   return (
      <SidebarContext.Provider
         value={{
            collapsed: sidebarOpen,
            setCollapsed: handleToggleSidebar,
            showToast,
         }}
      >
         <WrapperLayout>
            {toast.visible && (
               <Box css={{
                  position: 'fixed',
                  top: '20px',
                  right: '20px',
                  zIndex: 9999,
               }}>
                  <Card css={{
                     bg: toast.type === 'error' ? '$error' : '$green600',
                     minWidth: '200px'
                  }}>
                     <Card.Body css={{ py: '$4', px: '$8' } as any}>
                        <Text color="white" weight="medium">{toast.message}</Text>
                     </Card.Body>
                  </Card>
               </Box>
            )}

            <SidebarWrapper />
            <NavbarWrapper>{children}</NavbarWrapper>
         </WrapperLayout>
      </SidebarContext.Provider>
   );
};
