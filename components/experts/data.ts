export type Expertise =
     | 'child-psychology'
     | 'behavioral-therapy'
     | 'parent-coaching'
     | 'adolescent-counseling'
     | 'sleep-training'
     | 'nutrition'
     | 'special-needs'
     | 'family-mediation'
     | 'academic-guidance'
     | 'trauma-recovery';

export type Language = 'english' | 'spanish' | 'french' | 'mandarin' | 'hindi' | 'arabic';

export interface Expert {
     id: string;
     name: string;
     title: string;
     credentials: string[];
     avatar: string;
     bio: string;
     expertise: Expertise[];
     languages: Language[];
     experience: number; // years
     rating: number;
     reviewCount: number;
     hourlyRate: number;
     availability: 'high' | 'medium' | 'low';
     verified: boolean;
     featured: boolean;
     location: string;
     education: string[];
     approach: string;
     videoIntro?: string;
     achievements?: string[];
}

export interface Review {
     id: string;
     expertId: string;
     author: string;
     rating: number;
     content: string;
     date: string;
     helpful: number;
}

export interface ConsultationType {
     id: string;
     name: string;
     duration: number; // minutes
     price: number;
     description: string;
}

export interface AvailabilitySlot {
     id: string;
     expertId: string;
     date: string;
     startTime: string;
     endTime: string;
     booked: boolean;
}

// Mock Data
export const experts: Expert[] = [
     {
          id: 'dr-sarah-miller',
          name: 'Dr. Sarah Miller',
          title: 'Child Psychologist & Parenting Coach',
          credentials: ['PhD in Child Psychology', 'Licensed Clinical Psychologist', 'Certified Parent Coach'],
          avatar: 'https://i.pravatar.cc/150?u=sarah-miller',
          bio: 'With over 15 years of experience specializing in child development and family dynamics, Dr. Miller helps parents navigate challenges from toddler years through adolescence using evidence-based techniques.',
          expertise: ['child-psychology', 'parent-coaching', 'behavioral-therapy', 'adolescent-counseling'],
          languages: ['english', 'spanish'],
          experience: 15,
          rating: 4.9,
          reviewCount: 247,
          hourlyRate: 180,
          availability: 'high',
          verified: true,
          featured: true,
          location: 'New York, NY',
          education: ['PhD - Stanford University', 'Masters - Columbia University', 'BA - Harvard University'],
          approach: 'Uses a combination of cognitive-behavioral techniques and positive parenting strategies tailored to each family\'s unique needs.',
          videoIntro: 'https://example.com/video-sarah',
          achievements: ['Author of "The Connected Parent"', 'Featured in Psychology Today', 'Awarded APA Excellence in Practice 2022']
     },
     {
          id: 'dr-michael-chen',
          name: 'Dr. Michael Chen',
          title: 'Family Therapist & Adolescent Specialist',
          credentials: ['LMFT', 'PhD in Family Therapy', 'Certified Trauma Specialist'],
          avatar: 'https://i.pravatar.cc/150?u=michael-chen',
          bio: 'Specializing in adolescent development and family systems, Dr. Chen helps families improve communication, resolve conflicts, and build stronger relationships.',
          expertise: ['adolescent-counseling', 'family-mediation', 'trauma-recovery', 'behavioral-therapy'],
          languages: ['english', 'mandarin'],
          experience: 12,
          rating: 4.8,
          reviewCount: 189,
          hourlyRate: 160,
          availability: 'medium',
          verified: true,
          featured: true,
          location: 'San Francisco, CA',
          education: ['PhD - University of California', 'Masters - NYU', 'BA - UC Berkeley'],
          approach: 'Family systems approach with emphasis on communication skills and emotional intelligence development.',
          achievements: ['Published researcher on adolescent mental health', 'Speaker at National Family Therapy Conference']
     },
     {
          id: 'maria-rodriguez',
          name: 'Maria Rodriguez',
          title: 'Parent Coach & Sleep Consultant',
          credentials: ['Certified Parent Coach', 'Pediatric Sleep Consultant', 'M.Ed in Early Childhood'],
          avatar: 'https://i.pravatar.cc/150?u=maria-rodriguez',
          bio: 'Maria specializes in helping parents establish healthy sleep habits, routines, and positive discipline strategies for children ages 0-8.',
          expertise: ['sleep-training', 'parent-coaching', 'behavioral-therapy'],
          languages: ['english', 'spanish', 'french'],
          experience: 8,
          rating: 4.7,
          reviewCount: 156,
          hourlyRate: 120,
          availability: 'high',
          verified: true,
          featured: false,
          location: 'Miami, FL',
          education: ['M.Ed - University of Miami', 'BA - Florida International University'],
          approach: 'Gentle, attachment-based approach focusing on consistency and responsive parenting.',
          achievements: ['Certified by International Parenting Association', 'Featured on Parenting Today Podcast']
     },
     {
          id: 'dr-james-wilson',
          name: 'Dr. James Wilson',
          title: 'Child Development Specialist',
          credentials: ['EdD in Child Development', 'Board Certified Behavior Analyst', 'Licensed School Psychologist'],
          avatar: 'https://i.pravatar.cc/150?u=james-wilson',
          bio: 'Dr. Wilson specializes in developmental delays, learning differences, and helping parents support children with special needs.',
          expertise: ['special-needs', 'academic-guidance', 'child-psychology'],
          languages: ['english'],
          experience: 20,
          rating: 4.9,
          reviewCount: 312,
          hourlyRate: 200,
          availability: 'low',
          verified: true,
          featured: true,
          location: 'Boston, MA',
          education: ['EdD - Boston University', 'Masters - Tufts University', 'BA - Brown University'],
          approach: 'Strength-based approach focusing on each child\'s unique abilities and potential.',
          achievements: ['Author of "Understanding Your Unique Child"', 'Consultant for Boston Public Schools']
     },
     {
          id: 'priya-sharma',
          name: 'Priya Sharma',
          title: 'Nutritionist & Family Wellness Coach',
          credentials: ['RD - Registered Dietitian', 'Certified Nutrition Specialist', 'Family Wellness Coach'],
          avatar: 'https://i.pravatar.cc/150?u=priya-sharma',
          bio: 'Priya helps families develop healthy eating habits, address picky eating, and create balanced nutrition plans for children of all ages.',
          expertise: ['nutrition', 'parent-coaching'],
          languages: ['english', 'hindi'],
          experience: 10,
          rating: 4.6,
          reviewCount: 98,
          hourlyRate: 110,
          availability: 'medium',
          verified: true,
          featured: false,
          location: 'Chicago, IL',
          education: ['MS in Nutrition - University of Illinois', 'BS - University of Michigan'],
          approach: 'Practical, family-centered nutrition guidance that\'s easy to implement in busy households.',
          achievements: ['Featured in Parents Magazine', 'Speaker at National Nutrition Conference']
     },
     {
          id: 'dr-lisa-patel',
          name: 'Dr. Lisa Patel',
          title: 'Adolescent Mental Health Expert',
          credentials: ['PsyD in Clinical Psychology', 'Licensed Psychologist', 'Teen Mental Health Specialist'],
          avatar: 'https://i.pravatar.cc/150?u=lisa-patel',
          bio: 'Specializing in teen mental health, Dr. Patel helps adolescents navigate anxiety, depression, academic stress, and social challenges.',
          expertise: ['adolescent-counseling', 'trauma-recovery', 'academic-guidance'],
          languages: ['english', 'hindi', 'arabic'],
          experience: 9,
          rating: 4.8,
          reviewCount: 134,
          hourlyRate: 170,
          availability: 'medium',
          verified: true,
          featured: false,
          location: 'Seattle, WA',
          education: ['PsyD - University of Washington', 'Masters - University of Chicago', 'BA - UCLA'],
          approach: 'Integrative approach combining talk therapy, mindfulness, and practical coping strategies.',
          achievements: ['Developed Teen Resilience Program', 'Researcher on adolescent anxiety interventions']
     }
];

export const reviews: Review[] = [
     {
          id: 'rev-1',
          expertId: 'dr-sarah-miller',
          author: 'Emily Johnson',
          rating: 5,
          content: 'Dr. Miller transformed our family dynamic. Her practical advice helped us navigate our toddler\'s tantrums with patience and understanding.',
          date: '2023-10-15',
          helpful: 42
     },
     {
          id: 'rev-2',
          expertId: 'dr-sarah-miller',
          author: 'Mark Thompson',
          rating: 5,
          content: 'Outstanding expertise in adolescent psychology. Our teenage son opened up in ways we never thought possible.',
          date: '2023-10-10',
          helpful: 38
     },
     {
          id: 'rev-3',
          expertId: 'dr-michael-chen',
          author: 'Sophia Rodriguez',
          rating: 4,
          content: 'Excellent family therapist. Helped us rebuild communication after a difficult divorce.',
          date: '2023-10-12',
          helpful: 29
     },
     {
          id: 'rev-4',
          expertId: 'maria-rodriguez',
          author: 'Jennifer Lee',
          rating: 5,
          content: 'Maria saved our sleep! Within two weeks, our 2-year-old was sleeping through the night.',
          date: '2023-10-08',
          helpful: 56
     },
     {
          id: 'rev-5',
          expertId: 'dr-james-wilson',
          author: 'David Chen',
          rating: 5,
          content: 'Dr. Wilson\'s guidance for our son with autism has been life-changing. Highly recommend!',
          date: '2023-10-05',
          helpful: 47
     }
];

export const consultationTypes: ConsultationType[] = [
     {
          id: 'intro',
          name: 'Introductory Session',
          duration: 30,
          price: 75,
          description: 'Brief assessment and overview of how we can help'
     },
     {
          id: 'standard',
          name: 'Standard Consultation',
          duration: 60,
          price: 150,
          description: 'In-depth consultation with personalized recommendations'
     },
     {
          id: 'extended',
          name: 'Extended Session',
          duration: 90,
          price: 200,
          description: 'Comprehensive assessment and detailed action plan'
     },
     {
          id: 'package',
          name: '3-Session Package',
          duration: 180,
          price: 400,
          description: 'Save 15% with a package of three sessions'
     }
];

export const availabilitySlots: AvailabilitySlot[] = [
     { id: 'slot-1', expertId: 'dr-sarah-miller', date: '2023-10-20', startTime: '09:00', endTime: '10:00', booked: false },
     { id: 'slot-2', expertId: 'dr-sarah-miller', date: '2023-10-20', startTime: '14:00', endTime: '15:00', booked: false },
     { id: 'slot-3', expertId: 'dr-sarah-miller', date: '2023-10-21', startTime: '10:30', endTime: '11:30', booked: true },
     { id: 'slot-4', expertId: 'dr-michael-chen', date: '2023-10-20', startTime: '11:00', endTime: '12:00', booked: false },
     { id: 'slot-5', expertId: 'dr-michael-chen', date: '2023-10-21', startTime: '15:00', endTime: '16:00', booked: false },
     { id: 'slot-6', expertId: 'maria-rodriguez', date: '2023-10-20', startTime: '13:00', endTime: '14:00', booked: false },
];

export const expertiseCategories = [
     { id: 'child-psychology', name: 'Child Psychology', color: '#3f3bef' },
     {
          id: 'behavioral-therapy', name: 'Behavioral Therapy', color: '#10b981',
     },
     { id: 'parent-coaching', name: 'Parent Coaching', color: '#f59e0b', },
     { id: 'adolescent-counseling', name: 'Adolescent Counseling', color: '#ef4444' },
     { id: 'sleep-training', name: 'Sleep Training', color: '#8b5cf6' },
     { id: 'nutrition', name: 'Nutrition', color: '#06b6d4' },
     { id: 'special-needs', name: 'Special Needs', color: '#84cc16' },
     { id: 'family-mediation', name: 'Family Mediation', color: '#f97316' },
     { id: 'academic-guidance', name: 'Academic Guidance', color: '#6366f1' },
     { id: 'trauma-recovery', name: 'Trauma Recovery', color: '#ec4899' }
];

export const filters = {
     expertise: expertiseCategories.map(cat => cat.id),
     languages: ['english', 'spanish', 'french', 'mandarin', 'hindi', 'arabic'],
     experience: ['0-5', '5-10', '10-15', '15+'],
     availability: ['high', 'medium', 'low'],
     price: ['0-100', '100-150', '150-200', '200+']
};