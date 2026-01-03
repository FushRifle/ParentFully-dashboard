import React from 'react';
import { Card, Text, Button, Badge } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { NewsItem } from './data';
import { ExternalLink, TrendingUp, Clock } from 'lucide-react';

interface NewsCardProps {
     news: NewsItem;
     compact?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, compact = false }) => {
     const getCategoryColor = (category: NewsItem['category']) => {
          switch (category) {
               case 'general': return 'primary';
               case 'technical': return 'success';
               case 'updates': return 'warning';
               case 'events': return 'secondary';
               case 'tips': return 'error';
               default: return 'default';
          }
     };

     return (
          <Card css={{ p: compact ? '$4' : '$6' }} variant="flat">
               <Card.Body>
                    <Flex direction="column" css={{ gap: compact ? '$2' : '$4' }}>
                         <Flex justify="between" align="start">
                              <Box css={{ flex: 1 }}>
                                   <Flex align="center" css={{ gap: '$2', mb: '$1' }}>
                                        {news.trending && (
                                             <TrendingUp size={14} color="#ef4444" />
                                        )}
                                        <Text b size={compact ? '$sm' : '$md'}>
                                             {news.title}
                                        </Text>
                                   </Flex>

                                   <Text
                                        size={compact ? '$xs' : '$sm'}
                                        color="$accents7"
                                        css={{ lineHeight: 1.5 }}
                                   >
                                        {news.summary}
                                   </Text>
                              </Box>
                         </Flex>

                         <Flex justify="between" align="center">
                              <Flex align="center" css={{ gap: '$3' }}>
                                   <Badge
                                        size="sm"
                                        variant="flat"
                                        color={getCategoryColor(news.category)}
                                   >
                                        {news.category}
                                   </Badge>

                                   <Flex align="center" css={{ gap: '$1' }}>
                                        <Clock size={12} color="$accents7" />
                                        <Text size="$xs" color="$accents7">
                                             {news.publishedAt}
                                        </Text>
                                   </Flex>
                              </Flex>

                              <Flex align="center" css={{ gap: '$2' }}>
                                   <Text size="$xs" color="$accents7">
                                        {news.source}
                                   </Text>
                                   <Button
                                        auto
                                        light
                                        size="sm"
                                        icon={<ExternalLink size={14} />}
                                        onPress={() => window.open(news.url, '_blank')}
                                   />
                              </Flex>
                         </Flex>
                    </Flex>
               </Card.Body>
          </Card>
     );
};