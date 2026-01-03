import React, { useState, useMemo } from 'react';
import {
     Card, Text, Button, Avatar,
     Badge, Progress, Grid, Divider
} from '@nextui-org/react';

import { Tabs } from '../styles/tabs';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { Expert, Review, ConsultationType, expertiseCategories } from './data';
import {
     Star, Calendar, Clock, Award,
     GraduationCap, Video, BookOpen,
     Shield, CheckCircle2, Globe
} from 'lucide-react';

import { ReviewCard } from './review-card';
import { BookingModal } from './booking-modal';

interface ExpertProfileProps {
     expert: Expert;
     reviews: Review[];
     consultationTypes: ConsultationType[];
     onBookConsultation?: (expertId: string, consultationType: string) => void;
}

export const ExpertProfile: React.FC<ExpertProfileProps> = ({
     expert,
     reviews,
     consultationTypes,
     onBookConsultation
}) => {
     const [selectedTab, setSelectedTab] = useState('overview');
     const [showBookingModal, setShowBookingModal] = useState(false);

     const tabItems = useMemo(() => [
          {
               key: 'overview',
               title: 'Overview',
               content: (
                    <Box css={{ py: '$4' }}>
                         <section style={{ marginBottom: '32px' }}>
                              <Text h4 css={{ mb: '$3', display: 'flex', alignItems: 'center', gap: '$2' }}>
                                   <BookOpen size={20} /> Approach & Philosophy
                              </Text>
                              <Text size="$lg" css={{ lineHeight: 1.8, color: '$accents8', maxWidth: '800px' }}>
                                   {expert.approach}
                              </Text>
                         </section>

                         <Grid.Container gap={4}>
                              <Grid xs={12} md={6}>
                                   <Box>
                                        <Text h4 css={{ mb: '$4' }}>Education & Credentials</Text>
                                        <Flex direction="column" css={{ gap: '$4' }}>
                                             {expert.education.map((edu, index) => (
                                                  <Flex key={index} align="center" css={{ gap: '$4' }}>
                                                       <Box css={{ p: '$2', bg: '$primaryLight', borderRadius: '$sm' }}>
                                                            <GraduationCap size={18} color="var(--nextui-colors-primary)" />
                                                       </Box>
                                                       <Text b size="$sm">{edu}</Text>
                                                  </Flex>
                                             ))}
                                             {expert.credentials.map((cred, index) => (
                                                  <Flex key={`cred-${index}`} align="center" css={{ gap: '$4' }}>
                                                       <Box css={{ p: '$2', bg: '$successLight', borderRadius: '$sm' }}>
                                                            <Shield size={18} color="var(--nextui-colors-success)" />
                                                       </Box>
                                                       <Text b size="$sm">{cred}</Text>
                                                  </Flex>
                                             ))}
                                        </Flex>
                                   </Box>
                              </Grid>

                              {(Array.isArray(expert.achievements) && expert.achievements.length > 0) && (
                                   <Grid xs={12} md={6}>
                                        <Box>
                                             <Text h4 css={{ mb: '$4' }}>Recognition</Text>
                                             <Flex direction="column" css={{ gap: '$4' }}>
                                                  {expert.achievements.map((achievement, index) => (
                                                       <Flex key={index} align="center" css={{ gap: '$4' }}>
                                                            <Box css={{ p: '$2', bg: '$warningLight', borderRadius: '$sm' }}>
                                                                 <Award size={18} color="var(--nextui-colors-warning)" />
                                                            </Box>
                                                            <Text b size="$sm">{achievement}</Text>
                                                       </Flex>
                                                  ))}
                                             </Flex>
                                        </Box>
                                   </Grid>
                              )}
                         </Grid.Container>
                    </Box>
               )
          },
          {
               key: 'reviews',
               title: `Reviews (${reviews.length})`,
               content: (
                    <Flex direction="column" css={{ gap: '$8', py: '$4' }}>
                         <Card variant="bordered" css={{ mw: '100%', p: '$8', borderStyle: 'dashed' }}>
                              <Grid.Container gap={2} justify="center" alignItems="center">
                                   <Grid xs={12} sm={4}>
                                        <Flex direction="column" align="center" justify="center" css={{ textAlign: 'center' }}>
                                             <Text h1 css={{ mb: 0, fontSize: '64px', fontWeight: '$black' }}>
                                                  {expert.rating}
                                             </Text>
                                             <Flex css={{ gap: '$1', mb: '$2' }}>
                                                  {[...Array(5)].map((_, i) => (
                                                       <Star
                                                            key={i}
                                                            size={20}
                                                            fill={i < Math.floor(expert.rating) ? '#f59e0b' : 'transparent'}
                                                            color="#f59e0b"
                                                       />
                                                  ))}
                                             </Flex>
                                             <Text color="$accents7">Based on {expert.reviewCount} reviews</Text>
                                        </Flex>
                                   </Grid>

                                   <Grid xs={12} sm={8}>
                                        <Box css={{ w: '100%', px: '$4' }}>
                                             {[5, 4, 3, 2, 1].map((stars) => {
                                                  const count = reviews.filter(r => Math.floor(r.rating) === stars).length;
                                                  const percentage = (count / reviews.length) * 100;
                                                  return (
                                                       <Flex key={stars} align="center" css={{ gap: '$4', mb: '$2' }}>
                                                            <Text b size="$sm" css={{ minWidth: '12px' }}>{stars}</Text>
                                                            <Progress value={percentage} color="warning" size="sm" />
                                                            <Text size="$sm" color="$accents6" css={{ minWidth: '40px' }}>{count}</Text>
                                                       </Flex>
                                                  );
                                             })}
                                        </Box>
                                   </Grid>
                              </Grid.Container>
                         </Card>
                         <Grid.Container gap={2}>
                              {reviews.map((review) => (
                                   <Grid xs={12} key={review.id}>
                                        <ReviewCard review={review} />
                                   </Grid>
                              ))}
                         </Grid.Container>
                    </Flex>
               )
          },
          {
               key: 'consultation',
               title: 'Book a Session',
               content: (
                    <Box css={{ py: '$4' }}>
                         <Grid.Container gap={2}>
                              {consultationTypes.map((type) => (
                                   <Grid xs={12} sm={6} md={4} key={type.id}>
                                        <Card
                                             isPressable
                                             variant="bordered"
                                             onPress={() => setShowBookingModal(true)}
                                             css={{
                                                  transition: '0.2s',
                                                  '&:hover': { borderColor: '$primary', transform: 'translateY(-4px)' }
                                             }}
                                        >
                                             <Card.Header css={{ pb: 0 }}>
                                                  <Flex justify="between" align="center" css={{ w: '100%' }}>
                                                       <Text b size="$xl">{type.name}</Text>
                                                       <Badge color="primary" variant="flat">${type.price}</Badge>
                                                  </Flex>
                                             </Card.Header>
                                             <Card.Body>
                                                  <Flex align="center" css={{ gap: '$2', mb: '$4', color: '$accents7' }}>
                                                       <Clock size={16} />
                                                       <Text size="$sm">{type.duration} Minutes</Text>
                                                  </Flex>
                                                  <Text size="$sm" color="$accents8">{type.description}</Text>
                                             </Card.Body>
                                             <Card.Footer>
                                                  <Button
                                                       flat
                                                       onPress={() => setShowBookingModal(true)}
                                                  >
                                                       Select Session
                                                  </Button>
                                             </Card.Footer>
                                        </Card>
                                   </Grid>
                              ))}
                         </Grid.Container>
                    </Box>
               )
          }
     ], [expert, reviews, consultationTypes]);

     return (
          <>
               <Card variant="flat" css={{ p: '$10', mb: '$8', bg: '$background' }}>
                    <Flex direction="column" css={{ gap: '$8' }}>
                         <Flex justify="between" align="start" wrap="wrap" css={{ gap: '$6' }}>
                              <Flex css={{ gap: '$8' }} wrap="wrap">
                                   <Avatar
                                        src={expert.avatar}
                                        css={{ size: '$40', borderRadius: '$xl' }}
                                        bordered
                                        color="primary"
                                   />
                                   <Box>
                                        <Flex align="center" css={{ gap: '$3', mb: '$1' }}>
                                             <Text h2 css={{ m: 0 }}>{expert.name}</Text>
                                             {expert.verified && <CheckCircle2 size={24} color="var(--nextui-colors-primary)" />}
                                        </Flex>

                                        <Text h4 color="$primary" css={{ fontWeight: '$medium', mb: '$4' }}>
                                             {expert.title}
                                        </Text>

                                        <Flex wrap="wrap" css={{ gap: '$6', mb: '$6' }}>
                                             <Flex align="center" css={{ gap: '$2' }}>
                                                  <Star size={18} fill="#f59e0b" color="#f59e0b" />
                                                  <Text b>{expert.rating}</Text>
                                                  <Text color="$accents7">({expert.reviewCount})</Text>
                                             </Flex>
                                             <Flex align="center" css={{ gap: '$2' }}>
                                                  <Clock size={18} color="var(--nextui-colors-accents7)" />
                                                  <Text b>{expert.experience} Yrs</Text>
                                             </Flex>
                                             <Flex align="center" css={{ gap: '$2' }}>
                                                  <Globe size={18} color="var(--nextui-colors-accents7)" />
                                                  <Text b>{expert.languages.length} Languages</Text>
                                             </Flex>
                                        </Flex>

                                        <Flex css={{ gap: '$4' }}>
                                             <Button
                                                  shadow
                                                  color="primary"
                                                  icon={<Calendar size={18} />}
                                                  onPress={() => setShowBookingModal(true)}
                                             >
                                                  Book Consultation
                                             </Button>
                                             {expert.videoIntro && (
                                                  <Button auto flat icon={<Video size={18} />}>
                                                       Watch Intro
                                                  </Button>
                                             )}
                                        </Flex>
                                   </Box>
                              </Flex>

                              <Box css={{
                                   p: '$6',
                                   bg: '$accents0',
                                   borderRadius: '$lg',
                                   textAlign: 'center',
                                   minWidth: '160px',
                                   border: '1px solid $accents2'
                              }}>
                                   <Text size="$sm" color="$accents7" transform="uppercase" b>Hourly Rate</Text>
                                   <Text h2 css={{ color: '$primary', m: 0 }}>${expert.hourlyRate}</Text>
                                   <Text size="$xs" color="$accents6">Secure Payment</Text>
                              </Box>
                         </Flex>

                         <Divider />

                         <Grid.Container gap={2}>
                              <Grid xs={12} md={7}>
                                   <Box>
                                        <Text h5 css={{ mb: '$3', color: '$accents7' }}>Expertise</Text>
                                        <Flex wrap="wrap" css={{ gap: '$2' }}>
                                             {expert.expertise.map((exp, index) => {
                                                  const category = expertiseCategories.find(c => c.id === exp);
                                                  return (
                                                       <Badge
                                                            key={index}
                                                            variant="flat"
                                                            css={{
                                                                 bg: `${category?.color}20`,
                                                                 color: category?.color,
                                                                 border: `1px solid ${category?.color}40`,
                                                                 px: '$4'
                                                            }}
                                                       >
                                                            {category?.name}
                                                       </Badge>
                                                  );
                                             })}
                                        </Flex>
                                   </Box>
                              </Grid>
                              <Grid xs={12} md={5}>
                                   <Box>
                                        <Text h5 css={{ mb: '$3', color: '$accents7' }}>Communication</Text>
                                        <Flex wrap="wrap" css={{ gap: '$2' }}>
                                             {expert.languages.map((lang) => (
                                                  <Badge key={lang} variant="bordered" color="default" css={{ px: '$4' }}>
                                                       {lang.toUpperCase()}
                                                  </Badge>
                                             ))}
                                        </Flex>
                                   </Box>
                              </Grid>
                         </Grid.Container>
                    </Flex>
               </Card>

               <Tabs
                    items={tabItems}
                    activeKey={selectedTab}
                    onChange={(key) => setSelectedTab(key as string)}
                    variant="underlined"
                    css={{ mb: '$10' }}
               />

               <BookingModal
                    open={showBookingModal}
                    onClose={() => setShowBookingModal(false)}
                    expert={expert}
                    consultationTypes={consultationTypes}
                    onBookConsultation={onBookConsultation as any}
               />
          </>
     );
};