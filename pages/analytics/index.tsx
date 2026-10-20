import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Grid, Loading, Table, Text } from '@nextui-org/react';
import { RefreshCw } from 'lucide-react';
import { api } from '../../lib';
import { Box } from '../../components/styles/box';
import { Flex } from '../../components/styles/flex';

type ActivityData = {
   total_sessions: number;
   unique_users: number;
   avg_duration_seconds: number;
   top_platform: string | null;
   daily_app_opens: { date: string; count: number }[];
   top_screens: { screen: string; count: number }[];
   platform_breakdown: { platform: string; count: number; percentage: number }[];
};

type DemographicsData = {
   total_users: number;
   onboarding_rate: number;
   demographics_filled_rate: number;
   country_count: number;
   top_countries: { country: string; count: number }[];
};

const periods = [
   { value: '7d', label: 'Last 7 days' },
   { value: '30d', label: 'Last 30 days' },
   { value: '90d', label: 'Last 90 days' },
   { value: 'all', label: 'All time' },
];

export default function AnalyticsPage() {
   const [period, setPeriod] = useState('30d');
   const [activity, setActivity] = useState<ActivityData | null>(null);
   const [demographics, setDemographics] = useState<DemographicsData | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [sessions, setSessions] = useState<any[]>([]);
   const [platform, setPlatform] = useState('all');

   const load = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
         const [activityResponse, demographicsResponse, sessionsResponse] = await Promise.all([
            api.get('/v1/admin/analytics/activity', { params: { period } }),
            api.get('/v1/admin/analytics/demographics', { params: { period } }),
            api.get('/v1/admin/analytics/sessions', { params: { period, per_page: 100, ...(platform !== 'all' ? { platform } : {}) } }),
         ]);
         setActivity(activityResponse.data.data);
         setDemographics(demographicsResponse.data.data);
         setSessions(sessionsResponse.data.data?.data ?? []);
      } catch (err: any) {
         setError(err?.response?.data?.message ?? err?.message ?? 'Unable to load analytics.');
      } finally {
         setLoading(false);
      }
   }, [period, platform]);

   useEffect(() => { load(); }, [load]);

   const metrics = [
      { label: 'Sessions', value: activity?.total_sessions },
      { label: 'Unique users', value: activity?.unique_users },
      { label: 'Avg. session', value: activity ? `${Math.round(activity.avg_duration_seconds / 60)} min` : undefined },
      { label: 'Onboarding rate', value: demographics ? `${demographics.onboarding_rate}%` : undefined },
      { label: 'Countries', value: demographics?.country_count },
      { label: 'Top platform', value: activity?.top_platform ?? '—' },
   ];

   return (
      <Box className="admin-page">
         <Box className="glass-panel glass-hero">
         <Flex justify="between" align="center" css={{ gap: '$4', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Box>
               <Text className="section-kicker">Insights workspace</Text>
               <Text h2 css={{ m: 0, fontSize: '1.35rem' }}>Analytics</Text>
               <Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>App usage insights from recorded ParentFully sessions.</Text>
            </Box>
            <Flex css={{ gap: '$3' }} align="center">
               <select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Analytics period">
                  {periods.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
               </select>
               <select value={platform} onChange={(event) => setPlatform(event.target.value)} aria-label="Platform"><option value="all">All platforms</option><option value="ios">iOS</option><option value="android">Android</option></select>
               <Button auto flat icon={<RefreshCw size={15} />} onPress={load} disabled={loading}>Refresh</Button>
            </Flex>
         </Flex>
         </Box>

         {error && <Text color="error" size="$sm" css={{ mb: '$5' }}>{error}</Text>}

         <Grid.Container gap={1.25} css={{ p: 0, mb: '$7' }}>
            {metrics.map((metric) => (
               <Grid key={metric.label} xs={12} sm={6} md={4} lg={2}>
                  <Card className="metric-tile" css={{ width: '100%', '--tile-accent': '#635bff' } as any}>
                     <Card.Body css={{ p: '$6' } as any}>
                        <Text size="$xs" css={{ color: '$accents7' }}>{metric.label}</Text>
                        <Text h3 css={{ m: 0, mt: '$2', fontSize: '1.35rem' }}>
                           {loading ? <Loading size="xs" /> : typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value ?? '—'}
                        </Text>
                     </Card.Body>
                  </Card>
               </Grid>
            ))}
         </Grid.Container>

         <Grid.Container gap={1.5} css={{ p: 0 }}>
            <Grid xs={12} md={6}>
               {(activity?.top_screens?.length ?? 0) > 0 ? <Table aria-label="Top screens" bordered shadow={false} css={{ width: '100%' }}>
                  <Table.Header><Table.Column>TOP SCREEN</Table.Column><Table.Column>VIEWS</Table.Column></Table.Header>
                  <Table.Body items={activity?.top_screens ?? []}>
                     {(item) => <Table.Row key={item.screen}><Table.Cell>{item.screen}</Table.Cell><Table.Cell>{item.count.toLocaleString()}</Table.Cell></Table.Row>}
                  </Table.Body>
               </Table> : <Card variant="bordered" css={{ width: '100%', boxShadow: 'none' }}><Card.Body><Text size="$sm" css={{ color: '$accents7' }}>{loading ? 'Loading screen activity…' : 'No screen activity recorded.'}</Text></Card.Body></Card>}
            </Grid>
            <Grid xs={12} md={6}>
               {(demographics?.top_countries?.length ?? 0) > 0 ? <Table aria-label="Top countries" bordered shadow={false} css={{ width: '100%' }}>
                  <Table.Header><Table.Column>TOP COUNTRY</Table.Column><Table.Column>USERS</Table.Column></Table.Header>
                  <Table.Body items={demographics?.top_countries ?? []}>
                     {(item) => <Table.Row key={item.country}><Table.Cell>{item.country}</Table.Cell><Table.Cell>{item.count.toLocaleString()}</Table.Cell></Table.Row>}
                  </Table.Body>
               </Table> : <Card variant="bordered" css={{ width: '100%', boxShadow: 'none' }}><Card.Body><Text size="$sm" css={{ color: '$accents7' }}>{loading ? 'Loading country data…' : 'No country data recorded.'}</Text></Card.Body></Card>}
            </Grid>
         </Grid.Container>

         <Box className="glass-panel" css={{ mt: '$7', p: '$5' }}>
            <Text className="section-kicker">Customer activity</Text>
            <Text h3 css={{ fontSize: '1.05rem', mt: '$1', mb: '$1' }}>Individual sessions</Text>
            <Text size="$xs" css={{ color: '$accents7', mb: '$4' }}>Inspect device, navigation, platform and session duration signals.</Text>
            {sessions.length ? <Table aria-label="Individual app sessions" bordered shadow={false}>
               <Table.Header><Table.Column>USER</Table.Column><Table.Column>PLATFORM</Table.Column><Table.Column>DEVICE</Table.Column><Table.Column>VERSION</Table.Column><Table.Column>LAST SCREEN</Table.Column><Table.Column>DURATION</Table.Column><Table.Column>OPENED</Table.Column></Table.Header>
               <Table.Body items={sessions}>{(session) => <Table.Row key={session.id}><Table.Cell>{session.user_name ?? '—'}<Text size="$xs">{session.user_email ?? '—'}</Text></Table.Cell><Table.Cell>{session.platform ?? '—'}</Table.Cell><Table.Cell>{session.device_model ?? '—'}</Table.Cell><Table.Cell>{session.app_version ?? '—'}</Table.Cell><Table.Cell>{session.last_screen ?? '—'}</Table.Cell><Table.Cell>{session.duration_seconds == null ? '—' : `${Math.floor(session.duration_seconds / 60)}m ${session.duration_seconds % 60}s`}</Table.Cell><Table.Cell>{session.opened_at ? new Date(session.opened_at).toLocaleString() : '—'}</Table.Cell></Table.Row>}</Table.Body>
            </Table> : <Text size="$sm" css={{ color: '$accents7' }}>{loading ? 'Loading sessions…' : 'No sessions recorded.'}</Text>}
         </Box>
      </Box>
   );
}
