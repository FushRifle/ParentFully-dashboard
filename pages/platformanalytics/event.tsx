import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib';
import { EventPerson } from '@/components/platformanalytics/event-person';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { eventProperties, formatEventName } from '@/components/platformanalytics/event-fields';
import { Activity, ArrowLeft, Clock3, MonitorSmartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
   const row = query.data;
   const props = row?.properties ?? {};
   const date = row?.timestamp ?? row?.event_at;
   const timestamp = date && !Number.isNaN(Date.parse(date)) ? new Date(date).toLocaleString() : 'Not recorded';
   const context = [
      ['Screen', props.$screen_name ?? props.screen_name], ['URL', props.$current_url],
      ['App', props.$app_name], ['App version', props.$app_version], ['Build', props.$app_build],
      ['Device', props.$device_name ?? props.$model], ['Manufacturer', props.$device_manufacturer],
      ['Operating system', props.$os_name ?? props.$os], ['OS version', props.$os_version],
      ['Library', props.$lib ?? props.library], ['Library version', props.$lib_version],
   ];
   return <div className="admin-page space-y-5">
      <Link href="/platformanalytics" className="admin-back-link"><ArrowLeft size={15} /> Back to Platform Analytics</Link>
      {query.isPending ? <AppLoadingState message="Loading event details…" /> : query.isError ? <section role="alert" className="glass-panel space-y-3 p-6"><h1 className="font-semibold">Event unavailable</h1><p className="text-sm text-muted-foreground">{query.error.message}</p><Button variant="outline" onClick={() => void query.refetch()}>Try again</Button></section> : <>
         <header className="glass-panel p-5 sm:p-6"><div className="flex items-start gap-4"><span className="rounded-xl bg-primary/10 p-3 text-primary"><Activity size={22} /></span><div className="min-w-0"><p className="section-kicker">{source === 'posthog' ? 'PostHog' : 'RevenueCat'} · Event details</p><h1 className="mt-2 break-words text-xl font-semibold">{formatEventName(row.event ?? row.event_type)}</h1><p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Clock3 size={14} />{timestamp}</p></div></div></header>
         <div className="grid items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="glass-panel space-y-5 p-5"><div><h2 className="mb-4 text-sm font-semibold">Person</h2><EventPerson event={row} /></div><div className="border-t border-border pt-4"><p className="text-xs text-muted-foreground">Original event name</p><code className="mt-2 block break-all text-xs">{row.event ?? row.event_type}</code></div>{row.id && <div><p className="text-xs text-muted-foreground">Event ID</p><p className="mt-1 break-all text-xs">{row.id}</p></div>}</aside>
            <div className="min-w-0 space-y-5"><section className="glass-panel p-5"><h2 className="mb-5 flex items-center gap-2 text-sm font-semibold"><MonitorSmartphone size={16} className="text-primary" /> App & device context</h2><dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">{context.map(([key, value]) => <div key={key} className="min-w-0 border-b border-border/50 pb-3"><dt className="text-[11px] text-muted-foreground">{key}</dt><dd className="mt-1 break-words text-sm font-medium">{value == null || value === '' ? 'Not recorded' : String(value)}</dd></div>)}</dl></section>
            <section className="glass-panel overflow-hidden"><header className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="text-sm font-semibold">Event properties</h2><span className="text-xs text-muted-foreground">{Object.keys(props).length} fields</span></header>{Object.keys(props).length ? <dl className="divide-y divide-border/60">{Object.entries(props).map(([key, value]) => <div key={key} className="grid gap-2 px-5 py-3.5 hover:bg-muted/30 sm:grid-cols-[minmax(140px,0.7fr)_minmax(0,1fr)]"><dt className="break-words text-xs text-muted-foreground">{formatEventName(key)}</dt><dd className="min-w-0 break-words text-xs font-medium">{typeof value === 'object' && value !== null ? <details><summary className="cursor-pointer text-primary">View structured value</summary><pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-muted/40 p-3 text-[11px]">{JSON.stringify(value, null, 2)}</pre></details> : value == null ? '—' : typeof value === 'boolean' ? value ? 'Yes' : 'No' : String(value)}</dd></div>)}</dl> : <p className="px-5 py-10 text-center text-sm text-muted-foreground">No properties were returned for this event.</p>}</section></div>
         </div>
      </>}
   </div>;
}
