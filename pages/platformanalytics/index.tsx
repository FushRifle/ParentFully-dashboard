import Link from 'next/link';
import { BarChart3, ArrowUpRight } from 'lucide-react';
import { ProviderAnalytics } from '@/components/platformanalytics/provider-analytics';

export default function PlatformAnalyticsPage() {
   return <div className="admin-page space-y-5">
      <header className="glass-panel glass-hero platform-analytics-hero">
         <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4"><span className="analytics-hero-icon"><BarChart3 size={20} /></span><div><p className="section-kicker">Connected insights</p><h1 className="mt-1 text-xl font-semibold">Platform Analytics</h1><p className="mt-1 text-sm text-muted-foreground">App behaviour from PostHog. Subscription billing from RevenueCat.</p></div></div>
            <Link href="/analytics" className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:bg-muted">Internal analytics <ArrowUpRight size={14} /></Link>
         </div>
         <div className="mt-5 flex flex-wrap gap-5 border-t border-border/60 pt-4">
            <div className="min-w-[180px] flex-1"><h2 className="text-sm font-semibold text-primary">PostHog · App activity</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Behavioural events captured by the app’s PostHog integration.</p></div>
            <div className="min-w-[180px] flex-1"><h2 className="text-sm font-semibold text-emerald-500">RevenueCat · Billing</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Provider billing metrics and stored webhook events. Manual premium access is managed separately in Subscriptions.</p></div>
         </div>
      </header>
      <ProviderAnalytics />
   </div>;
}
