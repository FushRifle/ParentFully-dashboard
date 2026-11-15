import React from 'react';

export const WrapperLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="flex h-dvh min-h-screen w-full min-w-0 overflow-hidden bg-transparent">
         {children}
      </div>
   );
};
