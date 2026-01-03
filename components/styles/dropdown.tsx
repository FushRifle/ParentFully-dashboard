import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { styled, CSS } from '@nextui-org/react';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';

interface DropdownItem {
     key: string;
     label: ReactNode;
     icon?: ReactNode;
     color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
     disabled?: boolean;
     onClick?: () => void;
}

interface DropdownProps {
     children: ReactNode;
     items: DropdownItem[];
     placement?: 'bottom' | 'top' | 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
     trigger?: 'click' | 'hover';
     disabled?: boolean;
     fullWidth?: boolean;
     css?: CSS;
     'aria-label'?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
     children,
     items,
     placement = 'bottom',
     trigger = 'click',
     disabled = false,
     fullWidth = false,
     css,
     'aria-label': ariaLabel = 'Dropdown'
}) => {
     const [isOpen, setIsOpen] = useState(false);
     const dropdownRef = useRef<HTMLDivElement>(null);
     const triggerRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
               if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
               }
          };

          document.addEventListener('mousedown', handleClickOutside);
          return () => document.removeEventListener('mousedown', handleClickOutside);
     }, []);

     const getPlacementStyle = () => {
          switch (placement) {
               case 'top':
                    return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', mb: '$2' };
               case 'top-left':
                    return { bottom: '100%', left: 0, mb: '$2' };
               case 'top-right':
                    return { bottom: '100%', right: 0, mb: '$2' };
               case 'left':
                    return { right: '100%', top: '50%', transform: 'translateY(-50%)', mr: '$2' };
               case 'right':
                    return { left: '100%', top: '50%', transform: 'translateY(-50%)', ml: '$2' };
               case 'bottom-left':
                    return { top: '100%', left: 0, mt: '$2' };
               case 'bottom-right':
                    return { top: '100%', right: 0, mt: '$2' };
               default: // bottom
                    return { top: '100%', left: '50%', transform: 'translateX(-50%)', mt: '$2' };
          }
     };

     const handleMouseEnter = () => {
          if (trigger === 'hover' && !disabled) {
               setIsOpen(true);
          }
     };

     const handleMouseLeave = () => {
          if (trigger === 'hover') {
               setIsOpen(false);
          }
     };

     const handleItemClick = (item: DropdownItem) => {
          if (item.disabled) return;
          item.onClick?.();
          setIsOpen(false);
     };

     return (
          <DropdownContainer
               ref={dropdownRef}
               css={css}
               aria-label={ariaLabel}
               onMouseEnter={handleMouseEnter}
               onMouseLeave={handleMouseLeave}
          >
               <TriggerContainer
                    ref={triggerRef}
                    onClick={() => trigger === 'click' && !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    css={{ width: fullWidth ? '100%' : 'auto' }}
               >
                    {children}
               </TriggerContainer>

               {isOpen && (
                    <DropdownMenu style={getPlacementStyle()}>
                         {items.map((item) => (
                              <DropdownItem
                                   key={item.key}
                                   onClick={() => handleItemClick(item)}
                                   disabled={item.disabled}
                                   color={item.color}
                                   role="menuitem"
                                   tabIndex={item.disabled ? -1 : 0}
                                   onKeyDown={(e: React.KeyboardEvent) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                             e.preventDefault();
                                             handleItemClick(item);
                                        }
                                   }}
                              >
                                   <Flex align="center" css={{ gap: '$3' }}>
                                        {item.icon && <Box css={{ flexShrink: 0 }}>{item.icon}</Box>}
                                        <Box css={{ flex: 1 }}>{item.label}</Box>
                                   </Flex>
                              </DropdownItem>
                         ))}
                    </DropdownMenu>
               )}
          </DropdownContainer>
     );
};

// Styled Components
const DropdownContainer = styled('div', {
     position: 'relative',
     display: 'inline-block'
});

const TriggerContainer = styled('div', {
     variants: {
          disabled: {
               true: {
                    opacity: 0.5,
                    cursor: 'not-allowed',
                    '&:hover': {
                         opacity: 0.5
                    }
               },
               false: {
                    cursor: 'pointer',
                    '&:hover': {
                         opacity: 0.8
                    }
               }
          }
     }
});

const DropdownMenu = styled('div', {
     position: 'absolute',
     zIndex: 1000,
     minWidth: '160px',
     bg: '$background',
     borderRadius: '$lg',
     border: '1px solid $border',
     boxShadow: '$lg',
     py: '$2',
     display: 'flex',
     flexDirection: 'column',
     animation: 'fadeIn 0.2s ease'
});

const DropdownItem = styled('div', {
     px: '$4',
     py: '$3',
     cursor: 'pointer',
     fontSize: '$sm',
     transition: 'all 0.2s ease',
     outline: 'none',

     variants: {
          disabled: {
               true: {
                    opacity: 0.5,
                    cursor: 'not-allowed',
                    '&:hover': {
                         bg: 'transparent'
                    }
               },
               false: {
                    '&:hover': {
                         bg: '$accents0'
                    },
                    '&:focus': {
                         bg: '$accents0',
                         outline: 'none'
                    }
               }
          },
          color: {
               default: {
                    color: '$text'
               },
               primary: {
                    color: '$primary'
               },
               secondary: {
                    color: '$secondary'
               },
               success: {
                    color: '$success'
               },
               warning: {
                    color: '$warning'
               },
               error: {
                    color: '$error'
               }
          }
     },

     defaultVariants: {
          disabled: false,
          color: 'default'
     }
});

// Dropdown.Item component for JSX syntax
const DropdownItemComponent: React.FC<{
     key?: string;
     children?: ReactNode;
     icon?: ReactNode;
     color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
     disabled?: boolean;
}> = ({ children }) => {
     return <>{children}</>;
};

type DropdownComponent = React.FC<DropdownProps> & {
     Item: typeof DropdownItemComponent;
};

const DropdownWithItem = Dropdown as DropdownComponent;
DropdownWithItem.Item = DropdownItemComponent;

export default DropdownWithItem;