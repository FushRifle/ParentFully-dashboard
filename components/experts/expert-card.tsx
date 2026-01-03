import React from 'react';
import { Card, Text, Button, Avatar, Badge } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { Expert, expertiseCategories } from './data';
import { Star, MapPin, Clock, Video, CheckCircle } from 'lucide-react';

interface ExpertCardProps {
     expert: Expert;
     compact?: boolean;
     onBook?: (expertId: string) => void;
     onViewProfile?: (expertId: string) => void;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({
     expert,
     compact = false,
     onBook,
     onViewProfile
}) => {
     const getAvailabilityColor = () => {
          switch (expert.availability) {
               case 'high': return 'success';
               case 'medium': return 'warning';
               case 'low': return 'error';
               default: return 'default';
          }
     };

     const getAvailabilityText = () => {
          switch (expert.availability) {
               case 'high': return 'High Availability';
               case 'medium': return 'Limited Spots';
               case 'low': return 'Booked Soon';
          }
     };

     return (
          <Card
               css={{
                    p: compact ? '$4' : '$6',
                    height: '100%',
                    ...(expert.featured && { border: '2px solid $warning' })
               }}
               variant="flat"
          >
               <Card.Body>
                    <Flex direction="column" css={{ gap: compact ? '$4' : '$6' }}>
                         {/* Header */}
                         <Flex justify="between" align="start">
                              <Flex css={{ gap: '$4' }}>
                                   <Avatar
                                        src={expert.avatar}
                                        size={compact ? 'lg' : 'xl'}
                                        bordered
                                        color={expert.verified ? 'primary' : 'default'}
                                   />
                                   <Box>
                                        <Flex align="center" css={{ gap: '$2', mb: '$1' }}>
                                             <Text b size={compact ? '$md' : '$lg'}>
                                                  {expert.name}
                                             </Text>
                                             {expert.verified && (
                                                  <CheckCircle size={16} color="#3f3bef" />
                                             )}
                                             {expert.featured && (
                                                  <Badge size="xs" variant="flat" color="warning">
                                                       Featured
                                                  </Badge>
                                             )}
                                        </Flex>
                                        <Text size="$sm" color="$primary" css={{ fontWeight: 500, mb: '$1' }}>
                                             {expert.title}
                                        </Text>
                                        <Flex align="center" css={{ gap: '$2' }}>
                                             <MapPin size={12} color="$accents7" />
                                             <Text size="$xs" color="$accents7">
                                                  {expert.location}
                                             </Text>
                                        </Flex>
                                   </Box>
                              </Flex>

                              <Flex direction="column" align="end" css={{ gap: '$1' }}>
                                   <Text b size="$lg" css={{ color: '$primary' }}>
                                        ${expert.hourlyRate}/hr
                                   </Text>
                                   <Text size="$xs" color="$accents7">
                                        per session
                                   </Text>
                              </Flex>
                         </Flex>

                         {/* Rating & Experience */}
                         <Flex justify="between" align="center">
                              <Flex align="center" css={{ gap: '$2' }}>
                                   <Flex align="center" css={{ gap: '$1' }}>
                                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                        <Text b size="$sm">{expert.rating}</Text>
                                   </Flex>
                                   <Text size="$xs" color="$accents7">
                                        ({expert.reviewCount} reviews)
                                   </Text>
                              </Flex>

                              <Flex align="center" css={{ gap: '$2' }}>
                                   <Clock size={14} color="$accents7" />
                                   <Text size="$sm">{expert.experience} years experience</Text>
                              </Flex>
                         </Flex>

                         {/* Bio */}
                         {!compact && (
                              <Text size="$sm" color="$accents7" css={{ lineHeight: 1.6 }}>
                                   {expert.bio}
                              </Text>
                         )}

                         {/* Expertise Tags */}
                         <Flex wrap="wrap" css={{ gap: '$2' }}>
                              {expert.expertise.slice(0, compact ? 2 : 3).map((exp, index) => {
                                   const category = expertiseCategories.find(c => c.id === exp);
                                   return (
                                        <Badge
                                             key={index}
                                             size="sm"
                                             variant="flat"
                                             css={{
                                                  bg: `${category?.color}10`,
                                                  color: category?.color
                                             }}
                                        >
                                             {category?.name}
                                        </Badge>
                                   );
                              })}
                              {expert.expertise.length > (compact ? 2 : 3) && (
                                   <Badge size="sm" variant="flat" color="default">
                                        +{expert.expertise.length - (compact ? 2 : 3)} more
                                   </Badge>
                              )}
                         </Flex>

                         {/* Languages */}
                         {!compact && (
                              <Box>
                                   <Text size="$xs" color="$accents7" css={{ mb: '$1' }}>
                                        Languages spoken:
                                   </Text>
                                   <Flex wrap="wrap" css={{ gap: '$2' }}>
                                        {expert.languages.map((lang, index) => (
                                             <Badge key={index} size="xs" variant="flat" color="default">
                                                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                             </Badge>
                                        ))}
                                   </Flex>
                              </Box>
                         )}

                         {/* Availability & Actions */}
                         <Flex justify="between" align="center">
                              <Box>
                                   <Badge
                                        size="sm"
                                        variant="flat"
                                        color={getAvailabilityColor()}
                                   >
                                        {getAvailabilityText()}
                                   </Badge>
                                   {expert.videoIntro && (
                                        <Button
                                             auto
                                             light
                                             size="sm"
                                             icon={<Video size={14} />}
                                             css={{ ml: '$2' }}
                                        >
                                             Video Intro
                                        </Button>
                                   )}
                              </Box>

                              <Flex css={{ gap: '$2' }}>
                                   <Button
                                        auto
                                        size="sm"
                                        light
                                        onPress={() => onViewProfile?.(expert.id)}
                                   >
                                        View Profile
                                   </Button>
                                   <Button
                                        auto
                                        size="sm"
                                        css={{ bg: '#3f3bef' }}
                                        onPress={() => onBook?.(expert.id)}
                                   >
                                        Book Session
                                   </Button>
                              </Flex>
                         </Flex>
                    </Flex>
               </Card.Body>
          </Card>
     );
};