import React from 'react';
import { styled } from '@nextui-org/react';

interface MenuProps {
     size?: number;
     color?: string;
     css?: any;
}

export const Menu: React.FC<MenuProps> = ({
     size = 24,
     color = 'currentColor',
     css
}) => {
     const StyledSvg = styled('svg', {
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
               <line x1="3" y1="12" x2="21" y2="12"></line>
               <line x1="3" y1="6" x2="21" y2="6"></line>
               <line x1="3" y1="18" x2="21" y2="18"></line>
          </StyledSvg>
     );
};