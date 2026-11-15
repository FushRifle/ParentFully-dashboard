import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSidebarContext } from '../layout/layout-context';

interface Props {
   title: string;
   icon: React.ReactNode;
   isActive?: boolean;
   href?: string;
}

export const SidebarItem = React.memo(function SidebarItem({ icon, title, isActive, href = '#' }: Props) {
   const { setCollapsed, collapsed, mobileOpen } = useSidebarContext();
   const router = useRouter();

   const handleClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!mobileOpen || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      // Keep the link mounted until navigation has completed.
      event.preventDefault();
      const navigated = await router.push(href);
      if (navigated) setCollapsed();
   };

   return (
      <NextLink
         href={href}
         onClick={handleClick}
         aria-current={isActive ? 'page' : undefined}
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
               height: '41px',
               padding: collapsed ? '0 10px' : '0 12px 0 14px',
               borderRadius: '11px',
               cursor: 'pointer',
               position: 'relative',
               userSelect: 'none',
               transition: 'background 80ms ease, border-color 80ms ease, transform 80ms ease, box-shadow 80ms ease',
               background: isActive ? 'var(--pf-nav-active)' : 'transparent',
               border: isActive
                  ? '1px solid var(--pf-border-hover)'
                  : '1px solid transparent',
               boxShadow: isActive ? 'inset 0 0 0 1px rgba(242,140,24,.08)' : 'none',
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

            {/* Active route indicator */}
            {isActive && (
               <span
                  style={{
                     position: 'absolute',
                     left: '0',
                     top: '50%',
                     transform: 'translateY(-50%)',
                     width: '3px',
                     height: '16px',
                     borderRadius: '4px',
                     background: '#f28c18',
                     boxShadow: '0 0 8px rgba(242, 140, 24, 0.4)',
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
                  width: '28px',
                  height: '28px',
                  flex: '0 0 28px',
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
                  fontWeight: isActive ? 650 : 500,
                  color: isActive ? 'var(--pf-nav-active-text)' : 'var(--pf-nav-text)',
                  letterSpacing: '-0.01em',
                  transition: 'color 80ms ease',
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
});
