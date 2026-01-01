import React from 'react';
import { Text, Link, Button, Grid, Badge, Card, Divider, Avatar } from '@nextui-org/react';
import { Box } from '../styles/box';
import dynamic from 'next/dynamic';
import { Flex } from '../styles/flex';
import { TableWrapper } from '../table/table';
import NextLink from 'next/link';

// Branding-specific Card imports (assuming these exist or you'll restyle them)
import { CardUsersOverview } from './card-balance1'; // Renamed to "Active Families"
import { CardNewUsers } from './card-balance2';      // Renamed to "New Signups"
import { CardPremium } from './card-balance3';       // Renamed to "Premium Subscriptions"

const Chart = dynamic(
   () => import('../charts/steam').then((mod) => mod.Steam),
   { ssr: false }
);

// --- NEW COMPONENT: CommunityNewsFeed ---
const CommunityNewsFeed = () => (
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
                     Just completed their "Potty Training Masterclass"! 🎉
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
                     Shared their first "Family Meal Planning" template. 🥕
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
                     Reached Level 5 in "Productive Parenthood" challenge! 🚀
                  </Text>
                  <Text size="$xs" css={{ color: '$accents6', mt: '$1' }}>2 days ago</Text>
               </Box>
            </Flex>
         </Flex>
      </Card.Body>
      <Card.Footer>
         <Button flat size="sm" css={{ borderRadius: '$pill' }}>View All Feed</Button>
      </Card.Footer>
   </Card>
);

export const Content = () => (
   <Box css={{
      overflow: 'hidden',
      height: '100%',
      px: '$8',
      pb: '$20',
      '@sm': { px: '$12' },
      maxW: '1600px',
      margin: '0 auto',
      bg: '$accents0'
   }}>

      {/* --- 1. Header: Brand Focus with Illustration --- */}
      <Flex justify="between" align="end" css={{
         mt: '$12', mb: '$10',
         flexWrap: 'wrap', gap: '$6', position: 'relative'
      }}>
         <Box css={{ zIndex: 1 }}>
            <Flex align="center" css={{ gap: '$3', mb: '$2' }}>
               <Badge color="secondary" variant="flat" css={{ border: 'none', px: '$4' }}>ParentFully Admin</Badge>
               <Text span css={{ color: '$accents6', size: '$xs' }}>v1.0.0</Text>
            </Flex>
            <Text h2 css={{ m: 0, fontWeight: '$bold', letterSpacing: '-0.03em' }}>
               ParentFully Insights Dashboard
            </Text>
            <Text span css={{ color: '$accents7' }}>
               Monitoring family growth, guide engagement, and productivity metrics.
            </Text>
         </Box>

         <Flex css={{ gap: '$4', zIndex: 1 }}>
            <Button auto flat color="secondary" css={{ borderRadius: '$pill' }}>Export Report</Button>
            <Button auto shadow color="primary" css={{ borderRadius: '$pill' }}>+ New Guide</Button>
         </Flex>

         {/* Header Illustration */}
         <Box
            css={{
               position: 'absolute',
               right: '-20px',
               top: '-20px',
               width: '320px',
               height: '220px',
               zIndex: 0,
               opacity: 0.8,
               display: 'none',
               '@md': { display: 'block' }
            }}
         >
            <img
               src="https://thumbs.dreamstime.com/b/happy-african-american-family-disabled-girl-sitting-wheelchair-holding-basketball-ball-concept-parents-involvement-98439832.jpg"
               alt="Parenting and Family Growth Illustration"
               style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '12px',
                  objectFit: 'contain'
               }}
            />
         </Box>
      </Flex>

      <Flex
         css={{
            'gap': '$12',
            'flexDirection': 'column',
            '@lg': { flexDirection: 'row' },
         }}
      >
         {/* --- 2. Left Column: Data & Activity (72%) --- */}
         <Box css={{ flex: '1 1 72%', minWidth: 0 }}>

            {/* Parenting KPI Row */}
            <Grid.Container gap={2} css={{ p: 0, mb: '$10' }}>
               <Grid xs={12} sm={4}>
                  <CardUsersOverview />
               </Grid>
               <Grid xs={12} sm={4}>
                  <CardNewUsers />
               </Grid>
               <Grid xs={12} sm={4}>
                  <CardPremium />
               </Grid>
            </Grid.Container>

            {/* Engagement Chart */}
            <Card variant="flat" css={{
               p: '$6',
               borderRadius: '$2xl',
               bg: '$background',
               border: '1px solid $border',
            }}>
               <Card.Header css={{ p: '$4', mb: '$4' } as any}>
                  <Flex justify="between" align="center" css={{ width: '100%' }}>
                     <Box>
                        <Text b size="$lg">User Engagement Trends</Text>
                        <Text size="$xs" css={{ color: '$accents6', display: 'block' }}>Guide completions vs. Productivity tool usage</Text>
                     </Box>
                     <Flex css={{ gap: '$2' }}>
                        <Badge color="primary" variant="dot">Guides</Badge>
                        <Badge color="success" variant="dot">Tools</Badge>
                     </Flex>
                  </Flex>
               </Card.Header>
               <Card.Body css={{ p: 0, overflow: 'hidden' } as any}>
                  <Box css={{ height: '380px', width: '100%', px: '$2' }}>
                     <Chart />
                  </Box>
               </Card.Body>
            </Card>

            {/* Latest User Registrations */}
            <Box css={{ mt: '$15' }}>
               <Flex justify="between" align="center" css={{ mb: '$8' }}>
                  <Box>
                     <Text h3 css={{ m: 0 }}>New Parents Signups</Text>
                     <Text size="$sm" css={{ color: '$accents7' }}>Real-time feed of new members</Text>
                  </Box>
                  <NextLink href="/accounts">
                     <Text color="primary" b css={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                        View All Parents →
                     </Text>
                  </NextLink>
               </Flex>
               <Card variant="bordered" css={{ borderRadius: '$2xl', border: '1px solid $border', bg: '$background' }}>
                  <Card.Body css={{ p: 0 } as any}>
                     <TableWrapper />
                  </Card.Body>
               </Card>
            </Box>
         </Box>

         {/* --- 3. Right Column: Content & Support (28%) --- */}
         <Box
            css={{
               'flex': '1 1 28%',
               'display': 'flex',
               'flexDirection': 'column',
               'gap': '$10',
            }}
         >
            {/* New: Community News Feed */}
            <CommunityNewsFeed />

            {/* Parenting Experts / Support Team */}
            <Card variant="flat" css={{ bg: '$background', border: '1px solid $border', p: '$4' }}>
               <Card.Header css={{ pb: 0 } as any}>
                  <Text b size="$md">On-Call Parenting Experts</Text>
               </Card.Header>
               <Card.Body>
                  <Flex direction="column" css={{ gap: '$6' }}>
                     <Flex align="center" justify="between">
                        <Flex align="center" css={{ gap: '$4' }}>
                           <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" color="secondary" bordered />
                           <Box>
                              <Text b size="$sm">Dr. Sarah Jenkins</Text>
                              <Text size="$xs" css={{ color: '$accents6' }}>Child Psychologist</Text>
                           </Box>
                        </Flex>
                        <Badge color="success" variant="flat">Online</Badge>
                     </Flex>
                     <Divider />
                     <Flex align="center" justify="between">
                        <Flex align="center" css={{ gap: '$4' }}>
                           <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" color="primary" bordered />
                           <Box>
                              <Text b size="$sm">Marcus Chen</Text>
                              <Text size="$xs" css={{ color: '$accents6' }}>Sleep Consultant</Text>
                           </Box>
                        </Flex>
                        <Badge color="warning" variant="flat">Busy</Badge>
                     </Flex>
                  </Flex>
               </Card.Body>
               <Card.Footer>
                  <Button flat size="sm" css={{ borderRadius: '$pill' }}>Manage Experts</Button>
               </Card.Footer>
            </Card>

            {/* Support & Help Card */}
            <Card
               css={{
                  bg: '#3f3bef',
                  borderRadius: '$2xl',
                  p: '$4',
                  border: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 20px -5px rgba(63, 59, 239, 0.3)',
                  width: '100%',
               }}
            >
               <Card.Body css={{ py: '$10', zIndex: 1 } as any}>
                  <Flex direction="column" align="start" css={{ textAlign: 'left', px: '$4' }}>
                     <Badge
                        disableOutline
                        css={{
                           bg: 'rgba(255,255,255,0.2)',
                           color: 'white',
                           mb: '$4',
                           border: 'none',
                        }}
                     >
                        Support & Issues
                     </Badge>

                     <Text h4 color="white" css={{ mb: '$2', lineHeight: '$xs' }}>
                        Review pending <br />user issues
                     </Text>

                     <Text
                        size="$xs"
                        color="white"
                        css={{ opacity: 0.85, mb: '$8', maxW: '180px' }}
                     >
                        Monitor, investigate, and resolve support requests and reports submitted by users.
                     </Text>

                     <Button
                        size="sm"
                        auto
                        css={{
                           bg: 'white',
                           color: '#3f3bef',
                           fontWeight: '$bold',
                           borderRadius: '$pill',
                           px: '$10',
                           zIndex: 2,
                           '&:hover': {
                              opacity: 0.9,
                              transform: 'translateY(-2px)',
                           },
                        }}
                     >
                        View Tickets
                     </Button>
                  </Flex>
               </Card.Body>

               {/* --- Responsive Support Illustration --- */}
               <Box
                  css={{
                     position: 'absolute',
                     bottom: '-10px',
                     right: '-15px',
                     // Responsive scaling: 45% of card width
                     width: '45%',
                     minWidth: '120px',
                     maxWidth: '200px',
                     aspectRatio: '1 / 1',
                     zIndex: 0,
                     pointerEvents: 'none',
                     transition: 'width 0.3s ease', // Matches sidebar toggle speed
                     '@md': {
                        animation: 'float 6s ease-in-out infinite',
                        '@keyframes float': {
                           '0%, 100%': { transform: 'translateY(0)' },
                           '50%': { transform: 'translateY(-10px)' },
                        },
                     },
                  }}
               >
                  <img
                     src="https://png.pngtree.com/png-vector/20231014/ourmid/pngtree-3d-customer-service-operator-png-illustration-png-image_10160272.png"
                     alt="Admin Support Illustration"
                     style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
               </Box>
            </Card>
         </Box>
      </Flex>
   </Box>
);