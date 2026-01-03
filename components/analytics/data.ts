export interface AnalyticsMetric {
     id: string;
     name: string;
     value: number | string;
     change: number;
     changeType: 'increase' | 'decrease' | 'neutral';
     color: string;
}

export interface ChartDataPoint {
     date: string;
     value: number;
}

export interface LineChartData {
     label: string;
     data: ChartDataPoint[];
     color: string;
}

export interface BarChartData {
     label: string;
     value: number;
     color: string;
}

export interface TopContent {
     id: string;
     title: string;
     views: number;
     engagement: number;
     change: number;
}

export interface UserActivity {
     time: string;
     users: number;
     pageViews: number;
     sessions: number;
}

export interface DeviceData {
     device: string;
     percentage: number;
     users: number;
     color: string;
}

export interface TrafficSource {
     source: string;
     percentage: number;
     visits: number;
     color: string;
}

// Mock Data
export const analyticsMetrics: AnalyticsMetric[] = [
     {
          id: 'users',
          name: 'Total Users',
          value: '12,847',
          change: 12.5,
          changeType: 'increase',
          color: '#3f3bef'
     },
     {
          id: 'sessions',
          name: 'Sessions',
          value: '48,920',
          change: 8.2,
          changeType: 'increase',
          color: '#10b981'
     },
     {
          id: 'pageviews',
          name: 'Page Views',
          value: '124,580',
          change: -3.4,
          changeType: 'decrease',
          color: '#f59e0b'
     },
     {
          id: 'engagement',
          name: 'Avg. Engagement',
          value: '4m 32s',
          change: 15.7,
          changeType: 'increase',
          color: '#8b5cf6'
     },
     {
          id: 'bounce',
          name: 'Bounce Rate',
          value: '32.4%',
          change: -2.1,
          changeType: 'decrease',
          color: '#ef4444'
     },
     {
          id: 'conversion',
          name: 'Conversion Rate',
          value: '4.8%',
          change: 5.3,
          changeType: 'increase',
          color: '#06b6d4'
     }
];

export const trafficChartData: LineChartData[] = [
     {
          label: 'This Week',
          color: '#3f3bef',
          data: [
               { date: 'Mon', value: 3200 },
               { date: 'Tue', value: 4100 },
               { date: 'Wed', value: 3800 },
               { date: 'Thu', value: 5100 },
               { date: 'Fri', value: 4900 },
               { date: 'Sat', value: 4200 },
               { date: 'Sun', value: 3800 }
          ]
     },
     {
          label: 'Last Week',
          color: '#8b5cf6',
          data: [
               { date: 'Mon', value: 2800 },
               { date: 'Tue', value: 3500 },
               { date: 'Wed', value: 3200 },
               { date: 'Thu', value: 4200 },
               { date: 'Fri', value: 3900 },
               { date: 'Sat', value: 3500 },
               { date: 'Sun', value: 3100 }
          ]
     }
];

export const pageViewsData: BarChartData[] = [
     { label: 'Home', value: 12500, color: '#3f3bef' },
     { label: 'Dashboard', value: 9800, color: '#10b981' },
     { label: 'Profile', value: 7600, color: '#f59e0b' },
     { label: 'Settings', value: 5400, color: '#8b5cf6' },
     { label: 'Support', value: 4200, color: '#ef4444' },
     { label: 'Docs', value: 3100, color: '#06b6d4' }
];

export const userActivityData: UserActivity[] = [
     { time: '00:00', users: 120, pageViews: 450, sessions: 180 },
     { time: '04:00', users: 80, pageViews: 320, sessions: 130 },
     { time: '08:00', users: 450, pageViews: 1800, sessions: 520 },
     { time: '12:00', users: 680, pageViews: 2500, sessions: 780 },
     { time: '16:00', users: 520, pageViews: 1900, sessions: 620 },
     { time: '20:00', users: 380, pageViews: 1400, sessions: 450 }
];

export const topContentData: TopContent[] = [
     {
          id: '1',
          title: 'Getting Started Guide',
          views: 12500,
          engagement: 85,
          change: 12.5
     },
     {
          id: '2',
          title: 'API Documentation',
          views: 9800,
          engagement: 78,
          change: 8.2
     },
     {
          id: '3',
          title: 'Dashboard Overview',
          views: 7600,
          engagement: 92,
          change: 15.7
     },
     {
          id: '4',
          title: 'User Management',
          views: 5400,
          engagement: 65,
          change: -3.4
     },
     {
          id: '5',
          title: 'Billing Settings',
          views: 4200,
          engagement: 71,
          change: 5.3
     }
];

export const deviceData: DeviceData[] = [
     { device: 'Mobile', percentage: 52, users: 6680, color: '#3f3bef' },
     { device: 'Desktop', percentage: 38, users: 4880, color: '#10b981' },
     { device: 'Tablet', percentage: 10, users: 1280, color: '#f59e0b' }
];

export const trafficSources: TrafficSource[] = [
     { source: 'Direct', percentage: 35, visits: 4480, color: '#3f3bef' },
     { source: 'Organic Search', percentage: 28, visits: 3584, color: '#10b981' },
     { source: 'Social Media', percentage: 22, visits: 2816, color: '#f59e0b' },
     { source: 'Referral', percentage: 12, visits: 1536, color: '#8b5cf6' },
     { source: 'Email', percentage: 3, visits: 384, color: '#ef4444' }
];

export const timeRanges = [
     { id: 'today', label: 'Today' },
     { id: 'week', label: 'This Week' },
     { id: 'month', label: 'This Month' },
     { id: 'quarter', label: 'This Quarter' },
     { id: 'year', label: 'This Year' }
];

export const dateFilters = [
     { id: '7d', label: 'Last 7 days' },
     { id: '30d', label: 'Last 30 days' },
     { id: '90d', label: 'Last 90 days' },
     { id: '1y', label: 'Last year' },
     { id: 'custom', label: 'Custom range' }
];