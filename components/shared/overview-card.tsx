import React from 'react';
import NextLink from 'next/link';
import { LucideIcon } from 'lucide-react';

export type OverviewCardProps = {
   label: string;
   value: React.ReactNode;
   description: string;
   icon: LucideIcon;
   color: string;
   active?: boolean;
   loading?: boolean;
   href?: string;
   onClick?: () => void;
   /** Small inline badge/icon rendered in the bottom-right strip. */
   decoration?: React.ReactNode;
   /**
    * Large illustration rendered behind the card content.
    * Pass a React node (e.g. `<Image layout="fill" …/>`, an <svg>, or an <img>).
    * The component supplies the positioned, sized wrapper.
    */
   illustration?: React.ReactNode;
};

export const OverviewCard = ({
   label,
   value,
   description,
   icon: Icon,
   color,
   active = false,
   loading = false,
   href,
   onClick,
   decoration,
   illustration,
}: OverviewCardProps) => {
   const content = (
      <>
         {illustration && (
            <span className="overview-card-illustration" aria-hidden="true">
               {illustration}
            </span>
         )}
         <span className="overview-card-top">
            <span className="overview-card-icon">
               <Icon size={17} />
            </span>
            <small>{label}</small>
         </span>
         <strong>{loading ? '—' : value}</strong>
         <p>{description}</p>
         {decoration && (
            <span className="overview-card-decoration">{decoration}</span>
         )}
      </>
   );
   const className = `glass-panel overview-card${active ? ' active' : ''}${href || onClick ? ' interactive' : ''
      }`;
   const style = { '--overview-card-accent': color } as React.CSSProperties;

   if (href)
      return (
         <NextLink href={href} passHref legacyBehavior>
            <a className={className} style={style}>
               {content}
            </a>
         </NextLink>
      );
   if (onClick)
      return (
         <button
            type="button"
            aria-pressed={active}
            className={className}
            style={style}
            onClick={onClick}
         >
            {content}
         </button>
      );
   return (
      <div className={className} style={style}>
         {content}
      </div>
   );
};

export const OverviewCardGrid = ({
   children,
   columns = 4,
   className = '',
}: {
   children: React.ReactNode;
   columns?: number;
   className?: string;
}) => (
   <div
      className={`overview-card-grid ${className}`}
      style={{ '--overview-card-columns': columns } as React.CSSProperties}
   >
      {children}
   </div>
);