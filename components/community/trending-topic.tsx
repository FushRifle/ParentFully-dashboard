import React from 'react';
import { Card, Text, Badge } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { TrendingTopic } from './data';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendingTopicProps {
     topic: TrendingTopic;
     rank: number;
}

export const TrendingTopicComponent: React.FC<TrendingTopicProps> = ({ topic, rank }) => {
     const getTrendIcon = () => {
          switch (topic.trend) {
               case 'up':
                    return <TrendingUp size={14} color="#10b981" />;
               case 'down':
                    return <TrendingDown size={14} color="#ef4444" />;
               default:
                    return <Minus size={14} color="#6b7280" />;
          }
     };

     const getRankColor = (rank: number) => {
          if (rank === 1) return '#f59e0b';
          if (rank === 2) return '#6b7280';
          if (rank === 3) return '#92400e';
          return '#6b7280';
     };

     return (
          <Card css={{ p: '$4' }} variant="flat">
               <Card.Body>
                    <Flex justify="between" align="center">
                         <Flex align="center" css={{ gap: '$4' }}>
                              <Box
                                   css={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '$sm',
                                        bg: rank <= 3 ? `${getRankColor(rank)}20` : '$accents0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                   }}
                              >
                                   <Text
                                        size="$xs"
                                        css={{
                                             fontWeight: '$bold',
                                             color: rank <= 3 ? getRankColor(rank) : '$accents7'
                                        }}
                                   >
                                        {rank}
                                   </Text>
                              </Box>

                              <Box>
                                   <Text b size="$sm">
                                        {topic.tag}
                                   </Text>
                                   <Text size="$xs" color="$accents7">
                                        {topic.postCount.toLocaleString()} posts
                                   </Text>
                              </Box>
                         </Flex>

                         <Flex align="center" css={{ gap: '$1' }}>
                              {getTrendIcon()}
                              <Badge
                                   size="xs"
                                   variant="flat"
                                   color={topic.trend === 'up' ? 'success' :
                                        topic.trend === 'down' ? 'error' : 'default'}
                              >
                                   {topic.trend}
                              </Badge>
                         </Flex>
                    </Flex>
               </Card.Body>
          </Card>
     );
};