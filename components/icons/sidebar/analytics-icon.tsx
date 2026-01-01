import React from 'react';
import { Svg } from '../../styles/svg';

export const AnalyticsIcon = () => {
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
                    d="M4 19H20V21H4V19ZM4 15H20V17H4V15ZM4 11H14V13H4V11ZM4 7H10V9H4V7Z"
                    fill="#969696"
               />
          </Svg>
     );
};
