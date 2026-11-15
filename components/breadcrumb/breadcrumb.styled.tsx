import Link from 'next/link';
import React from 'react';


export const Breadcrumbs = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <ul className= {`flex list-none items-center gap-4 p-0 m-0 ${className}`}>
      { children }
      </ul>
);

export const CrumbLink = ({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) => (
   <Link href= { href } className = {`text-muted-foreground hover:text-foreground ${className}`}>
      { children }
      </Link>
);

export const Crumb = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <li className= {`flex flex-row items-center gap-2 last:[&>a]:pointer-events-none last:[&>a]:cursor-default last:[&>a]:text-foreground ${className}`}>
      { children }
      </li>
);