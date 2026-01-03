import React, { useState } from 'react';
import { Grid, Text, Button, Card, Badge } from '@nextui-org/react';

import { Box } from '../../components/styles/box';
import { Flex } from '../../components/styles/flex';
import { Tabs } from '../../components/styles/tabs';

import { RefreshCw, Bell, Download, Settings } from 'lucide-react';

import {
     systemMetrics,
     services,
     incidents,
     recentLogs,
     overallStatus
} from '../../components/system/data';

import { SystemStatusHeader } from '../../components/system/header';
import { MetricGauge } from '../../components/system/metric-gauge';
import { ServiceStatusCard } from '../../components/system/service-status-card';
import { IncidentCard } from '../../components/system/incident-card';
import { LogEntryComponent } from '../../components/system/log-entry';

const SystemHealthPage = () => {
     const [isRefreshing, setIsRefreshing] = useState(false);
     const [selectedTab, setSelectedTab] = useState('overview');

     const handleRefresh = () => {
          setIsRefreshing(true);
          setTimeout(() => {
               setIsRefreshing(false);
          }, 1000);
     };

     const activeIncidents = incidents.filter(i => i.status !== 'resolved');

     const tabItems = [
          {
               key: 'overview',
               title: 'Overview',
               content: (
                    <Box css={{ mt: '$6' }}>
                         {/* System Metrics */}
                         <Text h4 css={{ mb: '$6' }}>System Metrics</Text>
                         <Grid.Container gap={2} css={{ mb: '$8' }}>
                              {systemMetrics.map((metric) => (
                                   <Grid xs={12} sm={6} md={4} key={metric.id}>
                                        <MetricGauge metric={metric} />
                                   </Grid>
                              ))}
                         </Grid.Container>

                         {/* Services & Incidents Grid */}
                         <Grid.Container gap={2} css={{ mb: '$8' }}>
                              <Grid xs={12} lg={8}>
                                   <Card css={{ p: '$6', height: '100%' }} variant="flat">
                                        <Text h4 css={{ mb: '$6' }}>Services Status</Text>
                                        <Grid.Container gap={2}>
                                             {services.map((service) => (
                                                  <Grid xs={12} sm={6} key={service.id}>
                                                       <ServiceStatusCard service={service} />
                                                  </Grid>
                                             ))}
                                        </Grid.Container>
                                   </Card>
                              </Grid>

                              <Grid xs={12} lg={4}>
                                   <Card css={{ p: '$6', height: '100%' }} variant="flat">
                                        <Flex justify="between" align="center" css={{ mb: '$6' }}>
                                             <Text h4>Active Incidents</Text>
                                             <Badge size="sm" variant="flat" color="error">
                                                  {activeIncidents.length}
                                             </Badge>
                                        </Flex>

                                        <Flex direction="column" css={{ gap: '$4' }}>
                                             {activeIncidents.map((incident) => (
                                                  <IncidentCard key={incident.id} incident={incident} compact />
                                             ))}

                                             {activeIncidents.length === 0 && (
                                                  <Box css={{ p: '$8', textAlign: 'center' }}>
                                                       <Text color="$accents7">No active incidents</Text>
                                                  </Box>
                                             )}
                                        </Flex>
                                   </Card>
                              </Grid>
                         </Grid.Container>
                    </Box>
               )
          },
          {
               key: 'incidents',
               title: 'Incidents',
               content: (
                    <Box css={{ mt: '$6' }}>
                         <Card css={{ p: '$6' }} variant="flat">
                              <Text h4 css={{ mb: '$6' }}>All Incidents</Text>
                              <Grid.Container gap={2}>
                                   {incidents.map((incident) => (
                                        <Grid xs={12} key={incident.id}>
                                             <IncidentCard incident={incident} />
                                        </Grid>
                                   ))}
                              </Grid.Container>
                         </Card>
                    </Box>
               )
          },
          {
               key: 'logs',
               title: 'Recent Logs',
               content: (
                    <Box css={{ mt: '$6' }}>
                         <Card css={{ p: '$6' }} variant="flat">
                              <Flex justify="between" align="center" css={{ mb: '$6' }}>
                                   <Text h4>System Logs</Text>
                                   <Button
                                        auto
                                        light
                                        size="sm"
                                        icon={<Download size={14} />}
                                   >
                                        Export Logs
                                   </Button>
                              </Flex>

                              <Card variant="flat" css={{ bg: '$accents0' }}>
                                   <Card.Body css={{ p: 0 }}>
                                        {recentLogs.map((log) => (
                                             <LogEntryComponent key={log.id} log={log} />
                                        ))}
                                   </Card.Body>
                              </Card>
                         </Card>
                    </Box>
               )
          }
     ];

     return (
          <Box css={{ p: '$10', overflow: 'auto', height: 'calc(100vh - 100px)' }}>
               {/* Header */}
               <Flex justify="between" align="center" css={{ mb: '$8' }}>
                    <Box>
                         <Text h2>System Health</Text>
                         <Text color="$accents7" css={{ mt: '$2' }}>
                              Monitor system performance and service status
                         </Text>
                    </Box>

                    <Flex css={{ gap: '$4' }}>
                         <Button
                              auto
                              light
                              icon={<Bell size={16} />}
                         >
                              Alerts
                         </Button>

                         <Button
                              auto
                              light
                              icon={<RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />}
                              onPress={handleRefresh}
                              disabled={isRefreshing}
                         >
                              {isRefreshing ? 'Refreshing...' : 'Refresh'}
                         </Button>
                    </Flex>
               </Flex>

               {/* System Status Header */}
               <Box css={{ mb: '$8' }}>
                    <SystemStatusHeader status={overallStatus} />
               </Box>

               {/* Tabs - Using items prop */}
               <Tabs
                    items={tabItems}
                    activeKey={selectedTab}
                    onChange={setSelectedTab}
                    css={{ mb: '$8' }}
                    variant="underlined"
               />

               {/* Quick Actions */}
               <Card css={{ p: '$6' }} variant="flat">
                    <Text h4 css={{ mb: '$6' }}>Quick Actions</Text>
                    <Grid.Container gap={2}>
                         <Grid xs={12} sm={4}>
                              <Button
                                   auto
                                   css={{ width: '100%', bg: '$accents0' }}
                                   onPress={() => console.log('Run diagnostics')}
                              >
                                   Run Diagnostics
                              </Button>
                         </Grid>
                         <Grid xs={12} sm={4}>
                              <Button
                                   auto
                                   css={{ width: '100%', bg: '$accents0' }}
                                   onPress={() => console.log('Clear cache')}
                              >
                                   Clear System Cache
                              </Button>
                         </Grid>
                         <Grid xs={12} sm={4}>
                              <Button
                                   auto
                                   css={{ width: '100%', bg: '$accents0' }}
                                   onPress={() => console.log('Restart services')}
                              >
                                   Restart Services
                              </Button>
                         </Grid>
                    </Grid.Container>
               </Card>

               {/* Add spin animation for refresh */}
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

export default SystemHealthPage;