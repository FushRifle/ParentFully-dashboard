export interface SystemMetric {
     id: string;
     name: string;
     value: number;
     unit: string;
     status: 'healthy' | 'warning' | 'critical';
     threshold: number;
     max: number;
     trend: 'up' | 'down' | 'stable';
}

export interface ServiceStatus {
     id: string;
     name: string;
     status: 'operational' | 'degraded' | 'down';
     uptime: string;
     responseTime: number;
     lastIncident?: string;
     dependencies?: string[];
}

export interface Incident {
     id: string;
     title: string;
     status: 'resolved' | 'investigating' | 'identified' | 'monitoring';
     severity: 'critical' | 'major' | 'minor' | 'maintenance';
     startTime: string;
     endTime?: string;
     affectedServices: string[];
     description?: string;
}

export interface LogEntry {
     id: string;
     timestamp: string;
     level: 'info' | 'warning' | 'error';
     service: string;
     message: string;
}

export interface ResourceUsage {
     time: string;
     cpu: number;
     memory: number;
     disk: number;
}

// Mock Data
export const systemMetrics: SystemMetric[] = [
     {
          id: 'cpu',
          name: 'CPU Usage',
          value: 45,
          unit: '%',
          status: 'healthy',
          threshold: 80,
          max: 100,
          trend: 'up',
     },
     {
          id: 'memory',
          name: 'Memory Usage',
          value: 68,
          unit: '%',
          status: 'healthy',
          threshold: 85,
          max: 100,
          trend: 'stable',
     },
     {
          id: 'disk',
          name: 'Disk Usage',
          value: 72,
          unit: '%',
          status: 'healthy',
          threshold: 90,
          max: 100,
          trend: 'up',
     },
     {
          id: 'network',
          name: 'Network I/O',
          value: 32,
          unit: 'MB/s',
          status: 'healthy',
          threshold: 100,
          max: 1000,
          trend: 'down',
     },
     {
          id: 'database',
          name: 'Database Load',
          value: 78,
          unit: '%',
          status: 'warning',
          threshold: 75,
          max: 100,
          trend: 'up',
     },
     {
          id: 'cache',
          name: 'Cache Hit Rate',
          value: 92,
          unit: '%',
          status: 'healthy',
          threshold: 85,
          max: 100,
          trend: 'stable',
     }
];

export const services: ServiceStatus[] = [
     {
          id: 'api',
          name: 'API Gateway',
          status: 'operational',
          uptime: '99.98%',
          responseTime: 45,
          lastIncident: '2 days ago',
          dependencies: ['auth', 'database']
     },
     {
          id: 'auth',
          name: 'Authentication Service',
          status: 'operational',
          uptime: '99.95%',
          responseTime: 120,
          dependencies: ['database']
     },
     {
          id: 'database',
          name: 'Database Cluster',
          status: 'degraded',
          uptime: '99.89%',
          responseTime: 210,
          lastIncident: '6 hours ago',
          dependencies: []
     },
     {
          id: 'storage',
          name: 'File Storage',
          status: 'operational',
          uptime: '99.99%',
          responseTime: 65,
          dependencies: []
     },
     {
          id: 'cache',
          name: 'Redis Cache',
          status: 'operational',
          uptime: '99.97%',
          responseTime: 12,
          dependencies: []
     },
     {
          id: 'queue',
          name: 'Message Queue',
          status: 'operational',
          uptime: '99.94%',
          responseTime: 35,
          dependencies: ['database']
     },
     {
          id: 'cdn',
          name: 'CDN Service',
          status: 'operational',
          uptime: '99.99%',
          responseTime: 85,
          dependencies: ['storage']
     },
     {
          id: 'monitoring',
          name: 'Monitoring System',
          status: 'down',
          uptime: '99.87%',
          responseTime: 0,
          lastIncident: '15 minutes ago',
          dependencies: []
     }
];

export const incidents: Incident[] = [
     {
          id: 'inc-001',
          title: 'Database Performance Degradation',
          status: 'investigating',
          severity: 'major',
          startTime: '2023-10-15 14:30',
          affectedServices: ['api', 'auth', 'queue'],
          description: 'Increased query latency affecting multiple services'
     },
     {
          id: 'inc-002',
          title: 'Monitoring Service Outage',
          status: 'identified',
          severity: 'critical',
          startTime: '2023-10-15 10:15',
          affectedServices: ['monitoring'],
          description: 'Monitoring service unreachable, investigating root cause'
     },
     {
          id: 'inc-003',
          title: 'Scheduled Maintenance',
          status: 'resolved',
          severity: 'maintenance',
          startTime: '2023-10-14 02:00',
          endTime: '2023-10-14 04:30',
          affectedServices: ['api', 'auth'],
          description: 'Regular security patches and updates'
     },
     {
          id: 'inc-004',
          title: 'CDN Connectivity Issues',
          status: 'monitoring',
          severity: 'minor',
          startTime: '2023-10-13 18:45',
          endTime: '2023-10-13 19:30',
          affectedServices: ['cdn'],
          description: 'Temporary connectivity issues with CDN provider'
     }
];

export const recentLogs: LogEntry[] = [
     {
          id: 'log-001',
          timestamp: '2023-10-15 14:35:22',
          level: 'warning',
          service: 'database',
          message: 'High CPU usage detected on primary node'
     },
     {
          id: 'log-002',
          timestamp: '2023-10-15 14:30:15',
          level: 'error',
          service: 'monitoring',
          message: 'Service heartbeat timeout'
     },
     {
          id: 'log-003',
          timestamp: '2023-10-15 14:28:47',
          level: 'info',
          service: 'api',
          message: 'Increased request rate detected'
     },
     {
          id: 'log-004',
          timestamp: '2023-10-15 14:25:12',
          level: 'warning',
          service: 'queue',
          message: 'Queue depth exceeded threshold'
     },
     {
          id: 'log-005',
          timestamp: '2023-10-15 14:20:33',
          level: 'info',
          service: 'auth',
          message: 'Authentication service restart completed'
     },
     {
          id: 'log-006',
          timestamp: '2023-10-15 14:15:58',
          level: 'info',
          service: 'cdn',
          message: 'Cache purge completed successfully'
     }
];

export const resourceUsageData: ResourceUsage[] = [
     { time: '00:00', cpu: 32, memory: 45, disk: 68 },
     { time: '04:00', cpu: 28, memory: 42, disk: 67 },
     { time: '08:00', cpu: 65, memory: 58, disk: 69 },
     { time: '12:00', cpu: 78, memory: 65, disk: 70 },
     { time: '16:00', cpu: 45, memory: 52, disk: 71 },
     { time: '20:00', cpu: 38, memory: 48, disk: 72 }
];

export const overallStatus = {
     system: 'operational',
     uptime: '99.95%',
     lastUpdated: 'Just now',
     totalServices: services.length,
     operationalServices: services.filter(s => s.status === 'operational').length,
     incidents: incidents.filter(i => i.status !== 'resolved').length
};