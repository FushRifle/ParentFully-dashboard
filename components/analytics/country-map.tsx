import React from 'react';
import { useQuery } from '@tanstack/react-query';

const national: Record<string, string> = { nigeria: '#008751', 'united states of america': '#b22234', 'united kingdom': '#244b91', canada: '#d52b1e', india: '#ff9933', germany: '#d99b08', france: '#244b91', australia: '#244b91', brazil: '#009739', ghana: '#ce9d12', kenya: '#16834a', 'south africa': '#007749', pakistan: '#147b47', ireland: '#169b62', spain: '#d7a200', italy: '#009246', china: '#de2910', japan: '#bc002d' };
const aliases: Record<string, string> = { us: 'united states of america', usa: 'united states of america', 'united states': 'united states of america', uk: 'united kingdom', gb: 'united kingdom', uae: 'united arab emirates', 'republic of korea': 'south korea' };
function countryKey(value: string) {
   let name = value.trim();
   if (/^[a-z]{2}$/i.test(name) && !aliases[name.toLowerCase()]) {
      try { name = new Intl.DisplayNames(['en'], { type: 'region' }).of(name.toUpperCase()) || name; } catch {}
   }
   const key = name.toLowerCase();
   return aliases[key] || key;
}
function colorFor(key: string) {
   const palette = ['#8b5cf6', '#0891b2', '#db2777', '#ea580c', '#4f46e5'];
   return national[key] || palette[Array.from(key).reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length];
}
function pathFor(geometry: any) {
   const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.type === 'MultiPolygon' ? geometry.coordinates : [];
   return polygons.flatMap((polygon: number[][][]) => polygon.map((ring) => ring.map(([x, y], i) => `${i ? 'L' : 'M'}${((x + 180) * 2).toFixed(1)},${((85 - y) * 2).toFixed(1)}`).join(' ') + 'Z')).join(' ');
}
export function CountryMap({ countries }: { countries: { country: string; count: number }[] }) {
   const map = useQuery({ queryKey: ['world-boundaries'], staleTime: Infinity, queryFn: async () => { const res = await fetch('/world-countries.geo.json'); if (!res.ok) throw new Error('Map unavailable'); return res.json(); } });
   const records = new Map(countries.map((country) => [countryKey(country.country), country]));
   const max = Math.max(1, ...countries.map((country) => country.count));
   return <div><div className="mb-4 rounded-xl border border-border bg-muted/20 p-3">{map.data ? <svg viewBox="0 0 720 330" role="img" aria-label="Countries highlighted to match the country rankings" className="h-auto w-full">{map.data.features.filter((f: any) => f.properties.name !== 'Antarctica').map((feature: any) => { const key = countryKey(feature.properties.name); const record = records.get(key); return <path key={[feature.id, key].join(":")} d={pathFor(feature.geometry)} fill={record ? colorFor(key) : 'var(--muted-foreground)'} fillOpacity={record ? 0.9 : 0.15} stroke="var(--background)" strokeWidth={0.6} fillRule="evenodd"><title>{feature.properties.name}{record ? `: ${record.count.toLocaleString()} users` : ''}</title></path>; })}</svg> : <p className="py-12 text-center text-xs text-muted-foreground">{map.isError ? 'Map unavailable. Country figures are shown below.' : 'Loading country map…'}</p>}</div><div className="space-y-3">{countries.map((country) => { const color = colorFor(countryKey(country.country)); return <div key={country.country}><div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><span className="inline-flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />{country.country || 'Unknown'}</span><span className="text-muted-foreground">{country.count.toLocaleString()} users</span></div><div className="h-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${country.count / max * 100}%`, backgroundColor: color }} /></div></div>; })}</div></div>;
}
