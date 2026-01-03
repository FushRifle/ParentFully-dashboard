import React, { useState } from 'react';
import { Card, Text, Button, Input, Avatar } from '@nextui-org/react';
import { Select } from '../styles/select';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { Image, Link, Smile, Send } from 'lucide-react';

interface CreatePostProps {
     authorAvatar: string;
     onSubmit?: (content: string, type: string) => void;
     placeholder?: string;
}

export const CreatePost: React.FC<CreatePostProps> = ({
     authorAvatar,
     onSubmit,
     placeholder = "What's on your mind?"
}) => {
     const [content, setContent] = useState('');
     const [postType, setPostType] = useState('discussion');

     const postTypes = [
          { value: 'discussion', label: 'Discussion' },
          { value: 'question', label: 'Question' },
          { value: 'announcement', label: 'Announcement' },
          { value: 'article', label: 'Article' }
     ];

     const handleSubmit = () => {
          if (content.trim()) {
               onSubmit?.(content, postType);
               setContent('');
          }
     };

     return (
          <Card css={{ p: '$6' }} variant="flat">
               <Card.Body>
                    <Flex direction="column" css={{ gap: '$6' }}>
                         {/* Header */}
                         <Flex align="center" css={{ gap: '$3' }}>
                              <Avatar src={authorAvatar} size="lg" bordered />
                              <Box>
                                   <Text b>Create Post</Text>
                                   <Text size="$xs" color="$accents7">
                                        Share your thoughts with the community
                                   </Text>
                              </Box>
                         </Flex>

                         {/* Content Input */}
                         <Input
                              placeholder={placeholder}
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              css={{
                                   '& .nextui-input-wrapper': {
                                        borderRadius: '$lg',
                                        minHeight: '100px',
                                        alignItems: 'flex-start',
                                        py: '$4'
                                   },
                                   '& .nextui-input': {
                                        minHeight: '80px'
                                   }
                              }}
                              contentRightStyling={false}
                         />

                         {/* Post Options */}
                         <Flex justify="between" align="center">
                              <Flex css={{ gap: '$3' }}>
                                   <Button
                                        auto
                                        light
                                        size="sm"
                                        icon={<Image size={16} />}
                                   >
                                        Media
                                   </Button>

                                   <Button
                                        auto
                                        light
                                        size="sm"
                                        icon={<Link size={16} />}
                                   >
                                        Link
                                   </Button>

                                   <Button
                                        auto
                                        light
                                        size="sm"
                                        icon={<Smile size={16} />}
                                   >
                                        Emoji
                                   </Button>
                              </Flex>
                         </Flex>

                         {/* Submit Button */}
                         <Button
                              auto
                              css={{ bg: '#3f3bef' }}
                              icon={<Send size={16} />}
                              onPress={handleSubmit}
                              disabled={!content.trim()}
                         >
                              Post to Community
                         </Button>
                    </Flex>
               </Card.Body>
          </Card>
     );
};