import React from 'react';
import { cssToStyle, type CSS } from '@/components/ui/legacy';

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
   direction?: 'row' | 'column';
   justify?: 'center' | 'start' | 'end' | 'between' | 'around';
   align?: 'center' | 'start' | 'end' | 'stretch' | 'between';
   wrap?: 'wrap' | 'nowrap';
   css?: CSS;
}

const justifyMap = {
   center: 'justify-center',
   start: 'justify-start',
   end: 'justify-end',
   between: 'justify-between',
   around: 'justify-around',
};

const alignMap = {
   center: 'items-center',
   start: 'items-start',
   end: 'items-end',
   stretch: 'items-stretch',
   between: 'items-between',
};

const wrapMap = {
   wrap: 'flex-wrap',
   nowrap: 'flex-nowrap',
};

export const Flex = ({
   children,
   className = '',
   direction = 'row',
   justify,
   align,
   wrap,
   css,
   style,
   ...props
}: FlexProps) => {
   return (
      <div
         className={`flex box-border ${direction === 'column' ? 'flex-col' : 'flex-row'} ${justify ? justifyMap[justify] : ''
            } ${align ? alignMap[align] : ''} ${wrap ? wrapMap[wrap] : ''} ${className}`
         }
         style={{ ...cssToStyle(css), ...style }}
         {...props}
      >
         {children}
      </div>
   );
};
