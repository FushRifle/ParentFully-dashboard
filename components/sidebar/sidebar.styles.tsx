import React from 'react';

export const SidebarWrapper = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
   <div
      className={`flex h-full w-60 shrink-0 flex-col overflow-y-auto border-r bg-background shadow-md transition-all duration-100 fixed -translate-x-full z-[202] md:sticky md:top-0 md:h-screen md:translate-x-0 md:shadow-none [&::-webkit-scrollbar]:hidden ${className}`}
      {...props}
   >
      {children}
   </div>
);

export const Overlay = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
   <div
      className={`fixed inset-0 z-[201] bg-black/15 transition-opacity duration-100 md:hidden ${className}`}
      {...props}
   />
);

export const Header = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <div className={`flex h-[66px] items-center gap-4 border-b border-transparent px-8 py-5 ${className}`}>
      {children}
   </div>
);

export const Body = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <div className={`mt-2 flex flex-1 flex-col gap-6 overflow-y-auto px-4 ${className}`}> {children} </div>
);

export const Footer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <div className={`mx-6 mt-auto flex items-center justify-center gap-8 border-t py-5 ${className}`}> {children} </div>
);

export const Sidebar = Object.assign(SidebarWrapper, {
   Header,
   Body,
   Overlay,
   Footer,
});