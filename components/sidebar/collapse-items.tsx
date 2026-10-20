import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { ChevronDown } from 'lucide-react';

interface CollapseItemLink {
   label: string;
   href: string;
}

interface Props {
   icon: React.ReactNode;
   title: string;
   items: CollapseItemLink[];
}

export const CollapseItems = ({ icon, items, title }: Props) => {
   const router = useRouter();

   // Check if any child item matches current route to auto-expand
   const hasActiveChild = items.some(
      (item) => router.pathname === item.href || router.pathname.startsWith(`${item.href}/`)
   );

   const [open, setOpen] = useState(hasActiveChild);

   useEffect(() => {
      if (hasActiveChild) setOpen(true);
   }, [router.pathname, hasActiveChild]);

   return (
      <div style={{ width: '100%', marginBottom: '2px' }}>
         {/* Micro-interaction Styles */}
         <style>{`
        .collapse-header-btn:hover {
          background: rgba(255, 255, 255, 0.04) !important;
        }
        .collapse-header-btn:active {
          transform: scale(0.98);
        }
        .collapse-sub-item:hover {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.04) !important;
          transform: translateX(3px);
        }
        .collapse-sub-item:hover .sub-dot {
          background: #3b82f6 !important;
          box-shadow: 0 0 8px #3b82f6 !important;
        }
      `}</style>

         {/* Accordion Trigger Header */}
         <button
            type="button"
            onClick={() => setOpen(!open)}
            className="collapse-header-btn"
            style={{
               width: '100%',
               height: '40px',
               padding: '0 12px 0 16px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               borderRadius: '10px',
               background: hasActiveChild ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
               border: '1px solid transparent',
               cursor: 'pointer',
               outline: 'none',
               userSelect: 'none',
               transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
         >
            {/* Icon + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div
                  style={{
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     color: hasActiveChild ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                     transition: 'color 0.2s ease',
                  }}
               >
                  {icon}
               </div>
               <span
                  style={{
                     fontSize: '13px',
                     fontWeight: hasActiveChild ? 600 : 400,
                     color: hasActiveChild ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                     letterSpacing: '-0.01em',
                     transition: 'color 0.2s ease',
                  }}
               >
                  {title}
               </span>
            </div>

            {/* Rotatable Chevron Arrow */}
            <ChevronDown
               size={14}
               color={open ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)'}
               style={{
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
               }}
            />
         </button>

         {/* Accordion Expandable Content Box */}
         <div
            style={{
               display: 'grid',
               gridTemplateRows: open ? '1fr' : '0fr',
               transition: 'grid-template-rows 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
         >
            <div style={{ overflow: 'hidden' }}>
               {/* Sub-items Container with Left Connecting Tree Line */}
               <div
                  style={{
                     marginLeft: '26px',
                     marginTop: '4px',
                     paddingLeft: '14px',
                     borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                     display: 'flex',
                     flexDirection: 'column',
                     gap: '2px',
                  }}
               >
                  {items.map((item) => {
                     const isActive =
                        router.pathname === item.href ||
                        router.pathname.startsWith(`${item.href}/`);

                     return (
                        <NextLink
                           key={item.href}
                           href={item.href}
                           style={{ textDecoration: 'none' }}
                        >
                           <div
                              className="collapse-sub-item"
                              style={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '10px',
                                 padding: '8px 12px',
                                 borderRadius: '8px',
                                 fontSize: '12px',
                                 fontWeight: isActive ? 600 : 400,
                                 color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                                 background: isActive
                                    ? 'rgba(255, 255, 255, 0.08)'
                                    : 'transparent',
                                 transition: 'all 0.2s ease',
                                 cursor: 'pointer',
                              }}
                           >
                              {/* Visual Tree Dot Indicator */}
                              <span
                                 className="sub-dot"
                                 style={{
                                    width: '5px',
                                    height: '5px',
                                    borderRadius: '50%',
                                    backgroundColor: isActive
                                       ? '#3b82f6'
                                       : 'rgba(255, 255, 255, 0.25)',
                                    boxShadow: isActive ? '0 0 8px #3b82f6' : 'none',
                                    transition: 'all 0.2s ease',
                                 }}
                              />
                              <span>{item.label}</span>
                           </div>
                        </NextLink>
                     );
                  })}
               </div>
            </div>
         </div>
      </div>
   );
};