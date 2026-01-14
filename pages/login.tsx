import React, { useState, useEffect } from 'react';
import { Input, Button, Text, Link, Spacer, Loading } from '@nextui-org/react';
import { useRouter } from 'next/router';

import { Mail } from '../components/icons/auth/mail';
import { Password } from '../components/icons/auth/password';
import { Box } from '../components/styles/box';
import { Flex } from '../components/styles/flex';
import { useLogin } from '../hooks/auth/useLogin';

const DEFAULT_EMAIL = 'admin@parentfully.app';
const DEFAULT_PASSWORD = 'Admin231!';

const LoginPage = () => {
     const router = useRouter();
     const { isLoading, error, login, clearError } = useLogin();
     const [email, setEmail] = useState(DEFAULT_EMAIL);
     const [password, setPassword] = useState(DEFAULT_PASSWORD);
     const [showDemoCredentials, setShowDemoCredentials] = useState(true);

     useEffect(() => {
          if (error) {
               clearError();
          }
     }, [email, password]);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          // Attempt login with the provided credentials
          const success = await login({ email, password });

          // If login is successful, the hook should handle the redirect
          if (success) {
               // Optional: Add a small delay for better UX
               // await new Promise(resolve => setTimeout(resolve, 500));
               router.push('/dashboard');
          }
     };

     const handleDemoLogin = () => {
          setEmail(DEFAULT_EMAIL);
          setPassword(DEFAULT_PASSWORD);
          setShowDemoCredentials(true);
          clearError(); // Clear any existing errors when using demo credentials
     };

     const handleClearCredentials = () => {
          setEmail('');
          setPassword('');
          setShowDemoCredentials(false);
          clearError();
     };

     // Optional: Add keyboard shortcut for demo login
     useEffect(() => {
          const handleKeyDown = (e: KeyboardEvent) => {
               if (e.ctrlKey && e.key === 'd') {
                    e.preventDefault();
                    handleDemoLogin();
               }
          };

          window.addEventListener('keydown', handleKeyDown);
          return () => window.removeEventListener('keydown', handleKeyDown);
     }, []);

     return (
          <Flex
               direction="row"
               css={{
                    minHeight: '100vh',
                    width: '100%',
                    bg: '$background',
               }}
          >
               {/* ---------- LEFT / BRAND ---------- */}
               <Flex
                    direction="column"
                    justify="center"
                    css={{
                         flex: '1 1 55%',
                         px: '$20',
                         background:
                              'radial-gradient(circle at top left, #5a58ff 0%, #2b2aa0 40%, #15144f 100%)',
                         display: 'none',
                         '@md': { display: 'flex' },
                    }}
               >
                    <Text
                         h1
                         css={{
                              color: 'white',
                              fontWeight: '$bold',
                              fontSize: '3.2rem',
                              lineHeight: '1.05',
                              maxWidth: 520,
                              mb: '$8',
                         }}
                    >
                         Where families
                         <br />
                         manage life together.
                    </Text>

                    <Text
                         css={{
                              color: 'rgba(255,255,255,0.75)',
                              maxWidth: 480,
                              fontSize: '$lg',
                         }}
                    >
                         Secure dashboards, shared planning, and real collaboration for modern
                         parenting.
                    </Text>
               </Flex>

               {/* ---------- RIGHT / FORM ---------- */}
               <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    css={{
                         flex: '1 1 45%',
                         px: '$12',
                         '@mdMax': { flex: '1 1 100%' },
                    }}
               >
                    <Box css={{ width: '100%', maxWidth: 380 }}>
                         <Text h2 css={{ fontWeight: '$bold', mb: '$2' }}>
                              Welcome back
                         </Text>

                         <Text css={{ color: '$accents7', mb: '$10' }}>
                              Sign in to continue to your dashboard
                         </Text>

                         <form onSubmit={handleSubmit}>
                              <Input
                                   fullWidth
                                   size="lg"
                                   bordered
                                   label="Email address"
                                   contentLeft={<Mail fill="currentColor" />}
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   disabled={isLoading}
                                   css={{ mb: '$8' }}
                                   aria-label="Email address"
                                   autoComplete="email"
                              />

                              <Input.Password
                                   fullWidth
                                   size="lg"
                                   bordered
                                   label="Password"
                                   contentLeft={<Password fill="currentColor" />}
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   disabled={isLoading}
                                   aria-label="Password"
                                   autoComplete="current-password"
                              />

                              {showDemoCredentials && (
                                   <>
                                        <Spacer y={0.75} />
                                        <Text size="$sm" color="success">
                                             ✓ Demo credentials loaded (Ctrl+D to reload)
                                        </Text>
                                   </>
                              )}

                              {error && (
                                   <>
                                        <Spacer y={0.75} />
                                        <Text color="error" size="$sm">
                                             {error}
                                        </Text>
                                   </>
                              )}

                              <Button
                                   type="submit"
                                   shadow
                                   size="lg"
                                   disabled={isLoading}
                                   css={{
                                        mt: '$10',
                                        width: '100%',
                                        borderRadius: '$pill',
                                        fontWeight: '$bold',
                                        bg: '#3f3bef',
                                        '&:hover': {
                                             bg: '#2b2aa0',
                                        },
                                        '&:disabled': {
                                             bg: '$accents4',
                                        },
                                   }}
                              >
                                   {isLoading ? (
                                        <Loading type="points" color="white" size="sm" />
                                   ) : (
                                        'Sign in'
                                   )}
                              </Button>
                         </form>

                         <Spacer y={1.5} />

                         <Flex direction="column" align="center">
                              {showDemoCredentials ? (
                                   <Button
                                        light
                                        size="sm"
                                        onClick={handleClearCredentials}
                                        css={{ color: '$accents6' }}
                                        disabled={isLoading}
                                   >
                                        Use my own credentials
                                   </Button>
                              ) : (
                                   <Button
                                        light
                                        size="sm"
                                        onClick={handleDemoLogin}
                                        css={{ color: '$accents6' }}
                                        disabled={isLoading}
                                   >
                                        Use demo credentials
                                   </Button>
                              )}

                              <Link href="/forgot-password" css={{ fontSize: '$sm' }}>
                                   Forgot your password?
                              </Link>
                         </Flex>

                         <Spacer y={2} />

                         <Text size="$sm" css={{ color: '$accents7', textAlign: 'center' }}>
                              Don't have an account?{' '}
                              <Link href="/signup" css={{ fontSize: '$sm' }}>
                                   Sign up
                              </Link>
                         </Text>

                         {/* Optional: Quick login hint for development */}
                         {process.env.NODE_ENV === 'development' && (
                              <>
                                   <Spacer y={1} />
                                   <Text size="$xs" css={{ color: '$accents6', textAlign: 'center', opacity: 0.7 }}>
                                        Dev mode: Click "Sign in" to redirect to dashboard
                                   </Text>
                              </>
                         )}
                    </Box>
               </Flex>
          </Flex>
     );
};

export default LoginPage;