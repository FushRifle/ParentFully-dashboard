/* =======================
   TYPES
======================= */

export type PostType = 'article' | 'news' | 'announcement' | 'discussion';

export type PostCategory =
     | 'general'
     | 'health'
     | 'updates'
     | 'technical'
     | 'education'
     | 'events'
     | 'tips'
     | 'parenting';

export interface Author {
     id: string;
     name: string;
     avatar: string;
     role: string;
     verified: boolean;
     followers: number;
}

export interface Post {
     id: string;
     title: string;
     content: string;
     excerpt: string;
     author: Author;
     type: PostType;
     category: PostCategory;
     tags: string[];
     likes: number;
     comments: number;
     shares: number;
     views: number;
     publishedAt: string;
     readTime: number;
     featured: boolean;
     pinned: boolean;
     image?: string;
}

export interface Comment {
     id: string;
     postId: string;
     author: Author;
     content: string;
     likes: number;
     replies: number;
     postedAt: string;
     isAuthor: boolean;
     parentId?: string;
}

export interface NewsItem {
     id: string;
     title: string;
     summary: string;
     source: string;
     url: string;
     publishedAt: string;
     category: PostCategory;
     trending: boolean;
}

export interface TrendingTopic {
     id: string;
     tag: string;
     postCount: number;
     trend: 'up' | 'down' | 'stable';
}

export interface CommunityStats {
     totalMembers: number;
     activeMembers: number;
     totalPosts: number;
     postsToday: number;
     totalComments: number;
}

/* =======================
   AUTHORS (PARENTS / EXPERTS)
======================= */

export const authors: Author[] = [
     {
          id: 'nurse-joy',
          name: 'Joy Adebayo',
          avatar: 'https://i.pravatar.cc/150?u=joy',
          role: 'Pediatric Nurse',
          verified: true,
          followers: 4820,
     },
     {
          id: 'dad-mike',
          name: 'Michael Thompson',
          avatar: 'https://i.pravatar.cc/150?u=mike',
          role: 'Father of 3',
          verified: true,
          followers: 2310,
     },
     {
          id: 'mom-sarah',
          name: 'Sarah Williams',
          avatar: 'https://i.pravatar.cc/150?u=sarah',
          role: 'Parenting Coach',
          verified: true,
          followers: 5290,
     },
     {
          id: 'teacher-emily',
          name: 'Emily Carter',
          avatar: 'https://i.pravatar.cc/150?u=emily',
          role: 'Early Childhood Educator',
          verified: true,
          followers: 3180,
     },
     {
          id: 'dad-david',
          name: 'David Okoye',
          avatar: 'https://i.pravatar.cc/150?u=david',
          role: 'Single Dad',
          verified: false,
          followers: 940,
     },
];

/* =======================
   POSTS (PARENTING CONTENT)
======================= */
export const posts: Post[] = [
     {
          id: 'post-1',
          title: 'New Sleep Tracking Feature for Your Child',
          content:
               'We’ve introduced a new sleep tracking feature to help parents monitor bedtime routines, night awakenings, and sleep quality for their children.',
          excerpt:
               'Track your child’s sleep patterns and improve bedtime routines.',
          author: authors[0],
          type: 'announcement',
          category: 'parenting',
          tags: ['sleep', 'toddlers', 'routine', 'health'],
          likes: 342,
          comments: 58,
          shares: 24,
          views: 2140,
          publishedAt: '2023-10-15 09:30',
          readTime: 4,
          featured: true,
          pinned: true,
          image:
               'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=800&auto=format&fit=crop',
     },
     {
          id: 'post-2',
          title: 'How to Handle Toddler Tantrums Calmly',
          content:
               'Toddler tantrums are normal. This guide explains why they happen and practical steps parents can take to respond calmly and effectively.',
          excerpt:
               'A practical guide for parents dealing with toddler meltdowns.',
          author: authors[2],
          type: 'article',
          category: 'tips',
          tags: ['tantrums', 'toddlers', 'discipline', 'emotions'],
          likes: 415,
          comments: 76,
          shares: 39,
          views: 3120,
          publishedAt: '2023-10-14 14:15',
          readTime: 7,
          featured: true,
          pinned: false,
          image:
               'https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&auto=format&fit=crop',
     },
     {
          id: 'post-3',
          title: 'Parent Meetup This Saturday',
          content:
               'Join fellow parents this Saturday for a relaxed meetup to share experiences, parenting tips, and support one another.',
          excerpt:
               'Local parent meetup for connection and support.',
          author: authors[1],
          type: 'news',
          category: 'events',
          tags: ['meetup', 'parents', 'community'],
          likes: 198,
          comments: 41,
          shares: 27,
          views: 1240,
          publishedAt: '2023-10-13 11:00',
          readTime: 3,
          featured: false,
          pinned: true,
          image:
               'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop',
     },
     {
          id: 'post-4',
          title: 'Screen Time: Finding the Right Balance',
          content:
               'Screens are everywhere. Learn how parents can set healthy screen-time boundaries without constant conflict.',
          excerpt:
               'Tips for managing screen time for kids of all ages.',
          author: authors[3],
          type: 'article',
          category: 'education',
          tags: ['screen-time', 'education', 'kids'],
          likes: 276,
          comments: 34,
          shares: 19,
          views: 1890,
          publishedAt: '2023-10-12 16:45',
          readTime: 6,
          featured: false,
          pinned: false,
     },
     {
          id: 'post-5',
          title: 'Daily Parenting Tips Are Now Live',
          content:
               'We’ve added daily bite-sized parenting tips to help you navigate everyday challenges with confidence.',
          excerpt:
               'Short daily parenting tips to support your journey.',
          author: authors[0],
          type: 'announcement',
          category: 'updates',
          tags: ['tips', 'daily', 'parenting'],
          likes: 164,
          comments: 22,
          shares: 11,
          views: 980,
          publishedAt: '2023-10-11 10:20',
          readTime: 3,
          featured: false,
          pinned: false,
     },
     {
          id: 'post-6',
          title: 'How Co-Parents Can Communicate Better',
          content:
               'Effective communication between co-parents creates a healthier environment for children. This guide offers practical strategies.',
          excerpt:
               'Practical advice for better co-parenting communication.',
          author: authors[4],
          type: 'article',
          category: 'parenting',
          tags: ['co-parenting', 'communication', 'family'],
          likes: 389,
          comments: 61,
          shares: 33,
          views: 2760,
          publishedAt: '2023-10-10 13:30',
          readTime: 8,
          featured: true,
          pinned: false,
     },
];

/* =======================
   COMMENTS
======================= */

export const comments: Comment[] = [
     {
          id: 'comment-1',
          postId: 'post-2',
          author: authors[1],
          content:
               'This helped me a lot today. I stayed calm during my toddler’s meltdown.',
          likes: 18,
          replies: 2,
          postedAt: '2023-10-14 16:45',
          isAuthor: false,
     },
     {
          id: 'comment-2',
          postId: 'post-6',
          author: authors[2],
          content:
               'Great advice. Communication really does change everything.',
          likes: 26,
          replies: 4,
          postedAt: '2023-10-11 09:15',
          isAuthor: false,
     },
];

/* =======================
   NEWS
======================= */

export const news: NewsItem[] = [
     {
          id: 'news-1',
          title: 'New Child Nutrition Guidelines Released',
          summary:
               'Health experts release updated nutrition guidelines for children.',
          source: 'Parenting Today',
          url: '#',
          publishedAt: '2023-10-15',
          category: 'health',
          trending: true,
     },
     {
          id: 'news-2',
          title: 'Schools Introduce Mental Health Programs',
          summary:
               'More schools are adopting mental health programs for children.',
          source: 'Family Health Weekly',
          url: '#',
          publishedAt: '2023-10-14',
          category: 'education',
          trending: true,
     },
];

/* =======================
   TRENDING TOPICS
======================= */

export const trendingTopics: TrendingTopic[] = [
     { id: 'topic-1', tag: '#parenting', postCount: 1845, trend: 'up' },
     { id: 'topic-2', tag: '#toddlers', postCount: 1320, trend: 'up' },
     { id: 'topic-3', tag: '#sleeptraining', postCount: 980, trend: 'stable' },
     { id: 'topic-4', tag: '#coparenting', postCount: 760, trend: 'up' },
     { id: 'topic-5', tag: '#schoollife', postCount: 540, trend: 'down' },
];

/* =======================
   COMMUNITY STATS
======================= */

export const communityStats: CommunityStats = {
     totalMembers: 18450,
     activeMembers: 5120,
     totalPosts: 3860,
     postsToday: 67,
     totalComments: 21940,
};

/* =======================
   FILTER OPTIONS
======================= */

export const typeOptions = [
     { label: 'All Types', value: 'all' },
     { label: 'Articles', value: 'article' },
     { label: 'News', value: 'news' },
     { label: 'Announcements', value: 'announcement' },
     { label: 'Discussions', value: 'discussion' },
];

export const categoryOptions = [
     { label: 'All Categories', value: 'all' },
     { label: 'Parenting', value: 'parenting' },
     { label: 'Health', value: 'health' },
     { label: 'Education', value: 'education' },
     { label: 'Events', value: 'events' },
     { label: 'Tips', value: 'tips' },
];
