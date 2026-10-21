import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Loading, Table, Text } from '@nextui-org/react';
import { Activity, BarChart3, Clock3, Globe2, MonitorSmartphone, RefreshCw, Route, Users } from 'lucide-react';
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

const periods = [{ value: '7d', label: '7 days' }, { value: '30d', label: '30 days' }, { value: '90d', label: '90 days' }, { value: 'all', label: 'All time' }];
const formatDuration = (seconds?: number | null) => {
   if (seconds == null || !Number.isFinite(Number(seconds))) return '—';
   const roundedSeconds = Math.max(0, Math.round(Number(seconds)));
   if (roundedSeconds < 60) return `${roundedSeconds}s`;
   const minutes = Math.floor(roundedSeconds / 60);
   const remainingSeconds = roundedSeconds % 60;
   return remainingSeconds ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
};

export default function AnalyticsPage() {
   const [period, setPeriod] = useState('30d');
   const [platform, setPlatform] = useState('all');
   const [activity, setActivity] = useState<ActivityData | null>(null);
   const [demographics, setDemographics] = useState<DemographicsData | null>(null);
   const [sessions, setSessions] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [showAllSessions, setShowAllSessions] = useState(false);

   const load = useCallback(async () => {
      setLoading(true); setError(null);
      try {
         const [activityResponse, demographicsResponse, sessionsResponse] = await Promise.all([
            api.get('/v1/admin/analytics/activity', { params: { period } }),
            api.get('/v1/admin/analytics/demographics', { params: { period } }),
            api.get('/v1/admin/analytics/sessions', { params: { period, per_page: 100, ...(platform !== 'all' ? { platform } : {}) } }),
         ]);
         setActivity(activityResponse.data.data);
         setDemographics(demographicsResponse.data.data);
         setSessions(sessionsResponse.data.data?.data ?? []);
      } catch (err: any) { setError(err?.response?.data?.message ?? err?.message ?? 'Unable to load analytics.'); }
      finally { setLoading(false); }
   }, [period, platform]);

   useEffect(() => { load(); }, [load]);
   useEffect(() => { setShowAllSessions(false); }, [period, platform]);

   const maxDailyOpens = Math.max(...(activity?.daily_app_opens ?? []).map((item) => item.count), 1);
   const maxScreenViews = Math.max(...(activity?.top_screens ?? []).map((item) => item.count), 1);
   const maxCountryUsers = Math.max(...(demographics?.top_countries ?? []).map((item) => item.count), 1);
   const visibleSessions = showAllSessions ? sessions : sessions.slice(0, 10);
   const metrics = useMemo(() => [
      { label: 'Total sessions', value: activity?.total_sessions, detail: 'Recorded app visits', icon: Activity, color: '#8b83ff' },
      { label: 'Unique users', value: activity?.unique_users, detail: 'People using the app', icon: Users, color: '#10b981' },
      { label: 'Average session', value: formatDuration(activity?.avg_duration_seconds), detail: 'Time spent per visit', icon: Clock3, color: '#f97316' },
      { label: 'Onboarding', value: demographics ? `${demographics.onboarding_rate}%` : undefined, detail: 'Completion rate', icon: Route, color: '#3b82f6' },
      { label: 'Countries', value: demographics?.country_count, detail: 'Customer locations', icon: Globe2, color: '#ec4899' },
      { label: 'Top platform', value: activity?.top_platform ?? '—', detail: 'Most-used platform', icon: MonitorSmartphone, color: '#14b8a6' },
   ], [activity, demographics]);

   return <Box className="admin-page analytics-page">
      <Box className="glass-panel glass-hero"><Flex justify="between" align="center" css={{ gap: '$5', flexWrap: 'wrap' }}>
         <Flex align="center" css={{ gap: '$4' }}><span className="analytics-hero-icon"><BarChart3 size={20}/></span><Box><Text className="section-kicker">Product intelligence</Text><Text h2 css={{ m: 0, mt: '$1', fontSize: '1.4rem' }}>Analytics</Text><Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>Understand app usage, engagement and customer behaviour.</Text></Box></Flex>
         <Flex align="center" css={{ gap: '$3', flexWrap: 'wrap' }}><div className="analytics-periods">{periods.map((item) => <button key={item.value} className={period === item.value ? 'active' : ''} onClick={() => setPeriod(item.value)} type="button">{item.label}</button>)}</div><select value={platform} onChange={(event) => setPlatform(event.target.value)} aria-label="Platform"><option value="all">All platforms</option><option value="ios">iOS</option><option value="android">Android</option></select><Button auto flat icon={<RefreshCw size={15}/>} onPress={load} disabled={loading}>Refresh</Button></Flex>
      </Flex></Box>

      {error && <div className="analytics-error">{error}</div>}
      <div className="analytics-metrics">{metrics.map((metric) => { const Icon = metric.icon; return <div className="analytics-metric glass-panel" key={metric.label}><span style={{ color: metric.color, background: `${metric.color}17` }}><Icon size={17}/></span><div><p>{metric.label}</p><strong>{loading ? '—' : typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value ?? '—'}</strong><small>{metric.detail}</small></div></div>; })}</div>

      <div className="analytics-primary-grid">
         <section className="analytics-panel analytics-trend glass-panel"><PanelTitle icon={<Activity size={17}/>} title="App opens" subtitle={`Daily activity · ${periods.find((item) => item.value === period)?.label}`} />
            {loading ? <PanelLoading/> : activity?.daily_app_opens?.length ? <div className="analytics-chart" aria-label="Daily app opens chart">{activity.daily_app_opens.map((item) => <div className="analytics-bar-column" key={item.date} title={`${new Date(item.date).toLocaleDateString()}: ${item.count} opens`}><span>{item.count}</span><i style={{ height: `${Math.max((item.count / maxDailyOpens) * 100, 4)}%` }}/><small>{new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</small></div>)}</div> : <Empty text="No app-open activity recorded for this period."/>}
         </section>
         <section className="analytics-panel glass-panel"><PanelTitle icon={<MonitorSmartphone size={17}/>} title="Platform mix" subtitle="Sessions by operating system" />
            {loading ? <PanelLoading/> : activity?.platform_breakdown?.length ? <div className="analytics-breakdown">{activity.platform_breakdown.map((item) => <div key={item.platform}><div><strong>{item.platform || 'Unknown'}</strong><span>{item.count.toLocaleString()} · {item.percentage}%</span></div><i><b style={{ width: `${item.percentage}%` }}/></i></div>)}</div> : <Empty text="No platform data recorded."/>}
         </section>
      </div>

      <div className="analytics-secondary-grid">
         <section className="analytics-panel glass-panel"><PanelTitle icon={<Route size={17}/>} title="Top screens" subtitle="Most visited areas" />{loading ? <PanelLoading/> : activity?.top_screens?.length ? <RankedList items={activity.top_screens.map((item) => ({ label: item.screen || 'Unknown screen', value: item.count }))} maximum={maxScreenViews} suffix="views"/> : <Empty text="No screen activity recorded."/>}</section>
         <section className="analytics-panel glass-panel"><PanelTitle icon={<Globe2 size={17}/>} title="Top countries" subtitle={`${demographics?.demographics_filled_rate ?? 0}% demographic coverage`} />{loading ? <PanelLoading/> : demographics?.top_countries?.length ? <RankedList items={demographics.top_countries.map((item) => ({ label: item.country || 'Unknown', value: item.count }))} maximum={maxCountryUsers} suffix="users"/> : <Empty text="No country data recorded."/>}</section>
      </div>

      <section className="analytics-panel analytics-sessions glass-panel"><div className="analytics-session-header"><PanelTitle icon={<Clock3 size={17}/>} title="Individual sessions" subtitle={`${sessions.length.toLocaleString()} sessions in the current result`} /><select value={platform} onChange={(event) => setPlatform(event.target.value)} aria-label="Filter sessions by platform"><option value="all">All platforms</option><option value="ios">iOS only</option><option value="android">Android only</option></select></div>
         {loading ? <PanelLoading/> : visibleSessions.length ? <><div className="analytics-table-wrap"><Table aria-label="Individual app sessions" shadow={false}><Table.Header><Table.Column>USER</Table.Column><Table.Column>PLATFORM</Table.Column><Table.Column>DEVICE</Table.Column><Table.Column>VERSION</Table.Column><Table.Column>LAST SCREEN</Table.Column><Table.Column>DURATION</Table.Column><Table.Column>OPENED</Table.Column></Table.Header><Table.Body items={visibleSessions}>{(session) => <Table.Row key={session.id}><Table.Cell><Text b size="$sm">{session.user_name ?? 'Unknown'}</Text><Text size="$xs" css={{ color: '$accents7' }}>{session.user_email ?? '—'}</Text></Table.Cell><Table.Cell><span className="analytics-platform-pill">{session.platform ?? '—'}</span></Table.Cell><Table.Cell>{session.device_model ?? '—'}</Table.Cell><Table.Cell>{session.app_version ?? '—'}</Table.Cell><Table.Cell>{session.last_screen ?? '—'}</Table.Cell><Table.Cell>{formatDuration(session.duration_seconds)}</Table.Cell><Table.Cell>{session.opened_at ? new Date(session.opened_at).toLocaleString() : '—'}</Table.Cell></Table.Row>}</Table.Body></Table></div>{sessions.length > 10 && <button className="analytics-see-more" type="button" onClick={() => setShowAllSessions((value) => !value)}>{showAllSessions ? 'Show fewer sessions' : `See all ${sessions.length} sessions`}</button>}</> : <Empty text="No sessions recorded for these filters."/>}
      </section>
   </Box>;
}

const PanelTitle = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => <header className="analytics-panel-title"><span>{icon}</span><div><h3>{title}</h3><p>{subtitle}</p></div></header>;
const PanelLoading = () => <div className="analytics-loading"><Loading size="sm"/></div>;
const Empty = ({ text }: { text: string }) => <div className="analytics-empty"><BarChart3 size={20}/><p>{text}</p></div>;
const RankedList = ({ items, maximum, suffix }: { items: { label: string; value: number }[]; maximum: number; suffix: string }) => <div className="analytics-ranked-list">{items.slice(0, 8).map((item, index) => <div key={`${item.label}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><section><div><strong>{item.label}</strong><small>{item.value.toLocaleString()} {suffix}</small></div><i><b style={{ width: `${Math.max((item.value / maximum) * 100, 4)}%` }}/></i></section></div>)}</div>;
