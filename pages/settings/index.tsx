import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Loading, Switch, Text } from '@nextui-org/react';
import { api } from '@/lib';
import { Box } from '@/components/styles/box';
import { Flex } from '@/components/styles/flex';
import { AppLoadingState } from '@/components/shared/app-loading-state';

type PlatformSettings = {
   maintenance_mode: boolean;
   registrations_open: boolean;
   email_notifications: boolean;
};

type FreePlanPolicy = {
   limits: {
      children: number;
      routines_per_child: number;
      tasks_per_routine: number;
   };
   enforcement_status: string;
   scopes: Record<string, string>;
};

const policyLabels: Record<keyof FreePlanPolicy['limits'], { title: string; description: string }> = {
   children: { title: 'Children per family', description: 'Maximum active children available to a free family.' },
   routines_per_child: { title: 'Routines per child', description: 'Maximum routines a free account can assign to each child.' },
   tasks_per_routine: { title: 'Tasks per routine', description: 'Maximum tasks allowed inside each free routine.' },
};

const labels: Record<keyof PlatformSettings, { title: string; description: string }> = {
   maintenance_mode: { title: 'Maintenance mode', description: 'Temporarily restrict normal platform access.' },
   registrations_open: { title: 'Open registrations', description: 'Allow new customers to create ParentFully accounts.' },
   email_notifications: { title: 'Email notifications', description: 'Enable platform-generated notification emails.' },
};

export default function SettingsPage() {
   const [settings, setSettings] = useState<PlatformSettings | null>(null);
   const [policy, setPolicy] = useState<FreePlanPolicy | null>(null);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      Promise.all([
         api.get<PlatformSettings>('/v1/admin/settings'),
         api.get<{ success: boolean; data: FreePlanPolicy }>('/v2/admin/free-plan-policy'),
      ])
         .then(([settingsResponse, policyResponse]) => {
            setSettings(settingsResponse.data);
            setPolicy(policyResponse.data.data);
         })
         .catch((err) => setError(err?.response?.data?.message ?? err?.message ?? 'Unable to load settings.'))
         .finally(() => setLoading(false));
   }, []);

   const save = async () => {
      if (!settings || !policy) return;
      setSaving(true);
      setError(null);
      try {
         const [settingsResponse, policyResponse] = await Promise.all([
            api.patch<PlatformSettings>('/v1/admin/settings', settings),
            api.patch<{ success: boolean; data: FreePlanPolicy }>('/v2/admin/free-plan-policy', { limits: policy.limits }),
         ]);
         setSettings(settingsResponse.data);
         setPolicy(policyResponse.data.data);
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
            <Button auto color="primary" onPress={save} disabled={!settings || !policy || saving}>
               {saving ? <Loading size="xs" color="currentColor" /> : 'Save changes'}
            </Button>
         </Flex>
         </Box>

         {error && <Text color="error" size="$sm" css={{ mb: '$5' }}>{error}</Text>}
         <Card>
            <Card.Body css={{ p: '$8' } as any}>
               {loading ? <AppLoadingState message="Loading settings…" /> : settings && (
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

         <Card css={{ mt: '$6' }}>
            <Card.Body css={{ p: '$8' } as any}>
               <Flex justify="between" align="start" css={{ gap: '$5', mb: '$6', flexWrap: 'wrap' }}>
                  <Box>
                     <Text b>Free-plan limits</Text>
                     <Text size="$xs" css={{ color: '$accents7', mt: '$1' }}>
                        These limits are enforced by the backend immediately for new assignments.
                     </Text>
                  </Box>
                  {policy && <Text size="$xs" css={{ color: '$success' }}>Enforcement: {policy.enforcement_status}</Text>}
               </Flex>
               {loading ? <AppLoadingState message="Loading policy…" /> : policy && (
                  <Flex css={{ gap: '$5', flexWrap: 'wrap' }}>
                     {(Object.keys(policy.limits) as (keyof FreePlanPolicy['limits'])[]).map((key) => (
                        <Box key={key} css={{ flex: '1 1 220px' }}>
                           <Input
                              fullWidth
                              type="number"
                              min={1}
                              label={policyLabels[key].title}
                              value={String(policy.limits[key])}
                              onChange={(event) => setPolicy({
                                 ...policy,
                                 limits: { ...policy.limits, [key]: Math.max(1, Number(event.target.value) || 1) },
                              })}
                           />
                           <Text size="$xs" css={{ color: '$accents7', mt: '$2' }}>{policyLabels[key].description}</Text>
                        </Box>
                     ))}
                  </Flex>
               )}
            </Card.Body>
         </Card>
      </Box>
   );
}
