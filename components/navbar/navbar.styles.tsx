import React from 'react';

export const SidebarWrapper = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <div className={`flex h-screen overflow-hidden ${className}`}>{children}</div>
);

export const StyledBurgerButton = ({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
   <button className={`p-2 rounded-md hover:bg-muted transition-colors ${className}`} {...props}>
      {children}
   </button>
);

export const Sidebar = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <aside className={`flex h-screen w-[250px] flex-col border-r bg-background p-4 transition-transform duration-300 ${className}`}>
      {children}
   </aside>
);

export const SidebarLogo = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <div className={`mb-6 flex cursor-pointer items-center gap-3 border-b px-2 py-3 ${className}`}>{children}</div>
);

export const LogoText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <span className={`text-lg font-bold tracking-tight text-foreground ${className}`}>{children}</span>
);

export const NavList = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <nav className={`flex flex-1 flex-col gap-2 overflow-y-auto ${className}`}>{children}</nav>
);

export const NavSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <div className={`mb-4 flex flex-col gap-1 ${className}`}>{children}</div>
);

export const NavSectionTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <span className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${className}`}>{children}</span>
);

export const NavItem = ({ children, className = '', active = false, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { active?: boolean }) => (
   <a
      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-all duration-200 ${active
         ? 'bg-primary/10 font-semibold text-primary'
         : 'text-muted-foreground hover:bg-muted hover:text-foreground'
         } ${className}`}
      {...props}
   >
      {children}
   </a>
);

export const NavItemIcon = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center ${className}`}>{children}</span>
);

export const NavItemLabel = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <span className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap ${className}`}>{children}</span>
);

export const NavItemBadge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <span className={`ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground ${className}`}>{children}</span>
);

export const NavItemChevron = ({ children, className = '', open = false }: { children: React.ReactNode; className?: string; open?: boolean }) => (
   <span className={`ml-auto inline-flex items-center text-muted-foreground transition-transform duration-200 ${open ? 'rotate-90' : ''} ${className}`}>
      {children}
   </span>
);

export const NavSubList = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <div className={`mt-0.5 flex flex-col gap-0.5 pl-9 ${className}`}>{children}</div>
);

export const NavSubItem = ({ children, className = '', ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
   <a className={`cursor-pointer rounded-md px-3 py-2 text-xs text-muted-foreground no-underline hover:bg-muted hover:text-foreground ${className}`} {...props}>
      {children}
   </a>
);

export const NavDivider = ({ className = '' }: { className?: string }) => (
   <hr className={`my-2 border-t ${className}`} />
);

export const SidebarFooter = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <div className={`mt-auto flex flex-col gap-2 border-t pt-4 ${className}`}>{children}</div>
);

export const UserProfile = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <div className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted ${className}`}>{children}</div>
);

export const UserAvatar = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
   <div className={`h-8 w-8 shrink-0 rounded-full bg-muted ${className}`}>{children}</div>
);

export const UserInfo = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <div className={`flex flex-col gap-0.5 overflow-hidden ${className}`}>{children}</div>
);

export const UserName = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <span className={`overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-foreground ${className}`}>{children}</span>
);

export const UserRole = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <span className={`overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground ${className}`}>{children}</span>
);

export const SidebarToggle = ({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
   <button className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-transparent px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${className}`} {...props}>
      {children}
   </button>
);