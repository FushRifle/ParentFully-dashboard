import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button, Input, Loading, Text } from '@nextui-org/react';

import { Mail } from '../components/icons/auth/mail';
import { Password } from '../components/icons/auth/password';
import { useLogin } from '../hooks/auth/useLogin';

const LoginPage = () => {
   const router = useRouter();
   const { isLoading, error, login, clearError } = useLogin();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [rememberMe, setRememberMe] = useState(false);

   useEffect(() => {
      const savedEmail = window.localStorage.getItem('rememberedEmail');
      if (savedEmail) {
         setEmail(savedEmail);
         setRememberMe(true);
      }
      router.prefetch('/dashboard');
   }, [router]);

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (rememberMe) window.localStorage.setItem('rememberedEmail', email.trim());
      else window.localStorage.removeItem('rememberedEmail');

      const success = await login({ email: email.trim(), password });
      if (success) await router.replace('/dashboard');
   };

   return (
      <main className="login-page">
         <section className="login-shell" aria-label="ParentFully admin sign in">
            <aside className="login-brand">
               <div>
                  <span className="section-kicker">ParentFully Admin</span>
                  <h1>Support every family from one clear workspace.</h1>
                  <p>Customers, subscriptions and activity—kept together for your team.</p>
               </div>

               <div className="login-illustration" aria-hidden="true">
                  <Image
                     src="/onboarding/login-family.webp"
                     alt=""
                     layout="fill"
                     objectFit="contain"
                     objectPosition="center bottom"
                     sizes="(min-width: 761px) 390px, 1px"
                  />
               </div>
            </aside>

            <div className="login-form-panel">
               <div className="login-form-inner">
                  <Image
                     src="/icons/ParentFully.png"
                     alt="ParentFully"
                     width={132}
                     height={56}
                     objectFit="contain"
                     objectPosition="left center"
                     priority
                  />

                  <h2 className="login-title">Welcome back</h2>
                  <p className="login-subtitle">Sign in with your administrator account.</p>

                  <form className="login-form" onSubmit={handleSubmit}>
                     <Input
                        fullWidth
                        size="lg"
                        type="email"
                        labelPlaceholder="Email address"
                        contentLeft={<Mail fill="#A1A1AA" />}
                        value={email}
                        autoComplete="email"
                        required
                        onChange={(event) => {
                           setEmail(event.target.value);
                           if (error) clearError();
                        }}
                        css={{ mb: '$11', '& .nextui-input-wrapper': { borderRadius: '12px' } }}
                     />

                     <Input.Password
                        fullWidth
                        size="lg"
                        labelPlaceholder="Password"
                        contentLeft={<Password fill="#A1A1AA" />}
                        value={password}
                        autoComplete="current-password"
                        required
                        onChange={(event) => {
                           setPassword(event.target.value);
                           if (error) clearError();
                        }}
                        css={{ '& .nextui-input-wrapper': { borderRadius: '12px' } }}
                     />

                     <div className="login-options">
                        <label className="login-remember">
                           <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(event) => setRememberMe(event.target.checked)}
                           />
                           <span>Remember email</span>
                        </label>
                        <span className="login-access-note">Admin access only</span>
                     </div>

                     {error && (
                        <Text color="error" size="$sm" css={{ mt: '$7', textAlign: 'center' }} role="alert">
                           {error}
                        </Text>
                     )}

                     <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading || !email.trim() || !password}
                        css={{
                           mt: '$9',
                           width: '100%',
                           height: '52px',
                           borderRadius: '13px',
                           fontWeight: 700,
                           background: '#f28c18',
                           boxShadow: '0 12px 25px -14px rgba(242, 140, 24, 0.8)',
                           transition: 'transform 140ms ease, box-shadow 140ms ease',
                           '&:hover': {
                              background: '#df7e11',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 15px 28px -14px rgba(242, 140, 24, 0.9)',
                           },
                        }}
                     >
                        {isLoading ? <Loading type="points" color="white" size="sm" /> : 'Sign in'}
                     </Button>
                  </form>
               </div>
            </div>
         </section>
      </main>
   );
};

export default LoginPage;
