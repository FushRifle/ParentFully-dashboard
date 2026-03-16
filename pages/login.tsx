import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input, Button, Text, Link, Spacer, Loading, Card, Checkbox } from '@nextui-org/react';
import { useRouter } from 'next/router';

import { Mail } from '../components/icons/auth/mail';
import { Password } from '../components/icons/auth/password';
import { Box } from '../components/styles/box';
import { Flex } from '../components/styles/flex';
import { useLogin } from '../hooks/auth/useLogin';

const LoginPage = () => {
     const router = useRouter();
     const { isLoading, error, login, clearError } = useLogin();
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [rememberMe, setRememberMe] = useState(false);

     // Check for saved email on component mount
     useEffect(() => {
          const savedEmail = localStorage.getItem('rememberedEmail');
          if (savedEmail) {
               setEmail(savedEmail);
               setRememberMe(true);
          }
     }, []);

     useEffect(() => {
          if (error) clearError();
     }, [email, password, clearError]);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          // Handle remember me functionality
          if (rememberMe) {
               localStorage.setItem('rememberedEmail', email);
          } else {
               localStorage.removeItem('rememberedEmail');
          }

          const success = await login({ email, password });

          // If login successful and remember me is checked, you might also want to
          // set a longer session expiry or store a refresh token
          if (success) {
               // You could also store a session token here if your auth system supports it
               // For example: localStorage.setItem('sessionToken', response.token);
               router.push('/dashboard');
          }
     };

     return (
          <Flex
               justify="center"
               align="center"
               css={{
                    minHeight: '100vh',
                    width: '100%',
                    backgroundColor: '#F8F9FA',
                    px: '$6'
               }}
          >
               <Card
                    css={{
                         display: 'flex',
                         flexDirection: 'row',
                         width: '100%',
                         maxWidth: '1000px',
                         minHeight: '650px',
                         border: 'none',
                         borderRadius: '24px',
                         boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                    }}
               >
                    {/* ---------- LEFT / BRAND SIDE ---------- */}
                    <Flex
                         direction="column"
                         justify="between"
                         css={{
                              flex: '1 1 50%',
                              p: '60px',
                              backgroundColor: '#FFF8F0',
                              display: 'none',
                              '@md': { display: 'flex' },
                         }}
                    >
                         <Box>

                              <Spacer y={1} />
                              <Text h1 css={{
                                   fontWeight: '$bold',
                                   fontSize: '2.5rem',
                                   lineHeight: '1.2',
                                   color: '#111'
                              }}>
                                   <span style={{ color: '#FF8C01' }}>  ParentFully  <br />
                                   </span>
                              </Text>
                              <Text css={{ color: 'gray', fontSize: '$lg', mt: '$4' }}>
                                   where parents and co-parents focus on what matters most together.
                              </Text>
                         </Box>

                         {/* Illustration Placeholder - Transparent BG */}
                         <Box css={{ textAlign: 'center' }}>
                              <img
                                   src="/onboarding/amico_1.png"
                                   alt="Family collaboration"
                                   style={{ width: '100%', maxWidth: '350px', height: 'auto' }}
                              />
                         </Box>
                    </Flex>

                    {/* ---------- RIGHT / FORM SIDE ---------- */}
                    <Flex
                         direction="column"
                         align="center"
                         justify="center"
                         css={{
                              flex: '1 1 55%', // Slightly more weight to the form side for "air"
                              px: '$20',       // Increased horizontal padding for breathing room
                              py: '$10',
                              backgroundColor: 'white',
                              '@xsMax': { px: '$10' }, // Responsive padding for smaller screens
                         }}
                    >

                         <Box css={{ width: '100%', maxWidth: '420px' }}>

                              <Image
                                   src="/icons/ParentFully.png"
                                   alt="Logo"
                                   width={180}
                                   height={100}
                                   style={{ objectFit: 'contain' }}
                                   priority
                              />

                              <Text h2 css={{
                                   fontWeight: '800',
                                   fontSize: '2.2rem',
                                   color: 'black',
                                   letterSpacing: '-0.02e'
                              }}>
                                   Welcome back
                              </Text>
                              <Text css={{ color: '$accents6', marginBottom: '$12', fontSize: '$lg' }}>
                                   Please enter your details to sign in
                              </Text>
                              <Spacer y={3} />

                              <form onSubmit={handleSubmit}>
                                   <Input
                                        fullWidth
                                        size="xl"
                                        labelPlaceholder="Email"
                                        contentLeft={<Mail fill="#A1A1AA" />}
                                        value={email}
                                        color='primary'
                                        onChange={(e) => setEmail(e.target.value)}
                                        css={{
                                             mb: '$12',
                                             '& .nextui-input-wrapper': {
                                                  borderRadius: '12px',
                                             }
                                        }}
                                   />

                                   <Spacer y={1} />

                                   <Input.Password
                                        fullWidth
                                        size="xl"
                                        labelPlaceholder="Password"
                                        color='primary'
                                        contentLeft={<Password fill="#A1A1AA" />}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        css={{
                                             '& .nextui-input-wrapper': {
                                                  borderRadius: '12px',
                                             }
                                        }}
                                   />

                                   {/* Remember Me Checkbox */}
                                   <Flex justify="between" align="center" css={{ mt: '$8' }}>
                                        <Flex
                                             align="center"
                                             onClick={() => setRememberMe(!rememberMe)}
                                             css={{
                                                  cursor: 'pointer',
                                                  userSelect: 'none',
                                                  gap: '$2'
                                             }}
                                        >
                                             <Box css={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  width: '25px',
                                                  height: '25px',
                                             }}>
                                                  {rememberMe ? <CheckedIcon /> : <UncheckedIcon />}
                                             </Box>
                                             <Text
                                                  css={{
                                                       color: '$black',
                                                       fontSize: '$sm',
                                                  }}
                                             >
                                                  Remember me
                                             </Text>
                                        </Flex>

                                        <Link
                                             href="/forgot-password"
                                             css={{
                                                  color: '#FF8C01',
                                                  fontSize: '$sm',
                                                  '&:hover': { color: '$accents7' }
                                             }}
                                        >
                                             Forgot password?
                                        </Link>
                                   </Flex>

                                   {error && (
                                        <Text color="error" size="$sm" css={{ mt: '$5', textAlign: 'center' }}>
                                             {error}
                                        </Text>
                                   )}

                                   <Button
                                        type="submit"
                                        size="xl"
                                        disabled={isLoading}
                                        css={{
                                             mt: '$8',
                                             width: '100%',
                                             height: '64px',
                                             borderRadius: '18px',
                                             fontSize: '$md',
                                             fontWeight: '$bold',
                                             bg: '#FF8C01',
                                             boxShadow: '0 12px 24px -6px rgba(255, 140, 1, 0.35)',
                                             '&:hover': {
                                                  bg: '#E67E00',
                                                  transform: 'translateY(-3px)',
                                                  boxShadow: '0 15px 30px -8px rgba(255, 140, 1, 0.45)',
                                             },
                                             '&:active': { transform: 'translateY(0)' },
                                        }}
                                   >
                                        {isLoading ? <Loading type="points" color="white" size="sm" /> : 'Sign in'}
                                   </Button>
                              </form>

                              <Spacer y={1} />
                         </Box>
                    </Flex>
               </Card>
          </Flex>
     );
};

export default LoginPage;

const CheckedIcon = () => (
     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="#FF8C01" stroke="#FF8C01" strokeWidth="2" />
          <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
     </svg>
);

const UncheckedIcon = () => (
     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="white" stroke="#000000" strokeWidth="2" />
     </svg>
);