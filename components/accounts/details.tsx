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
import { updateAppUserStatus } from '@/services/adminService';

type Props = {
     user: User;
};

export const AccountDetails = ({ user }: Props) => {
     const router = useRouter();
     const { showToast } = useContext(SidebarContext);
     const [deleteVisible, setDeleteVisible] = useState(false);
     const [updatingStatus, setUpdatingStatus] = useState(false);

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
               status: user.status || user.user.status || 'active',
               country: user.country || user.user.country,
               registeredAt: user.created_at || user.user.created_at,
               onboardingComplete: user.has_completed_onboarding,
               family: user.family,
               subscription: user.subscriptions?.[0] || user.active_subscription,
          };
     }, [user]);
     const u = user.user ?? user;
     const profileImage = user.user?.profile_image || u.profile_image;
     const photo = user.user?.photo || u.photo;
     const profile_image = typeof profileImage === 'string' ? profileImage : profileImage?.uri;
     const userPhoto = typeof photo === 'string' ? photo : photo?.uri;

     const formatDate = (value?: string | Date | null) => {
          if (!value) return '—';
          const date = new Date(value);
          return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
     };

     const handleSuspendAccount = useCallback(async () => {
          setUpdatingStatus(true);
          try {
               await updateAppUserStatus(profile.id, 'suspended');
               setDeleteVisible(false);
               showToast(`${profile.fullName} has been suspended`);
               await router.push('/customers');
          } catch (error) {
               console.error('Failed to suspend account:', error);
               showToast('Failed to suspend account');
          } finally {
               setUpdatingStatus(false);
          }
     }, [profile, router, showToast]);

     return (
          <Flex css={{ mt: '$5', px: '$6', '@sm': { mt: '$10', px: '$16' } }} direction="column">
               <DeleteUserModal
                    visible={deleteVisible}
                    closeHandler={() => setDeleteVisible(false)}
                    userName={profile.fullName}
                    onConfirm={handleSuspendAccount}
               />

               {/* Navigation Section */}
               <Box>
                    <Breadcrumbs>
                         <Crumb>
                              <HouseIcon />
                              <Link href="/overview"><CrumbLink>Overview</CrumbLink></Link>
                              <Text css={{ mx: '$2' }}>/</Text>
                         </Crumb>
                         <Crumb>
                              <UsersIcon />
                              <Link href="/customers"><CrumbLink>Customers</CrumbLink></Link>
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
                                        {profile.status.toUpperCase()}
                                   </Badge>
                              </Flex>
                         </Grid>
                         <Grid css={{ '@xsMax': { mt: '$8', width: '100%' } }}>
                              <Flex css={{ gap: '$6' }}>
                                   <Button auto color="error" disabled={updatingStatus || profile.status === 'suspended'} onClick={() => setDeleteVisible(true)}>
                                        {profile.status === 'suspended' ? 'Account Suspended' : 'Suspend Account'}
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
                                                       <Text size="$sm" color="$accents7">Country</Text>
                                                       <Text size="$lg" b>{profile.country || '—'}</Text>
                                                  </Flex>
                                             </Grid>
                                             <Grid xs={12} sm={6}>
                                                  <Flex direction="column" css={{ gap: '$2' }}>
                                                       <Text size="$sm" color="$accents7">Registered</Text>
                                                       <Text size="$lg" b>{formatDate(profile.registeredAt)}</Text>
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
                                                  <Text size="$sm" color="$accents7">
                                                       {profile.subscription
                                                            ? `${profile.subscription.plan_type} · ${profile.subscription.status}`
                                                            : 'No current subscription'}
                                                  </Text>
                                             </Box>
                                             {profile.subscription && <Flex css={{ gap: '$6' }}>
                                                  <Button auto flat size="sm" onClick={() => router.push(`/plans/${profile.id}`)}>
                                                       Plan Details
                                                  </Button>
                                             </Flex>}
                                        </Flex>
                                   </Card.Body>
                              </Card>
                         </Flex>
                    </Grid>

                    {/* Sidebar Column */}
                    <Grid xs={12} md={4}>
                         <Flex direction="column" css={{ gap: '$10', width: '100%' }}>

                              {/* Account data from the customer record */}
                              <Card variant="bordered" css={{ borderRadius: '$xl', bg: '$backgroundContrast' }}>
                                   <Card.Header css={{ px: '$8', pt: '$8' }}>
                                        <Text b size="$md" transform="uppercase" color="$accents7">Account details</Text>
                                   </Card.Header>
                                   <Divider css={{ opacity: 0.5 }} />
                                   <Card.Body css={{ px: '$8', py: '$8' }}>
                                        <Flex direction="column" css={{ gap: '$8' }}>
                                             <Flex justify="between" align="center">
                                                  <Text size="$sm">Onboarding</Text>
                                                  <Badge variant="flat" size="xs" color={profile.onboardingComplete ? 'success' : 'warning'}>
                                                       {profile.onboardingComplete ? 'Complete' : 'Incomplete'}
                                                  </Badge>
                                             </Flex>
                                             <Flex justify="between" align="center">
                                                  <Text size="$sm">Family</Text>
                                                  <Text size="$sm" b>{profile.family?.name || '—'}</Text>
                                             </Flex>
                                             <Flex justify="between" align="center">
                                                  <Text size="$sm">Email verified</Text>
                                                  <Text size="$sm" b>{user.user.email_verified_at ? 'Yes' : 'No'}</Text>
                                             </Flex>
                                        </Flex>
                                   </Card.Body>
                              </Card>
                         </Flex>
                    </Grid>
               </Grid.Container>
          </Flex>
     );
};
