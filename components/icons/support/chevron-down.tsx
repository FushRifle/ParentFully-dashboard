import React from 'react';
import { styled } from '@nextui-org/react';

interface ChevronDownProps {
     size?: number;
     color?: string;
     css?: any;
}

export const ChevronDown: React.FC<ChevronDownProps> = ({
     size = 24,
     color = 'currentColor',
     css
}) => {
     const StyledSvg = styled('svg', {
          transition: 'transform 0.2s ease',
          ...css
     });

     return (
          <StyledSvg
               width={size}
               height={size}
               viewBox="0 0 24 24"
               fill="none"
               stroke={color}
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
               xmlns="http://www.w3.org/2000/svg"
          >
               <path d="M6 9L12 15L18 9" />
          </StyledSvg>
     );
};