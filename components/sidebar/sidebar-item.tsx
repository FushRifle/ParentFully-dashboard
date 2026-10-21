import React from 'react';
import NextLink from 'next/link';
import { useSidebarContext } from '../layout/layout-context';

interface Props {
   title: string;
   icon: React.ReactNode;
   isActive?: boolean;
   href?: string;
}

export const SidebarItem = ({ icon, title, isActive, href = '#' }: Props) => {
   const { setCollapsed, collapsed, mobileOpen } = useSidebarContext();

   const handleClick = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 960 && mobileOpen) {
         setCollapsed();
      }
   };

   return (
      <NextLink
         href={href}
         onClick={handleClick}
         style={{
            width: '100%',
            textDecoration: 'none',
            display: 'block',
            color: 'inherit',
         }}
      >
         <div
            style={{
               display: 'flex',
               alignItems: 'center',
               gap: '12px',
               width: '100%',
               height: '38px',
               padding: '0 12px 0 16px',
               borderRadius: '10px',
               cursor: 'pointer',
               position: 'relative',
               userSelect: 'none',
               transition: 'background 80ms ease, border-color 80ms ease, transform 80ms ease, box-shadow 80ms ease',
               background: isActive ? 'var(--pf-nav-active)' : 'transparent',
               border: isActive
                  ? '1px solid var(--pf-border-hover)'
                  : '1px solid transparent',
               boxShadow: isActive ? '0 8px 22px -15px rgba(242, 140, 24, 0.9)' : 'none',
            }}
            className={`sidebar-item-pill${collapsed ? ' sidebar-item-compact' : ''}`}
         >
            {/* Keyframe & Micro-interactions */}
            <style>{`
          .sidebar-item-pill:hover {
            background: ${isActive
                  ? 'var(--pf-nav-active)'
                  : 'var(--pf-hover)'
               } !important;
            transform: ${isActive || collapsed ? 'none' : 'translateX(2px)'};
          }
          .sidebar-item-pill:active {
            transform: scale(0.98);
          }
        `}</style>

            {/* Left Glowing Active Indicator Line */}
            {isActive && (
               <span
                  style={{
                     position: 'absolute',
                     left: '0',
                     top: '50%',
                     transform: 'translateY(-50%)',
                     width: '3.5px',
                     height: '18px',
                     borderRadius: '0 4px 4px 0',
                     background: '#f28c18',
                     boxShadow: '0 0 11px rgba(242, 140, 24, 0.8)',
                  }}
               />
            )}

            {/* Icon Container */}
            <div
               style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? 'var(--pf-nav-active-text)' : 'var(--pf-nav-icon)',
                  width: '26px',
                  height: '26px',
                  flex: '0 0 26px',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(242, 140, 24, 0.13)' : 'transparent',
                  transition: 'color 80ms ease, background 80ms ease',
                  filter: isActive
                     ? 'drop-shadow(0 0 5px rgba(242, 140, 24, 0.22))'
                     : 'none',
               }}
            >
               {icon}
            </div>

            {/* Title Text */}
            <span
               className="sidebar-item-label"
               style={{
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--pf-nav-active-text)' : 'var(--pf-nav-text)',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.2s ease',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
               }}
            >
               {title}
            </span>
         </div>
      </NextLink>
   );
};
