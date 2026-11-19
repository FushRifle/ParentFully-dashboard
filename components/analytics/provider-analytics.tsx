import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib';
import { useAuth } from '@/lib/context/authContext';
import { SegmentedTabs } from '@/components/shared/segmented-tabs';

type Provider = 'posthog' | 'revenuecat';
type Event = { id?: number; event?: string; event_type?: string; timestamp?: string; event_at?: string; properties?: Record<string, unknown>; product_id?: string; environment?: string };
type Data = { status: string; events?: Event[]; webhook_events?: Event[]; pagination?: { has_more?: boolean; last_page?: number; total?: number }; metrics?: { overview?: unknown; chart?: unknown; overview_status?: string; chart_status?: string; chart_name?: string } };
const charts = ['actives', 'actives_new', 'churn', 'conversion_to_paying', 'customers_new', 'initial_conversion', 'mrr', 'revenue', 'trials', 'trials_new', 'trial_conversion_rate'];
const fieldClass = 'rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm';
export function ProviderAnalytics() {
  const { user } = useAuth();
  const [source, setSource] = useState<Provider>('posthog');
  const [period, setPeriod] = useState('30d');
  const [page, setPage] = useState(1);
  const [eventDraft, setEventDraft] = useState('');
  const [event, setEvent] = useState('');
  const [chart, setChart] = useState('actives');
  const [environment, setEnvironment] = useState('');
  const query = useQuery({
    queryKey: ['admin', user?.id, 'provider-analytics', source, period, page, event, chart, environment],
    enabled: !!user,
    retry: false,
    staleTime: 60_000,
    queryFn: async ({ signal }): Promise<Data> => {
      const params = { source, period, page, per_page: 20, ...(source === 'posthog' ? { event_name: event || undefined } : { chart, event_type: event || undefined, environment: environment || undefined }) };
      const response = await api.get('/v1/admin/analytics/integrations', { params, signal });
      return response.data.data[source];
    },
  });
  const data = query.data;
  const rows = source === 'posthog' ? data?.events ?? [] : data?.webhook_events ?? [];
  const hasNext = source === 'posthog' ? data?.pagination?.has_more === true : page < (data?.pagination?.last_page ?? 1);
  const status = ({ not_configured: 'PostHog read credentials are not configured on the backend.', local_events_only: 'RevenueCat metrics are not configured. Stored webhook events remain available.', upstream_unavailable: 'RevenueCat metrics are temporarily unavailable. Stored webhook events are shown below.', unavailable: 'Provider analytics are temporarily unavailable.' } as Record<string, string>)[data?.status ?? ''];
  return <section className="glass-panel p-5 space-y-4">
    <div className="flex flex-wrap justify-between items-center gap-3"><div><h2 className="text-lg font-semibold">Provider analytics</h2><p className="text-sm text-gray-500">Product activity and billing metrics are separate from subscription access.</p></div>
      <SegmentedTabs value={source} onChange={value => { setSource(value as Provider); setPage(1); setEvent(''); setEventDraft(''); }} ariaLabel="Analytics provider" tabs={[{ value: 'posthog', label: 'PostHog' }, { value: 'revenuecat', label: 'RevenueCat' }]} />
    </div>
    <form className="flex flex-wrap gap-3" onSubmit={e => { e.preventDefault(); setPage(1); if (event === eventDraft.trim() && page === 1) void query.refetch(); else setEvent(eventDraft.trim()); }}>
      <select className={fieldClass} aria-label="Provider period" value={period} onChange={e => { setPeriod(e.target.value); setPage(1); }}>{['7d', '30d', '90d'].map(p => <option key={p} value={p}>{p.slice(0, -1)} days</option>)}</select>
      <input className={fieldClass} aria-label="Provider event filter" placeholder={source === 'posthog' ? 'Exact event name' : 'Webhook event type'} value={eventDraft} onChange={e => setEventDraft(e.target.value)} />
      {source === 'revenuecat' && <><select className={fieldClass} aria-label="RevenueCat chart" value={chart} onChange={e => { setChart(e.target.value); setPage(1); }}>{charts.map(c => <option key={c} value={c}>{c.replaceAll('_', ' ')}</option>)}</select><select className={fieldClass} aria-label="Webhook environment" value={environment} onChange={e => { setEnvironment(e.target.value); setPage(1); }}><option value="">All environments</option><option value="production">Production</option><option value="sandbox">Sandbox</option></select></>}
      <button className={fieldClass} type="submit" disabled={query.isFetching}>Apply / Refresh</button>
    </form>
    {query.isPending ? <p role="status">Loading {source}…</p> : query.isError ? <p role="alert">Could not load analytics. Check access or retry; requests are limited to ten per minute.</p> : <>
      {status && <p role="status" className="rounded-xl bg-amber-100/50 p-3 text-sm">{status}</p>}
      {source === 'revenuecat' && <><h3 className="font-semibold">RevenueCat aggregate metrics</h3><div className="grid md:grid-cols-2 gap-3">{(['overview', 'chart'] as const).map(key => <div key={key} className="border rounded-xl p-3 min-w-0"><h4 className="font-medium capitalize">{key === 'chart' ? data?.metrics?.chart_name : key}</h4>{data?.metrics?.[`${key}_status`] === 'available' ? <details><summary className="cursor-pointer text-sm mt-2">View provider data</summary><pre className="overflow-auto max-h-64 text-xs">{JSON.stringify(data.metrics[key], null, 2)}</pre></details> : <p className="text-sm text-gray-500">Metrics unavailable. Check backend provider credentials.</p>}</div>)}</div><h3 className="font-semibold">Stored RevenueCat webhook events</h3></>}
      <div className="overflow-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-2">Event</th><th className="p-2">Time</th><th className="p-2">{source === 'posthog' ? 'Properties' : 'Product / environment'}</th></tr></thead><tbody>{rows.map((row, i) => <tr key={row.id ?? i} className="border-t"><td className="p-2 font-medium">{row.event ?? row.event_type}</td><td className="p-2 whitespace-nowrap">{row.timestamp ?? row.event_at}</td><td className="p-2">{source === 'posthog' ? <details><summary>Properties</summary><pre className="text-xs max-w-sm overflow-auto">{JSON.stringify(row.properties, null, 2)}</pre></details> : `${row.product_id ?? '—'} · ${row.environment ?? '—'}`}</td></tr>)}</tbody></table>{!rows.length && <p className="py-5 text-center text-gray-500">No events for these filters.</p>}</div>
      <div className="flex justify-between items-center"><button className={fieldClass} disabled={page === 1 || query.isFetching} onClick={() => setPage(p => p - 1)}>Previous</button><span className="text-sm">Page {page}{source === 'revenuecat' && ` · ${data?.pagination?.total ?? 0} events`}</span><button className={fieldClass} disabled={!hasNext || query.isFetching} onClick={() => setPage(p => p + 1)}>Next</button></div>
    </>}
  </section>;
}
