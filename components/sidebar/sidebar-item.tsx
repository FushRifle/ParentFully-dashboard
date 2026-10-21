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
         setTimeout(() => {
            setCollapsed();
         }, 100);
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
               transition: 'background 120ms ease, border-color 120ms ease, transform 120ms ease',
               background: isActive ? 'var(--pf-nav-active)' : 'transparent',
               border: isActive
                  ? '1px solid var(--pf-border-hover)'
                  : '1px solid transparent',
               boxShadow: isActive ? '0 4px 15px -3px rgba(0, 0, 0, 0.5)' : 'none',
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
            transform: ${isActive ? 'none' : 'translateX(3px)'};
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
                     background: '#3b82f6',
                     boxShadow: '0 0 10px #3b82f6',
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
                  transition: 'color 0.2s ease, transform 0.2s ease',
                  filter: isActive
                     ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.3))'
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
