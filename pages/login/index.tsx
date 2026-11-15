import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { Mail } from '@/components/icons/auth/mail';
import { Password } from '@/components/icons/auth/password';
import { useLogin } from '@/hooks/auth/useLogin';

const LoginPage = () => {
   const router = useRouter();
   const { isLoading, error, login, clearError } = useLogin();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [rememberMe, setRememberMe] = useState(false);
   const [showPassword, setShowPassword] = useState(false);

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
               </div>

               <div className="login-illustration" aria-hidden="true">
                  <Image
                     src="/onboarding/login-family.webp"
                     alt=""
                     fill
                     style={{ objectFit: 'contain', objectPosition: 'center bottom' }}
                     sizes="(min-width: 761px) 390px, 1px"
                     loading="eager"
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
                     style={{ width: '132px', height: 'auto', objectFit: 'contain', objectPosition: 'left center' }}
                     priority
                  />

                  <h2 className="login-title">Welcome back</h2>
                  <p className="login-subtitle">Sign in with your administrator account.</p>

                  <form className="login-form" onSubmit={handleSubmit}>
                     <FieldGroup className="gap-5">
                        <Field>
                           <FieldLabel htmlFor="admin-email">Email address</FieldLabel>
                           <div className="relative">
                              <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
                                 <Mail fill="currentColor" />
                              </span>
                              <Input
                                 id="admin-email"
                                 type="email"
                                 placeholder="name@parentfullyapp.com"
                                 value={email}
                                 autoComplete="email"
                                 required
                                 className="h-12 rounded-xl border-border bg-background pl-11 pr-4 shadow-sm"
                                 onChange={(event) => {
                                    setEmail(event.target.value);
                                    if (error) clearError();
                                 }}
                              />
                           </div>
                        </Field>

                        <Field>
                           <FieldLabel htmlFor="admin-password">Password</FieldLabel>
                           <div className="relative">
                              <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
                                 <Password fill="currentColor" />
                              </span>
                              <Input
                                 id="admin-password"
                                 type={showPassword ? 'text' : 'password'}
                                 placeholder="Enter your password"
                                 value={password}
                                 autoComplete="current-password"
                                 required
                                 className="h-12 rounded-xl border-border bg-background pl-11 pr-12 shadow-sm"
                                 onChange={(event) => {
                                    setPassword(event.target.value);
                                    if (error) clearError();
                                 }}
                              />
                              <button
                                 type="button"
                                 aria-label={showPassword ? 'Hide password' : 'Show password'}
                                 onClick={() => setShowPassword((visible) => !visible)}
                                 className="absolute right-2.5 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              >
                                 {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                              </button>
                           </div>
                        </Field>
                     </FieldGroup>

                     <div className="login-options">
                        <label className="login-remember">
                           <Checkbox
                              checked={rememberMe}
                              onCheckedChange={(checked) => setRememberMe(checked === true)}
                           />
                           <span>Remember email</span>
                        </label>
                        <span className="login-access-note">Admin access only</span>
                     </div>

                     <FieldError className="mt-4 justify-center text-center">{error}</FieldError>

                     <Button
                        type="submit"
                        disabled={isLoading || !email.trim() || !password}
                        className="mt-6 h-[52px] w-full rounded-xl bg-[#f28c18] text-sm font-bold text-white shadow-[0_12px_25px_-14px_rgba(242,140,24,0.8)] hover:bg-[#df7e11]"
                     >
                        {isLoading ? (
                           <span className="inline-flex items-center gap-2">
                              <Loader2 size={16} className="animate-spin" />
                              Signing in…
                           </span>
                        ) : 'Sign in'}
                     </Button>
                  </form>
               </div>
            </div>
         </section>
      </main>
   );
};

export default LoginPage;
