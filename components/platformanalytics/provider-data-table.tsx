import React from 'react';
import { CircleDollarSign } from 'lucide-react';
import { OverviewCard, OverviewCardGrid } from '@/components/shared/overview-card';

const label = (key: string) => key.replace(/[_-]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
const isObject = (value: unknown): value is Record<string, any> => !!value && typeof value === 'object' && !Array.isArray(value);
const display = (value: any): string => value == null ? '—' : typeof value === 'boolean' ? value ? 'Yes' : 'No' : typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 4 }) : String(value);
const metadata = new Set(['object', 'url', 'next_page', 'previous_page', 'project_id', 'id']);

export function ProviderDataTable({ value }: { value: unknown }) {
   let data = value;
   if (typeof data === 'string') { try { data = JSON.parse(data); } catch {} }
   const metrics: { name: string; value: unknown; unit?: string; description?: string }[] = [];
   const datasets: { name: string; rows: Record<string, unknown>[] }[] = [];
   const walk = (node: unknown, path: string, depth = 0) => {
      if (depth > 8) return;
      if (Array.isArray(node)) {
         if (node.length && node.every(isObject)) {
            if (node.every(item => 'value' in item && ('name' in item || 'display_name' in item || 'id' in item))) {
               node.forEach(item => metrics.push({ name: item.display_name || item.name || label(item.id), value: item.value, unit: item.unit, description: item.description }));
            } else {
               const rows = node.map(item => Object.fromEntries(Object.entries(item).filter(([key, val]) => !metadata.has(key) && (val == null || typeof val !== 'object'))));
               if (rows.some(row => Object.keys(row).length)) datasets.push({ name: path || 'Data points', rows });
               node.forEach(item => Object.entries(item).forEach(([key, val]) => { if (val && typeof val === 'object') walk(val, item.display_name || item.name || label(key), depth + 1); }));
            }
         } else if (node.length) datasets.push({ name: path || 'Values', rows: node.map((item, index) => ({ position: index + 1, value: display(item) })) });
      } else if (isObject(node)) {
         for (const [key, val] of Object.entries(node)) {
            if (metadata.has(key)) continue;
            if (val && typeof val === 'object') walk(val, label(key), depth + 1);
            else if (typeof val === 'number') metrics.push({ name: label(key), value: val });
         }
      }
   };
   walk(data, '');
   if (!metrics.length && !datasets.length) return <div className="rounded-xl border border-dashed border-border px-5 py-10 text-center text-xs text-muted-foreground">No reportable metrics returned for this selection.</div>;
   return <div className="space-y-5">
      {!!metrics.length && <OverviewCardGrid columns={3}>{metrics.map((metric, index) => <OverviewCard key={`${metric.name}-${index}`} label={metric.name} value={display(metric.value)} description={metric.description || metric.unit || 'RevenueCat metric'} icon={CircleDollarSign} color={['#f28c18', '#10b981', '#8b5cf6'][index % 3]} />)}</OverviewCardGrid>}
      {datasets.map((dataset, index) => { const columns = [...new Set(dataset.rows.flatMap(row => Object.keys(row)))]; return <div key={`${dataset.name}-${index}`}><h5 className="mb-3 text-xs font-semibold capitalize">{dataset.name}</h5><div className="max-h-80 overflow-auto rounded-xl border border-border"><table className="w-full text-left"><thead className="sticky top-0 bg-background"><tr>{columns.map(key => <th key={key} className="whitespace-nowrap">{label(key)}</th>)}</tr></thead><tbody>{dataset.rows.map((row, i) => <tr key={i}>{columns.map(key => <td key={key} className="tabular-nums">{display(row[key])}</td>)}</tr>)}</tbody></table></div></div>; })}
   </div>;
}
