import React, { useEffect, useState } from 'react';
import { Button, Card, Loading, Switch, Text } from '@nextui-org/react';
import { api } from '../lib';
import { Box } from '../components/styles/box';
import { Flex } from '../components/styles/flex';

type PlatformSettings = {
   maintenance_mode: boolean;
   registrations_open: boolean;
   email_notifications: boolean;
};

const labels: Record<keyof PlatformSettings, { title: string; description: string }> = {
   maintenance_mode: { title: 'Maintenance mode', description: 'Temporarily restrict normal platform access.' },
   registrations_open: { title: 'Open registrations', description: 'Allow new customers to create ParentFully accounts.' },
   email_notifications: { title: 'Email notifications', description: 'Enable platform-generated notification emails.' },
};

export default function SettingsPage() {
   const [settings, setSettings] = useState<PlatformSettings | null>(null);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      api.get<PlatformSettings>('/v1/admin/settings')
         .then((response) => setSettings(response.data))
         .catch((err) => setError(err?.response?.data?.message ?? err?.message ?? 'Unable to load settings.'))
         .finally(() => setLoading(false));
   }, []);

   const save = async () => {
      if (!settings) return;
      setSaving(true);
      setError(null);
      try {
         const response = await api.patch<PlatformSettings>('/v1/admin/settings', settings);
         setSettings(response.data);
      } catch (err: any) {
         setError(err?.response?.data?.message ?? err?.message ?? 'Unable to save settings.');
      } finally {
         setSaving(false);
      }
   };

   return (
      <Box className="admin-page" css={{ maxW: '1000px' }}>
         <Box className="glass-panel glass-hero">
         <Flex justify="between" align="center" css={{ gap: '$4', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Box>
               <Text className="section-kicker">System controls</Text>
               <Text h2 css={{ m: 0, fontSize: '1.35rem' }}>Settings</Text>
               <Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>Platform configuration loaded from ParentFully.</Text>
            </Box>
            <Button auto color="primary" onPress={save} disabled={!settings || saving}>
               {saving ? <Loading size="xs" color="currentColor" /> : 'Save changes'}
            </Button>
         </Flex>
         </Box>

         {error && <Text color="error" size="$sm" css={{ mb: '$5' }}>{error}</Text>}
         <Card>
            <Card.Body css={{ p: '$8' } as any}>
               {loading ? <Loading size="sm">Loading settings…</Loading> : settings && (
                  <Flex direction="column" css={{ gap: '$7' }}>
                     {(Object.keys(settings) as (keyof PlatformSettings)[]).map((key) => (
                        <Flex key={key} justify="between" align="center" css={{ gap: '$8' }}>
                           <Box>
                              <Text b size="$sm">{labels[key].title}</Text>
                              <Text size="$xs" css={{ color: '$accents7', mt: '$1' }}>{labels[key].description}</Text>
                           </Box>
                           <Switch
                              checked={settings[key]}
                              onChange={(event) => setSettings({ ...settings, [key]: event.target.checked })}
                           />
                        </Flex>
                     ))}
                  </Flex>
               )}
            </Card.Body>
         </Card>
      </Box>
   );
}
