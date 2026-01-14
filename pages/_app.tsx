import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createTheme, NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Layout } from '../components/layout/layout'
import { GoalBackground } from '../constants/GoalBackground'
import { AuthProvider } from '../lib/context/authContext'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

const lightTheme = createTheme({
   type: 'light',
   theme: {
      colors: {
         primary: '#3f3bef',
      },
   },
})

const darkTheme = createTheme({
   type: 'dark',
   theme: {
      colors: {
         primary: '#3f3bef',
      },
   },
})

export default function MyApp({ Component, pageProps }: AppProps) {
   const router = useRouter()

   useEffect(() => {
      if (router.pathname === '/') {
         router.replace('/login')
      }
   }, [router.pathname])

   const isAuthPage = router.pathname.startsWith('/login')

   return (
      <NextThemesProvider
         defaultTheme="system"
         attribute="class"
         value={{
            light: lightTheme.className,
            dark: darkTheme.className,
         }}
      >
         <NextUIProvider>
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
         </NextUIProvider>
      </NextThemesProvider>
   )
}
