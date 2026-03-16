import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Layout } from '../components/layout/layout';
import { GoalBackground } from '../constants/GoalBackground';
import { AuthProvider } from '../lib/context/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Create light and dark NextUI themes
const lightTheme = createTheme({
   type: 'light',
   theme: {
      colors: {
         primary: '#3f3bef',
      },
   },
});

const darkTheme = createTheme({
   type: 'dark',
   theme: {
      colors: {
         primary: '#3f3bef',
      },
   },
});

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: 5 * 60 * 1000,
         refetchOnWindowFocus: false,
      },
   },
});

export default function MyApp({ Component, pageProps }: AppProps) {
   const router = useRouter();

   useEffect(() => {
      if (router.pathname === '/') {
         router.replace('/login');
      }
   }, [router]);

   const isAuthPage = ['/login', '/register'].some((path) =>
      router.pathname.startsWith(path)
   );

   return (
      <NextThemesProvider
         defaultTheme="system"
         attribute="class"
         value={{ light: lightTheme.className, dark: darkTheme.className }}
      >
         <NextUIProvider>
            <QueryClientProvider client={queryClient}>
               <AuthProvider>
                  {isAuthPage ? (
                     <Component {...pageProps} />
                  ) : (
                     <GoalBackground>
                        <Layout>
                           <Component {...pageProps} />
                        </Layout>
                     </GoalBackground>
                  )}
               </AuthProvider>
            </QueryClientProvider>
         </NextUIProvider>
      </NextThemesProvider>
   );
}