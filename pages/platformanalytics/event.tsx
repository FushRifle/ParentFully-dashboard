import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib';
import { EventPerson } from '@/components/platformanalytics/event-person';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { eventProperties } from '@/components/platformanalytics/event-fields';

export default function EventDetail() {
   const router = useRouter();
   const { source, period, page, event, chart, environment, index, expected, name } = router.query;
   const query = useQuery({ queryKey: ['provider-event-detail', router.asPath], enabled: router.isReady && ['posthog', 'revenuecat'].includes(String(source)), retry: false, queryFn: async () => {
      const response = await api.get('/v1/admin/analytics/integrations', { params: { source, period, page, per_page: 20, ...(source === 'posthog' ? { event_name: event || undefined } : { chart, environment: environment || undefined, event_type: event || undefined }) } });
      const payload = response.data.data[String(source)];
      const rows = source === 'posthog' ? payload.events : payload.webhook_events;
      const row = rows?.[Number(index)];
      if (!row || String(row.timestamp ?? row.event_at ?? '') !== String(expected ?? '') || String(row.event ?? row.event_type ?? '') !== String(name ?? '')) throw new Error('This event is no longer on the requested page. Return to the event list and select it again.');
      return { ...row, properties: eventProperties(row.properties) };
   } });
   return <div className="admin-page space-y-5"><Link href="/platformanalytics" className="admin-back-link">← Back to Platform Analytics</Link><section className="glass-panel p-6"><p className="section-kicker">Event details · {source}</p>{query.isPending ? <AppLoadingState message="Loading event…" /> : query.isError ? <p role="alert" className="mt-4 text-sm text-destructive">{query.error.message}</p> : <><h1 className="mt-2 text-xl font-semibold">{query.data.event ?? query.data.event_type}</h1><div className="my-5 border-y border-border py-4"><EventPerson event={query.data} /></div><dl className="grid gap-5 sm:grid-cols-2">{Object.entries(query.data).filter(([key]) => key !== 'properties').map(([key, value]) => <div key={key}><dt className="text-xs capitalize text-muted-foreground">{key.replaceAll('_', ' ')}</dt><dd className="mt-1 break-words text-sm">{typeof value === 'object' ? JSON.stringify(value) : String(value ?? '—')}</dd></div>)}</dl><h2 className="mb-3 mt-6 font-semibold">Event properties</h2><pre className="max-h-[450px] overflow-auto rounded-xl border border-border bg-muted/40 p-4 text-xs">{JSON.stringify(query.data.properties ?? {}, null, 2)}</pre></>}</section></div>;
}
