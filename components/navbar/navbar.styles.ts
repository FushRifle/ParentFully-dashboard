import { styled } from '@nextui-org/react';

export const SidebarWrapper = styled('div', {
   overflow: 'hidden',
   height: '100vh',
   display: 'flex',
});

export const StyledBurgerButton = styled('button', {
   // ... your existing burger button styles
});

// Sidebar container
export const Sidebar = styled('aside', {
   width: '250px',
   height: '100vh',
   display: 'flex',
   flexDirection: 'column',
   padding: '16px',
   background: '$background',
   borderRight: '1px solid $accents2',
   transition: 'transform 0.3s ease',
});

// Logo / brand area
export const SidebarLogo = styled('div', {
   display: 'flex',
   alignItems: 'center',
   gap: '12px',
   padding: '12px 8px',
   marginBottom: '24px',
   cursor: 'pointer',
   borderBottom: '1px solid $accents2',
});

export const LogoText = styled('span', {
   fontSize: '$lg',
   fontWeight: '$bold',
   color: '$text',
   letterSpacing: '-0.5px',
});

// Navigation list
export const NavList = styled('nav', {
   display: 'flex',
   flexDirection: 'column',
   gap: '8px',
   flex: 1,
   overflowY: 'auto',
});

// Section group
export const NavSection = styled('div', {
   display: 'flex',
   flexDirection: 'column',
   gap: '4px',
   marginBottom: '16px',
});

export const NavSectionTitle = styled('span', {
   fontSize: '$xs',
   fontWeight: '$semibold',
   color: '$accents6',
   textTransform: 'uppercase',
   letterSpacing: '0.5px',
   padding: '8px 12px',
});

// Individual nav item
export const NavItem = styled('a', {
   display: 'flex',
   alignItems: 'center',
   gap: '12px',
   padding: '10px 12px',
   borderRadius: '8px',
   fontSize: '$sm',
   fontWeight: '$medium',
   color: '$accents8',
   textDecoration: 'none',
   cursor: 'pointer',
   transition: 'all 0.2s ease',

   '&:hover': {
      background: '$accents1',
      color: '$text',
   },

   'variants': {
      active: {
         true: {
            background: '$primaryLight',
            color: '$primary',
            fontWeight: '$semibold',
         },
      },
   },
});

// Icon wrapper inside nav item
export const NavItemIcon = styled('span', {
   display: 'inline-flex',
   alignItems: 'center',
   justifyContent: 'center',
   width: '20px',
   height: '20px',
   flexShrink: 0,
   color: 'inherit',
});

// Label text
export const NavItemLabel = styled('span', {
   flex: 1,
   whiteSpace: 'nowrap',
   overflow: 'hidden',
   textOverflow: 'ellipsis',
});

// Badge (e.g. "New", count)
export const NavItemBadge = styled('span', {
   fontSize: '$xs',
   fontWeight: '$semibold',
   padding: '2px 8px',
   borderRadius: '999px',
   background: '$primary',
   color: '$white',
   marginLeft: 'auto',
});

// Dropdown chevron for expandable items
export const NavItemChevron = styled('span', {
   display: 'inline-flex',
   alignItems: 'center',
   marginLeft: 'auto',
   color: '$accents5',
   transition: 'transform 0.2s ease',

   variants: {
      open: {
         true: {
            transform: 'rotate(90deg)',
         },
      },
   },
});

// Nested sub-items
export const NavSubList = styled('div', {
   display: 'flex',
   flexDirection: 'column',
   gap: '2px',
   paddingLeft: '36px',
   marginTop: '2px',
});

export const NavSubItem = styled('a', {
   padding: '8px 12px',
   borderRadius: '6px',
   fontSize: '$xs',
   color: '$accents7',
   textDecoration: 'none',
   cursor: 'pointer',

   '&:hover': {
      background: '$accents1',
      color: '$text',
   },
});

// Divider
export const NavDivider = styled('hr', {
   border: 'none',
   borderTop: '1px solid $accents2',
   margin: '8px 0',
});

// Footer / bottom section (user profile, settings, logout)
export const SidebarFooter = styled('div', {
   display: 'flex',
   flexDirection: 'column',
   gap: '8px',
   paddingTop: '16px',
   borderTop: '1px solid $accents2',
   marginTop: 'auto',
});

export const UserProfile = styled('div', {
   display: 'flex',
   alignItems: 'center',
   gap: '12px',
   padding: '8px 12px',
   borderRadius: '8px',
   cursor: 'pointer',
   transition: 'background 0.2s ease',

   '&:hover': {
      background: '$accents1',
   },
});

export const UserAvatar = styled('div', {
   width: '32px',
   height: '32px',
   borderRadius: '50%',
   background: '$accents3',
   flexShrink: 0,
});

export const UserInfo = styled('div', {
   display: 'flex',
   flexDirection: 'column',
   gap: '2px',
   overflow: 'hidden',
});

export const UserName = styled('span', {
   fontSize: '$sm',
   fontWeight: '$semibold',
   color: '$text',
   whiteSpace: 'nowrap',
   overflow: 'hidden',
   textOverflow: 'ellipsis',
});

export const UserRole = styled('span', {
   fontSize: '$xs',
   color: '$accents6',
   whiteSpace: 'nowrap',
   overflow: 'hidden',
   textOverflow: 'ellipsis',
});

// Collapse toggle / sidebar footer button
export const SidebarToggle = styled('button', {
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   gap: '8px',
   padding: '10px 12px',
   borderRadius: '8px',
   background: 'transparent',
   border: 'none',
   cursor: 'pointer',
   color: '$accents7',
   fontSize: '$sm',
   transition: 'background 0.2s ease',

   '&:hover': {
      background: '$accents1',
      color: '$text',
   },
});