import React from 'react';

export const WrapperLayout = ({ children }: { children: React.ReactNode }) => {
   return <div className="flex" > { children } </div>;
};