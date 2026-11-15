import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MetricCard } from '@/components/analytics/metric-card';
import { TableExport } from '@/components/shared/table-export';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { LineChartComponent } from '@/components/charts/line-chart';
import {
    getSessionStats,
    getSessions,
    SessionStats,
    UserSession,
} from '@/services/sessionService';

const platformOptions = [
    { value: 'all', label: 'All Platforms' },
    { value: 'ios', label: 'iOS' },
    { value: 'android', label: 'Android' },
];

const dateRangeOptions = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' },
];

function formatDuration(seconds: number | null): string {
    if (seconds == null) return '—';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
}

function formatDate(dateStr: string): string {
    try {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return dateStr;
    }
}

function formatScreenName(value?: string | null): string {
    return value?.trim() === '/' ? 'Homescreen' : value || '—';
}

function getDateRange(days: string): { date_from: string; date_to: string } {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - parseInt(days, 10));
    return {
        date_from: from.toISOString().split('T')[0],
        date_to: to.toISOString().split('T')[0],
    };
}

function getTopPlatform(breakdown: Record<string, number>): string {
    if (!breakdown || Object.keys(breakdown).length === 0) return '—';
    return Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0][0].toUpperCase();
}

const ActivityPage = () => {
    const [dateRange, setDateRange] = useState('30');
    const [platform, setPlatform] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState<SessionStats | null>(null);
    const [sessions, setSessions] = useState<UserSession[]>([]);
    const [sessionsMeta, setSessionsMeta] = useState<any>(null);
    const [page, setPage] = useState(1);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const { date_from, date_to } = getDateRange(dateRange);
        try {
            const [statsRes, sessionsRes] = await Promise.all([
                getSessionStats({ date_from, date_to, platform: platform === 'all' ? undefined : platform }),
                getSessions({ date_from, date_to, platform: platform === 'all' ? undefined : platform, page, per_page: 20 }),
            ]);
            setStats(statsRes);
            setSessions(sessionsRes.data);
            setSessionsMeta(sessionsRes.meta);
        } catch (err) {
            console.error('Failed to fetch session data:', err);
        } finally {
            setIsLoading(false);
        }
    }, [dateRange, page, platform]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const dailyChartData = stats
        ? [{
            label: 'Daily Opens',
            color: '#3f3bef',
            data: stats.daily_opens.map((d) => ({ date: d.date.slice(5), value: d.count })),
        }]
        : [];

    const statCards = stats
        ? [
            { id: 'total_sessions', name: 'Total Sessions', value: stats.total_sessions.toLocaleString(), change: 0, changeType: 'neutral' as const, color: '#3f3bef' },
            { id: 'unique_users', name: 'Unique Users', value: stats.unique_users.toLocaleString(), change: 0, changeType: 'neutral' as const, color: '#10b981' },
            { id: 'avg_duration', name: 'Avg Session', value: formatDuration(stats.avg_duration_secs), change: 0, changeType: 'neutral' as const, color: '#f59e0b' },
            { id: 'top_platform', name: 'Top Platform', value: getTopPlatform(stats.platform_breakdown), change: 0, changeType: 'neutral' as const, color: '#6366f1' },
        ]
        : [];

    return (
        <div className="h-[calc(100vh-100px)] overflow-auto p-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">User Activity</h2>
                    <p className="mt-2 text-muted-foreground">Track who opened the app, when, and what they did</p>
                </div>
                <div className="flex gap-4">
                    <Select value={platform} onValueChange={(v) => { setPlatform(v); setPage(1); }}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Platform" /></SelectTrigger>
                        <SelectContent>
                            {platformOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={dateRange} onValueChange={(v) => { setDateRange(v); setPage(1); }}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Date Range" /></SelectTrigger>
                        <SelectContent>
                            {dateRangeOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading && !stats ? (
                <div className="flex justify-center py-20">
                    <AppLoadingState message="Loading activity analytics…" />
                </div>
            ) : (
                <>
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        {statCards.map((metric) => <MetricCard key={metric.id} metric={metric} />)}
                    </div>

                    {dailyChartData.length > 0 && dailyChartData[0].data.length > 1 && (
                        <div className="mb-8">
                            <LineChartComponent data={dailyChartData} height={300} title="Daily App Opens" />
                        </div>
                    )}

                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Card className="p-6">
                            <CardHeader className="p-0 pb-4"><h4 className="text-lg font-semibold">Top Screens</h4></CardHeader>
                            <CardContent className="p-0">
                                {stats?.top_screens && stats.top_screens.length > 0 ? (
                                    stats.top_screens.map((s, i) => (
                                        <div key={i} className="flex items-center justify-between border-b py-2 last:border-b-0">
                                            <span className="text-sm">{formatScreenName(s.last_screen)}</span>
                                            <span className="text-sm font-semibold" style={{ color: '#3f3bef' }}>{s.count}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No screen data yet</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="p-6">
                            <CardHeader className="p-0 pb-4"><h4 className="text-lg font-semibold">Platform Breakdown</h4></CardHeader>
                            <CardContent className="p-0">
                                {stats?.platform_breakdown && Object.keys(stats.platform_breakdown).length > 0 ? (
                                    Object.entries(stats.platform_breakdown).map(([plat, count]) => {
                                        const total = Object.values(stats.platform_breakdown).reduce((a, b) => a + b, 0);
                                        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                        return (
                                            <div key={plat} className="mb-4 flex flex-col">
                                                <div className="mb-1 flex justify-between">
                                                    <span className="text-sm capitalize">{plat}</span>
                                                    <span className="text-sm font-semibold">{count} ({pct}%)</span>
                                                </div>
                                                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: plat === 'ios' ? '#3f3bef' : '#10b981' }} />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-muted-foreground">No platform data yet</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="p-6">
                        <CardHeader className="p-0 pb-4">
                            <div className="flex w-full items-center justify-between">
                                <h4 className="text-lg font-semibold">Sessions</h4>
                                <div className="flex items-center gap-3">
                                    {sessionsMeta && <span className="text-sm text-muted-foreground">{sessionsMeta.total.toLocaleString()} total</span>}
                                    <TableExport
                                        rows={sessions}
                                        filename="activity-sessions"
                                        title="Activity sessions"
                                        columns={[
                                            { key: 'user.name', label: 'User' },
                                            { key: 'user.email', label: 'Email' },
                                            { key: 'platform', label: 'Platform' },
                                            { key: 'device_model', label: 'Device' },
                                            { key: 'last_screen', label: 'Last screen', value: (s) => formatScreenName(s.last_screen) },
                                            { key: 'duration_seconds', label: 'Duration', value: (s) => formatDuration(s.duration_seconds) },
                                            { key: 'opened_at', label: 'Opened' },
                                        ]}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {sessions.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No sessions found for the selected filters.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Platform</TableHead>
                                            <TableHead>Device</TableHead>
                                            <TableHead>Last Screen</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Opened At</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sessions.map((session) => (
                                            <TableRow key={session.id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold">{session.user?.name ?? `User #${session.user_id}`}</span>
                                                        <span className="text-xs text-muted-foreground">{session.user?.email ?? ''}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell><span className="text-sm capitalize">{session.platform ?? '—'}</span></TableCell>
                                                <TableCell><span className="text-sm">{session.device_model ?? '—'}</span></TableCell>
                                                <TableCell><span className="text-sm">{formatScreenName(session.last_screen)}</span></TableCell>
                                                <TableCell><span className="text-sm">{formatDuration(session.duration_seconds)}</span></TableCell>
                                                <TableCell><span className="text-sm">{formatDate(session.opened_at)}</span></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}

                            {sessionsMeta && sessionsMeta.last_page > 1 && (
                                <div className="mt-6 flex items-center justify-center gap-4">
                                    <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
                                    <span className="text-sm">Page {sessionsMeta.current_page} of {sessionsMeta.last_page}</span>
                                    <Button variant="secondary" size="sm" disabled={page >= sessionsMeta.last_page} onClick={() => setPage((p) => p + 1)}>Next</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
};

export default ActivityPage;