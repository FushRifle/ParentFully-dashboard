import React, { useState, useMemo } from 'react';
import { Grid, Text, Button, Input, Badge, Card } from '@nextui-org/react';

import { Select } from '../../components/styles/select';
import { Box } from '../../components/styles/box';
import { Flex } from '../../components/styles/flex';

import {
     Search, Filter, Lock, Video,
     BookOpen, Clock, Shield
} from 'lucide-react';
import { Tabs } from '../../components/styles/tabs';

import {
     experts, expertiseCategories, filters,
     consultationTypes, reviews
} from '../../components/experts/data';

import { ExpertCard } from '../../components/experts/expert-card';
import { ExpertiseFilter } from '../../components/experts/expert-filter';
import { ExpertProfile } from '../../components/experts/expert-profile';

const ExpertsPage = () => {
     const [selectedTab, setSelectedTab] = useState('browse');
     const [searchQuery, setSearchQuery] = useState('');
     const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
     const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
     const [selectedLanguage, setSelectedLanguage] = useState('all');
     const [selectedExperience, setSelectedExperience] = useState('all');
     const [selectedAvailability, setSelectedAvailability] = useState('all');
     const [selectedPrice, setSelectedPrice] = useState('all');

     // Options for Selects
     const languageOptions = [{ label: 'All Languages', value: 'all' }, ...filters.languages.map(lang => ({ label: lang.charAt(0).toUpperCase() + lang.slice(1), value: lang }))];
     const experienceOptions = [{ label: 'Any Experience', value: 'all' }, ...filters.experience.map(exp => ({ label: `${exp} years`, value: exp }))];
     const availabilityOptions = [
          { label: 'All', value: 'all' },
          { label: 'Available Now', value: 'available' },
          { label: 'Busy', value: 'busy' }
     ];
     const priceOptions = [
          { label: 'All', value: 'all' },
          { label: '$0 - $100', value: '0-100' },
          { label: '$100 - $150', value: '100-150' },
          { label: '$150 - $200', value: '150-200' },
          { label: '$200+', value: '200+' }
     ];

     // Get selected expert details
     const currentExpert = useMemo(() => experts.find(expert => expert.id === selectedExpert) || null, [selectedExpert]);

     // Filter experts
     const filteredExperts = useMemo(() => {
          return experts.filter(expert => {
               const matchesSearch =
                    searchQuery === '' ||
                    expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    expert.expertise.some(exp => expertiseCategories.find(c => c.id === exp)?.name.toLowerCase().includes(searchQuery.toLowerCase()));

               const matchesExpertise =
                    selectedExpertise.length === 0 ||
                    selectedExpertise.some(exp => expert.expertise.includes(expertiseCategories.find(c => c.name === exp)?.id as any));

               const matchesLanguage =
                    selectedLanguage === 'all' || expert.languages.includes(selectedLanguage as any);

               const matchesExperience = (() => {
                    if (selectedExperience === 'all') return true;
                    if (selectedExperience === '0-5') return expert.experience <= 5;
                    if (selectedExperience === '5-10') return expert.experience > 5 && expert.experience <= 10;
                    if (selectedExperience === '10-15') return expert.experience > 10 && expert.experience <= 15;
                    if (selectedExperience === '15+') return expert.experience > 15;
                    return true;
               })();

               const matchesAvailability =
                    selectedAvailability === 'all' || expert.availability === selectedAvailability;

               const matchesPrice = (() => {
                    if (selectedPrice === 'all') return true;
                    if (selectedPrice === '0-100') return expert.hourlyRate <= 100;
                    if (selectedPrice === '100-150') return expert.hourlyRate > 100 && expert.hourlyRate <= 150;
                    if (selectedPrice === '150-200') return expert.hourlyRate > 150 && expert.hourlyRate <= 200;
                    if (selectedPrice === '200+') return expert.hourlyRate > 200;
                    return true;
               })();

               return matchesSearch && matchesExpertise && matchesLanguage && matchesExperience && matchesAvailability && matchesPrice;
          });
     }, [searchQuery, selectedExpertise, selectedLanguage, selectedExperience, selectedAvailability, selectedPrice]);

     // Stats
     const stats = {
          totalExperts: experts.length,
          verifiedExperts: experts.filter(e => e.verified).length,
          averageRating: (experts.reduce((sum, e) => sum + e.rating, 0) / experts.length).toFixed(1),
          totalExperience: experts.reduce((sum, e) => sum + e.experience, 0)
     };

     const handleBookExpert = (expertId: string) => {
          setSelectedExpert(expertId);
          setSelectedTab('profile');
     };

     const handleViewProfile = (expertId: string) => {
          setSelectedExpert(expertId);
          setSelectedTab('profile');
     };

     const handleBookConsultation = (expertId: string, consultationType: string) => {
          console.log('Booking consultation:', { expertId, consultationType });
     };

     // Tab items
     const tabItems = [
          {
               key: 'browse',
               title: 'Browse Experts',
               content: (
                    <Flex css={{ gap: '$6', flexWrap: 'wrap' }}>
                         {/* Left Panel - Filters */}
                         <Flex direction="column" css={{ width: '100%', maxWidth: '300px', gap: '$6' }}>
                              <ExpertiseFilter selectedExpertise={selectedExpertise} onChange={setSelectedExpertise} />

                              <Card css={{ p: '$6' }} variant="flat">
                                   <Text h4 css={{ mb: '$4' }}>Languages</Text>
                                   <Select
                                        value={selectedLanguage}
                                        onChange={setSelectedLanguage}
                                        options={languageOptions}
                                        css={{ width: '100%' }}
                                   />
                              </Card>

                              <Card css={{ p: '$6' }} variant="flat">
                                   <Text h4 css={{ mb: '$4' }}>Years of Experience</Text>
                                   <Select
                                        value={selectedExperience}
                                        onChange={setSelectedExperience}
                                        options={experienceOptions}
                                        css={{ width: '100%' }}
                                   />
                              </Card>
                         </Flex>

                         {/* Right Panel - Expert Cards */}
                         <Flex direction="column" css={{ flex: 1, gap: '$6' }}>
                              {filteredExperts.filter(e => e.featured).length > 0 && (
                                   <Box>
                                        <Flex align="center" css={{ gap: '$3', mb: '$4' }}>
                                             <Text h4>Featured Experts</Text>
                                        </Flex>

                                        <Flex direction="column" css={{ gap: '$3' }}>
                                             {filteredExperts.filter(e => e.featured).map(expert => (
                                                  <ExpertCard
                                                       key={expert.id}
                                                       expert={expert}
                                                       onBook={handleBookExpert}
                                                       onViewProfile={handleViewProfile}
                                                  />
                                             ))}
                                        </Flex>
                                   </Box>
                              )}
                         </Flex>
                         <Flex>
                              <Text h4 css={{ mb: '$4' }}>
                                   {filteredExperts.length} Parenting Experts Available
                              </Text>

                              <Grid.Container gap={2}>
                                   {filteredExperts.filter(e => !e.featured).map(expert => (
                                        <Grid xs={12} md={6} key={expert.id}>
                                             <ExpertCard
                                                  expert={expert}
                                                  compact
                                                  onBook={handleBookExpert}
                                                  onViewProfile={handleViewProfile}
                                             />
                                        </Grid>
                                   ))}
                              </Grid.Container>
                         </Flex>
                    </Flex>

               )
          },
          {
               key: 'profile',
               title: 'Expert Profile',
               content: currentExpert ? (
                    <ExpertProfile
                         expert={currentExpert}
                         reviews={reviews.filter(r => r.expertId === currentExpert.id)}
                         consultationTypes={consultationTypes}
                         onBookConsultation={handleBookConsultation}
                    />
               ) : (
                    <Box css={{ textAlign: 'center', py: '$20' }}>
                         <Text h4 color="$accents7">Select an expert to view their profile</Text>
                    </Box>
               )
          }
     ];

     return (
          <Box css={{ p: '$10', overflow: 'auto', height: 'calc(100vh - 100px)' }}>
               {/* Header */}
               <Flex justify="between" align="center" css={{ mb: '$8' }}>
                    <Box>
                         <Text h2>Parenting Experts</Text>
                         <Text color="$accents7" css={{ mt: '$2' }}>
                              Connect with certified parenting advisors, counselors, and specialists
                         </Text>
                    </Box>

                    <Flex css={{ gap: '$4' }}>
                         <Button auto css={{ bg: '#3f3bef' }} icon={<BookOpen size={16} />} onPress={() => console.log('Book consultation')}>
                              Book Free Consultation
                         </Button>
                    </Flex>
               </Flex>

               {/* Stats */}
               <Card css={{ p: '$6', mb: '$8' }} variant="flat">
                    <Grid.Container gap={2}>
                         <Grid xs={12} sm={6} md={3}>
                              <Flex direction="column" align="center">
                                   <Text b size="$2xl" css={{ color: '$primary' }}>{stats.totalExperts}</Text>
                                   <Text size="$sm" color="$accents7">Certified Experts</Text>
                              </Flex>
                         </Grid>
                         <Grid xs={12} sm={6} md={3}>
                              <Flex direction="column" align="center">
                                   <Text b size="$2xl" css={{ color: '$success' }}>{stats.verifiedExperts}</Text>
                                   <Text size="$sm" color="$accents7">Verified Professionals</Text>
                              </Flex>
                         </Grid>
                         <Grid xs={12} sm={6} md={3}>
                              <Flex direction="column" align="center">
                                   <Text b size="$2xl" css={{ color: '$warning' }}>{stats.averageRating}</Text>
                                   <Text size="$sm" color="$accents7">Average Rating</Text>
                              </Flex>
                         </Grid>
                         <Grid xs={12} sm={6} md={3}>
                              <Flex direction="column" align="center">
                                   <Text b size="$2xl" css={{ color: '$secondary' }}>{stats.totalExperience}+</Text>
                                   <Text size="$sm" color="$accents7">Years of Experience</Text>
                              </Flex>
                         </Grid>
                    </Grid.Container>
               </Card>

               {/* Search & Filters */}
               <Card css={{ p: '$6', mb: '$8' }} variant="flat">
                    <Flex css={{ gap: '$6', flexWrap: 'wrap' }}>
                         <Input
                              placeholder="Search experts by name, specialty, or keyword..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              contentLeft={<Search size={16} />}
                              css={{ flex: 1, minWidth: '200px' }}
                         />

                         <Select placeholder="Availability" value={selectedAvailability} options={availabilityOptions} onChange={setSelectedAvailability} css={{ minWidth: '150px' }} />
                         <Select placeholder="Price Range" value={selectedPrice} options={priceOptions} onChange={setSelectedPrice} css={{ minWidth: '150px' }} />

                         <Button
                              auto
                              light
                              icon={<Filter size={16} />}
                              onPress={() => {
                                   setSelectedExpertise([]);
                                   setSelectedLanguage('all');
                                   setSelectedExperience('all');
                                   setSelectedAvailability('all');
                                   setSelectedPrice('all');
                              }}
                         >
                              Clear Filters
                         </Button>
                    </Flex>
               </Card>

               {/* Main Tabs */}
               <Tabs items={tabItems} activeKey={selectedTab} onChange={setSelectedTab} variant="underlined" css={{ mb: '$8' }} />

               {/* Benefits 
               {selectedTab === 'browse' && (
                    <Card css={{ p: '$6', mt: '$8' }} variant="flat">
                         <Text h4 css={{ mb: '$6', textAlign: 'center' }}>Why Choose Our Parenting Experts?</Text>
                         <Grid.Container gap={4}>
                              <Grid xs={12} sm={6} md={3}>
                                   <Flex direction="column" align="center" css={{ gap: '$3', textAlign: 'center' }}>
                                        <Badge size="lg" color="primary" variant="flat"><Shield size={24} /></Badge>
                                        <Text b>Verified Credentials</Text>
                                        <Text size="$sm" color="$accents7">All experts are thoroughly vetted and certified</Text>
                                   </Flex>
                              </Grid>
                              <Grid xs={12} sm={6} md={3}>
                                   <Flex direction="column" align="center" css={{ gap: '$3', textAlign: 'center' }}>
                                        <Badge size="lg" color="success" variant="flat"><Clock size={24} /></Badge>
                                        <Text b>Flexible Scheduling</Text>
                                        <Text size="$sm" color="$accents7">Book sessions that fit your schedule</Text>
                                   </Flex>
                              </Grid>
                              <Grid xs={12} sm={6} md={3}>
                                   <Flex direction="column" align="center" css={{ gap: '$3', textAlign: 'center' }}>
                                        <Badge size="lg" color="warning" variant="flat"><Video size={24} /></Badge>
                                        <Text b>Multiple Formats</Text>
                                        <Text size="$sm" color="$accents7">Video, phone, or in-person consultations</Text>
                                   </Flex>
                              </Grid>
                              <Grid xs={12} sm={6} md={3}>
                                   <Flex direction="column" align="center" css={{ gap: '$3', textAlign: 'center' }}>
                                        <Badge size="lg" color="error" variant="flat"><Lock size={24} /></Badge>
                                        <Text b>Confidential & Secure</Text>
                                        <Text size="$sm" color="$accents7">Your privacy is our top priority</Text>
                                   </Flex>
                              </Grid>
                         </Grid.Container>
                    </Card>
               )}
                    */}
          </Box>
     );
};

export default ExpertsPage;
