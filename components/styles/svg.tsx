import React from 'react';

const UnstyledSvg = ({ children, className = '', ...props }: React.SVGProps<SVGSVGElement>) => (
   <svg className={className} {...props}>{children}</svg>
);

const UnstyledPath = ({ className = '', ...props }: React.SVGProps<SVGPathElement>) => (
   <path className={className} {...props} />
);

const UnstyledRect = ({ className = '', ...props }: React.SVGProps<SVGRectElement>) => (
   <rect className={className} {...props} />
);

export const Svg = Object.assign(UnstyledSvg, {
   Path: UnstyledPath,
   Rect: UnstyledRect,
});