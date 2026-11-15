import React from 'react';

export const Toast = ({ message, visible }: { message: string; visible: boolean }) => {
     if (!visible) return null;

     return (
          <div className="fixed right-5 top-5 z-[10000] w-[300px] rounded-xl bg-emerald-600 p-4 shadow-lg">
               <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{message}</span>
               </div>
          </div>
     );
};