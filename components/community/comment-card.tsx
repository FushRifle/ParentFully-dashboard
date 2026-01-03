import React, { useState } from 'react';
import { Card, Text, Button, Avatar, Input, Badge } from '@nextui-org/react';
import { Heart, Reply, MoreVertical, Send } from 'lucide-react';

import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { Comment } from './data';

interface CommentCardProps {
     comment: Comment;
     onLike?: (commentId: string) => void;
     onReply?: (commentId: string, content: string) => void;
     showReplyInput?: boolean;
}

export const CommentCard: React.FC<CommentCardProps> = ({
     comment,
     onLike,
     onReply,
     showReplyInput = false
}) => {
     const [isLiked, setIsLiked] = useState(false);
     const [replyContent, setReplyContent] = useState('');
     const [showReply, setShowReply] = useState(false);

     const handleLike = () => {
          setIsLiked(!isLiked);
          onLike?.(comment.id);
     };

     const handleReply = () => {
          if (replyContent.trim()) {
               onReply?.(comment.id, replyContent);
               setReplyContent('');
               setShowReply(false);
          }
     };

     return (
          <Card css={{ p: '$4' }} variant="flat">
               <Card.Body>
                    <Flex direction="column" css={{ gap: '$4' }}>
                         {/* Comment Header */}
                         <Flex justify="between" align="start">
                              <Flex css={{ gap: '$3' }}>
                                   <Avatar
                                        src={comment.author.avatar}
                                        size="md"
                                        bordered
                                        color={comment.isAuthor ? 'primary' : 'default'}
                                   />
                                   <Box>
                                        <Flex align="center" css={{ gap: '$2', mb: '$1' }}>
                                             <Text b size="$sm">
                                                  {comment.author.name}
                                             </Text>
                                             {comment.isAuthor && (
                                                  <Badge size="xs" variant="flat" color="primary">
                                                       Author
                                                  </Badge>
                                             )}
                                        </Flex>
                                        <Text size="$xs" color="$accents7">
                                             {comment.postedAt}
                                        </Text>
                                   </Box>
                              </Flex>

                              <Button auto light css={{ minWidth: 'auto', px: '$2' }}>
                                   <MoreVertical size={16} />
                              </Button>
                         </Flex>

                         {/* Comment Content */}
                         <Text size="$sm" css={{ lineHeight: 1.6 }}>
                              {comment.content}
                         </Text>

                         {/* Comment Actions */}
                         <Flex justify="between" align="center">
                              <Flex css={{ gap: '$3' }}>
                                   <Button
                                        auto
                                        light
                                        size="sm"
                                        color={isLiked ? 'error' : 'default'}
                                        icon={<Heart size={14} fill={isLiked ? '#ef4444' : 'none'} />}
                                        onPress={handleLike}
                                   >
                                        {comment.likes + (isLiked ? 1 : 0)}
                                   </Button>

                                   <Button
                                        auto
                                        light
                                        size="sm"
                                        icon={<Reply size={14} />}
                                        onPress={() => setShowReply(!showReply)}
                                   >
                                        Reply
                                   </Button>
                              </Flex>

                              {comment.replies > 0 && (
                                   <Text size="$xs" color="$accents7">
                                        {comment.replies} replies
                                   </Text>
                              )}
                         </Flex>

                         {/* Reply Input */}
                         {(showReply || showReplyInput) && (
                              <Flex css={{ gap: '$3', mt: '$2' }}>
                                   <Input
                                        fullWidth
                                        placeholder="Write a reply..."
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        css={{
                                             '& .nextui-input-wrapper': {
                                                  borderRadius: '$pill'
                                             }
                                        }}
                                   />
                                   <Button
                                        auto
                                        color="primary"
                                        icon={<Send size={16} />}
                                        onPress={handleReply}
                                   />
                              </Flex>
                         )}
                    </Flex>
               </Card.Body>
          </Card>
     );
};