import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
   const [step, setStep] = useState<'email' | 'code' | 'password' | 'done'>('email');
   const [email, setEmail] = useState('');
   const [code, setCode] = useState('');
   const [token, setToken] = useState('');
   const [password, setPassword] = useState('');
   const [confirmation, setConfirmation] = useState('');
   const [visible, setVisible] = useState(false);
   const [busy, setBusy] = useState(false);
   const [error, setError] = useState('');
   const [notice, setNotice] = useState('');
   const sendCode = async () => {
      await api.post('/v1/forgot-password', { email: email.trim() });
      setNotice('Check your email for your reset code.');
      setStep('code');
   };
   const submit = async (event: React.FormEvent) => {
      event.preventDefault(); setError(''); setNotice(''); setBusy(true);
      try {
         if (step === 'email') await sendCode();
         else if (step === 'code') {
            const response = await api.post('/v1/verify-reset-code', { email: email.trim(), code: code.trim() });
            const resetToken = response.data?.data?.token ?? response.data?.token;
            if (!resetToken) throw new Error('The reset code could not be verified. Request a new code.');
            setToken(resetToken); setStep('password');
         } else {
            if (password !== confirmation) throw new Error('Passwords do not match.');
            await api.post('/v1/reset-password', { email: email.trim(), code: code.trim(), token, password, password_confirmation: confirmation });
            setPassword(''); setConfirmation(''); setToken(''); setCode(''); setStep('done');
         }
      } catch (err: any) { setError(Object.values(err.response?.data?.errors ?? {}).flat().join(' ') || err.response?.data?.message || err.message || 'Unable to reset your password.'); }
      finally { setBusy(false); }
   };
   return <main className="login-page"><section className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-xl sm:p-8">
      <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">← Back to sign in</Link>
      <h1 className="mt-6 text-2xl font-semibold">{step === 'done' ? 'Password updated' : 'Reset your password'}</h1>
      <p className="mb-6 mt-2 text-sm text-muted-foreground">{step === 'email' ? 'Enter your account email to receive a reset code.' : step === 'code' ? `Enter the code sent to ${email}.` : step === 'password' ? 'Choose a new password for your account.' : 'You can now sign in with your new password.'}</p>
      {step === 'done' ? <Link href="/login" className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground">Sign in</Link> : <form onSubmit={submit} className="space-y-5">
         {step === 'email' && <Field><FieldLabel htmlFor="reset-email">Email address</FieldLabel><Input id="reset-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={busy} /></Field>}
         {step === 'code' && <Field><FieldLabel htmlFor="reset-code">Reset code</FieldLabel><Input id="reset-code" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} required disabled={busy} /></Field>}
         {step === 'password' && <><Field><FieldLabel htmlFor="new-password">New password</FieldLabel><div className="relative"><Input id="new-password" type={visible ? 'text' : 'password'} className="pr-12" autoComplete="new-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={busy} /><button type="button" aria-label={visible ? 'Hide passwords' : 'Show passwords'} onClick={() => setVisible(!visible)} className="absolute right-3 top-3">{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></Field><Field><FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel><Input id="confirm-password" type={visible ? 'text' : 'password'} autoComplete="new-password" minLength={8} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required disabled={busy} /></Field></>}
         {error && <p role="alert" className="text-sm text-destructive">{error}</p>}{notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
         <Button type="submit" className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" size={16} />}{step === 'email' ? 'Send reset code' : step === 'code' ? 'Verify code' : 'Update password'}</Button>
         {step === 'code' && <Button type="button" variant="ghost" disabled={busy} onClick={() => { setStep('email'); setCode(''); setError(''); }}>Change email or request a new code</Button>}
      </form>}
   </section></main>;
}
