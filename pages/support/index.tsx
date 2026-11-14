import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, Loading, Pagination, Text, Textarea } from '@nextui-org/react';
import { Headphones, Inbox, Send } from 'lucide-react';
import { api } from '../../lib';
import { Box } from '../../components/styles/box';
import { Flex } from '../../components/styles/flex';
import { Select } from '../../components/styles/select';
import { AppLoadingState } from '../../components/shared/app-loading-state';

type Conversation = { id: number; user: { id: number; name: string; email: string } | null; support_status: 'open' | 'closed' | 'resolved'; last_message_at?: string | null; created_at?: string | null };
type Message = { id: number; message: string; sender?: { id?: number; name: string }; is_admin: boolean; created_at?: string | null };

const dateTime = (value?: string | null) => {
   if (!value) return 'No messages yet';
   const date = new Date(value);
   return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
};

export default function SupportPage() {
   const [conversations, setConversations] = useState<Conversation[]>([]);
   const [selectedId, setSelectedId] = useState<number | null>(null);
   const [messages, setMessages] = useState<Message[]>([]);
   const [status, setStatus] = useState('');
   const [page, setPage] = useState(1);
   const [lastPage, setLastPage] = useState(1);
   const [loading, setLoading] = useState(true);
   const [messagesLoading, setMessagesLoading] = useState(false);
   const [reply, setReply] = useState('');
   const [sending, setSending] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const selected = useMemo(() => conversations.find((item) => item.id === selectedId) ?? null, [conversations, selectedId]);

   const loadConversations = useCallback(async () => {
      setLoading(true); setError(null);
      try {
         const response = await api.get('/v1/admin/support/conversations', { params: { page, per_page: 20, ...(status ? { status } : {}) } });
         const rows: Conversation[] = Array.isArray(response.data?.data) ? response.data.data : [];
         setConversations(rows); setLastPage(response.data?.meta?.last_page ?? 1);
         setSelectedId((current) => rows.some((row) => row.id === current) ? current : rows[0]?.id ?? null);
      } catch (err: any) {
         setConversations([]); setError(err?.response?.data?.message ?? err?.message ?? 'Unable to load support conversations.');
      } finally { setLoading(false); }
   }, [page, status]);

   const loadMessages = useCallback(async () => {
      if (!selectedId) { setMessages([]); return; }
      setMessagesLoading(true);
      try {
         const response = await api.get(`/v1/admin/support/conversations/${selectedId}/messages`);
         setMessages(Array.isArray(response.data?.data) ? response.data.data : []);
      } catch (err: any) { setError(err?.response?.data?.message ?? 'Unable to load conversation messages.'); }
      finally { setMessagesLoading(false); }
   }, [selectedId]);

   useEffect(() => { void loadConversations(); }, [loadConversations]);
   useEffect(() => { void loadMessages(); }, [loadMessages]);

   const updateStatus = async (nextStatus: string) => {
      if (!selectedId) return;
      try {
         await api.put(`/v1/admin/support/conversations/${selectedId}/status`, { status: nextStatus });
         setConversations((items) => items.map((item) => item.id === selectedId ? { ...item, support_status: nextStatus as Conversation['support_status'] } : item));
      } catch (err: any) { setError(err?.response?.data?.message ?? 'Unable to update ticket status.'); }
   };

   const sendReply = async () => {
      if (!selectedId || !reply.trim()) return;
      setSending(true);
      try {
         const response = await api.post(`/v1/admin/support/conversations/${selectedId}/reply`, { body: reply.trim() });
         setMessages((items) => [...items, response.data]); setReply('');
      } catch (err: any) { setError(err?.response?.data?.message ?? 'Unable to send reply.'); }
      finally { setSending(false); }
   };

   return <Box className="admin-page">
      <Box className="glass-panel glass-hero"><Flex justify="between" align="center" css={{ gap: '$5', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
         <Flex align="center" css={{ gap: '$4' }}><Box css={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', color: '#8b83ff', bg: 'rgba(99,91,255,.12)' }}><Headphones size={20} /></Box><Box><Text className="section-kicker">Customer care</Text><Text h2 css={{ m: 0, fontSize: '1.35rem' }}>Support</Text><Text size="$xs" css={{ color: '$accents7' }}>Review and answer customer support conversations.</Text></Box></Flex>
         <Select value={status} onChange={(value) => { setStatus(value); setPage(1); }} aria-label="Filter by status" options={[{ value: '', label: 'All statuses' }, { value: 'open', label: 'Open' }, { value: 'resolved', label: 'Resolved' }, { value: 'closed', label: 'Closed' }]} css={{ width: 190 }} />
      </Flex></Box>
      {error && <Text color="error" size="$sm" css={{ mb: '$4' }}>{error}</Text>}
      <Flex css={{ gap: '$6', alignItems: 'stretch', '@smMax': { flexDirection: 'column' } }}>
         <Card css={{ flex: '0 0 330px', minHeight: 560 }}><Card.Body css={{ p: '$3' } as any}>
            {loading ? <AppLoadingState message="Loading conversations…" minHeight={240} /> : conversations.length === 0 ? <Empty /> : conversations.map((conversation) => <button key={conversation.id} type="button" onClick={() => setSelectedId(conversation.id)} style={{ width: '100%', border: 0, cursor: 'pointer', textAlign: 'left', padding: 14, marginBottom: 6, borderRadius: 14, background: selectedId === conversation.id ? 'var(--pf-accent-soft)' : 'transparent', color: 'inherit' }}><Flex justify="between" align="center" css={{ gap: '$3' }}><Text b size="$sm">{conversation.user?.name ?? 'Unknown customer'}</Text><Badge size="sm" variant="flat" color={conversation.support_status === 'open' ? 'warning' : 'success'}>{conversation.support_status}</Badge></Flex><Text size="$xs" css={{ color: '$accents7', mt: '$1' }}>{conversation.user?.email ?? 'No email'}</Text><Text size="10px" css={{ color: '$accents6', mt: '$2' }}>{dateTime(conversation.last_message_at ?? conversation.created_at)}</Text></button>)}
            {lastPage > 1 && <Flex justify="center" css={{ pt: '$4' }}><Pagination page={page} total={lastPage} onChange={setPage} size="sm" /></Flex>}
         </Card.Body></Card>
         <Card css={{ flex: 1, minWidth: 0, minHeight: 560 }}><Card.Body css={{ p: 0, display: 'flex', flexDirection: 'column' } as any}>
            {!selected ? <Flex direction="column" align="center" justify="center" css={{ flex: 1, gap: '$3', color: '$accents7' }}><Inbox size={30} /><Text>Select a conversation</Text></Flex> : <>
               <Flex justify="between" align="center" css={{ p: '$6', borderBottom: '1px solid $border', gap: '$4', flexWrap: 'wrap' }}><Box><Text b>{selected.user?.name ?? 'Unknown customer'}</Text><Text size="$xs" css={{ color: '$accents7' }}>{selected.user?.email ?? 'No email'} · Ticket #{selected.id}</Text></Box><Select value={selected.support_status} onChange={updateStatus} aria-label="Conversation status" options={[{ value: 'open', label: 'Open' }, { value: 'resolved', label: 'Resolved' }, { value: 'closed', label: 'Closed' }]} css={{ width: 150 }} /></Flex>
               <Box css={{ flex: 1, p: '$6', overflowY: 'auto', maxHeight: 430, bg: '$accents0' }}>{messagesLoading ? <AppLoadingState message="Loading messages…" minHeight={240} /> : messages.length === 0 ? <Text size="$sm" css={{ color: '$accents7', textAlign: 'center', mt: '$12' }}>No messages in this conversation.</Text> : <Flex direction="column" css={{ gap: '$4' }}>{messages.map((message) => <Flex key={message.id} justify={message.is_admin ? 'end' : 'start'}><Box css={{ maxW: '76%', p: '$4', borderRadius: message.is_admin ? '16px 16px 4px 16px' : '16px 16px 16px 4px', bg: message.is_admin ? '$primary' : '$accents2', color: message.is_admin ? 'white' : '$text' }}><Text size="$sm" css={{ color: 'inherit', whiteSpace: 'pre-wrap' }}>{message.message}</Text><Text size="10px" css={{ color: 'inherit', opacity: .7, mt: '$2' }}>{message.is_admin ? 'Admin' : message.sender?.name ?? selected.user?.name} · {dateTime(message.created_at)}</Text></Box></Flex>)}</Flex>}</Box>
               <Flex align="end" css={{ p: '$5', gap: '$3', borderTop: '1px solid $border' }}><Textarea fullWidth minRows={2} maxRows={5} placeholder="Write a reply…" value={reply} onChange={(event) => setReply(event.target.value)} /><Button auto color="primary" icon={<Send size={16} />} disabled={sending || !reply.trim()} onPress={sendReply}>{sending ? <Loading size="xs" color="currentColor" /> : 'Send'}</Button></Flex>
            </>}
         </Card.Body></Card>
      </Flex>
   </Box>;
}

const Empty = () => <Flex direction="column" align="center" css={{ py: '$12', gap: '$3', textAlign: 'center' }}><Inbox size={28} /><Text b>No conversations</Text><Text size="$xs" css={{ color: '$accents7' }}>No support tickets match this filter.</Text></Flex>;
