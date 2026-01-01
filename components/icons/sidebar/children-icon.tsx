import React from 'react';
import { Svg } from '../../styles/svg';

export const ChildrenIcon = () => {
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
                    d="M12 2C10.343 2 9 3.343 9 5C9 6.657 10.343 8 12 8C13.657 8 15 6.657 15 5C15 3.343 13.657 2 12 2ZM6 10C4.343 10 3 11.343 3 13V19H5V14H7V19H9V13C9 11.343 7.657 10 6 10ZM18 10C16.343 10 15 11.343 15 13V19H17V14H19V19H21V13C21 11.343 19.657 10 18 10Z"
                    fill="#969696"
               />
          </Svg>
     );
};
