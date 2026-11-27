import React, { createContext, useContext } from 'react';
import NextLink from 'next/link';
import { Button as LumaButton } from './button';
import { Card as LumaCard, CardContent, CardFooter, CardHeader } from './card';
import { Badge as LumaBadge } from './badge';
import { Input as LumaInput } from './input';
import { Textarea as LumaTextarea } from './textarea';
import { Switch as LumaSwitch } from './switch';
import { cn } from '@/lib/utils';

export type CSS = React.CSSProperties & Record<string, any>;

const spacing: Record<string, string> = {
  '$1': '.25rem', '$2': '.5rem', '$3': '.75rem', '$4': '1rem', '$5': '1.25rem',
  '$6': '1.5rem', '$7': '1.75rem', '$8': '2rem', '$9': '2.25rem', '$10': '2.5rem', '$12': '3rem',
};
const colors: Record<string, string> = {
  '$text': 'var(--foreground)', '$background': 'var(--background)', '$border': 'var(--border)',
  '$primary': 'var(--primary)', '$error': 'var(--destructive)', '$success': '#10b981',
  '$accents0': 'var(--background)', '$accents1': 'var(--muted)', '$accents2': 'var(--muted)',
  '$accents6': 'var(--muted-foreground)', '$accents7': 'var(--muted-foreground)',
};

export function cssToStyle(css?: CSS): React.CSSProperties | undefined {
  if (!css) return undefined;
  const result: Record<string, any> = {};
  const aliases: Record<string, string[]> = {
    p: ['padding'], px: ['paddingLeft', 'paddingRight'], py: ['paddingTop', 'paddingBottom'],
    m: ['margin'], mx: ['marginLeft', 'marginRight'], my: ['marginTop', 'marginBottom'],
    mt: ['marginTop'], mb: ['marginBottom'], ml: ['marginLeft'], mr: ['marginRight'],
    pt: ['paddingTop'], pb: ['paddingBottom'], pl: ['paddingLeft'], pr: ['paddingRight'],
    bg: ['background'], maxW: ['maxWidth'], minW: ['minWidth'], maxH: ['maxHeight'], minH: ['minHeight'],
  };
  for (const [key, raw] of Object.entries(css)) {
    if (key.startsWith('&') || key.startsWith('@')) continue;
    const value = typeof raw === 'string' ? (spacing[raw] ?? colors[raw] ?? raw) : raw;
    const targets = aliases[key] ?? [key];
    targets.forEach((target) => { result[target] = value; });
  }
  return result;
}

const clean = (props: Record<string, any>) => {
  const { css, auto, flat, bordered, shadow, animated, rounded, clickable, fullWidth, light,
    icon, contentLeft, contentRight, helperText, helperColor, status, color, size, weight,
    transform, h1, h2, h3, h4, h5, h6, b, block, span, labelPlaceholder, onPress,
    isDisabled, initialValue, minRows, maxRows, ...html } = props;
  return { html, style: cssToStyle(css), icon, contentLeft, contentRight, labelPlaceholder, onPress, isDisabled, initialValue, minRows, maxRows };
};

export const Box = React.forwardRef<HTMLDivElement, any>(({ as: Tag = 'div', css, ...props }, ref) =>
  <Tag ref={ref} style={{ ...cssToStyle(css), ...props.style }} {...props} />);
Box.displayName = 'Box';

export const Text = React.forwardRef<HTMLElement, any>((props, ref) => {
  const { html, style } = clean(props);
  const Tag = props.h1 ? 'h1' : props.h2 ? 'h2' : props.h3 ? 'h3' : props.h4 ? 'h4' : props.h5 ? 'h5' : props.h6 ? 'h6' : props.b ? 'strong' : props.span ? 'span' : 'p';
  return <Tag ref={ref as any} style={{ margin: 0, fontWeight: props.weight, ...style, ...props.style }} {...html} />;
});
Text.displayName = 'Text';

export const Button = React.forwardRef<HTMLButtonElement, any>((props, ref) => {
  const { html, style, icon, onPress, isDisabled } = clean(props);
  const variant = props.color === 'error' ? 'destructive' : props.flat || props.light ? 'ghost' : props.bordered ? 'outline' : 'default';
  return <LumaButton ref={ref} variant={variant as any} size={props.size === 'xs' ? 'xs' : props.size === 'sm' ? 'sm' : 'default'} onClick={onPress ?? props.onClick} disabled={isDisabled ?? props.disabled} style={{ ...style, ...props.style }} {...html}>{icon}{props.children}</LumaButton>;
});
Button.displayName = 'Button';

const CardRoot = React.forwardRef<HTMLDivElement, any>(({ css, ...props }, ref) => <LumaCard ref={ref} style={{ ...cssToStyle(css), ...props.style }} {...props} />);
CardRoot.displayName = 'Card';
const LegacyCardHeader = ({ css, style, ...props }: any) => <CardHeader style={{ ...cssToStyle(css), ...style }} {...props} />;
const LegacyCardBody = ({ css, style, ...props }: any) => <CardContent style={{ ...cssToStyle(css), ...style }} {...props} />;
const LegacyCardFooter = ({ css, style, ...props }: any) => <CardFooter style={{ ...cssToStyle(css), ...style }} {...props} />;
export const Card = Object.assign(CardRoot, { Header: LegacyCardHeader, Body: LegacyCardBody, Footer: LegacyCardFooter });

export const Badge = ({ children, css, color, ...props }: any) => <LumaBadge variant={color === 'error' ? 'destructive' : color === 'default' ? 'secondary' : 'outline'} style={cssToStyle(css)} {...props}>{children}</LumaBadge>;

const InputRoot = React.forwardRef<HTMLInputElement, any>((props, ref) => {
  const { html, style, contentLeft, contentRight, labelPlaceholder, initialValue } = clean(props);
  const input = <LumaInput ref={ref} placeholder={props.placeholder ?? labelPlaceholder} defaultValue={props.defaultValue ?? initialValue} style={{ ...style, ...props.style }} {...html} />;
  return contentLeft || contentRight ? <span className="relative flex items-center">{contentLeft && <span className="absolute left-3 z-10">{contentLeft}</span>}{React.cloneElement(input, { className: cn(contentLeft && 'pl-9', contentRight && 'pr-9', props.className) })}{contentRight && <span className="absolute right-3">{contentRight}</span>}</span> : input;
});
InputRoot.displayName = 'Input';
export const Input = Object.assign(InputRoot, { Password: React.forwardRef<HTMLInputElement, any>((props, ref) => <InputRoot ref={ref} type="password" {...props} />) });

export const Textarea = React.forwardRef<HTMLTextAreaElement, any>((props, ref) => {
  const { html, style, labelPlaceholder, initialValue, minRows, maxRows } = clean(props);
  return <LumaTextarea ref={ref} placeholder={props.placeholder ?? labelPlaceholder} defaultValue={props.defaultValue ?? initialValue} rows={minRows} style={{ ...style, ...props.style, maxHeight: maxRows ? `${maxRows * 1.5}rem` : undefined }} {...html} />;
});
Textarea.displayName = 'Textarea';

export const Switch = ({ checked, onChange, onCheckedChange, ...props }: any) => <LumaSwitch checked={checked} onCheckedChange={(value) => { onCheckedChange?.(value); onChange?.({ target: { checked: value } }); }} {...props} />;
export const Checkbox = ({ isSelected, checked, onChange, children, ...props }: any) => <label className="inline-flex items-center gap-2"><input type="checkbox" checked={isSelected ?? checked} onChange={onChange} {...props} />{children}</label>;
export const Divider = (props: any) => <hr className="my-3 border-border" {...props} />;
export const Spacer = ({ y = 1, x = 0 }: any) => <span aria-hidden style={{ display: 'block', height: `${y * .5}rem`, width: `${x * .5}rem` }} />;
export const Loading = ({ children }: any) => <span className="inline-flex items-center gap-2"><span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />{children}</span>;
export const Progress = ({ value = 0, max = 100, css, ...props }: any) => <progress value={value} max={max} style={cssToStyle(css)} {...props} />;
export const Container = ({ children, css, ...props }: any) => <div className="mx-auto w-full max-w-7xl px-4" style={cssToStyle(css)} {...props}>{children}</div>;
export const Row = ({ children, css, ...props }: any) => <div className="flex" style={cssToStyle(css)} {...props}>{children}</div>;
export const Col = ({ children, css, ...props }: any) => <div className="min-w-0 flex-1" style={cssToStyle(css)} {...props}>{children}</div>;

const GridRoot = ({ children, css, ...props }: any) => <div style={cssToStyle(css)} {...props}>{children}</div>;
const GridContainer = ({ children, gap = 1, css, ...props }: any) => <div className="grid grid-cols-12" style={{ gap: `${gap * .5}rem`, ...cssToStyle(css) }} {...props}>{children}</div>;
export const Grid = Object.assign(GridRoot, { Container: GridContainer });

export const Avatar = Object.assign(({ src, text, name, size, ...props }: any) => <span className="inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold" {...props}>{src ? <img src={src} alt={name ?? ''} className="h-full w-full object-cover" /> : text ?? name?.slice(0, 2)?.toUpperCase()}</span>, { Group: ({ children }: any) => <span className="flex -space-x-2">{children}</span> });
export const User = ({ name, description, src }: any) => <span className="inline-flex items-center gap-2"><Avatar src={src} name={name}/><span><strong className="block">{name}</strong><small>{description}</small></span></span>;
export const Link = ({ href, children, ...props }: any) => <NextLink href={href} {...props}>{children}</NextLink>;

const ModalRoot = ({ open, onClose, children, ...props }: any) => !open ? null : <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}><div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl border bg-background p-5 shadow-2xl" {...props}>{children}</div></div>;
export const Modal = Object.assign(ModalRoot, {
  Header: ({ children, ...props }: any) => <header className="mb-4 text-lg font-semibold" {...props}>{children}</header>,
  Body: ({ children, ...props }: any) => <div className="space-y-4" {...props}>{children}</div>,
  Footer: ({ children, ...props }: any) => <footer className="mt-5 flex justify-end gap-2" {...props}>{children}</footer>,
});

const TableItemsContext = createContext<any[]>([]);
const TableRoot = ({ children, css, shadow: _shadow, ...props }: any) => <div className="w-full overflow-x-auto"><table className="w-full caption-bottom text-sm" style={cssToStyle(css)} {...props}>{children}</table></div>;
const TableHeader = ({ children }: any) => <thead className="border-b">{children}</thead>;
const TableBody = ({ children, items = [] }: any) => <TableItemsContext.Provider value={items}><tbody>{typeof children === 'function' ? items.map((item: any) => children(item)) : children}</tbody></TableItemsContext.Provider>;
const TableRow = ({ children, ...props }: any) => <tr className="border-b transition-colors hover:bg-muted/50" {...props}>{children}</tr>;
const TableColumn = ({ children, ...props }: any) => <th className="h-10 px-3 text-left align-middle text-xs font-medium text-muted-foreground" {...props}>{children}</th>;
const TableCell = ({ children, ...props }: any) => <td className="p-3 align-middle" {...props}>{children}</td>;
export const Table = Object.assign(TableRoot, { Header: TableHeader, Body: TableBody, Row: TableRow, Column: TableColumn, Cell: TableCell, Pagination: () => null });

export const Pagination = ({ page = 1, total = 1, onChange }: any) => <nav className="flex items-center gap-2"><Button size="md" bordered disabled={page <= 1} onClick={() => onChange?.(page - 1)}>Previous</Button><span className="text-sm text-muted-foreground">{page} / {total}</span><Button size="md" bordered disabled={page >= total} onClick={() => onChange?.(page + 1)}>Next</Button></nav>;

export function styled(Tag: any, base: CSS = {}) {
  return React.forwardRef<any, any>(({ css, ...props }, ref) => <Tag ref={ref} style={{ ...cssToStyle(base), ...cssToStyle(css), ...props.style }} {...props} />);
}
