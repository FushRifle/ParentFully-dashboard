import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib';
import { useAuth } from '@/lib/context/authContext';
import { SegmentedTabs } from '@/components/shared/segmented-tabs';
import { usePageSearch } from '@/lib/context/searchContext';
import { Button } from '@/components/ui/button';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { Activity, AlertCircle, RefreshCw, Database, Clock3 } from 'lucide-react';
import { OverviewCard, OverviewCardGrid } from '@/components/shared/overview-card';
import Link from 'next/link';
import { EventPerson } from './event-person';
import { eventProperties } from './event-fields';

type Provider = 'posthog' | 'revenuecat';
type Event = { id?: number; event?: string; event_type?: string; timestamp?: string; event_at?: string; properties?: Record<string, unknown>; product_id?: string; environment?: string };
type Data = { status: string; events?: Event[]; webhook_events?: Event[]; pagination?: { has_more?: boolean; last_page?: number; total?: number }; metrics?: { overview?: unknown; chart?: unknown; overview_status?: string; chart_status?: string; chart_name?: string } };
const charts = ['actives', 'actives_new', 'churn', 'conversion_to_paying', 'customers_new', 'initial_conversion', 'mrr', 'revenue', 'trials', 'trials_new', 'trial_conversion_rate'];
const fieldClass = 'h-9 rounded-xl border border-border bg-background/60 px-3 text-xs font-medium text-foreground disabled:opacity-50';
export function ProviderAnalytics() {
  const { user } = useAuth();
  const [source, setSource] = useState<Provider>('posthog');
  const [period, setPeriod] = useState('30d');
  const [page, setPage] = useState(1);
  const { search } = usePageSearch();
  const [event, setEvent] = useState('');
  const [chart, setChart] = useState('actives');
  const [environment, setEnvironment] = useState('');
  useEffect(() => {
    const timer = window.setTimeout(() => { setPage(1); }, 800);
    return () => window.clearTimeout(timer);
  }, [search]);
  const query = useQuery({
    queryKey: ['admin', user?.id, 'provider-analytics', source, period, page, event, chart, environment],
    enabled: !!user,
    retry: false,
    staleTime: 60_000,
    queryFn: async ({ signal }): Promise<Data> => {
      const params = { source, period, page, per_page: 20, ...(source === 'posthog' ? { event_name: event || undefined } : { chart, event_type: event || undefined, environment: environment || undefined }) };
      const response = await api.get('/v1/admin/analytics/integrations', { params, signal });
      const payload = response.data.data[source];
      if (!payload) throw new Error('Provider response is missing.');
      return { ...payload, events: payload.events?.map((row: any) => ({ ...row, properties: eventProperties(row.properties) })) };
    },
  });
  const data = query.data;
  const rows = source === 'posthog' ? data?.events ?? [] : data?.webhook_events ?? [];
  const hasNext = source === 'posthog' ? data?.pagination?.has_more === true : page < (data?.pagination?.last_page ?? 1);
  const [knownEvents, setKnownEvents] = useState<Record<string, string[]>>({});
  useEffect(() => {
    const names = rows.map(row => row.event ?? row.event_type).filter(Boolean) as string[];
    if (names.length) setKnownEvents(previous => ({ ...previous, [source]: [...new Set([...(previous[source] ?? []), ...names])].sort() }));
  }, [data, source]);
  const visibleRows = rows.map((row, index) => ({ row, index })).filter(({ row }) => !search.trim() || JSON.stringify(row).toLowerCase().includes(search.trim().toLowerCase()));
  const status = ({ not_configured: 'PostHog read credentials are not configured on the backend.', local_events_only: 'RevenueCat metrics are not configured. Stored webhook events remain available.', upstream_unavailable: 'RevenueCat metrics are temporarily unavailable. Stored webhook events are shown below.', unavailable: 'Provider analytics are temporarily unavailable.' } as Record<string, string>)[data?.status ?? ''];
  return <section className="platform-provider space-y-5">
    <div className="glass-panel platform-provider-toolbar"><div className="flex flex-wrap justify-between items-center gap-3"><div><p className="section-kicker">Explore your data</p><h2 className="mt-1 text-base font-semibold">{source === 'posthog' ? 'Behaviour & engagement' : 'Subscriptions & revenue'}</h2></div>
      <SegmentedTabs value={source} onChange={value => { setSource(value as Provider); setPage(1); }} ariaLabel="Analytics provider" tabs={[{ value: 'posthog', label: 'PostHog' }, { value: 'revenuecat', label: 'RevenueCat' }]} />
    </div>
      <form className="mt-4 flex flex-wrap items-center gap-3 border-t border-border/60 pt-4" onSubmit={e => { e.preventDefault(); void query.refetch(); }}>
        <select className={fieldClass} aria-label="Provider period" value={period} onChange={e => { setPeriod(e.target.value); setPage(1); }}>{['7d', '30d', '90d'].map(p => <option key={p} value={p}>{p.slice(0, -1)} days</option>)}</select>
        <select className={fieldClass} aria-label="Event type" value={event} onChange={e => { setEvent(e.target.value); setPage(1); }}><option value="">All events</option>{[...new Set([...(knownEvents[source] ?? []), ...(event ? [event] : [])])].map(name => <option key={name} value={name}>{name}</option>)}</select>
        {source === 'revenuecat' && <><select className={fieldClass} aria-label="RevenueCat chart" value={chart} onChange={e => { setChart(e.target.value); setPage(1); }}>{charts.map(c => <option key={c} value={c}>{c.replaceAll('_', ' ')}</option>)}</select><select className={fieldClass} aria-label="Webhook environment" value={environment} onChange={e => { setEnvironment(e.target.value); setPage(1); }}><option value="">All environments</option><option value="production">Production</option><option value="sandbox">Sandbox</option></select></>}
        <Button variant="outline" size="sm" type="submit" disabled={query.isFetching}><RefreshCw size={14} className={query.isFetching ? 'animate-spin' : ''} />Refresh</Button>
        <span className="ml-auto text-[11px] text-muted-foreground">Search the loaded events using the navbar</span>
      </form></div>

    {/** 
    <OverviewCardGrid columns={3}>
      <OverviewCard label="Records on this page" value={query.isError ? '—' : rows.length} description={source === 'posthog' ? 'Captured product events' : 'Stored billing webhook events'} icon={Activity} color="#f28c18" loading={query.isPending} />
      <OverviewCard label="Reporting window" value={`${period.slice(0, -1)} days`} description="Selected reporting period" icon={Clock3} color="#8b5cf6" />
      <OverviewCard label="Data availability" value={query.isPending ? 'Loading' : query.isError ? 'Unavailable' : status ? 'Limited' : 'Available'} description={source === 'posthog' ? 'Source · PostHog' : 'Source · RevenueCat'} icon={Database} color="#10b981" />
    </OverviewCardGrid>
    */}
    <div className="glass-panel platform-provider-results">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4"><div><h3 className="text-sm font-semibold">{source === 'posthog' ? 'Product event stream' : 'Billing intelligence'}</h3><p className="mt-1 text-xs text-muted-foreground">{source === 'posthog' ? 'Events captured by PostHog' : 'RevenueCat metrics and webhook history'}</p></div><span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium">{source === 'posthog' ? 'PostHog' : 'RevenueCat'}</span></header>
      <div className="space-y-5 p-4 sm:p-5">
        {query.isPending ? <AppLoadingState message={`Loading ${source === 'posthog' ? 'PostHog' : 'RevenueCat'} insights…`} minHeight={120} /> : query.isError ? <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4"><span className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400"><AlertCircle size={18} /></span><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">Insights temporarily unavailable</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{(query.error as any)?.response?.status === 429 ? 'Request limit reached. Please wait a minute before retrying.' : 'We couldn’t retrieve the connected analytics. Check your access or try again shortly.'}</p></div><Button variant="outline" size="sm" onClick={() => void query.refetch()} disabled={query.isFetching}>Try again</Button></div> : <>
          {status && <p role="status" className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-5 text-muted-foreground">{status}</p>}
          {source === 'revenuecat' && <><h3 className="font-semibold">RevenueCat aggregate metrics</h3><div className="grid md:grid-cols-2 gap-3">{(['overview', 'chart'] as const).map(key => <div key={key} className="border rounded-xl p-3 min-w-0"><h4 className="font-medium capitalize">{key === 'chart' ? data?.metrics?.chart_name : key}</h4>{data?.metrics?.[`${key}_status`] === 'available' ? <details><summary className="cursor-pointer text-sm mt-2">View provider data</summary><pre className="overflow-auto max-h-64 text-xs">{JSON.stringify(data.metrics[key], null, 2)}</pre></details> : <p className="text-sm text-gray-500">Metrics unavailable. Check backend provider credentials.</p>}</div>)}</div><h3 className="font-semibold">Stored RevenueCat webhook events</h3></>}
          <div className="overflow-auto"><table className="w-full text-left text-sm"><thead><tr>{['Event', 'Person', 'URL / Screen', 'Library', 'Time'].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{visibleRows.map(({ row, index }) => <tr key={`${row.id ?? index}-${row.timestamp ?? row.event_at}`}><td><Link className="text-primary hover:underline" href={{ pathname: '/platformanalytics/event', query: { source, period, page, event, chart, environment, index, expected: row.timestamp ?? row.event_at ?? '', name: row.event ?? row.event_type ?? '' } }}>{row.event ?? row.event_type ?? 'Unnamed event'}</Link></td><td><EventPerson event={row} /></td><td className="max-w-[220px] break-words">{String(row.properties?.$current_url ?? row.properties?.$screen_name ?? row.properties?.screen_name ?? '—')}</td><td>{String(row.properties?.$lib ?? row.properties?.library ?? '—')}</td><td>{row.timestamp || row.event_at ? new Date((row.timestamp ?? row.event_at)!).toLocaleString() : '—'}</td></tr>)}</tbody></table>{!visibleRows.length && <p className="py-10 text-center text-sm text-muted-foreground">No events match these filters.</p>}</div>
          <nav aria-label="Provider event pages" className="admin-pagination"><button disabled={page === 1 || query.isFetching} onClick={() => setPage(p => p - 1)}>Previous</button><span className="text-xs">Page {page}{source === 'revenuecat' && ` · ${data?.pagination?.total ?? 0} events`}</span><button disabled={!hasNext || query.isFetching} onClick={() => setPage(p => p + 1)}>Next</button></nav>
        </>}
      </div></div>
  </section>;
}
