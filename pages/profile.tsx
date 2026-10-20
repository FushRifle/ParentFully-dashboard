import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Text } from '@nextui-org/react';
import { KeyRound, UserRound } from 'lucide-react';
import { api } from '../lib';
import { useAuth } from '../lib/context/authContext';
import { Box } from '../components/styles/box';
import { Flex } from '../components/styles/flex';

export default function ProfilePage() {
   const { user, updateUser } = useAuth();
   const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [saving, setSaving] = useState(false);
   const [currentPassword, setCurrentPassword] = useState(''); const [password, setPassword] = useState(''); const [confirmation, setConfirmation] = useState('');
   const [message, setMessage] = useState(''); const [error, setError] = useState('');
   useEffect(() => { setName(user?.name ?? user?.user?.name ?? ''); setEmail(user?.email ?? user?.user?.email ?? ''); }, [user]);

   const saveProfile = async () => {
      setSaving(true); setError(''); setMessage('');
      try {
         const { data } = await api.put('/v1/admin/me', { name, email });
         if (user) updateUser({ ...user, name: data.name, email: data.email, user: { ...user.user, name: data.name, email: data.email } });
         setMessage('Profile updated.');
      } catch (err: any) { setError(err?.response?.data?.message ?? 'Profile update failed.'); }
      finally { setSaving(false); }
   };
   const changePassword = async () => {
      setSaving(true); setError(''); setMessage('');
      try {
         await api.put('/v1/admin/me/password', { current_password: currentPassword, password, password_confirmation: confirmation });
         setCurrentPassword(''); setPassword(''); setConfirmation(''); setMessage('Password changed.');
      } catch (err: any) { setError(err?.response?.data?.message ?? Object.values(err?.response?.data?.errors ?? {}).flat().join(' ') ?? 'Password change failed.'); }
      finally { setSaving(false); }
   };

   return <Box className="admin-page" css={{ maxW: '1100px' }}>
      <Box className="glass-panel glass-hero"><Flex align="center" css={{ gap: '$4', position: 'relative', zIndex: 1 }}><Box css={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', color: '#8b83ff', bg: 'rgba(99,91,255,.12)', border: '1px solid rgba(139,131,255,.25)' }}><UserRound size={20}/></Box><Box><Text className="section-kicker">Admin account</Text><Text h2 css={{ m: 0, mt: '$1', fontSize: '1.35rem' }}>Profile & security</Text><Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>Manage your identity and login credentials.</Text></Box></Flex></Box>
      {message && <Text color="success" size="$sm" css={{ mb: '$4' }}>{message}</Text>}{error && <Text color="error" size="$sm" css={{ mb: '$4' }}>{error}</Text>}
      <div className="content-grid">
         <Card css={{ gridColumn: 'span 6' }}><Card.Header css={{ gap: '$3' }}><UserRound size={17} color="#3b82f6"/><Box><Text b>Account details</Text><Text size="$xs" css={{ color: '$accents7' }}>Your dashboard identity</Text></Box></Card.Header><Card.Body css={{ gap: '$5' } as any}><Input bordered fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} /><Input bordered fullWidth type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><Button auto color="primary" onPress={saveProfile} disabled={saving}>Save profile</Button></Card.Body></Card>
         <Card css={{ gridColumn: 'span 6' }}><Card.Header css={{ gap: '$3' }}><KeyRound size={17} color="#f97316"/><Box><Text b>Change password</Text><Text size="$xs" css={{ color: '$accents7' }}>Keep your admin access protected</Text></Box></Card.Header><Card.Body css={{ gap: '$5' } as any}><Input bordered fullWidth type="password" label="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /><Input bordered fullWidth type="password" label="New password" value={password} onChange={(e) => setPassword(e.target.value)} /><Input bordered fullWidth type="password" label="Confirm new password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} /><Button auto color="primary" onPress={changePassword} disabled={saving || !currentPassword || !password || password !== confirmation}>Change password</Button></Card.Body></Card>
      </div>
   </Box>;
}
