import React, { useState } from 'react';
import { Card, Text, Button, Avatar } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { Review } from './data';
import { Star, ThumbsUp, Calendar } from 'lucide-react';

interface ReviewCardProps {
     review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
     const [isHelpful, setIsHelpful] = useState(false);

     return (
          <Card css={{ p: '$6' }} variant="flat">
               <Flex direction="column" css={{ gap: '$4' }}>
                    {/* Review Header */}
                    <Flex justify="between" align="start">
                         <Flex css={{ gap: '$3' }}>
                              <Avatar
                                   text={review.author.charAt(0)}
                                   size="md"
                                   color="primary"
                              />
                              <Box>
                                   <Text b>{review.author}</Text>
                                   <Flex align="center" css={{ gap: '$2', mt: '$1' }}>
                                        <Flex align="center" css={{ gap: '$1' }}>
                                             {[...Array(5)].map((_, i) => (
                                                  <Star
                                                       key={i}
                                                       size={12}
                                                       fill={i < review.rating ? '#f59e0b' : 'none'}
                                                       color="#f59e0b"
                                                  />
                                             ))}
                                        </Flex>
                                        <Text size="$xs" color="$accents7">•</Text>
                                        <Flex align="center" css={{ gap: '$1' }}>
                                             <Calendar size={12} color="$accents7" />
                                             <Text size="$xs" color="$accents7">{review.date}</Text>
                                        </Flex>
                                   </Flex>
                              </Box>
                         </Flex>

                         <Button
                              auto
                              light
                              size="sm"
                              color={isHelpful ? 'success' : 'default'}
                              icon={<ThumbsUp size={14} fill={isHelpful ? '#10b981' : 'none'} />}
                              onPress={() => setIsHelpful(!isHelpful)}
                         >
                              {review.helpful + (isHelpful ? 1 : 0)}
                         </Button>
                    </Flex>

                    {/* Review Content */}
                    <Text css={{ lineHeight: 1.6 }}>
                         {review.content}
                    </Text>
               </Flex>
          </Card>
     );
};