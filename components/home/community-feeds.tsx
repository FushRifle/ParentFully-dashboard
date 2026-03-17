import React from 'react';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import { Text, Link, Button, Card, Divider, Avatar } from '@nextui-org/react';

export const CommunityNewsFeed = () => (
     <Card variant="flat" css={{ bg: '$background', border: '1px solid $border', p: '$4' }}>
          <Card.Header css={{ pb: 0 } as any}>
               <Text b size="$md">Family Milestones & News</Text>
          </Card.Header>
          <Card.Body css={{ pt: '$4' } as any}>
               <Flex direction="column" css={{ gap: '$6' }}>
                    {/* News Item 1 */}
                    <Flex align="start" css={{ gap: '$4' }}>
                         <Avatar src="https://i.pravatar.cc/150?u=family1" size="md" />
                         <Box>
                              <Text b size="$sm">The Smiths</Text>
                              <Text size="$xs" css={{ color: '$accents7' }}>
                                   Just completed their "Potty Training Masterclass"!
                              </Text>
                              <Text size="$xs" css={{ color: '$accents6', mt: '$1' }}>2 hours ago</Text>
                         </Box>
                    </Flex>
                    <Divider />
                    {/* News Item 2 */}
                    <Flex align="start" css={{ gap: '$4' }}>
                         <Avatar src="https://i.pravatar.cc/150?u=family2" size="md" />
                         <Box>
                              <Text b size="$sm">The Johnsons</Text>
                              <Text size="$xs" css={{ color: '$accents7' }}>
                                   Shared their first "Family Meal Planning" template.
                              </Text>
                              <Text size="$xs" css={{ color: '$accents6', mt: '$1' }}>Yesterday</Text>
                         </Box>
                    </Flex>
                    <Divider />
                    {/* News Item 3 */}
                    <Flex align="start" css={{ gap: '$4' }}>
                         <Avatar src="https://i.pravatar.cc/150?u=family3" size="md" />
                         <Box>
                              <Text b size="$sm">User @ParentPro</Text>
                              <Text size="$xs" css={{ color: '$accents7' }}>
                                   Reached Level 5 in "Productive Parenthood" challenge!
                              </Text>
                              <Text size="$xs" css={{ color: '$accents6', mt: '$1' }}>2 days ago</Text>
                         </Box>
                    </Flex>
               </Flex>
          </Card.Body>
          <Card.Footer>
               <Link href="/community">
                    <Button flat size="sm" css={{ borderRadius: '$pill' }}>View All Feed</Button>
               </Link>
          </Card.Footer>
     </Card>
);
