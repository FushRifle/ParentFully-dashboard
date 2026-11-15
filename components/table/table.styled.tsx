import React from 'react';

export const IconButton = ({
   children,
   className = '',
   ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
   <button
      className={`flex cursor-pointer items-center justify-center border-none bg-transparent p-0 outline-none transition-opacity hover:opacity-80 active:opacity-60 ${className}`}
      {...props}
   >
      {children}
   </button>
);

type BadgeType = 'active' | 'paused' | 'vacation';

const badgeVariants: Record<BadgeType, string> = {
   active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
   paused: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
   vacation: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export const StyledBadge = ({
   children,
   type = 'active',
   className = '',
}: {
   children: React.ReactNode;
   type?: BadgeType;
   className?: string;
}) => (
   <span
      className={`inline-block items-center self-center rounded-[14px] px-3 py-2 text-[10px] font-bold uppercase leading-none tracking-wider shadow-sm ${badgeVariants[type]} ${className}`}
   >
      {children}
   </span>
);