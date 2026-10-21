import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Loading, Text } from '@nextui-org/react';
import { CheckCircle2, Clock3, Inbox, MessageSquareText, RefreshCw, Search, Tag, UserRound } from 'lucide-react';
import { api } from '../lib';
import { Box } from '../components/styles/box';
import { Flex } from '../components/styles/flex';

const statusOptions = ['new', 'reviewed', 'resolved'];
const initials = (name?: string) => (name || 'Unknown').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();

export default function FeedbackPage() {
   const [rows, setRows] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [updatingId, setUpdatingId] = useState<number | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [query, setQuery] = useState('');
   const [category, setCategory] = useState('');
   const [status, setStatus] = useState('');
   const visibleRows = useMemo(() => {
      const search = query.trim().toLowerCase();
      const categoryQuery = category.trim().toLowerCase();
      return rows.filter((item) => {
         const searchableText = [item.subject, item.message, item.category, item.user?.name, item.user?.email]
            .filter(Boolean).join(' ').toLowerCase();
         const matchesSearch = !search || searchableText.includes(search);
         const matchesCategory = !categoryQuery || String(item.category ?? '').toLowerCase().includes(categoryQuery);
         const matchesStatus = !status || item.status === status;
         return matchesSearch && matchesCategory && matchesStatus;
      });
   }, [category, query, rows, status]);

   const load = useCallback(async () => {
      setLoading(true); setError(null);
      try {
         const { data } = await api.get('/v1/admin/feedback', { params: { per_page: 100, ...(query ? { search: query } : {}), ...(category ? { category } : {}), ...(status ? { status } : {}) } });
         setRows(Array.isArray(data?.data) ? data.data : Array.isArray(data?.data?.data) ? data.data.data : []);
      } catch (err: any) { setError(err?.response?.data?.message ?? 'Unable to load feedback.'); }
      finally { setLoading(false); }
   }, [query, category, status]);

   useEffect(() => { const timer = setTimeout(load, query ? 300 : 0); return () => clearTimeout(timer); }, [load, query]);

   const update = async (row: any, value: string) => {
      setUpdatingId(row.id); setError(null);
      try {
         await api.patch(`/v1/admin/feedback/${row.id}`, { status: value });
         setRows((current) => current.map((item) => item.id === row.id ? { ...item, status: value } : item));
      } catch (err: any) { setError(err?.response?.data?.message ?? 'Unable to update feedback.'); }
      finally { setUpdatingId(null); }
   };

   const counts = useMemo(() => ({
      total: visibleRows.length,
      new: visibleRows.filter((item) => item.status === 'new').length,
      reviewed: visibleRows.filter((item) => item.status === 'reviewed').length,
      resolved: visibleRows.filter((item) => item.status === 'resolved').length,
   }), [visibleRows]);

   return <Box className="admin-page feedback-page">
      <Box className="glass-panel glass-hero"><Flex justify="between" align="center" css={{ gap: '$5', flexWrap: 'wrap' }}>
         <Flex align="center" css={{ gap: '$4' }}><span className="feedback-hero-icon"><MessageSquareText size={20}/></span><Box><Text className="section-kicker">Customer voice</Text><Text h2 css={{ m: 0, mt: '$1', fontSize: '1.4rem' }}>Feedback</Text><Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>Review customer submissions and move them through your response workflow.</Text></Box></Flex>
         <Button auto flat icon={<RefreshCw size={15}/>} onPress={load} disabled={loading}>Refresh feedback</Button>
      </Flex></Box>

      {error && <div className="feedback-error">{error}</div>}

      <div className="feedback-metrics">
         <SummaryCard label="All feedback" value={counts.total} icon={<Inbox size={17}/>} color="#8b83ff" />
         <SummaryCard label="New" value={counts.new} icon={<Clock3 size={17}/>} color="#f97316" />
         <SummaryCard label="Reviewed" value={counts.reviewed} icon={<MessageSquareText size={17}/>} color="#3b82f6" />
         <SummaryCard label="Resolved" value={counts.resolved} icon={<CheckCircle2 size={17}/>} color="#10b981" />
      </div>

      <Box className="glass-panel feedback-toolbar"><Box><Text b size="$sm">Feedback queue</Text><Text size="$xs" css={{ color: '$accents7', mt: '$1' }}>{loading ? 'Refreshing submissions…' : `${rows.length} submissions match the current filters`}</Text></Box><Flex css={{ gap: '$3', flexWrap: 'wrap' }}>
         <Input bordered clearable aria-label="Search feedback" placeholder="Search feedback…" contentLeft={<Search size={15}/>} value={query} onChange={(event) => setQuery(event.target.value)} />
         <div className="feedback-input-wrap"><Tag size={14}/><input className="feedback-category-input" aria-label="Filter by category" placeholder="Category" value={category} onChange={(event) => setCategory(event.target.value)} /></div>
         <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status"><option value="">All statuses</option>{statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      </Flex></Box>

      {loading ? <Box className="glass-panel feedback-loading"><Loading size="sm">Loading feedback…</Loading></Box> : visibleRows.length ? <div className="feedback-grid">{visibleRows.map((item) => <article className="feedback-card glass-panel" key={item.id}>
         <header><div className="feedback-avatar">{initials(item.user?.name)}</div><div className="feedback-author"><strong>{item.user?.name ?? 'Unknown customer'}</strong><span>{item.user?.email ?? 'Email unavailable'}</span></div><span className={`feedback-status status-${item.status || 'new'}`}>{item.status || 'new'}</span></header>
         <div className="feedback-card-content"><div className="feedback-card-meta"><span><Tag size={12}/>{item.category || 'General'}</span><time>{item.created_at ? new Date(item.created_at).toLocaleDateString([], { dateStyle: 'medium' }) : 'Date unavailable'}</time></div><h3>{item.subject || 'Customer feedback'}</h3><p>{item.message || 'No message was supplied.'}</p></div>
         <footer><span><UserRound size={13}/> Submission #{item.id}</span><label>Status<select value={item.status || 'new'} disabled={updatingId === item.id} onChange={(event) => update(item, event.target.value)}>{statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label></footer>
      </article>)}</div> : <Box className="glass-panel feedback-empty"><Inbox size={24}/><Text b>No feedback found</Text><Text size="$sm" css={{ color: '$accents7' }}>Try clearing or changing the current filters.</Text></Box>}
   </Box>;
}

const SummaryCard = ({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) => <div className="feedback-summary glass-panel"><span style={{ color, background: `${color}17` }}>{icon}</span><div><p>{label}</p><strong>{value.toLocaleString()}</strong></div></div>;
