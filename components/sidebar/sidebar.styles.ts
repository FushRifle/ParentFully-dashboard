import { styled } from '@nextui-org/react';

export const SidebarWrapper = styled('div', {
   'backgroundColor': '$background',
   'transition': 'width 90ms cubic-bezier(.2,.8,.2,1), transform 100ms cubic-bezier(.2,.8,.2,1)',
   'willChange': 'transform',
   'height': '100%',
   'position': 'fixed',
   'transform': 'translateX(-100%)',
   'width': '15rem',
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
      'width': '15rem',
   },
   'variants': {
      open: {
         true: {
            transform: 'translateX(0)',
            display: 'flex',
         },
      },
      compact: {
         true: {
            '@md': { width: '4.75rem' },
         },
      },
   },
});

export const Overlay = styled('div', {
   'backgroundColor': 'rgba(0, 0, 0, 0.15)',
   'position': 'fixed',
   'inset': 0,
   'zIndex': '201',
   'transition': 'opacity 90ms ease-out',
   'opacity': 1,
   '@md': {
      display: 'none',
   },
});

export const Header = styled('div', {
   display: 'flex',
   gap: '$4',
   alignItems: 'center',
   px: '$8',
   py: '$5',
   height: '66px',
   borderBottom: '1px solid transparent',
});

export const Body = styled('div', {
   display: 'flex',
   flexDirection: 'column',
   gap: '$6',
   mt: '$2',
   px: '$4',
   flex: '1 1 auto',
   overflowY: 'auto',
});

export const Footer = styled('div', {
   'display': 'flex',
   'alignItems': 'center',
   'justifyContent': 'center',
   'gap': '$8',
   'mt': 'auto',
   'py': '$5',
   'borderTop': '1px solid $border',
   'mx': '$6',
});

export const Sidebar = Object.assign(SidebarWrapper, {
   Header,
   Body,
   Overlay,
   Footer,
});
