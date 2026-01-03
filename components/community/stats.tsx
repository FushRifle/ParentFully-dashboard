import React from 'react';
import { Card, Text, Progress, Grid } from '@nextui-org/react';

import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { CommunityStats } from './data';
import { Users, MessageSquare, FileText, TrendingUp } from 'lucide-react';

interface CommunityStatsProps {
     stats: CommunityStats;
}

export const CommunityStatsComponent: React.FC<CommunityStatsProps> = ({ stats }) => {
     return (
          <Card css={{ p: '$6' }} variant="flat">
               <Card.Body>
                    <Flex direction="column" css={{ gap: '$6' }}>
                         <Flex justify="between" align="center">
                              <Text h4>Community Stats</Text>
                              <Text size="$xs" color="$accents7">
                                   Updated today
                              </Text>
                         </Flex>

                         <Grid.Container gap={2}>
                              <Grid xs={12} sm={6}>
                                   <Flex direction="column" css={{ gap: '$2' }}>
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
                                                  <Users size={20} color="#3f3bef" />
                                             </Box>
                                             <Box>
                                                  <Text size="$sm" color="$accents7">Total Members</Text>
                                                  <Text b size="$lg">{stats.totalMembers.toLocaleString()}</Text>
                                             </Box>
                                        </Flex>
                                        <Progress
                                             value={(stats.activeMembers / stats.totalMembers) * 100}
                                             color="primary"
                                             size="sm"
                                             css={{ mt: '$2' }}
                                        />
                                        <Text size="$xs" color="$accents7">
                                             {stats.activeMembers.toLocaleString()} active members
                                        </Text>
                                   </Flex>
                              </Grid>

                              <Grid xs={12} sm={6}>
                                   <Flex direction="column" css={{ gap: '$2' }}>
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
                                                  <FileText size={20} color="#10b981" />
                                             </Box>
                                             <Box>
                                                  <Text size="$sm" color="$accents7">Total Posts</Text>
                                                  <Text b size="$lg">{stats.totalPosts.toLocaleString()}</Text>
                                             </Box>
                                        </Flex>
                                        <Progress
                                             value={(stats.postsToday / 100) * 100}
                                             color="success"
                                             size="sm"
                                             css={{ mt: '$2' }}
                                        />
                                        <Text size="$xs" color="$accents7">
                                             {stats.postsToday} posts today
                                        </Text>
                                   </Flex>
                              </Grid>

                              <Grid xs={12} sm={6}>
                                   <Flex direction="column" css={{ gap: '$2' }}>
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
                                                  <MessageSquare size={20} color="#f59e0b" />
                                             </Box>
                                             <Box>
                                                  <Text size="$sm" color="$accents7">Total Comments</Text>
                                                  <Text b size="$lg">{stats.totalComments.toLocaleString()}</Text>
                                             </Box>
                                        </Flex>
                                        <Progress
                                             value={75}
                                             color="warning"
                                             size="sm"
                                             css={{ mt: '$2' }}
                                        />
                                        <Text size="$xs" color="$accents7">
                                             High engagement rate
                                        </Text>
                                   </Flex>
                              </Grid>

                              <Grid xs={12} sm={6}>
                                   <Flex direction="column" css={{ gap: '$2' }}>
                                        <Flex align="center" css={{ gap: '$3' }}>
                                             <Box
                                                  css={{
                                                       width: '40px',
                                                       height: '40px',
                                                       borderRadius: '$md',
                                                       bg: '#8b5cf610',
                                                       display: 'flex',
                                                       alignItems: 'center',
                                                       justifyContent: 'center'
                                                  }}
                                             >
                                                  <TrendingUp size={20} color="#8b5cf6" />
                                             </Box>
                                             <Box>
                                                  <Text size="$sm" color="$accents7">Growth</Text>
                                                  <Text b size="$lg">+12.5%</Text>
                                             </Box>
                                        </Flex>
                                        <Progress
                                             value={12.5}
                                             color="secondary"
                                             size="sm"
                                             css={{ mt: '$2' }}
                                        />
                                        <Text size="$xs" color="$accents7">
                                             This month
                                        </Text>
                                   </Flex>
                              </Grid>
                         </Grid.Container>
                    </Flex>
               </Card.Body>
          </Card>
     );
};