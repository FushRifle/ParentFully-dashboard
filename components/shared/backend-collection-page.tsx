import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Input, Modal, Pagination, Table, Text, Textarea } from '@nextui-org/react';
import { Database, Edit2, Eye, Layers3, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import NextLink from 'next/link';
import { api } from '../../lib';
import { getPageMeta, PagePath } from '../../lib/pageMeta';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';

export interface BackendColumn {
   key: string;
   label: string;
   type?: 'date' | 'status' | 'boolean' | 'number';
}

export interface BackendFormField {
   key: string;
   label: string;
   type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';
   required?: boolean;
   options?: Array<{ value: string; label: string }>;
}

interface BackendCollectionPageProps {
   path: PagePath;
   endpoint: string;
   columns: BackendColumn[];
   searchable?: boolean;
   rowHref?: (row: Record<string, any>) => string;
   formFields?: BackendFormField[];
   resourceName?: string;
   createLabel?: string;
   mutationEndpoint?: string;
   listParams?: Record<string, string | number>;
   createPayload?: Record<string, any>;
   allowDelete?: boolean;
   allowCreate?: boolean;
   summaryMetrics?: Array<{
      key: 'total' | 'visible' | 'page';
      label: string;
      color: string;
      icon?: React.ReactNode;
      description?: string;
   }>;
}

interface CollectionMeta {
   current_page: number;
   last_page: number;
   total: number;
}

const getValue = (row: Record<string, any>, path: string) =>
   path.split('.').reduce<any>((value, key) => value?.[key], row);

const normalizeCollection = (payload: any): { rows: Record<string, any>[]; meta: CollectionMeta } => {
   if (Array.isArray(payload)) {
      return { rows: payload, meta: { current_page: 1, last_page: 1, total: payload.length } };
   }

   if (Array.isArray(payload?.data)) {
      return {
         rows: payload.data,
         meta: payload.meta ?? { current_page: 1, last_page: 1, total: payload.data.length },
      };
   }

   if (Array.isArray(payload?.data?.data)) {
      const paginator = payload.data;
      return {
         rows: paginator.data,
         meta: {
            current_page: paginator.current_page ?? 1,
            last_page: paginator.last_page ?? 1,
            total: paginator.total ?? paginator.data.length,
         },
      };
   }

   return { rows: [], meta: { current_page: 1, last_page: 1, total: 0 } };
};

const formatValue = (value: any, type?: BackendColumn['type']) => {
   if (value === null || value === undefined || value === '') return '—';
   if (type === 'boolean') return value ? 'Yes' : 'No';
   if (type === 'number') return Number(value).toLocaleString();
   if (type === 'date') {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
   }
   if (typeof value === 'object') return value.name ?? value.email ?? '—';
   return String(value).replaceAll('_', ' ');
};

export const BackendCollectionPage = ({
   path, endpoint, columns, searchable = true, rowHref, formFields = [], resourceName,
   createLabel, mutationEndpoint = endpoint, listParams, createPayload, allowDelete = false, allowCreate = true,
   summaryMetrics,
}: BackendCollectionPageProps) => {
   const metaCopy = getPageMeta(path);
   const serializedListParams = JSON.stringify(listParams ?? {});
   const [rows, setRows] = useState<Record<string, any>[]>([]);
   const [meta, setMeta] = useState<CollectionMeta>({ current_page: 1, last_page: 1, total: 0 });
   const [page, setPage] = useState(1);
   const [search, setSearch] = useState('');
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [formOpen, setFormOpen] = useState(false);
   const [editing, setEditing] = useState<Record<string, any> | null>(null);
   const [form, setForm] = useState<Record<string, any>>({});
   const [saving, setSaving] = useState(false);

   const load = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
         const response = await api.get(endpoint, {
            params: { page, per_page: 25, ...JSON.parse(serializedListParams), ...(searchable && search.trim() ? { search: search.trim() } : {}) },
         });
         const normalized = normalizeCollection(response.data);
         setRows(normalized.rows);
         setMeta(normalized.meta);
      } catch (err: any) {
         setRows([]);
         setError(err?.response?.data?.message ?? err?.message ?? `Unable to load ${metaCopy.title.toLowerCase()}.`);
      } finally {
         setLoading(false);
      }
   }, [endpoint, metaCopy.title, page, search, searchable, serializedListParams]);

   useEffect(() => {
      const timeout = setTimeout(load, search ? 250 : 0);
      return () => clearTimeout(timeout);
   }, [load, search]);

   const openCreate = () => {
      setEditing(null);
      setForm(Object.fromEntries(formFields.map((field) => [field.key, ''])));
      setFormOpen(true);
   };

   const openEdit = (row: Record<string, any>) => {
      setEditing(row);
      setForm(Object.fromEntries(formFields.map((field) => [field.key, getValue(row, field.key) ?? ''])));
      setFormOpen(true);
   };

   const save = async () => {
      setSaving(true);
      setError(null);
      try {
         const payload = Object.fromEntries(Object.entries({ ...form, ...(editing ? {} : createPayload) }).filter(([, value]) => value !== ''));
         if (editing) await api.put(`${mutationEndpoint}/${editing.id}`, payload);
         else await api.post(mutationEndpoint, payload);
         setFormOpen(false);
         await load();
      } catch (err: any) {
         const validation = err?.response?.data?.errors;
         setError(validation ? Object.values(validation).flat().join(' ') : err?.response?.data?.message ?? err?.message ?? 'Unable to save record.');
      } finally {
         setSaving(false);
      }
   };

   const remove = async (row: Record<string, any>) => {
      if (!window.confirm(`Delete this ${resourceName ?? 'record'}?`)) return;
      try {
         await api.delete(`${mutationEndpoint}/${row.id}`);
         await load();
      } catch (err: any) {
         setError(err?.response?.data?.message ?? err?.message ?? 'Unable to delete record.');
      }
   };

   const tableColumns = formFields.length || rowHref || allowDelete
      ? [...columns, { key: '__actions', label: 'ACTIONS' }]
      : columns;
   const metrics = summaryMetrics ?? [
      { key: 'total' as const, label: 'Total records', color: '#635bff' },
      { key: 'visible' as const, label: 'Visible now', color: '#10b981' },
      { key: 'page' as const, label: 'Current page', color: '#f97316' },
   ];
   const metricValue = (key: 'total' | 'visible' | 'page') => key === 'total'
      ? meta.total
      : key === 'visible'
         ? rows.length
         : `${meta.current_page} / ${Math.max(meta.last_page, 1)}`;

   return (
      <Box className="admin-page">
         <Box className="glass-panel glass-hero">
            <Flex justify="between" align="center" css={{ gap: '$6', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
               <Flex align="center" css={{ gap: '$4' }}>
                  <Box css={{ width: '44px', height: '44px', borderRadius: '14px', display: 'grid', placeItems: 'center', color: '#8b83ff', bg: 'rgba(99,91,255,.12)', border: '1px solid rgba(139,131,255,.25)' }}>
                     <Layers3 size={20} />
                  </Box>
                  <Box>
                     <Text className="section-kicker">Workspace</Text>
                     <Text h2 css={{ m: 0, mt: '$1', fontSize: '1.35rem' }}>{metaCopy.title}</Text>
                     <Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>{metaCopy.subtitle}</Text>
                  </Box>
               </Flex>
               <Flex css={{ gap: '$3', flexWrap: 'wrap' }} align="center">
                  <Button auto flat icon={<RefreshCw size={15} />} onPress={load} disabled={loading}>Refresh</Button>
                  {formFields.length > 0 && allowCreate && <Button auto color="primary" icon={<Plus size={15} />} onPress={openCreate}>{createLabel ?? `Add ${resourceName ?? 'record'}`}</Button>}
               </Flex>
            </Flex>
         </Box>

         <div className="metric-grid">
            {metrics.map((item) => {
               const value = metricValue(item.key);
               return (
               <Box key={item.label} className="glass-panel metric-tile" css={{ '--tile-accent': item.color } as any}>
                  <Flex align="center" css={{ gap: '$2', color: item.color }}>{item.icon ?? <Database size={14} />}<Text className="section-kicker">{item.label}</Text></Flex>
                  <Text h3 css={{ m: 0, mt: '$3', fontSize: '1.45rem' }}>{loading ? '—' : typeof value === 'number' ? value.toLocaleString() : value}</Text>
                  {item.description && <Text size="$xs" css={{ color: '$accents7', mt: '$2' }}>{item.description}</Text>}
               </Box>
               );
            })}
         </div>

         <Box className="glass-panel glass-toolbar">
            <Flex justify="between" align="center" css={{ gap: '$4', flexWrap: 'wrap' }}>
               <Box>
                  <Text b size="$sm">All {metaCopy.title}</Text>
                  <Text size="$xs" css={{ color: '$accents7', mt: '$1' }}>Browse, search and manage backend records.</Text>
               </Box>
            <Flex css={{ gap: '$3' }} align="center">
               {searchable && (
                  <Input
                     bordered
                     clearable
                     aria-label={`Search ${metaCopy.title}`}
                     placeholder={`Search ${metaCopy.title.toLowerCase()}...`}
                     contentLeft={<Search size={15} />}
                     value={search}
                     onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                     css={{ width: '240px' }}
                  />
               )}
            </Flex>
            </Flex>
         </Box>

         {error ? (
            <Box className="glass-panel" css={{ p: '$10', border: '1px solid $red300 !important', bg: 'rgba(239,68,68,.08) !important' }}>
               <Text color="error" size="$sm">{error}</Text>
            </Box>
         ) : !loading && rows.length === 0 ? (
            <Box className="glass-panel" css={{ p: '$10', textAlign: 'center' }}>
               <Text size="$sm" css={{ color: '$accents7' }}>No {metaCopy.title.toLowerCase()} found.</Text>
            </Box>
         ) : (
            <Box className="glass-panel glass-table">
            <Table aria-label={`${metaCopy.title} data`} shadow={false} css={{ minWidth: '100%' }}>
               <Table.Header>
                  {tableColumns.map((column) => <Table.Column key={column.key}>{column.label}</Table.Column>)}
               </Table.Header>
               <Table.Body
                  items={rows}
                  loadingState={loading ? 'loading' : 'idle'}
               >
                  {(row) => (
                     <Table.Row key={row.id ?? JSON.stringify(row)} css={rowHref ? { '&:hover td': { bg: '$accents1' } } : undefined}>
                        {tableColumns.map((column) => {
                           if (column.key === '__actions') return (
                              <Table.Cell key={column.key}>
                                 <Flex css={{ gap: '$2' }}>
                                    {rowHref && <NextLink href={rowHref(row)} passHref legacyBehavior><Button as="a" auto light icon={<Eye size={15} />} aria-label="View details" /></NextLink>}
                                    {formFields.length > 0 && <Button auto light icon={<Edit2 size={15} />} onPress={() => openEdit(row)} aria-label="Edit" />}
                                    {allowDelete && <Button auto light color="error" icon={<Trash2 size={15} />} onPress={() => remove(row)} aria-label="Delete" />}
                                 </Flex>
                              </Table.Cell>
                           );
                           const value = getValue(row, column.key);
                           const content = column.type === 'status' ? (
                              <Badge variant="flat" color={['active', 'paid', 'fulfilled', 'resolved', 'premium'].includes(String(value).toLowerCase()) ? 'success' : 'default'}>
                                 {formatValue(value)}
                              </Badge>
                           ) : (
                              <Text size="$sm">{formatValue(value, column.type)}</Text>
                           );
                           return (
                              <Table.Cell key={column.key}>
                                 {rowHref ? (
                                    <NextLink href={rowHref(row)} passHref legacyBehavior>
                                       <a style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>{content}</a>
                                    </NextLink>
                                 ) : content}
                              </Table.Cell>
                           );
                        })}
                     </Table.Row>
                  )}
               </Table.Body>
            </Table>
            </Box>
         )}

         {!error && meta.last_page > 1 && (
            <Flex justify="between" align="center" css={{ mt: '$5' }}>
               <Text size="$xs" css={{ color: '$accents7' }}>{meta.total.toLocaleString()} records</Text>
               <Pagination total={meta.last_page} page={meta.current_page} onChange={setPage} size="sm" />
            </Flex>
         )}

         <Modal closeButton open={formOpen} onClose={() => setFormOpen(false)} width="560px">
            <Modal.Header><Text h4 css={{ m: 0 }}>{editing ? 'Edit' : 'Add'} {resourceName ?? 'record'}</Text></Modal.Header>
            <Modal.Body>
               {formFields.map((field) => field.type === 'textarea' ? (
                  <Textarea key={field.key} bordered fullWidth label={field.label} value={form[field.key] ?? ''} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} />
               ) : field.type === 'select' ? (
                  <label key={field.key} style={{ display: 'grid', gap: 6, fontSize: 12 }}>
                     {field.label}
                     <select value={form[field.key] ?? ''} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} required={field.required}>
                        <option value="">Select…</option>
                        {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                     </select>
                  </label>
               ) : (
                  <Input key={field.key} bordered fullWidth label={field.label} type={field.type ?? 'text'} value={form[field.key] ?? ''} required={field.required} onChange={(event) => setForm({ ...form, [field.key]: field.type === 'number' ? Number(event.target.value) : event.target.value })} />
               ))}
               {error && <Text color="error" size="$xs">{error}</Text>}
            </Modal.Body>
            <Modal.Footer>
               <Button auto flat onPress={() => setFormOpen(false)}>Cancel</Button>
               <Button auto color="primary" onPress={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            </Modal.Footer>
         </Modal>
      </Box>
   );
};
