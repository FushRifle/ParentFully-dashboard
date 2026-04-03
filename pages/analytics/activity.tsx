import React, { useEffect, useState } from 'react';
import { Grid, Text, Button, Card, Table, Loading } from '@nextui-org/react';

import { Select } from '../../components/styles/select';
import { Box } from '../../components/styles/box';
import { Flex } from '../../components/styles/flex';
import { RefreshCw } from 'lucide-react';

import { LineChart } from '../../components/charts/line-chart';
import { MetricCard } from '../../components/analytics/metric-card';

import {
    getSessionStats,
    getSessions,
    SessionStats,
    UserSession,
} from '../../services/sessionService';

const platformOptions = [
    { value: '', label: <Text size="$sm">All Platforms</Text> },
    { value: 'ios', label: <Text size="$sm">iOS</Text> },
    { value: 'android', label: <Text size="$sm">Android</Text> },
];

const dateRangeOptions = [
    { value: '7', label: <Text size="$sm">Last 7 days</Text> },
    { value: '30', label: <Text size="$sm">Last 30 days</Text> },
    { value: '90', label: <Text size="$sm">Last 90 days</Text> },
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
    const [platform, setPlatform] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [stats, setStats] = useState<SessionStats | null>(null);
    const [sessions, setSessions] = useState<UserSession[]>([]);
    const [sessionsMeta, setSessionsMeta] = useState<any>(null);
    const [page, setPage] = useState(1);

    const fetchData = async () => {
        setIsLoading(true);
        const { date_from, date_to } = getDateRange(dateRange);
        try {
            const [statsRes, sessionsRes] = await Promise.all([
                getSessionStats({ date_from, date_to }),
                getSessions({ date_from, date_to, platform: platform || undefined, page, per_page: 20 }),
            ]);
            setStats(statsRes);
            setSessions(sessionsRes.data);
            setSessionsMeta(sessionsRes.meta);
        } catch (err) {
            console.error('Failed to fetch session data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dateRange, platform, page]);

    const dailyChartData = stats
        ? [
              {
                  label: 'Daily Opens',
                  color: '#3f3bef',
                  data: stats.daily_opens.map((d) => ({
                      date: d.date.slice(5), // MM-DD
                      value: d.count,
                  })),
              },
          ]
        : [];

    const statCards = stats
        ? [
              {
                  id: 'total_sessions',
                  name: 'Total Sessions',
                  value: stats.total_sessions.toLocaleString(),
                  change: 0,
                  changeType: 'neutral' as const,
                  color: '#3f3bef',
              },
              {
                  id: 'unique_users',
                  name: 'Unique Users',
                  value: stats.unique_users.toLocaleString(),
                  change: 0,
                  changeType: 'neutral' as const,
                  color: '#10b981',
              },
              {
                  id: 'avg_duration',
                  name: 'Avg Session',
                  value: formatDuration(stats.avg_duration_secs),
                  change: 0,
                  changeType: 'neutral' as const,
                  color: '#f59e0b',
              },
              {
                  id: 'top_platform',
                  name: 'Top Platform',
                  value: getTopPlatform(stats.platform_breakdown),
                  change: 0,
                  changeType: 'neutral' as const,
                  color: '#6366f1',
              },
          ]
        : [];

    return (
        <Box css={{ p: '$10', overflow: 'auto', height: 'calc(100vh - 100px)' }}>
            {/* Header */}
            <Flex justify="between" align="center" css={{ mb: '$8' }}>
                <Box>
                    <Text h2>User Activity</Text>
                    <Text color="$accents7" css={{ mt: '$2' }}>
                        Track who opened the app, when, and what they did
                    </Text>
                </Box>

                <Flex css={{ gap: '$4' }}>
                    <Select
                        placeholder="Platform"
                        value={platform}
                        onChange={setPlatform}
                        css={{ minWidth: '150px' }}
                        options={platformOptions}
                    />
                    <Select
                        placeholder="Date Range"
                        value={dateRange}
                        onChange={setDateRange}
                        css={{ minWidth: '150px' }}
                        options={dateRangeOptions}
                    />
                    <Button
                        auto
                        light
                        icon={<RefreshCw size={16} className={isLoading ? 'spin' : ''} />}
                        onPress={fetchData}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Refresh'}
                    </Button>
                </Flex>
            </Flex>

            {/* Stat Cards */}
            {isLoading && !stats ? (
                <Flex justify="center" css={{ py: '$20' }}>
                    <Loading size="lg" />
                </Flex>
            ) : (
                <>
                    <Grid.Container gap={2} css={{ mb: '$8' }}>
                        {statCards.map((metric) => (
                            <Grid xs={12} sm={6} md={3} key={metric.id}>
                                <MetricCard metric={metric} />
                            </Grid>
                        ))}
                    </Grid.Container>

                    {/* Daily Opens Line Chart */}
                    {dailyChartData.length > 0 && dailyChartData[0].data.length > 1 && (
                        <Box css={{ mb: '$8' }}>
                            <LineChart
                                data={dailyChartData}
                                height={300}
                                title="Daily App Opens"
                                showLegend
                            />
                        </Box>
                    )}

                    {/* Top Screens + Platform Breakdown */}
                    <Grid.Container gap={2} css={{ mb: '$8' }}>
                        <Grid xs={12} md={6}>
                            <Card css={{ p: '$6' }} variant="flat">
                                <Card.Header>
                                    <Text h4>Top Screens</Text>
                                </Card.Header>
                                <Card.Body>
                                    {stats?.top_screens && stats.top_screens.length > 0 ? (
                                        stats.top_screens.map((s, i) => (
                                            <Flex key={i} justify="between" align="center" css={{ py: '$2', borderBottom: '1px solid $accents1' }}>
                                                <Text size="$sm">{s.last_screen}</Text>
                                                <Text b size="$sm" css={{ color: '#3f3bef' }}>{s.count}</Text>
                                            </Flex>
                                        ))
                                    ) : (
                                        <Text color="$accents7" size="$sm">No screen data yet</Text>
                                    )}
                                </Card.Body>
                            </Card>
                        </Grid>

                        <Grid xs={12} md={6}>
                            <Card css={{ p: '$6' }} variant="flat">
                                <Card.Header>
                                    <Text h4>Platform Breakdown</Text>
                                </Card.Header>
                                <Card.Body>
                                    {stats?.platform_breakdown && Object.keys(stats.platform_breakdown).length > 0 ? (
                                        Object.entries(stats.platform_breakdown).map(([plat, count]) => {
                                            const total = Object.values(stats.platform_breakdown).reduce((a, b) => a + b, 0);
                                            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                            return (
                                                <Flex key={plat} direction="column" css={{ mb: '$4' }}>
                                                    <Flex justify="between" css={{ mb: '$1' }}>
                                                        <Text size="$sm" css={{ textTransform: 'capitalize' }}>{plat}</Text>
                                                        <Text size="$sm" b>{count} ({pct}%)</Text>
                                                    </Flex>
                                                    <Box css={{ height: '6px', bg: '$accents2', borderRadius: '$full', overflow: 'hidden' }}>
                                                        <Box css={{ width: `${pct}%`, height: '100%', bg: plat === 'ios' ? '#3f3bef' : '#10b981', borderRadius: '$full' }} />
                                                    </Box>
                                                </Flex>
                                            );
                                        })
                                    ) : (
                                        <Text color="$accents7" size="$sm">No platform data yet</Text>
                                    )}
                                </Card.Body>
                            </Card>
                        </Grid>
                    </Grid.Container>

                    {/* Sessions Table */}
                    <Card css={{ p: '$6' }} variant="flat">
                        <Card.Header>
                            <Flex justify="between" align="center" css={{ width: '100%' }}>
                                <Text h4>Sessions</Text>
                                {sessionsMeta && (
                                    <Text size="$sm" color="$accents7">
                                        {sessionsMeta.total.toLocaleString()} total
                                    </Text>
                                )}
                            </Flex>
                        </Card.Header>
                        <Card.Body>
                            {sessions.length === 0 ? (
                                <Text color="$accents7" size="$sm">No sessions found for the selected filters.</Text>
                            ) : (
                                <Table
                                    aria-label="Sessions table"
                                    css={{ minWidth: '100%', height: 'auto' }}
                                    shadow={false}
                                >
                                    <Table.Header>
                                        <Table.Column>User</Table.Column>
                                        <Table.Column>Platform</Table.Column>
                                        <Table.Column>Device</Table.Column>
                                        <Table.Column>Last Screen</Table.Column>
                                        <Table.Column>Duration</Table.Column>
                                        <Table.Column>Opened At</Table.Column>
                                    </Table.Header>
                                    <Table.Body>
                                        {sessions.map((session) => (
                                            <Table.Row key={session.id}>
                                                <Table.Cell>
                                                    <Flex direction="column">
                                                        <Text size="$sm" b>{session.user?.name ?? `User #${session.user_id}`}</Text>
                                                        <Text size="$xs" color="$accents7">{session.user?.email ?? ''}</Text>
                                                    </Flex>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Text size="$sm" css={{ textTransform: 'capitalize' }}>
                                                        {session.platform ?? '—'}
                                                    </Text>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Text size="$sm">{session.device_model ?? '—'}</Text>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Text size="$sm">{session.last_screen ?? '—'}</Text>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Text size="$sm">{formatDuration(session.duration_seconds)}</Text>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Text size="$sm">{formatDate(session.opened_at)}</Text>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            )}

                            {/* Pagination */}
                            {sessionsMeta && sessionsMeta.last_page > 1 && (
                                <Flex justify="center" css={{ mt: '$6', gap: '$4' }}>
                                    <Button
                                        auto
                                        flat
                                        disabled={page <= 1}
                                        onPress={() => setPage((p) => Math.max(1, p - 1))}
                                        size="sm"
                                    >
                                        Previous
                                    </Button>
                                    <Text size="$sm" css={{ alignSelf: 'center' }}>
                                        Page {sessionsMeta.current_page} of {sessionsMeta.last_page}
                                    </Text>
                                    <Button
                                        auto
                                        flat
                                        disabled={page >= sessionsMeta.last_page}
                                        onPress={() => setPage((p) => p + 1)}
                                        size="sm"
                                    >
                                        Next
                                    </Button>
                                </Flex>
                            )}
                        </Card.Body>
                    </Card>
                </>
            )}

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </Box>
    );
};

export default ActivityPage;
