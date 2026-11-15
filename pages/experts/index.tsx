import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { experts, expertiseCategories, filters, consultationTypes, reviews } from '@/components/experts/data';
import { ExpertCard } from '@/components/experts/expert-card';
import { ExpertiseFilter } from '@/components/experts/expert-filter';
import { ExpertProfile } from '@/components/experts/expert-profile';

const ExpertsPage = () => {
     const [selectedTab, setSelectedTab] = useState('browse');
     const [searchQuery, setSearchQuery] = useState('');
     const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
     const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
     const [selectedLanguage, setSelectedLanguage] = useState('all');
     const [selectedExperience, setSelectedExperience] = useState('all');
     const [selectedAvailability, setSelectedAvailability] = useState('all');
     const [selectedPrice, setSelectedPrice] = useState('all');

     const languageOptions = [
          { label: 'All Languages', value: 'all' },
          ...filters.languages.map((lang) => ({ label: lang.charAt(0).toUpperCase() + lang.slice(1), value: lang })),
     ];
     const experienceOptions = [
          { label: 'Any Experience', value: 'all' },
          ...filters.experience.map((exp) => ({ label: `${exp} years`, value: exp })),
     ];
     const availabilityOptions = [
          { label: 'All', value: 'all' },
          { label: 'Available Now', value: 'available' },
          { label: 'Busy', value: 'busy' },
     ];
     const priceOptions = [
          { label: 'All', value: 'all' },
          { label: '$0 - $100', value: '0-100' },
          { label: '$100 - $150', value: '100-150' },
          { label: '$150 - $200', value: '150-200' },
          { label: '$200+', value: '200+' },
     ];

     const currentExpert = useMemo(
          () => experts.find((expert) => expert.id === selectedExpert) || null,
          [selectedExpert],
     );

     const filteredExperts = useMemo(() => {
          return experts.filter((expert) => {
               const matchesSearch =
                    searchQuery === '' ||
                    expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    expert.expertise.some((exp) =>
                         expertiseCategories.find((c) => c.id === exp)?.name.toLowerCase().includes(searchQuery.toLowerCase()),
                    );

               const matchesExpertise =
                    selectedExpertise.length === 0 ||
                    selectedExpertise.some((exp) =>
                         expert.expertise.includes(expertiseCategories.find((c) => c.name === exp)?.id as any),
                    );

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

     const stats = {
          totalExperts: experts.length,
          verifiedExperts: experts.filter((e) => e.verified).length,
          averageRating: (experts.reduce((sum, e) => sum + e.rating, 0) / experts.length).toFixed(1),
          totalExperience: experts.reduce((sum, e) => sum + e.experience, 0),
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

     const clearFilters = () => {
          setSelectedExpertise([]);
          setSelectedLanguage('all');
          setSelectedExperience('all');
          setSelectedAvailability('all');
          setSelectedPrice('all');
     };

     return (
          <div className="h-[calc(100vh-100px)] overflow-auto p-10">
               <div className="mb-8 flex items-center justify-between">
                    <div>
                         <h2 className="text-2xl font-semibold">Parenting Experts</h2>
                         <p className="mt-2 text-muted-foreground">
                              Connect with certified parenting advisors, counselors, and specialists
                         </p>
                    </div>
                    <Button onClick={() => console.log('Book consultation')}>Book Free Consultation</Button>
               </div>

               <Card className="mb-8 p-6">
                    <CardContent className="grid grid-cols-1 gap-4 p-0 sm:grid-cols-2 md:grid-cols-4">
                         <div className="flex flex-col items-center">
                              <span className="text-2xl font-bold text-primary">{stats.totalExperts}</span>
                              <span className="text-sm text-muted-foreground">Certified Experts</span>
                         </div>
                         <div className="flex flex-col items-center">
                              <span className="text-2xl font-bold text-emerald-500">{stats.verifiedExperts}</span>
                              <span className="text-sm text-muted-foreground">Verified Professionals</span>
                         </div>
                         <div className="flex flex-col items-center">
                              <span className="text-2xl font-bold text-amber-500">{stats.averageRating}</span>
                              <span className="text-sm text-muted-foreground">Average Rating</span>
                         </div>
                         <div className="flex flex-col items-center">
                              <span className="text-2xl font-bold text-indigo-500">{stats.totalExperience}+</span>
                              <span className="text-sm text-muted-foreground">Years of Experience</span>
                         </div>
                    </CardContent>
               </Card>

               <Card className="mb-8 p-6">
                    <CardContent className="flex flex-wrap gap-6 p-0">
                         <div className="relative min-w-[200px] flex-1">
                              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                   placeholder="Search experts by name, specialty, or keyword..."
                                   value={searchQuery}
                                   onChange={(e) => setSearchQuery(e.target.value)}
                                   className="pl-9"
                              />
                         </div>

                         <Select value={selectedAvailability} onValueChange={setSelectedAvailability as any}>
                              <SelectTrigger className="min-w-[150px]"><SelectValue placeholder="Availability" /></SelectTrigger>
                              <SelectContent>
                                   {availabilityOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                              </SelectContent>
                         </Select>

                         <Select value={selectedPrice} onValueChange={setSelectedPrice as any}>
                              <SelectTrigger className="min-w-[150px]"><SelectValue placeholder="Price Range" /></SelectTrigger>
                              <SelectContent>
                                   {priceOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                              </SelectContent>
                         </Select>

                         <Button variant="ghost" onClick={clearFilters}>
                              <Filter size={16} className="mr-2" />
                              Clear Filters
                         </Button>
                    </CardContent>
               </Card>

               <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
                    <TabsList>
                         <TabsTrigger value="browse">Browse Experts</TabsTrigger>
                         <TabsTrigger value="profile">Expert Profile</TabsTrigger>
                    </TabsList>

                    <TabsContent value="browse" className="mt-4">
                         <div className="flex flex-wrap gap-6">
                              <div className="flex w-full max-w-[300px] flex-col gap-6">
                                   <ExpertiseFilter selectedExpertise={selectedExpertise} onChange={setSelectedExpertise} />

                                   <Card className="p-6">
                                        <h4 className="mb-4 text-lg font-semibold">Languages</h4>
                                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage as any}>
                                             <SelectTrigger className="w-full"><SelectValue placeholder="Language" /></SelectTrigger>
                                             <SelectContent>
                                                  {languageOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                             </SelectContent>
                                        </Select>
                                   </Card>

                                   <Card className="p-6">
                                        <h4 className="mb-4 text-lg font-semibold">Years of Experience</h4>
                                        <Select value={selectedExperience} onValueChange={setSelectedExperience as any}>
                                             <SelectTrigger className="w-full"><SelectValue placeholder="Experience" /></SelectTrigger>
                                             <SelectContent>
                                                  {experienceOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                             </SelectContent>
                                        </Select>
                                   </Card>
                              </div>

                              <div className="flex flex-1 flex-col gap-6">
                                   {filteredExperts.filter((e) => e.featured).length > 0 && (
                                        <div>
                                             <div className="mb-4 flex items-center gap-3">
                                                  <h4 className="text-lg font-semibold">Featured Experts</h4>
                                             </div>
                                             <div className="flex flex-col gap-3">
                                                  {filteredExperts.filter((e) => e.featured).map((expert) => (
                                                       <ExpertCard
                                                            key={expert.id}
                                                            expert={expert}
                                                            onBook={handleBookExpert}
                                                            onViewProfile={handleViewProfile}
                                                       />
                                                  ))}
                                             </div>
                                        </div>
                                   )}
                              </div>

                              <div className="w-full">
                                   <h4 className="mb-4 text-lg font-semibold">
                                        {filteredExperts.length} Parenting Experts Available
                                   </h4>
                                   <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {filteredExperts.filter((e) => !e.featured).map((expert) => (
                                             <ExpertCard
                                                  key={expert.id}
                                                  expert={expert}
                                                  compact
                                                  onBook={handleBookExpert}
                                                  onViewProfile={handleViewProfile}
                                             />
                                        ))}
                                   </div>
                              </div>
                         </div>
                    </TabsContent>

                    <TabsContent value="profile" className="mt-4">
                         {currentExpert ? (
                              <ExpertProfile
                                   expert={currentExpert}
                                   reviews={reviews.filter((r) => r.expertId === currentExpert.id)}
                                   consultationTypes={consultationTypes}
                                   onBookConsultation={handleBookConsultation}
                              />
                         ) : (
                              <div className="py-20 text-center">
                                   <h4 className="text-lg font-semibold text-muted-foreground">
                                        Select an expert to view their profile
                                   </h4>
                              </div>
                         )}
                    </TabsContent>
               </Tabs>
          </div>
     );
};

export default ExpertsPage;