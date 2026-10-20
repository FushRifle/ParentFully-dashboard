import React from 'react';
import { Badge, Card, Grid, Text } from '@nextui-org/react';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import { OverviewStats } from './overview-stats';
import { useUserStats } from '../../hooks/user/useUserStats';

export const Content = () => {
   const { stats, loading, error } = useUserStats();
   return (
   <Box css={{ width: '100%', maxW: '1440px', mx: 'auto', pb: '$12' }}>
      <Flex justify="between" align="end" css={{ mb: '$7', flexWrap: 'wrap', gap: '$4' }}>
         <Box>
            <Badge color="secondary" variant="flat" css={{ border: 'none', mb: '$2' }}>
               Live platform data
            </Badge>
            <Text h2 css={{ m: 0, fontSize: '1.45rem', letterSpacing: '-0.025em' }}>
               Platform overview
            </Text>
            <Text size="$sm" css={{ color: '$accents7', mt: '$1' }}>
               Customer, family, content, and activity totals from ParentFully.
            </Text>
         </Box>
      </Flex>

      <OverviewStats dashboardStats={stats} loading={loading} error={error} />
      <Grid.Container gap={1.5} css={{ p: 0, mt: '$4' }}>
         <Grid xs={12} md={6}><Card variant="bordered"><Card.Header><Text b>Top goal categories</Text></Card.Header><Card.Body css={{ gap: '$3' } as any}>{(stats?.top_goal_categories ?? []).map((category) => <Flex key={category.id} justify="between"><Text size="$sm">{category.name}</Text><Text b size="$sm">{category.goals_count.toLocaleString()}</Text></Flex>)}{!loading && !stats?.top_goal_categories?.length && <Text size="$sm" css={{ color: '$accents7' }}>No category activity yet.</Text>}</Card.Body></Card></Grid>
         <Grid xs={12} md={6}><Card variant="bordered"><Card.Header><Text b>Recent activity</Text></Card.Header><Card.Body css={{ gap: '$3' } as any}>{(stats?.recent_activity ?? []).map((activity) => <Box key={activity.id}><Text size="$sm">{activity.description || activity.action || activity.model_type || 'Activity'}</Text><Text size="$xs" css={{ color: '$accents7' }}>{activity.family_name || '—'} · {activity.created_at ? new Date(activity.created_at).toLocaleString() : '—'}</Text></Box>)}{!loading && !stats?.recent_activity?.length && <Text size="$sm" css={{ color: '$accents7' }}>No recent activity.</Text>}</Card.Body></Card></Grid>
      </Grid.Container>
   </Box>
   );
};
