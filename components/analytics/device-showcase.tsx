import React from 'react';
import { Smartphone } from 'lucide-react';
import dynamic from 'next/dynamic';
const PieChart = dynamic(() => import('@/components/charts/pie-chart').then((module) => module.PieChartComponent), { ssr: false });

export function DeviceShowcase({ platforms }: { platforms: { platform: string; count: number; percentage: number }[] }) {
   const colorFor = (platform: string) => platform.toLowerCase() === 'ios' ? '#f28c18' : platform.toLowerCase() === 'android' ? '#10b981' : '#3b82f6';
   const labelFor = (platform: string) => platform.toLowerCase() === 'ios' ? 'iOS' : platform.toLowerCase() === 'android' ? 'Android' : platform || 'Unknown';
   return <section className="glass-panel mb-5 p-5 sm:p-6"><h2 className="font-semibold">Devices & platforms</h2><p className="mt-1 text-xs text-muted-foreground">Recorded sessions by operating system</p><div className="mt-5 flex flex-row flex-wrap items-center gap-6"><div className="min-w-0 flex-[1_1_240px]"><PieChart embedded size={220} data={platforms.map((item) => ({ label: labelFor(item.platform), value: item.count, color: colorFor(item.platform) }))} /><div className="mt-2 flex flex-wrap justify-center gap-4" aria-label="Platform chart legend">{platforms.map((item) => <span key={item.platform} className="inline-flex items-center gap-2 text-xs font-medium"><span className="size-2.5 rounded-full" style={{ backgroundColor: colorFor(item.platform) }} />{labelFor(item.platform)}</span>)}</div></div><div className="flex flex-[2_1_320px] flex-row flex-wrap gap-4">{['ios', 'android'].map((platform) => {
      const record = platforms.find((item) => item.platform.toLowerCase() === platform);
      const ios = platform === 'ios';
      const color = colorFor(platform);
      return <div key={platform} className="device-showcase-card flex min-w-[150px] flex-1 items-center justify-center gap-5 py-4">
         <div aria-hidden="true" style={{ borderColor: color, color, backgroundColor: `${color}12` }} className={`device-mockup relative flex h-[120px] w-[62px] shrink-0 items-center justify-center rounded-[16px] border-[4px] shadow-lg ${ios ? '-rotate-6' : 'rotate-6'}`}>
            <span style={{ backgroundColor: color }} className={`absolute left-1/2 top-1 -translate-x-1/2 ${ios ? 'h-1 w-4 rounded-full' : 'size-1 rounded-full'}`} />
            <Smartphone size={20} />
         </div>
         <div className="min-w-0"><strong className="block text-xs font-semibold" style={{ color }}>{ios ? 'iPhone · iOS' : 'Android'}</strong><span className="mt-2 block text-2xl font-semibold">{record ? Number(record.count).toLocaleString() : '—'}</span><small className="mt-1 block text-xs text-muted-foreground">{record ? `${record.percentage}% of sessions` : 'No data'}</small></div>
      </div>;
   })}</div></div></section>;
}
