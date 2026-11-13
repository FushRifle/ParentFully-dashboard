import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

type PageSearchContextValue = { search: string; setSearch: (value: string) => void; clearSearch: () => void };
const PageSearchContext = createContext<PageSearchContextValue | null>(null);

export const PageSearchProvider = ({ children }: { children: React.ReactNode }) => {
   const router = useRouter();
   const [search, setSearch] = useState('');
   useEffect(() => { setSearch(''); }, [router.pathname]);
   const value = useMemo(() => ({ search, setSearch, clearSearch: () => setSearch('') }), [search]);
   return <PageSearchContext.Provider value={value}>{children}</PageSearchContext.Provider>;
};

export const usePageSearch = () => {
   const context = useContext(PageSearchContext);
   if (!context) throw new Error('usePageSearch must be used inside PageSearchProvider.');
   return context;
};
