import React, { useState, useMemo, useCallback } from 'react';
import { Search, TrendingUp, Users, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
     posts,
     comments,
     news,
     trendingTopics,
     communityStats,
     authors,
} from '@/components/community/data';

import { PostCard } from '@/components/community/post-card';
import { CommentCard } from '@/components/community/comment-card';
import { NewsCard } from '@/components/community/news-card';
import { TrendingTopicComponent } from '@/components/community/trending-topic';
import { CreatePost } from '@/components/community/create-post';
import { CommunityStatsComponent } from '@/components/community/stats';
import { FilterBar } from '@/components/community/filter-bar';

const CommunityPage = () => {
     const [selectedTab, setSelectedTab] = useState('feed');
     const [searchQuery, setSearchQuery] = useState('');
     const [typeFilter, setTypeFilter] = useState('all');
     const [categoryFilter, setCategoryFilter] = useState('all');
     const [selectedPost, setSelectedPost] = useState<string | null>(null);

     const currentUser = authors[0];

     const filteredPosts = useMemo(() => {
          const query = searchQuery.toLowerCase();
          return posts.filter((post) => {
               const matchesSearch =
                    post.title.toLowerCase().includes(query) ||
                    post.content.toLowerCase().includes(query) ||
                    post.tags.some((tag) => tag.toLowerCase().includes(query));
               const matchesType = typeFilter === 'all' || post.type === typeFilter;
               const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
               return matchesSearch && matchesType && matchesCategory;
          });
     }, [searchQuery, typeFilter, categoryFilter]);

     const featuredPosts = useMemo(() => filteredPosts.filter((p) => p.featured), [filteredPosts]);
     const regularPosts = useMemo(() => filteredPosts.filter((p) => !p.featured), [filteredPosts]);

     const postComments = useMemo(() => {
          if (!selectedPost) return comments.slice(0, 3);
          return comments.filter((c) => c.postId === selectedPost);
     }, [selectedPost]);

     const popularTags = useMemo(
          () => Array.from(new Set(posts.flatMap((p) => p.tags))).slice(0, 15),
          [],
     );

     const handleLikePost = useCallback((postId: string) => {
          console.log('Liked post:', postId);
     }, []);

     const handleCommentPost = useCallback((postId: string) => {
          setSelectedPost(postId);
     }, []);

     const handleSharePost = useCallback((postId: string) => {
          console.log('Shared post:', postId);
     }, []);

     const handleCreatePost = useCallback((content: string, type: string) => {
          console.log('Created post:', { content, type });
     }, []);

     return (
          <div className="h-[calc(100vh-100px)] overflow-auto p-10">
               <div className="mb-8 flex items-center justify-between">
                    <div>
                         <h2 className="text-2xl font-semibold">Community</h2>
                         <p className="text-muted-foreground">Connect, share, and learn with the community</p>
                    </div>
                    <div className="flex gap-4">
                         <Button variant="ghost">
                              <Users size={16} className="mr-2" />
                              Join Community
                         </Button>
                         <Button>Create Post</Button>
                    </div>
               </div>

               <Card className="mb-8 p-6">
                    <div className="flex flex-wrap gap-6">
                         <div className="relative min-w-[200px] flex-1">
                              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                   placeholder="Search..."
                                   value={searchQuery}
                                   onChange={(e) => setSearchQuery(e.target.value)}
                                   className="pl-9"
                              />
                         </div>
                         <FilterBar
                              searchQuery={searchQuery}
                              setSearchQuery={setSearchQuery}
                              typeFilter={typeFilter}
                              setTypeFilter={setTypeFilter}
                              categoryFilter={categoryFilter}
                              setCategoryFilter={setCategoryFilter}
                         />
                    </div>
               </Card>

               <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList>
                         <TabsTrigger value="feed">Feed</TabsTrigger>
                         <TabsTrigger value="news">News</TabsTrigger>
                         <TabsTrigger value="discussions">Discussions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="feed" className="mt-4">
                         <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                              <div className="flex flex-col gap-6 lg:col-span-8">
                                   <CreatePost authorAvatar={currentUser.avatar} onSubmit={handleCreatePost} />
                                   {featuredPosts.map((post) => (
                                        <PostCard
                                             key={post.id}
                                             post={post}
                                             onLike={handleLikePost}
                                             onComment={handleCommentPost}
                                             onShare={handleSharePost}
                                        />
                                   ))}
                                   {regularPosts.map((post) => (
                                        <PostCard
                                             key={post.id}
                                             post={post}
                                             onLike={handleLikePost}
                                             onComment={handleCommentPost}
                                             onShare={handleSharePost}
                                        />
                                   ))}
                              </div>

                              <div className="flex flex-col gap-6 lg:col-span-4">
                                   <Card className="p-6">
                                        <div className="mb-6 flex items-center justify-between">
                                             <div className="flex items-center gap-2">
                                                  <TrendingUp size={20} color="#ef4444" />
                                                  <h4 className="text-lg font-semibold">Trending Topics</h4>
                                             </div>
                                             <Badge variant="default">Today</Badge>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                             {trendingTopics.map((topic, index) => (
                                                  <TrendingTopicComponent key={topic.id} topic={topic} rank={index + 1} />
                                             ))}
                                        </div>
                                   </Card>

                                   <Card className="p-6">
                                        <h4 className="mb-6 text-lg font-semibold">Recent Comments</h4>
                                        <div className="flex flex-col gap-4">
                                             {postComments.map((comment) => (
                                                  <CommentCard key={comment.id} comment={comment} />
                                             ))}
                                        </div>
                                   </Card>
                              </div>
                         </div>
                    </TabsContent>

                    <TabsContent value="news" className="mt-4">
                         <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                              <div className="flex flex-col gap-6 lg:col-span-8">
                                   {news.map((item) => (
                                        <NewsCard key={item.id} news={item} />
                                   ))}
                              </div>

                              <div className="flex flex-col gap-6 lg:col-span-4">
                                   <CommunityStatsComponent stats={communityStats} />
                                   <Card className="p-6">
                                        <h4 className="mb-6 text-lg font-semibold">Popular Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                             {popularTags.map((tag) => (
                                                  <Badge key={tag} variant="secondary">{tag}</Badge>
                                             ))}
                                        </div>
                                   </Card>
                              </div>
                         </div>
                    </TabsContent>

                    <TabsContent value="discussions" className="mt-4">
                         <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                              <div className="flex flex-col gap-6 lg:col-span-8">
                                   {posts
                                        .filter((p) => p.type === 'discussion')
                                        .map((post) => (
                                             <PostCard
                                                  key={post.id}
                                                  post={post}
                                                  compact
                                                  onLike={handleLikePost}
                                                  onComment={handleCommentPost}
                                                  onShare={handleSharePost}
                                             />
                                        ))}
                              </div>

                              <div className="lg:col-span-4">
                                   <Card className="p-6">
                                        <div className="mb-6 flex items-center gap-3">
                                             <Sparkles size={20} color="#3f3bef" />
                                             <h4 className="text-lg font-semibold">Community Guidelines</h4>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                             <p className="text-sm">• Be respectful and inclusive</p>
                                             <p className="text-sm">• Stay on topic</p>
                                             <p className="text-sm">• No spam</p>
                                             <p className="text-sm">• Help others</p>
                                             <p className="text-sm">• Report abuse</p>
                                        </div>
                                        <Button className="mt-6 w-full">Read Full Guidelines</Button>
                                   </Card>
                              </div>
                         </div>
                    </TabsContent>
               </Tabs>
          </div>
     );
};

export default CommunityPage;