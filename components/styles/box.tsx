import React from 'react';
import { cssToStyle, type CSS } from '@/components/ui/legacy';

type BoxProps = React.HTMLAttributes<HTMLDivElement> & { css?: CSS; as?: React.ElementType };

export const Box = ({ children, className = '', css, style, as: Tag = 'div', ...props }: BoxProps) => (
   <Tag className={`box-border ${className}`} style={{ ...cssToStyle(css), ...style }} {...props}>
      {children}
   </Tag>
);
