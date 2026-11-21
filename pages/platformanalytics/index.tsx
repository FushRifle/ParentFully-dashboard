import Link from 'next/link';
import { useState } from 'react';
import { SegmentedTabs } from '@/components/shared/segmented-tabs';
import { BarChart3, ArrowUpRight } from 'lucide-react';
import { ProviderAnalytics } from '@/components/platformanalytics/provider-analytics';

export default function PlatformAnalyticsPage() {
   const [source, setSource] = useState<'posthog' | 'revenuecat'>('posthog');

   return (
      <div className="admin-page space-y-5">
         <header className="glass-panel glass-hero platform-analytics-hero">
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div className="flex items-center gap-4">
                  <span className="analytics-hero-icon">
                     <BarChart3 size={20} />
                  </span>
                  <div>
                     <p className="section-kicker">Connected insights</p>
                     <h1 className="mt-1 text-xl font-semibold">Platform Analytics</h1>
                     <p className="mt-1 text-sm text-muted-foreground">
                        App behaviour from PostHog. Subscription billing from RevenueCat.
                     </p>
                  </div>
               </div>

               <div className="flex flex-wrap items-center gap-3">
                  <SegmentedTabs
                     value={source}
                     onChange={(value) => setSource(value as 'posthog' | 'revenuecat')}
                     ariaLabel="Analytics provider"
                     tabs={[
                        { value: 'posthog', label: 'PostHog' },
                        { value: 'revenuecat', label: 'RevenueCat' },
                     ]}
                  />
                  <Link
                     href="/analytics"
                     className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
                  >
                     Internal analytics <ArrowUpRight size={14} />
                  </Link>
               </div>
            </div>
            <ProviderAnalytics key={source} source={source} />
         </header>
      </div>
   );
}