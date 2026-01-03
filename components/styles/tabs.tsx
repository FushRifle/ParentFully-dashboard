import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { styled, CSS } from '@nextui-org/react';
import { Flex } from './flex';
import { Box } from './box';

interface TabItem {
     key: string;
     title: ReactNode;
     content: ReactNode;
     disabled?: boolean;
     icon?: ReactNode;
}

interface TabsProps {
     items: TabItem[];
     defaultActiveKey?: string;
     activeKey?: string;
     onChange?: (key: string) => void;
     variant?: 'default' | 'underlined' | 'solid' | 'bordered' | 'pills';
     size?: 'sm' | 'md' | 'lg';
     fullWidth?: boolean;
     orientation?: 'horizontal' | 'vertical';
     hideContent?: boolean;
     css?: CSS;
     tabListCss?: CSS;
     tabPanelCss?: CSS;
     'aria-label'?: string;
     children?: ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
     items,
     defaultActiveKey,
     activeKey: controlledActiveKey,
     onChange,
     variant = 'default',
     size = 'md',
     fullWidth = false,
     orientation = 'horizontal',
     hideContent = false,
     css,
     tabListCss,
     tabPanelCss,
     'aria-label': ariaLabel = 'Tabs',
     children
}) => {
     const [activeKey, setActiveKey] = useState<string>(
          controlledActiveKey || defaultActiveKey || items[0]?.key || ''
     );
     const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
     const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

     useEffect(() => {
          if (controlledActiveKey !== undefined) {
               setActiveKey(controlledActiveKey);
          }
     }, [controlledActiveKey]);

     useEffect(() => {
          const activeIndex = items.findIndex(item => item.key === activeKey);
          if (activeIndex !== -1 && tabRefs.current[activeIndex]) {
               const activeTab = tabRefs.current[activeIndex];
               if (activeTab) {
                    setIndicatorStyle({
                         left: activeTab.offsetLeft,
                         width: activeTab.offsetWidth
                    });
               }
          }
     }, [activeKey, items, variant, orientation]);

     const handleTabClick = (key: string, disabled?: boolean) => {
          if (disabled) return;

          if (controlledActiveKey === undefined) {
               setActiveKey(key);
          }
          onChange?.(key);
     };

     const activeItem = items.find(item => item.key === activeKey);

     return (
          <TabsContainer
               orientation={orientation}
               css={css}
               aria-label={ariaLabel}
          >
               <TabList
                    variant={variant}
                    size={size}
                    fullWidth={fullWidth}
                    orientation={orientation}
                    css={tabListCss}
               >
                    {items.map((item, index) => {
                         const isActive = item.key === activeKey;

                         return (
                              <TabButton
                                   key={item.key}
                                   ref={(el: HTMLButtonElement | null) => {
                                        tabRefs.current[index] = el;
                                   }}
                                   isActive={isActive}
                                   variant={variant}
                                   size={size}
                                   fullWidth={fullWidth}
                                   disabled={item.disabled}
                                   onClick={() => handleTabClick(item.key, item.disabled)}
                                   role="tab"
                                   aria-selected={isActive}
                                   aria-controls={`tabpanel-${item.key}`}
                                   id={`tab-${item.key}`}
                                   type="button"
                              >
                                   <Flex align="center" css={{ gap: '$2' }}>
                                        {item.icon}
                                        {item.title}
                                   </Flex>
                              </TabButton>
                         );
                    })}

                    {variant === 'underlined' && (
                         <TabIndicator
                              style={indicatorStyle}
                              variant={variant}
                              size={size}
                         />
                    )}
               </TabList>

               {!hideContent && activeItem && (
                    <TabPanel
                         id={`tabpanel-${activeItem.key}`}
                         aria-labelledby={`tab-${activeItem.key}`}
                         role="tabpanel"
                         css={tabPanelCss}
                         variant={variant as 'default' | 'underlined'}
                    >
                         {activeItem.content}
                    </TabPanel>
               )}

               {children}
          </TabsContainer>
     );
};

// Tab.Item component for JSX syntax
const TabItemComponent: React.FC<{
     key?: string;
     title?: ReactNode;
     children?: ReactNode;
     disabled?: boolean;
     icon?: ReactNode;
}> = ({ children }) => {
     return <>{children}</>;
};

(Tabs as any).Item = TabItemComponent;

// Styled Components
const TabsContainer = styled('div', {
     display: 'flex',
     flexDirection: 'column',
     variants: {
          orientation: {
               horizontal: {
                    flexDirection: 'column',
               },
               vertical: {
                    flexDirection: 'row',
                    gap: '$8',
               }
          }
     },
     defaultVariants: {
          orientation: 'horizontal'
     }
});

const TabList = styled('div', {
     position: 'relative',
     display: 'flex',
     gap: '$1',
     p: '$1',
     variants: {
          variant: {
               default: {
                    borderBottom: '2px solid $border',
               },
               underlined: {
                    borderBottom: '1px solid $border',
               },
               solid: {
                    bg: '$accents0',
                    borderRadius: '$lg',
                    p: '$1',
               },
               bordered: {
                    border: '1px solid $border',
                    borderRadius: '$lg',
                    p: '$1',
               },
               pills: {
                    gap: '$2',
               }
          },
          size: {
               sm: {
                    fontSize: '$sm',
               },
               md: {
                    fontSize: '$md',
               },
               lg: {
                    fontSize: '$lg',
               }
          },
          fullWidth: {
               true: {
                    width: '100%',
                    '& button': {
                         flex: 1,
                    }
               }
          },
          orientation: {
               horizontal: {
                    flexDirection: 'row',
               },
               vertical: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    width: '200px',
                    flexShrink: 0,
               }
          }
     },
     defaultVariants: {
          variant: 'default',
          size: 'md',
          fullWidth: false,
          orientation: 'horizontal'
     }
});

const TabButton = styled('button', {
     all: 'unset',
     position: 'relative',
     display: 'inline-flex',
     alignItems: 'center',
     justifyContent: 'center',
     px: '$6',
     py: '$3',
     cursor: 'pointer',
     fontWeight: '$medium',
     transition: 'all 0.2s ease',
     outline: 'none',
     userSelect: 'none',
     whiteSpace: 'nowrap',
     borderRadius: '$lg',

     variants: {
          variant: {
               default: {
                    color: '$accents7',
                    '&:hover': {
                         color: '$text',
                    },
                    '&[data-active="true"]': {
                         color: '$primary',
                         fontWeight: '$semibold',
                    }
               },
               underlined: {
                    color: '$accents7',
                    bg: 'transparent',
                    borderRadius: '$lg $lg 0 0',
                    mb: '-1px',
                    '&:hover': {
                         color: '$text',
                         bg: '$accents0',
                    },
                    '&[data-active="true"]': {
                         color: '$primary',
                         fontWeight: '$semibold',
                    }
               },
               solid: {
                    color: '$accents7',
                    '&:hover': {
                         color: '$text',
                         bg: '$accents1',
                    },
                    '&[data-active="true"]': {
                         color: '$primary',
                         bg: '$white',
                         boxShadow: '$sm',
                    }
               },
               bordered: {
                    color: '$accents7',
                    border: '1px solid transparent',
                    '&:hover': {
                         color: '$text',
                         borderColor: '$accents3',
                    },
                    '&[data-active="true"]': {
                         color: '$primary',
                         borderColor: '$primary',
                         bg: '$primaryLight',
                    }
               },
               pills: {
                    color: '$accents7',
                    '&:hover': {
                         color: '$text',
                         bg: '$accents0',
                    },
                    '&[data-active="true"]': {
                         color: '$white',
                         bg: '$primary',
                    }
               }
          },
          size: {
               sm: {
                    fontSize: '$xs',
                    py: '$2',
                    px: '$4',
               },
               md: {
                    fontSize: '$sm',
                    py: '$3',
                    px: '$6',
               },
               lg: {
                    fontSize: '$md',
                    py: '$4',
                    px: '$8',
               }
          },
          fullWidth: {
               true: {
                    flex: 1,
                    justifyContent: 'center',
               }
          },
          isActive: {
               true: {},
               false: {}
          },
          disabled: {
               true: {
                    opacity: 0.5,
                    cursor: 'not-allowed',
                    '&:hover': {
                         bg: 'transparent !important',
                         color: 'inherit !important',
                    }
               }
          }
     },

     defaultVariants: {
          variant: 'default',
          size: 'md',
          isActive: false,
          disabled: false
     }
});

const TabIndicator = styled('div', {
     position: 'absolute',
     bottom: 0,
     height: '2px',
     bg: '$primary',
     transition: 'all 0.3s ease',
     variants: {
          variant: {
               underlined: {
                    height: '2px',
               }
          },
          size: {
               sm: {
                    height: '1px',
               },
               md: {
                    height: '2px',
               },
               lg: {
                    height: '3px',
               }
          }
     }
});

const TabPanel = styled('div', {
     pt: '$6',
     variants: {
          variant: {
               underlined: {
                    pt: '$8',
               },
               default: {
                    pt: '$6',
               }
          }
     }
});