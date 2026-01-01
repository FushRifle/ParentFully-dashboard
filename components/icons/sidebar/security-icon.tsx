import React from 'react';
import { Svg } from '../../styles/svg';

export const SecurityIcon = () => {
     return (
          <Svg
               width="24"
               height="24"
               viewBox="0 0 24 24"
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
               css={{
                    '& path': {
                         fill: '$accents6',
                    },
               }}
          >
               <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2L4 6V12C4 17.5 7.8 22.7 12 24C16.2 22.7 20 17.5 20 12V6L12 2ZM12 22C8 20.5 6 16 6 12V7.3L12 4L18 7.3V12C18 16 16 20.5 12 22ZM12 10C12.55 10 13 10.45 13 11V14C13 14.55 12.55 15 12 15C11.45 15 11 14.55 11 14V11C11 10.45 11.45 10 12 10Z"
                    fill="#969696"
               />
          </Svg>
     );
};
