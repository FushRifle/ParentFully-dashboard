import React from 'react';
import { Card, Text, Badge, Grid } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { Server, Activity, AlertCircle, Clock } from 'lucide-react';

interface SystemStatusHeaderProps {
     status: {
          system: string;
          uptime: string;
          lastUpdated: string;
          totalServices: number;
          operationalServices: number;
          incidents: number;
     };
}

export const SystemStatusHeader: React.FC<SystemStatusHeaderProps> = ({ status }) => {
     const getSystemStatusColor = () => {
          if (status.system === 'operational') return 'success';
          if (status.system === 'degraded') return 'warning';
          return 'error';
     };

     return (
          <Card css={{ p: '$6' }} variant="flat">
               <Card.Body>
                    <Flex direction="column" css={{ gap: '$6' }}>
                         <Flex justify="between" align="center">
                              <Flex align="center" css={{ gap: '$3' }}>
                                   <Box
                                        css={{
                                             width: '48px',
                                             height: '48px',
                                             borderRadius: '$lg',
                                             bg: 'green',
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center'
                                        }}
                                   >
                                        <Server size={24} color="$white" />
                                   </Box>
                                   <Box>
                                        <Text h3>System Status</Text>
                                        <Flex align="center" css={{ gap: '$2', mt: '$1' }}>
                                             <Badge
                                                  size="sm"
                                                  variant="flat"
                                                  color={getSystemStatusColor()}
                                             >
                                                  {status.system.toUpperCase()}
                                             </Badge>
                                             <Text size="$xs" color="$accents7">
                                                  Last updated: {status.lastUpdated}
                                             </Text>
                                        </Flex>
                                   </Box>
                              </Flex>
                         </Flex>

                         <Grid.Container gap={2}>
                              <Grid xs={12} sm={6} md={3}>
                                   <Flex align="center" css={{ gap: '$3' }}>
                                        <Box
                                             css={{
                                                  width: '40px',
                                                  height: '40px',
                                                  borderRadius: '$md',
                                                  bg: '#10b98110',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center'
                                             }}
                                        >
                                             <Activity size={20} color="#10b981" />
                                        </Box>
                                        <Box>
                                             <Text size="$sm" color="$accents7">Uptime</Text>
                                             <Text b size="$lg">{status.uptime}</Text>
                                        </Box>
                                   </Flex>
                              </Grid>

                              <Grid xs={12} sm={6} md={3}>
                                   <Flex align="center" css={{ gap: '$3' }}>
                                        <Box
                                             css={{
                                                  width: '40px',
                                                  height: '40px',
                                                  borderRadius: '$md',
                                                  bg: '#3f3bef10',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center'
                                             }}
                                        >
                                             <Server size={20} color="#3f3bef" />
                                        </Box>
                                        <Box>
                                             <Text size="$sm" color="$accents7">Services</Text>
                                             <Text b size="$lg">
                                                  {status.operationalServices}/{status.totalServices}
                                             </Text>
                                        </Box>
                                   </Flex>
                              </Grid>

                              <Grid xs={12} sm={6} md={3}>
                                   <Flex align="center" css={{ gap: '$3' }}>
                                        <Box
                                             css={{
                                                  width: '40px',
                                                  height: '40px',
                                                  borderRadius: '$md',
                                                  bg: '#ef444410',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center'
                                             }}
                                        >
                                             <AlertCircle size={20} color="#ef4444" />
                                        </Box>
                                        <Box>
                                             <Text size="$sm" color="$accents7">Active Incidents</Text>
                                             <Text b size="$lg">{status.incidents}</Text>
                                        </Box>
                                   </Flex>
                              </Grid>

                              <Grid xs={12} sm={6} md={3}>
                                   <Flex align="center" css={{ gap: '$3' }}>
                                        <Box
                                             css={{
                                                  width: '40px',
                                                  height: '40px',
                                                  borderRadius: '$md',
                                                  bg: '#f59e0b10',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center'
                                             }}
                                        >
                                             <Clock size={20} color="#f59e0b" />
                                        </Box>
                                        <Box>
                                             <Text size="$sm" color="$accents7">Last Incident</Text>
                                             <Text b size="$lg">2 days ago</Text>
                                        </Box>
                                   </Flex>
                              </Grid>
                         </Grid.Container>
                    </Flex>
               </Card.Body>
          </Card>
     );
};