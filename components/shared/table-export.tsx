// components/shared/table-export.tsx
import React, { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown, Download, FileText, Sheet } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export type ExportColumn<Row> = {
   key: string;
   label: string;
   value?: (row: Row) => unknown;
};

type Props<Row> = {
   rows: Row[];
   columns: ExportColumn<Row>[];
   filename: string;
   title?: string;
};

const printable = (value: unknown) => {
   if (value === null || value === undefined) return '';
   if (value instanceof Date) return value.toLocaleString();
   if (Array.isArray(value)) return value.map(printable).join(', ');
   if (typeof value === 'object') return JSON.stringify(value);
   return String(value).replaceAll('_', ' ');
};

const getPath = (row: any, path: string) =>
   path.split('.').reduce((value, key) => value?.[key], row);

const safeName = (value: string) =>
   value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'export';

const download = (blob: Blob, filename: string) => {
   const url = URL.createObjectURL(blob);
   const anchor = document.createElement('a');
   anchor.href = url;
   anchor.download = filename;
   document.body.appendChild(anchor);
   anchor.click();
   anchor.remove();
   window.setTimeout(() => URL.revokeObjectURL(url), 500);
};

const pdfEscape = (value: string) =>
   value.replace(/[^\x20-\x7E]/g, '?').replace(/([\\()])/g, '\\$1');

const createPdf = (lines: string[]) => {
   const pages = Array.from(
      { length: Math.max(1, Math.ceil(lines.length / 46)) },
      (_, index) => lines.slice(index * 46, (index + 1) * 46),
   );
   const objects: string[] = [];
   const add = (value: string) => {
      objects.push(value);
      return objects.length;
   };
   const catalogId = add('');
   const pagesId = add('');
   const fontId = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
   const pageIds: number[] = [];

   pages.forEach((pageLines) => {
      const content = `BT\n/F1 8 Tf\n36 560 Td\n10 TL\n${pageLines
         .map((line, index) => `${index ? 'T*\n' : ''}(${pdfEscape(line.slice(0, 125))}) Tj`)
         .join('\n')}\nET`;
      const contentId = add(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
      const pageId = add(
         `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 792 612] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`,
      );
      pageIds.push(pageId);
   });

   objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
   objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds
      .map((id) => `${id} 0 R`)
      .join(' ')}] /Count ${pageIds.length} >>`;

   let pdf = '%PDF-1.4\n';
   const offsets = [0];
   objects.forEach((object, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
   });

   const xref = pdf.length;
   pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
      .slice(1)
      .map((offset) => `${String(offset).padStart(10, '0')} 00000 n `)
      .join('\n')}\n`;
   pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF`;

   return new Blob([pdf], { type: 'application/pdf' });
};

export function TableExport<Row>({ rows, columns, filename, title = filename }: Props<Row>) {
   const [open, setOpen] = useState(false);

   const matrix = () =>
      rows.map((row) =>
         columns.map((column) => printable(column.value ? column.value(row) : getPath(row, column.key))),
      );

   const exportCsv = () => {
      const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
      const csv = [
         columns.map((column) => quote(column.label)).join(','),
         ...matrix().map((row) => row.map(quote).join(',')),
      ].join('\r\n');
      download(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }), `${safeName(filename)}.csv`);
      setOpen(false);
   };

   const exportPdf = () => {
      const lines = [
         title,
         `Generated ${new Date().toLocaleString()}`,
         '',
         columns.map((column) => column.label).join(' | '),
         '-'.repeat(120),
         ...matrix().map((row) => row.join(' | ')),
      ];
      download(createPdf(lines), `${safeName(filename)}.pdf`);
      setOpen(false);
   };

   return (
      <div className="table-export">
      <DropdownMenu open={open} onOpenChange={setOpen}>
         <DropdownMenuTrigger type="button" className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'table-export-trigger')}>
            <Download size={14} className="mr-2" />
            Export
            <ChevronDown size={13} className="ml-1" />
         </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-56">
               <DropdownMenuItem
                  disabled={!rows.length}
                  onClick={exportCsv}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
               >
                  <Sheet size={15} />
                  <span className="flex flex-col">
                     Export CSV
                     <small className="text-xs text-muted-foreground">Spreadsheet data</small>
                  </span>
               </DropdownMenuItem>
               <DropdownMenuItem
                  disabled={!rows.length}
                  onClick={exportPdf}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
               >
                  <FileText size={15} />
                  <span className="flex flex-col">
                     Export PDF
                     <small className="text-xs text-muted-foreground">Printable report</small>
                  </span>
               </DropdownMenuItem>
            </DropdownMenuContent>
      </DropdownMenu>
      </div>
   );
}
