import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Layout } from '@/components/layout/layout';
import { GoalBackground } from '@/constants/GoalBackground';
import { AuthProvider, useAuth } from '@/lib/context/authContext';
import { PageSearchProvider } from '@/lib/context/searchContext';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
   const { user, isLoading } = useAuth();
   const router = useRouter();

   useEffect(() => {
      if (!isLoading && !user) router.replace('/login');
   }, [user, isLoading, router]);

   if (isLoading || !user) return null;

   return <>{children}</>;
};

export default function MyApp({ Component, pageProps }: AppProps) {
   const router = useRouter();
   const [queryClient] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  staleTime: 60 * 1000,
                  gcTime: 10 * 60 * 1000,
                  refetchOnWindowFocus: false,
                  retry: 1,
               },
            },
         }),
   );

   const isAuthPage = ['/login'].some((path) => router.pathname.startsWith(path));

   return (
      <NextThemesProvider defaultTheme="system" enableSystem attribute="class">
         <TooltipProvider>
            <QueryClientProvider client={queryClient}>
               <AuthProvider>
                  {isAuthPage ? (
                     <Component {...pageProps} />
                  ) : (
                     <PageSearchProvider>
                        <GoalBackground>
                           <Layout>
                              <AuthGuard>
                                 <Component {...pageProps} />
                              </AuthGuard>
                           </Layout>
                        </GoalBackground>
                     </PageSearchProvider>
                  )}
               </AuthProvider>
            </QueryClientProvider>
         </TooltipProvider>
      </NextThemesProvider>
   );
}