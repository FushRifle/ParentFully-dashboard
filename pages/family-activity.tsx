import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { api } from '@/lib';
import { getSessions, type UserSession } from '@/services/sessionService';
import ChatAvatarWrapper from '@/components/Avatar/ChatAvatarWrapper';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { TableExport } from '@/components/shared/table-export';
import { Button } from '@/components/ui/button';
import { Activity, ArrowLeft, Clock3 } from 'lucide-react';

export default function FamilyActivity() {
   const router = useRouter();
   const id = Number(router.query.familyId);
   const [selected, setSelected] = useState('');
   const [page, setPage] = useState(1);
   useEffect(() => { setSelected(''); setPage(1); }, [id]);
   const familyQuery = useQuery({ queryKey: ['family-activity-family', id], enabled: !!id,
      queryFn: async () => { const res = await api.get(`/v1/admin/families/${id}`); return res.data?.data ?? res.data; } });
   const family = familyQuery.data;
   const people: any[] = Array.from(new Map([family?.owner, ...(family?.members ?? []).filter((m: any) => m.status === 'accepted').map((m: any) => m.user)].filter((u: any) => u?.id).map((u: any) => [String(u.id), u])).values());
   const userId = Number(selected || people[0]?.id);
   const person = people.find((u) => Number(u.id) === userId);
   const history = useInfiniteQuery({ queryKey: ['family-session-history', id], enabled: !!family,
      initialPageParam: 1,
      staleTime: 5 * 60 * 1000,
      queryFn: ({ pageParam, signal }) => getSessions({ page: pageParam, per_page: 100 }, signal),
      getNextPageParam: (result, _pages, current) => current < Number(result.meta?.last_page ?? 1) ? current + 1 : undefined,
   });
   const matches = new Map<number, UserSession>();
   for (const result of history.data?.pages ?? []) {
            for (const session of result.data) {
               const accountId = session.user_id ?? session.user?.id;
               const belongs = accountId != null
                  ? Number(accountId) === userId
                  : !!person?.email && session.user?.email?.trim().toLowerCase() === person.email.trim().toLowerCase();
               if (belongs) matches.set(session.id, session);
            }
   }
   const data = [...matches.values()].sort((a, b) => Date.parse(b.opened_at) - Date.parse(a.opened_at));
   const sessions = { ...history, data: { data, meta: { total: `${data.length}${history.hasNextPage ? '+' : ''}`, last_page: Math.max(1, Math.ceil(data.length / 20)) } } };
   const rows = (sessions.data?.data ?? []).slice((page - 1) * 20, page * 20);
   const failure: any = familyQuery.error || sessions.error;
   return <div className="admin-page space-y-5">
      <Link href={`/families/${id}`} className="admin-back-link"><ArrowLeft size={15} /> Back to family</Link>
      <section className="glass-panel p-5 sm:p-6">
         <div className="flex items-center gap-4"><span className="rounded-2xl bg-primary/10 p-3 text-primary"><Activity size={24} /></span><div><p className="section-kicker">Family journey</p><h1 className="mt-1 text-xl font-semibold">{family?.name ?? 'Family'} activity</h1></div></div>
         <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Explore each member’s app visits, devices and last recorded screens.</p>
      </section>
      <div className="grid items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="glass-panel p-4"><h2 className="mb-3 text-sm font-semibold">Family members <span className="text-muted-foreground">· {people.length}</span></h2><div className="grid gap-2">{people.map((user) => <button type="button" key={user.id} aria-pressed={Number(user.id) === userId} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${Number(user.id) === userId ? 'border-primary/40 bg-primary/10' : 'border-transparent hover:bg-muted/60'}`} onClick={() => { setSelected(String(user.id)); setPage(1); }}><ChatAvatarWrapper photo={user.photo} profile_image={user.profile_image} contactName={user.name} size={38} /><span className="min-w-0"><strong className="block truncate text-sm">{user.name || 'Unnamed member'}</strong><small className="block truncate text-muted-foreground">{user.email || `Account #${user.id}`}</small></span></button>)}</div></aside>
      <div className="min-w-0 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2"><div className="glass-panel p-4"><p className="text-xs text-muted-foreground">Recorded sessions</p><strong className="mt-2 block text-2xl">{sessions.isError ? '—' : sessions.data?.meta?.total ?? '—'}</strong></div><div className="glass-panel p-4"><p className="flex items-center gap-2 text-xs text-muted-foreground"><Clock3 size={14} /> Latest visit on this page</p><strong className="mt-2 block text-sm">{rows[0]?.opened_at ? new Date(rows[0].opened_at).toLocaleString() : 'No visit recorded'}</strong></div></div>
      {familyQuery.isLoading || sessions.isLoading ? <AppLoadingState message="Loading member activity…" /> : familyQuery.isError || sessions.isError ? <div role="alert" className="glass-panel space-y-3 p-6"><h2 className="font-semibold text-destructive">Unable to load this member’s activity</h2><p className="text-sm text-muted-foreground">{failure?.response?.data?.message || failure?.message || 'Please try again.'}</p><Button variant="outline" onClick={() => { if (familyQuery.isError) void familyQuery.refetch(); else void sessions.refetch(); }}>Retry</Button></div> : <section className="glass-panel p-5">
         <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><ChatAvatarWrapper profile_image={person?.profile_image} contactName={person?.name} size={36} /><h2 className="font-semibold">{person?.name ?? 'Member'} sessions</h2></div><TableExport rows={rows} filename={`family-${id}-user-${userId}-sessions`} columns={[{ key: 'opened_at', label: 'Opened' }, { key: 'last_screen', label: 'Last screen' }, { key: 'platform', label: 'Platform' }]} /></div>
         {!rows.length ? <p className="py-12 text-center text-muted-foreground">No recorded sessions for this member.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-3">Opened</th><th className="p-3">Last activity</th><th className="p-3">Last screen</th><th className="p-3">Platform</th><th className="p-3">Duration</th></tr></thead><tbody>{rows.map((s) => <tr key={s.id} className="border-b"><td className="p-3">{new Date(s.opened_at).toLocaleString()}</td><td className="p-3">{s.last_active_at ? new Date(s.last_active_at).toLocaleString() : '—'}</td><td className="p-3">{s.last_screen === '/' ? 'Home Screen' : s.last_screen || '—'}</td><td className="p-3">{s.platform || '—'}</td><td className="p-3">{s.duration_seconds == null ? '—' : `${Math.floor(s.duration_seconds / 60)}m ${s.duration_seconds % 60}s`}</td></tr>)}</tbody></table></div>}
         {(sessions.data?.meta?.last_page ?? 1) > 1 && <nav className="admin-pagination"><button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {sessions.data?.meta.last_page}</span><button disabled={page >= sessions.data!.meta.last_page} onClick={() => setPage(page + 1)}>Next</button></nav>}
      </section>}
      {history.hasNextPage && <Button variant="outline" disabled={history.isFetchingNextPage} onClick={() => { void history.fetchNextPage(); }}>{history.isFetchingNextPage ? 'Loading older sessions…' : 'Load older sessions'}</Button>}
      <p className="text-xs leading-5 text-muted-foreground">Session history records app visits and last screens. It does not include a complete log of routines, chores or goal actions.</p>
      </div></div>
   </div>;
}
