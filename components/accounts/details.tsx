import { useRouter } from 'next/router';
import Link from 'next/link';
import { HouseIcon } from '../icons/breadcrumb/house-icon';
import { UsersIcon } from '../icons/breadcrumb/users-icon';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { DeleteUserModal } from './modals/delete';
import { SidebarContext } from '../layout/layout-context';
import type { User } from '../../types/api';
import ChatAvatarWrapper from '@/components/Avatar/ChatAvatarWrapper';
import React, { useCallback, useMemo, useState, useContext } from 'react';
import { Breadcrumbs, Crumb, CrumbLink } from '../breadcrumb/breadcrumb.styled';
import {
     Button, Card, Divider, Input, Text,
     Badge, User as NextUser, Grid, Spacer
} from '@nextui-org/react';

type Props = {
     user: User;
};

export const AccountDetails = ({ user }: Props) => {
     const router = useRouter();
     const { showToast } = useContext(SidebarContext);
     const [deleteVisible, setDeleteVisible] = useState(false);

     const profile = useMemo(() => {
          const fullName = user.user.name || 'Unknown User';
          const [firstName = '', ...lastNameParts] = fullName.split(' ');

          return {
               id: user.user.id,
               firstName,
               lastName: lastNameParts.join(' '),
               fullName,
               email: user.user.email || 'N/A',
               avatar: user.user.profile_image,
               points: user.user.points ?? 0,
               isPremium: user.user.is_premium ?? false,
          };
     }, [user]);
     const u = user.user ?? user;
     const profile_image = u.profile_image;
     const userPhoto = user.user?.profile_image || u.photo;

     const SECURITY_LOGS = [
          { event: 'Last Activity', time: user.user.updated_at },
     ];

     const handleRevokePlan = useCallback(() => {
          showToast(`Subscription revoked for ${profile.firstName}`);
     }, [profile, showToast]);

     return (
          <Flex css={{ mt: '$5', px: '$6', '@sm': { mt: '$10', px: '$16' } }} direction="column">
               <DeleteUserModal
                    visible={deleteVisible}
                    closeHandler={() => setDeleteVisible(false)}
                    userName={profile.fullName}
                    onConfirm={() => {
                         setDeleteVisible(false);
                         router.push('/accounts');
                    }}
               />

               {/* Navigation Section */}
               <Box>
                    <Breadcrumbs>
                         <Crumb>
                              <HouseIcon />
                              <Link href="/dashboard"><CrumbLink>Home</CrumbLink></Link>
                              <Text css={{ mx: '$2' }}>/</Text>
                         </Crumb>
                         <Crumb>
                              <UsersIcon />
                              <Link href="/accounts"><CrumbLink>Accounts</CrumbLink></Link>
                              <Text css={{ mx: '$2' }}>/</Text>
                         </Crumb>
                         <Crumb><CrumbLink>{profile.fullName}</CrumbLink></Crumb>
                    </Breadcrumbs>
               </Box>

               {/* Page Header */}
               <Box css={{ mt: '$8', mb: '$12' }}>
                    <Grid.Container justify="space-between" alignItems="center">
                         <Grid>
                              <Flex align="center" css={{ gap: '$10' }}>
                                   <ChatAvatarWrapper
                                        photo={userPhoto}
                                        profile_image={profile_image}
                                        contactName={profile.fullName}
                                        size={100}
                                        variant={'primary'}
                                        borderWidth={1}
                                   />

                                   <Badge
                                        color={profile.isPremium ? 'warning' : 'success'}
                                        variant="flat"
                                        css={{ height: '$fit', px: '$6', borderRadius: '$pill', border: 'none' }}
                                   >
                                        {profile.isPremium ? 'PREMIUM' : 'ACTIVE'}
                                   </Badge>
                              </Flex>
                         </Grid>
                         <Grid css={{ '@xsMax': { mt: '$8', width: '100%' } }}>
                              <Flex css={{ gap: '$6' }}>
                                   <Button auto color="error" onClick={() => setDeleteVisible(true)}>
                                        Disable Account
                                   </Button>
                              </Flex>
                         </Grid>
                    </Grid.Container>
               </Box>

               <Grid.Container gap={2.5}>
                    {/* Main Content Column */}
                    <Grid xs={12} md={8}>
                         <Flex direction="column" css={{ gap: '$10', width: '100%' }}>

                              {/* Card: Profile Information (Read Only) */}
                              <Card variant="bordered" css={{ borderRadius: '$xl', bg: '$backgroundContrast' }}>
                                   <Card.Header css={{ px: '$10', pt: '$10' }}>
                                        <Flex direction="column">
                                             <Text h4 css={{ m: 0 }}>Profile Information</Text>
                                             <Text size="$sm" color="$accents7">User personal details and contact information.</Text>
                                        </Flex>
                                   </Card.Header>
                                   <Card.Body css={{ px: '$10', py: '$12' }}>
                                        <Grid.Container gap={3}>
                                             <Grid xs={12} sm={6}>
                                                  <Flex direction="column" css={{ gap: '$2' }}>
                                                       <Text size="$sm" color="$accents7">First Name</Text>
                                                       <Text size="$lg" b>{profile.firstName}</Text>
                                                  </Flex>
                                             </Grid>
                                             <Grid xs={12} sm={6}>
                                                  <Flex direction="column" css={{ gap: '$2' }}>
                                                       <Text size="$sm" color="$accents7">Last Name</Text>
                                                       <Text size="$lg" b>{profile.lastName || '—'}</Text>
                                                  </Flex>
                                             </Grid>
                                             <Grid xs={12}>
                                                  <Flex direction="column" css={{ gap: '$2' }}>
                                                       <Text size="$sm" color="$accents7">Email Address</Text>
                                                       <Text size="$lg" b>{profile.email}</Text>
                                                  </Flex>
                                             </Grid>
                                             <Grid xs={12} sm={6}>
                                                  <Flex direction="column" css={{ gap: '$2' }}>
                                                       <Text size="$sm" color="$accents7">Rewards Points</Text>
                                                       <Text size="$lg" b>{profile.points.toLocaleString()}</Text>
                                                  </Flex>
                                             </Grid>
                                             <Grid xs={12} sm={6}>
                                                  <Flex direction="column" css={{ gap: '$2' }}>
                                                       <Text size="$sm" color="$accents7">Referrals</Text>
                                                       <Text size="$lg" b>{profile.points.toLocaleString()}</Text>
                                                  </Flex>
                                             </Grid>
                                        </Grid.Container>
                                   </Card.Body>
                              </Card>

                              {/* Card: Subscription Management */}
                              <Card variant="bordered" css={{ borderRadius: '$xl', borderStyle: 'dashed', borderColor: '$accents3' }}>
                                   <Card.Body css={{ py: '$10', px: '$10' }}>
                                        <Flex justify="between" align="center" wrap="wrap" css={{ gap: '$8' }}>
                                             <Box>
                                                  <Text h5 css={{ m: 0 }}>Subscription Management</Text>
                                                  <Text size="$sm" color="$accents7">Manage plan billing, status, and termination.</Text>
                                             </Box>
                                             <Flex css={{ gap: '$6' }}>
                                                  <Button auto flat size="sm" onClick={() => router.push(`/plans/${profile.id}`)}>
                                                       Plan Details
                                                  </Button>
                                                  <Button auto flat color="error" size="sm" onClick={handleRevokePlan}>
                                                       Revoke Plan
                                                  </Button>
                                             </Flex>
                                        </Flex>
                                   </Card.Body>
                              </Card>
                         </Flex>
                    </Grid>

                    {/* Sidebar Column */}
                    <Grid xs={12} md={4}>
                         <Flex direction="column" css={{ gap: '$10', width: '100%' }}>

                              {/* Security Card */}
                              <Card variant="bordered" css={{ borderRadius: '$xl', bg: '$backgroundContrast' }}>
                                   <Card.Header css={{ px: '$8', pt: '$8' }}>
                                        <Text b size="$md" transform="uppercase" color="$accents7">Recent Logs</Text>
                                   </Card.Header>
                                   <Divider css={{ opacity: 0.5 }} />
                                   <Card.Body css={{ px: '$8', py: '$8' }}>
                                        <Flex direction="column" css={{ gap: '$8' }}>
                                             {SECURITY_LOGS.map((log, index) => (
                                                  <Flex key={index} justify="between" align="center">
                                                       <Box>
                                                            <Text size="$sm" b>{log.event}</Text>
                                                            <Text size="$xs" color="$accents6">{log.device}</Text>
                                                       </Box>
                                                       <Badge variant="flat" size="xs" color="neutral">{log.time}</Badge>
                                                  </Flex>
                                             ))}
                                        </Flex>
                                        <Spacer y={1.5} />
                                        <Button light color="primary" auto size="sm" css={{ width: '100%', borderRadius: '$md' }}>
                                             View History
                                        </Button>
                                   </Card.Body>
                              </Card>

                              {/* Quick Stats Card */}
                              <Card variant="flat" css={{ borderRadius: '$xl', bg: '$primaryLight' }}>
                                   <Card.Body css={{ py: '$8' }}>
                                        <Text b color="white" size="$sm">Account Status</Text>
                                        <Text size="$xs" color="white">This account is currently in good standing with no active reports.</Text>
                                   </Card.Body>
                              </Card>
                         </Flex>
                    </Grid>
               </Grid.Container>
          </Flex>
     );
};