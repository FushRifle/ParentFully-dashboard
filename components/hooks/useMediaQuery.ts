import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
     const [matches, setMatches] = useState(false);

     useEffect(() => {
          if (typeof window !== 'undefined') {
               const media = window.matchMedia(query);

               setMatches(media.matches);

               const listener = (event: MediaQueryListEvent) => {
                    setMatches(event.matches);
               };

               if (media.addEventListener) {
                    media.addEventListener('change', listener);
               } else {
                    media.addListener(listener);
               }

               return () => {
                    if (media.removeEventListener) {
                         media.removeEventListener('change', listener);
                    } else {
                         media.removeListener(listener);
                    }
               };
          }
     }, [query]);

     return matches;
};

// Common media query breakpoints
export const breakpoints = {
     xs: '(max-width: 640px)',
     sm: '(min-width: 641px) and (max-width: 768px)',
     md: '(min-width: 769px) and (max-width: 1024px)',
     lg: '(min-width: 1025px) and (max-width: 1280px)',
     xl: '(min-width: 1281px)',
     mobile: '(max-width: 768px)',
     tablet: '(min-width: 769px) and (max-width: 1024px)',
     desktop: '(min-width: 1025px)'
};

// Pre-configured hooks for common breakpoints
export const useIsMobile = () => useMediaQuery(breakpoints.mobile);
export const useIsTablet = () => useMediaQuery(breakpoints.tablet);
export const useIsDesktop = () => useMediaQuery(breakpoints.desktop);
export const useIsXs = () => useMediaQuery(breakpoints.xs);
export const useIsSm = () => useMediaQuery(breakpoints.sm);
export const useIsMd = () => useMediaQuery(breakpoints.md);
export const useIsLg = () => useMediaQuery(breakpoints.lg);
export const useIsXl = () => useMediaQuery(breakpoints.xl);