import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from '@/components/ui/pagination';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import {
   ArrowLeft,
   Edit2,
   Eye,
   Inbox,
   Layers3,
   Plus,
   Trash2,
} from 'lucide-react';
import NextLink from 'next/link';
import { api } from '@/lib';
import { getPageMeta, PagePath } from '@/lib/pageMeta';
import { usePageSearch } from '@/lib/context/searchContext';
import { TableExport } from '@/components/shared/table-export';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { cn } from '@/lib/utils';

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
   readFallbackEndpoints?: string[];
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
      return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
   }
   if (typeof value === 'object') return value.name ?? value.email ?? '—';
   return String(value).replaceAll('_', ' ');
};

export const BackendCollectionPage = ({
   path,
   endpoint,
   readFallbackEndpoints = [],
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
   const router = useRouter();
   const metaCopy = getPageMeta(path);
   const serializedListParams = JSON.stringify(listParams ?? {});
   const serializedFallbackEndpoints = JSON.stringify(readFallbackEndpoints);
   const [rows, setRows] = useState<Record<string, any>[]>([]);
   const [meta, setMeta] = useState<CollectionMeta>({
      current_page: 1,
      last_page: 1,
      total: 0,
   });
   const [page, setPage] = useState(1);
   const { search, setSearch } = usePageSearch();
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [formOpen, setFormOpen] = useState(false);
   const [editing, setEditing] = useState<Record<string, any> | null>(null);
   const [form, setForm] = useState<Record<string, any>>({});
   const [saving, setSaving] = useState(false);
   const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
      Object.fromEntries(filters.map((filter) => [filter.key, filter.defaultValue ?? ''])),
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
               formatValue(getValue(row, column.key), column.type).toLowerCase().includes(query),
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
         const params = {
            page,
            per_page: 25,
            ...JSON.parse(serializedListParams),
            ...Object.fromEntries(Object.entries(filterValues).filter(([, value]) => value !== '')),
            ...(searchable && search.trim() ? { search: search.trim() } : {}),
         };
         const endpoints = [endpoint, ...JSON.parse(serializedFallbackEndpoints)];
         let normalized: ReturnType<typeof normalizeCollection> | null = null;
         let lastError: any = null;

         for (const readEndpoint of endpoints) {
            try {
               const response = await api.get(readEndpoint, { params });
               const candidate = normalizeCollection(response.data);
               normalized = candidate;
               if (candidate.rows.length > 0 || readEndpoint === endpoints[endpoints.length - 1]) break;
            } catch (requestError) {
               lastError = requestError;
            }
         }

         if (!normalized && lastError) throw lastError;
         normalized ??= { rows: [], meta: { current_page: 1, last_page: 1, total: 0 } };
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
      serializedFallbackEndpoints,
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
         Object.fromEntries(formFields.map((field) => [field.key, getValue(row, field.key) ?? ''])),
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
               : err?.response?.data?.message ?? err?.message ?? 'Unable to save record.',
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
         setError(err?.response?.data?.message ?? err?.message ?? 'Unable to delete record.');
      }
   };

   const clearFilters = () => {
      setSearch('');
      setFilterValues(Object.fromEntries(filters.map((filter) => [filter.key, ''])));
      setPage(1);
   };

   const tableColumns =
      formFields.length || rowHref || allowDelete
         ? [...columns, { key: '__actions', label: 'ACTIONS' }]
         : columns;

   return (
      <div className={cn('admin-page', compactTableHeaders && 'customers-compact-table')}>
         {backHref && (
            <NextLink href={backHref} className="admin-back-link">
               <ArrowLeft size={15} />
               {backLabel}
            </NextLink>
         )}

         <div className="glass-panel glass-hero">
            <div className="relative z-10 flex flex-col gap-5">
               <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                     <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] border border-indigo-300/25 bg-indigo-500/10 text-indigo-400">
                        <Layers3 size={20} />
                     </div>
                     <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                           <h2 className="m-0 text-[1.35rem] font-semibold">{metaCopy.title}</h2>
                           <span className="whitespace-nowrap rounded-md border border-indigo-300/25 bg-indigo-500/10 px-2 py-0.5 text-[0.7rem] font-semibold text-indigo-400">
                              {loading ? '—' : meta.total.toLocaleString()} total
                           </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{metaCopy.subtitle}</p>
                     </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                     <TableExport
                        rows={visibleRows}
                        columns={columns.map((column) => ({ key: column.key, label: column.label }))}
                        filename={metaCopy.title}
                        title={`${metaCopy.title} report`}
                     />
                     {formFields.length > 0 && allowCreate && (
                        <Button onClick={openCreate}>
                           <Plus size={15} className="mr-2" />
                           {createLabel ?? `Add ${resourceName ?? 'record'}`}
                        </Button>
                     )}
                  </div>
               </div>

               {(filters.length > 0 || hasActiveFilters) && (
                  <div className="h-px w-full bg-border opacity-60" />
               )}

               {(filters.length > 0 || hasActiveFilters) && (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                     <div className="flex flex-wrap items-center gap-3">
                        {filters.map((filter) => (
                           <div key={filter.key} className="collection-filter flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{filter.label}</span>
                              <Select
                                 value={filterValues[filter.key] || '__all__'}
                                 onValueChange={(value: any) => {
                                    setFilterValues((current) => ({
                                       ...current,
                                       [filter.key]: value === '__all__' ? '' : value,
                                    }));
                                    setPage(1);
                                 }}
                              >
                                 <SelectTrigger className="h-8 w-40">
                                    <SelectValue placeholder={filter.label} />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {filter.options.map((option) => (
                                       <SelectItem key={option.value} value={option.value || '__all__'}>
                                          {option.label}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </div>
                        ))}
                     </div>

                     {hasActiveFilters && (
                        <Button variant="secondary" size="sm" onClick={clearFilters}>
                           Clear filters
                        </Button>
                     )}
                  </div>
               )}
            </div>
         </div>

         {error ? (
            <div className="glass-panel border border-red-300 bg-red-500/10 p-10">
               <p className="text-sm text-red-500">{error}</p>
            </div>
         ) : loading ? (
            <div className="glass-panel">
               <AppLoadingState message={`Loading ${metaCopy.title.toLowerCase()}…`} />
            </div>
         ) : visibleRows.length === 0 ? (
            <div className="glass-panel admin-empty-state flex flex-col items-center gap-3 py-12 text-center">
               <span className="grid h-12 w-12 place-items-center rounded-full bg-muted">
                  <Inbox size={22} />
               </span>
               <p className="font-semibold">No {metaCopy.title.toLowerCase()} found</p>
               <p className="text-sm text-muted-foreground">
                  {hasActiveFilters
                     ? 'Try another search or clear the current filters.'
                     : 'Records will appear here when they become available.'}
               </p>
               {hasActiveFilters && (
                  <Button variant="secondary" size="sm" onClick={clearFilters}>
                     Clear filters
                  </Button>
               )}
            </div>
         ) : (
            <div className="glass-panel glass-table">
               <Table>
                  <TableHeader>
                     <TableRow>
                        {tableColumns.map((column) => (
                           <TableHead key={column.key}>{column.label}</TableHead>
                        ))}
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {visibleRows.map((row) => (
                        <TableRow
                           key={row.id ?? JSON.stringify(row)}
                           className={rowHref ? 'cursor-pointer hover:bg-muted/50' : undefined}
                        >
                           {tableColumns.map((column) => {
                              if (column.key === '__actions')
                                 return (
                                    <TableCell key={column.key}>
                                       <div className="flex gap-2">
                                          {rowHref && (
                                             <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => router.push(rowHref(row))}
                                                aria-label="View details"
                                             >
                                                <Eye size={15} />
                                             </Button>
                                          )}
                                          {formFields.length > 0 && (
                                             <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => openEdit(row)}
                                                aria-label="Edit"
                                             >
                                                <Edit2 size={15} />
                                             </Button>
                                          )}
                                          {allowDelete && (
                                             <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-500"
                                                onClick={() => remove(row)}
                                                aria-label="Delete"
                                             >
                                                <Trash2 size={15} />
                                             </Button>
                                          )}
                                       </div>
                                    </TableCell>
                                 );
                              const value = getValue(row, column.key);
                              const content =
                                 column.type === 'status' ? (
                                    <Badge
                                       variant={
                                          ['active', 'paid', 'fulfilled', 'resolved', 'premium'].includes(
                                             String(value).toLowerCase(),
                                          )
                                             ? 'default'
                                             : 'secondary'
                                       }
                                    >
                                       {formatValue(value)}
                                    </Badge>
                                 ) : (
                                    <span className="text-sm">{formatValue(value, column.type)}</span>
                                 );
                              return (
                                 <TableCell
                                    key={column.key}
                                    onClick={() => rowHref && router.push(rowHref(row))}
                                    className={rowHref ? 'cursor-pointer' : undefined}
                                 >
                                    {content}
                                 </TableCell>
                              );
                           })}
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         )}

         {!error && meta.last_page > 1 && (
            <div className="mt-5 flex items-center justify-between">
               <p className="text-xs text-muted-foreground">
                  Page {meta.current_page} of {meta.last_page} · {meta.total.toLocaleString()} records
               </p>
               <Pagination>
                  <PaginationContent>
                     <PaginationItem>
                        <PaginationPrevious
                           onClick={() => setPage((p) => Math.max(1, p - 1))}
                           className={meta.current_page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                     </PaginationItem>
                     <PaginationItem>
                        <PaginationLink isActive>{meta.current_page}</PaginationLink>
                     </PaginationItem>
                     <PaginationItem>
                        <PaginationNext
                           onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                           className={meta.current_page === meta.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                     </PaginationItem>
                  </PaginationContent>
               </Pagination>
            </div>
         )}

         <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogContent className="max-w-[560px]">
               <DialogHeader>
                  <DialogTitle>
                     {editing ? 'Edit' : 'Add'} {resourceName ?? 'record'}
                  </DialogTitle>
               </DialogHeader>

               <div className="flex flex-col gap-4 py-4">
                  {formFields
                     .filter((field) => !field.createOnly || !editing)
                     .map((field) => (
                        <div key={field.key} className="flex flex-col gap-1.5">
                           <Label htmlFor={field.key}>{field.label}</Label>
                           {field.type === 'textarea' ? (
                              <Textarea
                                 id={field.key}
                                 value={form[field.key] ?? ''}
                                 onChange={(event) =>
                                    setForm({ ...form, [field.key]: event.target.value })
                                 }
                              />
                           ) : field.type === 'select' ? (
                              <Select
                                 value={form[field.key] ?? ''}
                                 onValueChange={(value) => setForm({ ...form, [field.key]: value })}
                              >
                                 <SelectTrigger id={field.key}>
                                    <SelectValue placeholder="Select…" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {field.options?.map((option) => (
                                       <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           ) : (
                              <Input
                                 id={field.key}
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
                           )}
                        </div>
                     ))}
                  {error && <p className="text-xs text-red-500">{error}</p>}
               </div>

               <DialogFooter>
                  <Button variant="secondary" onClick={() => setFormOpen(false)}>
                     Cancel
                  </Button>
                  <Button onClick={save} disabled={saving}>
                     {saving ? 'Saving…' : 'Save'}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
};