import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import { Text, Card, Badge } from '@nextui-org/react';

const Chart = dynamic(
     () => import('../charts/steam').then((mod) => mod.Steam),
     { ssr: false }
);

export const EngagementCharts = () => (
     <Card variant="flat" css={{
          p: '$6',
          borderRadius: '$2xl',
          bg: '$background',
          border: '1px solid $border',
     }}>
          <Card.Header css={{ p: '$4', mb: '$4' } as any}>
               <Flex justify="between" align="center" css={{ width: '100%' }}>
                    <Box>
                         <Text b size="$lg">User Engagement Trends</Text>
                         <Text size="$xs" css={{ color: '$accents6', display: 'block' }}>Guide completions vs. Productivity tool usage</Text>
                    </Box>
                    <Flex css={{ gap: '$2' }}>
                         <Badge color="primary" variant="dot">Guides</Badge>
                         <Badge color="success" variant="dot">Tools</Badge>
                    </Flex>
               </Flex>
          </Card.Header>
          <Card.Body css={{ p: 0, overflow: 'hidden' } as any}>
               <Box css={{ height: '380px', width: '100%', px: '$2' }}>
                    <Chart />
               </Box>
          </Card.Body>
     </Card>
);
