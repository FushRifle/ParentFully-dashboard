import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
   Badge,
   Button,
   Input,
   Modal,
   Pagination,
   Table,
   Text,
   Textarea,
} from '@nextui-org/react';
import {
   ArrowLeft,
   Edit2,
   Eye,
   Inbox,
   Layers3,
   Plus,
   Search,
   Trash2,
} from 'lucide-react';
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
   createOnly?: boolean;
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
   compactTableHeaders?: boolean;
   backHref?: string;
   backLabel?: string;
   filters?: Array<{
      key: string;
      label: string;
      defaultValue?: string;
      options: Array<{ value: string; label: string }>;
   }>;
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

const normalizeCollection = (
   payload: any,
): { rows: Record<string, any>[]; meta: CollectionMeta } => {
   if (Array.isArray(payload)) {
      return {
         rows: payload,
         meta: { current_page: 1, last_page: 1, total: payload.length },
      };
   }
   if (Array.isArray(payload?.data)) {
      return {
         rows: payload.data,
         meta: payload.meta ?? {
            current_page: 1,
            last_page: 1,
            total: payload.data.length,
         },
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
      return Number.isNaN(date.getTime())
         ? String(value)
         : date.toLocaleDateString();
   }
   if (typeof value === 'object') return value.name ?? value.email ?? '—';
   return String(value).replaceAll('_', ' ');
};

export const BackendCollectionPage = ({
   path,
   endpoint,
   columns,
   searchable = true,
   rowHref,
   formFields = [],
   resourceName,
   createLabel,
   mutationEndpoint = endpoint,
   listParams,
   createPayload,
   allowDelete = false,
   allowCreate = true,
   backHref,
   backLabel = 'Back to library',
   filters = [],
   compactTableHeaders = false,
}: BackendCollectionPageProps) => {
   const metaCopy = getPageMeta(path);
   const serializedListParams = JSON.stringify(listParams ?? {});
   const [rows, setRows] = useState<Record<string, any>[]>([]);
   const [meta, setMeta] = useState<CollectionMeta>({
      current_page: 1,
      last_page: 1,
      total: 0,
   });
   const [page, setPage] = useState(1);
   const [search, setSearch] = useState('');
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [formOpen, setFormOpen] = useState(false);
   const [editing, setEditing] = useState<Record<string, any> | null>(null);
   const [form, setForm] = useState<Record<string, any>>({});
   const [saving, setSaving] = useState(false);
   const [filterValues, setFilterValues] = useState<Record<string, string>>(
      () =>
         Object.fromEntries(
            filters.map((filter) => [filter.key, filter.defaultValue ?? '']),
         ),
   );

   const hasActiveFilters =
      search.trim().length > 0 ||
      Object.values(filterValues).some((value) => value !== '');

   const visibleRows = useMemo(() => {
      const query = search.trim().toLowerCase();
      return rows.filter((row) => {
         const matchesSearch =
            !searchable ||
            !query ||
            columns.some((column) =>
               formatValue(getValue(row, column.key), column.type)
                  .toLowerCase()
                  .includes(query),
            );
         const matchesFilters = filters.every((filter) => {
            const selected = filterValues[filter.key];
            return !selected || String(getValue(row, filter.key) ?? '') === selected;
         });
         return matchesSearch && matchesFilters;
      });
   }, [columns, filterValues, filters, rows, search, searchable]);

   const load = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
         const response = await api.get(endpoint, {
            params: {
               page,
               per_page: 25,
               ...JSON.parse(serializedListParams),
               ...Object.fromEntries(
                  Object.entries(filterValues).filter(([, value]) => value !== ''),
               ),
               ...(searchable && search.trim() ? { search: search.trim() } : {}),
            },
         });
         const normalized = normalizeCollection(response.data);
         setRows(normalized.rows);
         setMeta(normalized.meta);
      } catch (err: any) {
         setRows([]);
         setError(
            err?.response?.data?.message ??
            err?.message ??
            `Unable to load ${metaCopy.title.toLowerCase()}.`,
         );
      } finally {
         setLoading(false);
      }
   }, [
      endpoint,
      filterValues,
      metaCopy.title,
      page,
      search,
      searchable,
      serializedListParams,
   ]);

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
      setForm(
         Object.fromEntries(
            formFields.map((field) => [field.key, getValue(row, field.key) ?? '']),
         ),
      );
      setFormOpen(true);
   };

   const save = async () => {
      if (
         !editing &&
         Object.prototype.hasOwnProperty.call(form, 'password_confirmation') &&
         form.password !== form.password_confirmation
      ) {
         setError('Password and confirm password must match.');
         return;
      }
      setSaving(true);
      setError(null);
      try {
         const payload = Object.fromEntries(
            Object.entries({
               ...form,
               ...(editing ? {} : createPayload),
            }).filter(([, value]) => value !== ''),
         );
         if (editing) await api.put(`${mutationEndpoint}/${editing.id}`, payload);
         else await api.post(mutationEndpoint, payload);
         setFormOpen(false);
         await load();
      } catch (err: any) {
         const validation = err?.response?.data?.errors;
         setError(
            validation
               ? Object.values(validation).flat().join(' ')
               : err?.response?.data?.message ??
               err?.message ??
               'Unable to save record.',
         );
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
         setError(
            err?.response?.data?.message ??
            err?.message ??
            'Unable to delete record.',
         );
      }
   };

   const clearFilters = () => {
      setSearch('');
      setFilterValues(
         Object.fromEntries(filters.map((filter) => [filter.key, ''])),
      );
      setPage(1);
   };

   const tableColumns =
      formFields.length || rowHref || allowDelete
         ? [...columns, { key: '__actions', label: 'ACTIONS' }]
         : columns;

   return (
      <Box
         className={`admin-page${compactTableHeaders ? ' customers-compact-table' : ''}`}
      >
         {backHref && (
            <NextLink href={backHref} passHref legacyBehavior>
               <a className="admin-back-link">
                  <ArrowLeft size={15} />
                  {backLabel}
               </a>
            </NextLink>
         )}

         {/* ---- Header + toolbar merged into one glass panel ---- */}
         <Box className="glass-panel glass-hero">
            <Flex
               direction="column"
               css={{ gap: '$5', position: 'relative', zIndex: 1 }}
            >
               {/* Top row: identity + actions */}
               <Flex
                  justify="between"
                  align="center"
                  css={{ gap: '$4', flexWrap: 'wrap' }}
               >
                  <Flex align="center" css={{ gap: '$4', minWidth: 0 }}>
                     <Box
                        css={{
                           width: '44px',
                           height: '44px',
                           borderRadius: '14px',
                           display: 'grid',
                           placeItems: 'center',
                           color: '#8b83ff',
                           bg: 'rgba(99,91,255,.12)',
                           border: '1px solid rgba(139,131,255,.25)',
                           flexShrink: 0,
                        }}
                     >
                        <Layers3 size={20} />
                     </Box>
                     <Box css={{ minWidth: 0 }}>
                        <Flex align="center" css={{ gap: '$3', flexWrap: 'wrap' }}>
                           <Text h2 css={{ m: 0, fontSize: '1.35rem' }}>
                              {metaCopy.title}
                           </Text>
                           <Box
                              css={{
                                 px: '$2',
                                 py: '2px',
                                 borderRadius: '$md',
                                 fontSize: '0.7rem',
                                 fontWeight: 600,
                                 color: '#8b83ff',
                                 bg: 'rgba(99,91,255,.12)',
                                 border: '1px solid rgba(139,131,255,.25)',
                                 whiteSpace: 'nowrap',
                              }}
                           >
                              {loading ? '—' : meta.total.toLocaleString()} total
                           </Box>
                        </Flex>
                        <Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>
                           {metaCopy.subtitle}
                        </Text>
                     </Box>
                  </Flex>

                  <Flex css={{ gap: '$3', flexWrap: 'wrap' }} align="center">
                     {searchable && (
                        <Input
                           bordered
                           clearable
                           aria-label={`Search ${metaCopy.title}`}
                           placeholder={`Search ${metaCopy.title.toLowerCase()}...`}
                           contentLeft={<Search size={15} />}
                           value={search}
                           onChange={(event) => {
                              setSearch(event.target.value);
                              setPage(1);
                           }}
                           css={{ width: '250px' }}
                        />
                     )}
                     {formFields.length > 0 && allowCreate && (
                        <Button
                           auto
                           color="primary"
                           icon={<Plus size={15} />}
                           onPress={openCreate}
                        >
                           {createLabel ?? `Add ${resourceName ?? 'record'}`}
                        </Button>
                     )}
                  </Flex>
               </Flex>

               {/* Divider between identity row and controls row */}
               {(filters.length > 0 || hasActiveFilters) && (
                  <Box
                     css={{
                        height: '1px',
                        width: '100%',
                        background: '$border',
                        opacity: 0.6,
                     }}
                  />
               )}

               {/* Bottom row: filters + reset */}
               {(filters.length > 0 || hasActiveFilters) && (
                  <Flex
                     justify="between"
                     align="center"
                     css={{ gap: '$4', flexWrap: 'wrap' }}
                  >
                     <Flex css={{ gap: '$3', flexWrap: 'wrap' }} align="center">
                        {filters.map((filter) => (
                           <label className="collection-filter" key={filter.key}>
                              <span>{filter.label}</span>
                              <select
                                 aria-label={`Filter by ${filter.label}`}
                                 value={filterValues[filter.key] ?? ''}
                                 onChange={(event) => {
                                    setFilterValues((current) => ({
                                       ...current,
                                       [filter.key]: event.target.value,
                                    }));
                                    setPage(1);
                                 }}
                              >
                                 {filter.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                       {option.label}
                                    </option>
                                 ))}
                              </select>
                           </label>
                        ))}
                     </Flex>

                     {hasActiveFilters && (
                        <Button auto flat size="sm" onPress={clearFilters}>
                           Clear filters
                        </Button>
                     )}
                  </Flex>
               )}
            </Flex>
         </Box>

         {/* ---- Content: error / empty / table ---- */}
         {error ? (
            <Box
               className="glass-panel"
               css={{
                  p: '$10',
                  border: '1px solid $red300 !important',
                  bg: 'rgba(239,68,68,.08) !important',
               }}
            >
               <Text color="error" size="$sm">
                  {error}
               </Text>
            </Box>
         ) : !loading && visibleRows.length === 0 ? (
            <Box className="glass-panel admin-empty-state">
               <span>
                  <Inbox size={22} />
               </span>
               <Text b>No {metaCopy.title.toLowerCase()} found</Text>
               <Text size="$sm" css={{ color: '$accents7' }}>
                  {hasActiveFilters
                     ? 'Try another search or clear the current filters.'
                     : 'Records will appear here when they become available.'}
               </Text>
               {hasActiveFilters && (
                  <Button auto flat size="sm" onPress={clearFilters}>
                     Clear filters
                  </Button>
               )}
            </Box>
         ) : (
            <Box className="glass-panel glass-table">
               <Table
                  aria-label={`${metaCopy.title} data`}
                  shadow={false}
                  css={{ minWidth: '100%' }}
               >
                  <Table.Header>
                     {tableColumns.map((column) => (
                        <Table.Column key={column.key}>{column.label}</Table.Column>
                     ))}
                  </Table.Header>
                  <Table.Body
                     items={visibleRows}
                     loadingState={loading ? 'loading' : 'idle'}
                  >
                     {(row) => (
                        <Table.Row
                           key={row.id ?? JSON.stringify(row)}
                           css={
                              rowHref ? { '&:hover td': { bg: '$accents1' } } : undefined
                           }
                        >
                           {tableColumns.map((column) => {
                              if (column.key === '__actions')
                                 return (
                                    <Table.Cell key={column.key}>
                                       <Flex css={{ gap: '$2' }}>
                                          {rowHref && (
                                             <NextLink
                                                href={rowHref(row)}
                                                passHref
                                                legacyBehavior
                                             >
                                                <Button
                                                   as="a"
                                                   auto
                                                   light
                                                   icon={<Eye size={15} />}
                                                   aria-label="View details"
                                                />
                                             </NextLink>
                                          )}
                                          {formFields.length > 0 && (
                                             <Button
                                                auto
                                                light
                                                icon={<Edit2 size={15} />}
                                                onPress={() => openEdit(row)}
                                                aria-label="Edit"
                                             />
                                          )}
                                          {allowDelete && (
                                             <Button
                                                auto
                                                light
                                                color="error"
                                                icon={<Trash2 size={15} />}
                                                onPress={() => remove(row)}
                                                aria-label="Delete"
                                             />
                                          )}
                                       </Flex>
                                    </Table.Cell>
                                 );
                              const value = getValue(row, column.key);
                              const content =
                                 column.type === 'status' ? (
                                    <Badge
                                       variant="flat"
                                       color={
                                          [
                                             'active',
                                             'paid',
                                             'fulfilled',
                                             'resolved',
                                             'premium',
                                          ].includes(String(value).toLowerCase())
                                             ? 'success'
                                             : 'default'
                                       }
                                    >
                                       {formatValue(value)}
                                    </Badge>
                                 ) : (
                                    <Text size="$sm">
                                       {formatValue(value, column.type)}
                                    </Text>
                                 );
                              return (
                                 <Table.Cell key={column.key}>
                                    {rowHref ? (
                                       <NextLink href={rowHref(row)} passHref legacyBehavior>
                                          <a
                                             style={{
                                                display: 'block',
                                                color: 'inherit',
                                                textDecoration: 'none',
                                             }}
                                          >
                                             {content}
                                          </a>
                                       </NextLink>
                                    ) : (
                                       content
                                    )}
                                 </Table.Cell>
                              );
                           })}
                        </Table.Row>
                     )}
                  </Table.Body>
               </Table>
            </Box>
         )}

         {/* ---- Pagination ---- */}
         {!error && meta.last_page > 1 && (
            <Flex justify="between" align="center" css={{ mt: '$5' }}>
               <Text size="$xs" css={{ color: '$accents7' }}>
                  Page {meta.current_page} of {meta.last_page} ·{' '}
                  {meta.total.toLocaleString()} records
               </Text>
               <Pagination
                  total={meta.last_page}
                  page={meta.current_page}
                  onChange={setPage}
                  size="sm"
               />
            </Flex>
         )}

         {/* ---- Modal (unchanged) ---- */}
         <Modal
            closeButton
            open={formOpen}
            onClose={() => setFormOpen(false)}
            width="560px"
         >
            <Modal.Header>
               <Text h4 css={{ m: 0 }}>
                  {editing ? 'Edit' : 'Add'} {resourceName ?? 'record'}
               </Text>
            </Modal.Header>
            <Modal.Body>
               {formFields
                  .filter((field) => !field.createOnly || !editing)
                  .map((field) =>
                     field.type === 'textarea' ? (
                        <Textarea
                           key={field.key}
                           bordered
                           fullWidth
                           label={field.label}
                           value={form[field.key] ?? ''}
                           onChange={(event) =>
                              setForm({ ...form, [field.key]: event.target.value })
                           }
                        />
                     ) : field.type === 'select' ? (
                        <label
                           key={field.key}
                           style={{ display: 'grid', gap: 6, fontSize: 12 }}
                        >
                           {field.label}
                           <select
                              value={form[field.key] ?? ''}
                              onChange={(event) =>
                                 setForm({ ...form, [field.key]: event.target.value })
                              }
                              required={field.required}
                           >
                              <option value="">Select…</option>
                              {field.options?.map((option) => (
                                 <option key={option.value} value={option.value}>
                                    {option.label}
                                 </option>
                              ))}
                           </select>
                        </label>
                     ) : field.type === 'password' ? (
                        <Input.Password
                           key={field.key}
                           bordered
                           fullWidth
                           label={field.label}
                           value={form[field.key] ?? ''}
                           required={!editing && field.required}
                           onChange={(event) =>
                              setForm({ ...form, [field.key]: event.target.value })
                           }
                        />
                     ) : (
                        <Input
                           key={field.key}
                           bordered
                           fullWidth
                           label={field.label}
                           type={field.type ?? 'text'}
                           value={form[field.key] ?? ''}
                           required={field.required}
                           onChange={(event) =>
                              setForm({
                                 ...form,
                                 [field.key]:
                                    field.type === 'number'
                                       ? Number(event.target.value)
                                       : event.target.value,
                              })
                           }
                        />
                     ),
                  )}
               {error && (
                  <Text color="error" size="$xs">
                     {error}
                  </Text>
               )}
            </Modal.Body>
            <Modal.Footer>
               <Button auto flat onPress={() => setFormOpen(false)}>
                  Cancel
               </Button>
               <Button auto color="primary" onPress={save} disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
               </Button>
            </Modal.Footer>
         </Modal>
      </Box>
   );
};