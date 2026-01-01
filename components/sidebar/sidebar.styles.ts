import { styled } from '@nextui-org/react';

export const SidebarWrapper = styled('div', {
   'backgroundColor': '$background',
   'transition': 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
   'height': '100%',
   'position': 'fixed',
   'transform': 'translateX(-100%)',
   'width': '16rem',
   'flexShrink': 0,
   'zIndex': '202',
   'overflowY': 'auto',
   'borderRight': '1px solid $border',
   'display': 'flex',
   'flexDirection': 'column',
   'boxShadow': '$md',
   '&::-webkit-scrollbar': {
      display: 'none',
   },
   '@md': {
      'boxShadow': 'none',
      'marginLeft': '0',
      'position': 'sticky',
      'top': 0,
      'height': '100vh',
      'transform': 'translateX(0)',
   },
   'variants': {
      collapsed: {
         true: {
            transform: 'translateX(0)',
            display: 'flex',
         },
      },
   },
});

export const Overlay = styled('div', {
   'backgroundColor': 'rgba(0, 0, 0, 0.15)',
   'backdropFilter': 'blur(4px)',
   'position': 'fixed',
   'inset': 0,
   'zIndex': '201',
   'transition': 'opacity 0.3s ease',
   'opacity': 1,
   '@md': {
      display: 'none',
   },
});

export const Header = styled('div', {
   display: 'flex',
   gap: '$4',
   alignItems: 'center',
   px: '$10',
   py: '$8',
   height: '80px',
   borderBottom: '1px solid transparent',
});

export const Body = styled('div', {
   display: 'flex',
   flexDirection: 'column',
   gap: '$10',
   mt: '$4',
   px: '$4',
   flex: '1 1 auto',
});

export const Footer = styled('div', {
   'display': 'flex',
   'alignItems': 'center',
   'justifyContent': 'center',
   'gap': '$8',
   'mt': 'auto',
   'py': '$8',
   'borderTop': '1px solid $border',
   'mx': '$6',
});

export const Sidebar = Object.assign(SidebarWrapper, {
   Header,
   Body,
   Overlay,
   Footer,
});