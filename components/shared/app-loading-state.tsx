import React from 'react';

type AppLoadingStateProps = {
   message?: string;
   minHeight?: number | string;
   className?: string;
};

export function AppLoadingState({
   message = 'Loading…',
   minHeight = 180,
   className = '',
}: AppLoadingStateProps) {
   return (
      <div
         className={`app-loading-state ${className}`.trim()}
         style={{ minHeight }}
         role="progressbar"
         aria-label={message}
         aria-busy="true"
      >
         <span className="app-loading-state__icon" aria-hidden="true">
            <span className="app-loading-state__spinner" />
         </span>
         <span className="app-loading-state__message">{message}</span>
      </div>
   );
}

export default AppLoadingState;
