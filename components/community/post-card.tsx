import React, { useState } from 'react';
import { Card, Text, Button, Avatar, Badge } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { Post } from './data';
import {
     Heart, MessageCircle, Share2,
     Bookmark, MoreVertical, Eye, Clock
} from 'lucide-react';

interface PostCardProps {
     post: Post;
     compact?: boolean;
     onLike?: (postId: string) => void;
     onComment?: (postId: string) => void;
     onShare?: (postId: string) => void;
     onBookmark?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
     post,
     compact = false,
     onLike,
     onComment,
     onShare,
     onBookmark
}) => {
     const [isLiked, setIsLiked] = useState(false);
     const [isBookmarked, setIsBookmarked] = useState(false);

     const getTypeColor = (type: Post['type']) => {
          switch (type) {
               case 'announcement': return 'primary';
               case 'article': return 'success';
               case 'news': return 'warning';
               case 'discussion': return 'secondary';
               default: return 'default';
          }
     };

     const handleLike = () => {
          setIsLiked(!isLiked);
          onLike?.(post.id);
     };

     const handleBookmark = () => {
          setIsBookmarked(!isBookmarked);
          onBookmark?.(post.id);
     };

     return (
          <Card
               css={{
                    p: compact ? '$4' : '$6',
                    ...(post.pinned && { borderLeft: '4px solid $warning' })
               }}
               variant="flat"
          >
               <Card.Body>
                    <Flex direction="column" css={{ gap: compact ? '$4' : '$6' }}>
                         {/* Header */}
                         <Flex justify="between" align="start">
                              <Flex css={{ gap: '$4' }}>
                                   <Avatar
                                        src={post.author.avatar}
                                        size={compact ? 'md' : 'lg'}
                                        bordered
                                        color={post.author.verified ? 'primary' : 'default'}
                                   />
                                   <Box>
                                        <Flex align="center" css={{ gap: '$2', mb: '$1' }}>
                                             <Text b size={compact ? '$sm' : '$md'}>
                                                  {post.author.name}
                                             </Text>
                                             {post.author.verified && (
                                                  <Badge size="xs" variant="flat" color="primary">
                                                       Verified
                                                  </Badge>
                                             )}
                                        </Flex>
                                        <Flex align="center" css={{ gap: '$2' }}>
                                             <Text size="$xs" color="$accents7">
                                                  {post.author.role}
                                             </Text>
                                             <Text size="$xs" color="$accents7">•</Text>
                                             <Text size="$xs" color="$accents7">
                                                  {post.publishedAt}
                                             </Text>
                                        </Flex>
                                   </Box>
                              </Flex>

                              <Flex css={{ gap: '$2' }}>
                                   {post.pinned && (
                                        <Badge size="sm" variant="flat" color="warning">
                                             Pinned
                                        </Badge>
                                   )}
                                   {post.featured && !post.pinned && (
                                        <Badge size="sm" variant="flat" color="primary">
                                             Featured
                                        </Badge>
                                   )}
                                   <Button auto light css={{ minWidth: 'auto', px: '$2' }}>
                                        <MoreVertical size={20} />
                                   </Button>
                              </Flex>
                         </Flex>

                         {/* Content */}
                         <Box>
                              <Flex css={{ mb: '$2' }}>
                                   <Badge
                                        size="sm"
                                        variant="flat"
                                        color={getTypeColor(post.type)}
                                   >
                                        {post.type}
                                   </Badge>
                              </Flex>

                              <Text
                                   h3={!compact}
                                   h4={compact}
                                   css={{
                                        mb: compact ? '$2' : '$3',
                                        lineHeight: 1.3
                                   }}
                              >
                                   {post.title}
                              </Text>

                              {post.image && !compact && (
                                   <Box
                                        css={{
                                             width: '100%',
                                             height: '200px',
                                             borderRadius: '$lg',
                                             backgroundImage: `url(${post.image})`,
                                             backgroundSize: 'cover',
                                             backgroundPosition: 'center',
                                             mb: '$4'
                                        }}
                                   />
                              )}

                              <Text
                                   size={compact ? '$sm' : '$md'}
                                   color="$accents7"
                                   css={{ lineHeight: 1.6 }}
                              >
                                   {compact ? post.excerpt : post.content}
                              </Text>
                         </Box>

                         {/* Tags */}
                         {post.tags.length > 0 && (
                              <Flex wrap="wrap" css={{ gap: '$2' }}>
                                   {post.tags.map((tag, index) => (
                                        <Badge key={index} size="xs" variant="flat" color="default">
                                             {tag}
                                        </Badge>
                                   ))}
                              </Flex>
                         )}

                         {/* Stats */}
                         <Flex justify="between" align="center">
                              <Flex align="center" css={{ gap: '$4' }}>
                                   <Flex align="center" css={{ gap: '$2' }}>
                                        <Clock size={14} color="$accents7" />
                                        <Text size="$xs" color="$accents7">
                                             {post.readTime} min read
                                        </Text>
                                   </Flex>

                                   <Flex align="center" css={{ gap: '$2' }}>
                                        <Eye size={14} color="$accents7" />
                                        <Text size="$xs" color="$accents7">
                                             {post.views.toLocaleString()} views
                                        </Text>
                                   </Flex>
                              </Flex>

                              <Badge size="sm" variant="flat" color="default">
                                   {post.category}
                              </Badge>
                         </Flex>

                         {/* Actions */}
                         <Flex justify="between" align="center" css={{ pt: '$4', borderTop: '1px solid $border' }}>
                              <Flex css={{ gap: compact ? '$2' : '$4' }}>
                                   <Button
                                        auto
                                        light
                                        size={compact ? 'sm' : 'md'}
                                        color={isLiked ? 'error' : 'default'}
                                        icon={<Heart size={compact ? 16 : 20} fill={isLiked ? '#ef4444' : 'none'} />}
                                        onPress={handleLike}
                                   >
                                        {post.likes + (isLiked ? 1 : 0)}
                                   </Button>

                                   <Button
                                        auto
                                        light
                                        size={compact ? 'sm' : 'md'}
                                        icon={<MessageCircle size={compact ? 16 : 20} />}
                                        onPress={() => onComment?.(post.id)}
                                   >
                                        {post.comments}
                                   </Button>

                                   <Button
                                        auto
                                        light
                                        size={compact ? 'sm' : 'md'}
                                        icon={<Share2 size={compact ? 16 : 20} />}
                                        onPress={() => onShare?.(post.id)}
                                   >
                                        {post.shares}
                                   </Button>
                              </Flex>

                              <Button
                                   auto
                                   light
                                   size={compact ? 'sm' : 'md'}
                                   color={isBookmarked ? 'warning' : 'default'}
                                   icon={<Bookmark size={compact ? 16 : 20} fill={isBookmarked ? '#f59e0b' : 'none'} />}
                                   onPress={handleBookmark}
                              />
                         </Flex>
                    </Flex>
               </Card.Body>
          </Card>
     );
};