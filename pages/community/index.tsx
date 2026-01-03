import React, { useState, useMemo, useCallback } from 'react';
import { Grid, Text, Button, Input, Card, Badge } from '@nextui-org/react';
import {
     Search,
     Filter,
     TrendingUp,
     Users,
     Sparkles,
} from 'lucide-react';

import { Select } from '../../components/styles/select';
import { Box } from '../../components/styles/box';
import { Flex } from '../../components/styles/flex';
import { Tabs } from '../../components/styles/tabs';

import {
     posts,
     comments,
     news,
     trendingTopics,
     communityStats,
     authors,

     typeOptions,
     categoryOptions
} from '../../components/community/data';

import { PostCard } from '../../components/community/post-card';
import { CommentCard } from '../../components/community/comment-card';
import { NewsCard } from '../../components/community/news-card';
import { TrendingTopicComponent } from '../../components/community/trending-topic';
import { CreatePost } from '../../components/community/create-post';
import { CommunityStatsComponent } from '../../components/community/stats';
import { FilterBar } from '../../components/community/filter-bar';

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

               const matchesType =
                    typeFilter === 'all' || post.type === typeFilter;

               const matchesCategory =
                    categoryFilter === 'all' || post.category === categoryFilter;

               return matchesSearch && matchesType && matchesCategory;
          });
     }, [searchQuery, typeFilter, categoryFilter]);

     const featuredPosts = useMemo(
          () => filteredPosts.filter((p) => p.featured),
          [filteredPosts]
     );

     const regularPosts = useMemo(
          () => filteredPosts.filter((p) => !p.featured),
          [filteredPosts]
     );

     const postComments = useMemo(() => {
          if (!selectedPost) return comments.slice(0, 3);
          return comments.filter((c) => c.postId === selectedPost);
     }, [selectedPost]);

     const popularTags = useMemo(() => {
          return Array.from(new Set(posts.flatMap((p) => p.tags))).slice(0, 15);
     }, []);

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

     /* ------------------ Tabs ------------------ */
     const tabItems = useMemo(
          () => [
               {
                    key: 'feed',
                    title: 'Feed',
                    content: (
                         <Grid.Container gap={2}>
                              <Grid xs={12} lg={8}>
                                   <Flex direction="column" css={{ gap: '$6' }}>
                                        <CreatePost
                                             authorAvatar={currentUser.avatar}
                                             onSubmit={handleCreatePost}
                                        />

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
                                   </Flex>
                              </Grid>

                              <Grid xs={12} lg={4}>
                                   <Flex direction="column" css={{ gap: '$6' }}>
                                        <Card css={{ p: '$6' }} variant="flat">
                                             <Flex justify="between" align="center" css={{ mb: '$6' }}>
                                                  <Flex align="center" css={{ gap: '$2' }}>
                                                       <TrendingUp size={20} color="#ef4444" />
                                                       <Text h4>Trending Topics</Text>
                                                  </Flex>
                                                  <Badge size="sm" variant="flat" color="primary">
                                                       Today
                                                  </Badge>
                                             </Flex>

                                             <Flex direction="column" css={{ gap: '$2' }}>
                                                  {trendingTopics.map((topic, index) => (
                                                       <TrendingTopicComponent
                                                            key={topic.id}
                                                            topic={topic}
                                                            rank={index + 1}
                                                       />
                                                  ))}
                                             </Flex>
                                        </Card>

                                        <Card css={{ p: '$6' }} variant="flat">
                                             <Text h4 css={{ mb: '$6' }}>
                                                  Recent Comments
                                             </Text>
                                             <Flex direction="column" css={{ gap: '$4' }}>
                                                  {postComments.map((comment) => (
                                                       <CommentCard
                                                            key={comment.id}
                                                            comment={comment}
                                                       />
                                                  ))}
                                             </Flex>
                                        </Card>
                                   </Flex>
                              </Grid>
                         </Grid.Container>
                    ),
               },
               {
                    key: 'news',
                    title: 'News',
                    content: (
                         <Grid.Container gap={2}>
                              <Grid xs={12} lg={8}>
                                   <Flex direction="column" css={{ gap: '$6' }}>
                                        {news.map((item) => (
                                             <NewsCard key={item.id} news={item} />
                                        ))}
                                   </Flex>
                              </Grid>

                              <Grid xs={12} lg={4}>
                                   <Flex direction="column" css={{ gap: '$6' }}>
                                        <CommunityStatsComponent stats={communityStats} />

                                        <Card css={{ p: '$6' }} variant="flat">
                                             <Text h4 css={{ mb: '$6' }}>
                                                  Popular Tags
                                             </Text>
                                             <Flex wrap="wrap" css={{ gap: '$2' }}>
                                                  {popularTags.map((tag) => (
                                                       <Badge
                                                            key={tag}
                                                            size="sm"
                                                            variant="flat"
                                                            color="default"
                                                       >
                                                            {tag}
                                                       </Badge>
                                                  ))}
                                             </Flex>
                                        </Card>
                                   </Flex>
                              </Grid>
                         </Grid.Container>
                    ),
               },
               {
                    key: 'discussions',
                    title: 'Discussions',
                    content: (
                         <Grid.Container gap={2}>
                              <Grid xs={12} lg={8}>
                                   <Flex direction="column" css={{ gap: '$6' }}>
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
                                   </Flex>
                              </Grid>

                              <Grid xs={12} lg={4}>
                                   <Card css={{ p: '$6' }} variant="flat">
                                        <Flex align="center" css={{ gap: '$3', mb: '$6' }}>
                                             <Sparkles size={20} color="#3f3bef" />
                                             <Text h4>Community Guidelines</Text>
                                        </Flex>

                                        <Flex direction="column" css={{ gap: '$4' }}>
                                             <Text size="$sm">• Be respectful and inclusive</Text>
                                             <Text size="$sm">• Stay on topic</Text>
                                             <Text size="$sm">• No spam</Text>
                                             <Text size="$sm">• Help others</Text>
                                             <Text size="$sm">• Report abuse</Text>
                                        </Flex>

                                        <Button
                                             auto
                                             css={{ mt: '$6', width: '100%', bg: '#3f3bef' }}
                                        >
                                             Read Full Guidelines
                                        </Button>
                                   </Card>
                              </Grid>
                         </Grid.Container>
                    ),
               },
          ],
          [
               currentUser.avatar,
               featuredPosts,
               regularPosts,
               postComments,
               popularTags,
               handleCreatePost,
               handleLikePost,
               handleCommentPost,
               handleSharePost,
          ]
     );

     /* ------------------ Render ------------------ */

     return (
          <Box css={{ p: '$10', height: 'calc(100vh - 100px)', overflow: 'auto' }}>
               <Flex justify="between" align="center" css={{ mb: '$8' }}>
                    <Box>
                         <Text h2>Community</Text>
                         <Text color="$accents7">
                              Connect, share, and learn with the community
                         </Text>
                    </Box>

                    <Flex css={{ gap: '$4' }}>
                         <Button auto light icon={<Users size={16} />}>
                              Join Community
                         </Button>
                         <Button auto css={{ bg: '#3f3bef' }}>
                              Create Post
                         </Button>
                    </Flex>
               </Flex>

               <Card css={{ p: '$6', mb: '$8' }} variant="flat">
                    <Flex css={{ gap: '$6', flexWrap: 'wrap' }}>
                         {/* Search Input */}
                         <Input
                              placeholder="Search..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              contentLeft={<Search size={16} />}
                              css={{ flex: 1, minWidth: 200 }}
                         />

                         <FilterBar
                              searchQuery={searchQuery}
                              setSearchQuery={setSearchQuery}
                              typeFilter={typeFilter}
                              setTypeFilter={setTypeFilter}
                              categoryFilter={categoryFilter}
                              setCategoryFilter={setCategoryFilter}
                         />
                    </Flex>
               </Card>

               <Tabs
                    items={tabItems}
                    activeKey={selectedTab}
                    onChange={setSelectedTab}
                    variant="underlined"
               />
          </Box>
     );
};

export default CommunityPage;
