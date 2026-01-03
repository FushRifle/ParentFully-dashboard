import React, { useState } from 'react';
import { Grid, Text, Button, Card } from '@nextui-org/react';

import { Select } from '../../components/styles/select';
import { Box } from '../../components/styles/box';
import { Flex } from '../../components/styles/flex';
import { Download, RefreshCw } from 'lucide-react';

import {
     analyticsMetrics,
     trafficChartData,
     pageViewsData,
     topContentData,
     deviceData,
     trafficSources,
     userActivityData,
     dateFilters
} from '../../components/analytics/data';

import { MetricCard } from '../../components/analytics/metric-card';
import { LineChart } from '../../components/charts/line-chart';
import { BarChart } from '../../components/charts/bar-chart';
import { PieChart } from '../../components/charts/pie-chart';
import { ActivityTable } from '../../components/analytics/activity-table';
import { DateRangeSelector } from '../../components/analytics/date-range-selector';

const AnalyticsPage = () => {
     const [selectedRange, setSelectedRange] = useState('week');
     const [dateFilter, setDateFilter] = useState('30d');
     const [isRefreshing, setIsRefreshing] = useState(false);

     const handleRefresh = () => {
          setIsRefreshing(true);
          setTimeout(() => {
               setIsRefreshing(false);
          }, 1000);
     };

     const handleExport = () => {
          console.log('Exporting analytics data...');
     };

     return (
          <Box css={{ p: '$10', overflow: 'auto', height: 'calc(100vh - 100px)' }}>
               {/* Header */}
               <Flex justify="between" align="center" css={{ mb: '$8' }}>
                    <Box>
                         <Text h2>Analytics Dashboard</Text>
                         <Text color="$accents7" css={{ mt: '$2' }}>
                              Monitor your application performance and user engagement
                         </Text>
                    </Box>

                    <Flex css={{ gap: '$4' }}>
                         <Select
                              placeholder="Date Range"
                              value={dateFilter}
                              onChange={setDateFilter}
                              css={{ minWidth: '150px' }}
                              options={dateFilters.map(filter => ({
                                   value: filter.id,
                                   label: <Text size="$sm">{filter.label}</Text>,
                              }))}
                         />

                         <Button
                              auto
                              light
                              icon={<RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />}
                              onPress={handleRefresh}
                              disabled={isRefreshing}
                         >
                              {isRefreshing ? 'Refreshing...' : 'Refresh'}
                         </Button>

                         <Button
                              auto
                              icon={<Download size={16} />}
                              css={{ bg: '#3f3bef' }}
                              onPress={handleExport}
                         >
                              Export
                         </Button>
                    </Flex>
               </Flex>

               {/* Key Metrics Grid */}
               <Grid.Container gap={2} css={{ mb: '$8' }}>
                    {analyticsMetrics.map((metric) => (
                         <Grid xs={12} sm={6} md={4} lg={2} key={metric.id}>
                              <MetricCard metric={metric} />
                         </Grid>
                    ))}
               </Grid.Container>

               {/* Charts Row 1 */}
               <Grid.Container gap={2} css={{ mb: '$8' }}>
                    <Grid xs={12} lg={8}>
                         <LineChart
                              data={trafficChartData}
                              height={300}
                              title="Traffic Overview"
                              showLegend
                         />
                    </Grid>
                    <Grid xs={12} lg={4}>
                         <DateRangeSelector
                              selectedRange={selectedRange}
                              onRangeChange={setSelectedRange}
                         />
                    </Grid>
               </Grid.Container>

               {/* Charts Row 2 */}
               <Grid.Container gap={2} css={{ mb: '$8' }}>
                    <Grid xs={12} md={6}>
                         <BarChart
                              data={pageViewsData}
                              height={250}
                              title="Page Views by Page"
                              showValues
                         />
                    </Grid>
                    <Grid xs={12} md={6}>
                         <PieChart
                              data={deviceData as any}
                              size={200}
                              title="Device Distribution"
                              showLegend
                         />
                    </Grid>
               </Grid.Container>

               {/* Charts Row 3 */}
               <Grid.Container gap={2} css={{ mb: '$8' }}>
                    <Grid xs={12} md={6}>
                         <ActivityTable
                              data={topContentData}
                              title="Top Performing Content"
                              limit={5}
                         />
                    </Grid>
                    <Grid xs={12} md={6}>
                         <PieChart
                              data={trafficSources as any}
                              size={200}
                              title="Traffic Sources"
                              showLegend
                         />
                    </Grid>
               </Grid.Container>

               {/* User Activity Timeline */}
               <Card css={{ p: '$6' }} variant="flat">
                    <Card.Header>
                         <Text h4>Real-time User Activity</Text>
                    </Card.Header>
                    <Card.Body>
                         <Grid.Container gap={2}>
                              {userActivityData.map((activity, index) => (
                                   <Grid xs={12} sm={6} md={4} lg={2} key={index}>
                                        <Card css={{ p: '$4' }} variant="flat">
                                             <Flex direction="column" css={{ gap: '$2' }}>
                                                  <Text size="$sm" color="$accents7">
                                                       {activity.time}
                                                  </Text>
                                                  <Flex direction="column" css={{ gap: '$1' }}>
                                                       <Flex justify="between">
                                                            <Text size="$xs" color="$accents7">Users</Text>
                                                            <Text b size="$sm">{activity.users}</Text>
                                                       </Flex>
                                                       <Flex justify="between">
                                                            <Text size="$xs" color="$accents7">Page Views</Text>
                                                            <Text b size="$sm">{activity.pageViews}</Text>
                                                       </Flex>
                                                       <Flex justify="between">
                                                            <Text size="$xs" color="$accents7">Sessions</Text>
                                                            <Text b size="$sm">{activity.sessions}</Text>
                                                       </Flex>
                                                  </Flex>
                                             </Flex>
                                        </Card>
                                   </Grid>
                              ))}
                         </Grid.Container>
                    </Card.Body>
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

export default AnalyticsPage;