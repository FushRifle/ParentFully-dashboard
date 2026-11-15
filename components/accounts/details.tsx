import { useRouter } from 'next/router';
import Link from 'next/link';
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon';
import { UsersIcon } from '@/components/icons/breadcrumb/users-icon';
import { DeleteUserModal } from '@/components/accounts/modals/delete';
import { SidebarContext } from '@/components/layout/layout-context';
import type { User } from '@/types/api';
import ChatAvatarWrapper from '@/components/Avatar/ChatAvatarWrapper';
import React, { useCallback, useMemo, useState, useContext } from 'react';
import { Breadcrumbs, Crumb, CrumbLink } from '@/components/breadcrumb/breadcrumb.styled';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
          <div className="mt-5 flex flex-col px-6 sm:mt-10 sm:px-16">
               <DeleteUserModal
                    visible={deleteVisible}
                    closeHandler={() => setDeleteVisible(false)}
                    userName={profile.fullName}
                    onConfirm={handleSuspendAccount}
               />

               {/* Navigation Section */}
               <div>
                    <Breadcrumbs>
                         <Crumb>
                              <HouseIcon />
                              <Link href="/overview"><CrumbLink>Overview</CrumbLink></Link>
                              <span className="mx-2">/</span>
                         </Crumb>
                         <Crumb>
                              <UsersIcon />
                              <Link href="/customers"><CrumbLink>Customers</CrumbLink></Link>
                              <span className="mx-2">/</span>
                         </Crumb>
                         <Crumb><CrumbLink>{profile.fullName}</CrumbLink></Crumb>
                    </Breadcrumbs>
               </div>

               {/* Page Header */}
               <div className="mt-8 mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-6">
                         <ChatAvatarWrapper
                              photo={userPhoto}
                              profile_image={profile_image}
                              contactName={profile.fullName}
                              size={100}
                              variant="primary"
                              borderWidth={1}
                         />
                         <Badge
                              className="rounded-full px-4 py-1"
                              variant="secondary"
                              data-state={profile.isPremium ? 'warning' : 'success'}
                         >
                              {profile.status.toUpperCase()}
                         </Badge>
                    </div>
                    <div className="flex w-full gap-4 sm:w-auto">
                         <Button
                              variant="destructive"
                              disabled={updatingStatus || profile.status === 'suspended'}
                              onClick={() => setDeleteVisible(true)}
                         >
                              {profile.status === 'suspended' ? 'Account Suspended' : 'Suspend Account'}
                         </Button>
                    </div>
               </div>

               <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                    {/* Main Content Column */}
                    <div className="flex flex-col gap-6 md:col-span-8">
                         {/* Card: Profile Information */}
                         <Card className="rounded-xl bg-background">
                              <CardHeader className="px-8 pt-8">
                                   <div className="flex flex-col">
                                        <h4 className="text-lg font-semibold">Profile Information</h4>
                                        <p className="text-sm text-muted-foreground">
                                             User personal details and contact information.
                                        </p>
                                   </div>
                              </CardHeader>
                              <CardContent className="grid grid-cols-1 gap-6 px-8 py-8 sm:grid-cols-2">
                                   <div className="flex flex-col gap-1">
                                        <span className="text-sm text-muted-foreground">First Name</span>
                                        <span className="text-lg font-semibold">{profile.firstName}</span>
                                   </div>
                                   <div className="flex flex-col gap-1">
                                        <span className="text-sm text-muted-foreground">Last Name</span>
                                        <span className="text-lg font-semibold">{profile.lastName || '—'}</span>
                                   </div>
                                   <div className="flex flex-col gap-1 sm:col-span-2">
                                        <span className="text-sm text-muted-foreground">Email Address</span>
                                        <span className="text-lg font-semibold">{profile.email}</span>
                                   </div>
                                   <div className="flex flex-col gap-1">
                                        <span className="text-sm text-muted-foreground">Country</span>
                                        <span className="text-lg font-semibold">{profile.country || '—'}</span>
                                   </div>
                                   <div className="flex flex-col gap-1">
                                        <span className="text-sm text-muted-foreground">Registered</span>
                                        <span className="text-lg font-semibold">{formatDate(profile.registeredAt)}</span>
                                   </div>
                              </CardContent>
                         </Card>

                         {/* Card: Subscription Management */}
                         <Card className="rounded-xl border-dashed">
                              <CardContent className="flex flex-wrap items-center justify-between gap-6 px-8 py-8">
                                   <div>
                                        <h5 className="font-semibold">Subscription Management</h5>
                                        <p className="text-sm text-muted-foreground">
                                             {profile.subscription
                                                  ? `${profile.subscription.plan_type} · ${profile.subscription.status}`
                                                  : 'No current subscription'}
                                        </p>
                                   </div>
                                   {profile.subscription && (
                                        <div className="flex gap-4">
                                             <Button
                                                  variant="secondary"
                                                  size="sm"
                                                  onClick={() => router.push(`/plans/${profile.id}`)}
                                             >
                                                  Plan Details
                                             </Button>
                                        </div>
                                   )}
                              </CardContent>
                         </Card>
                    </div>

                    {/* Sidebar Column */}
                    <div className="flex flex-col gap-6 md:col-span-4">
                         <Card className="rounded-xl bg-background">
                              <CardHeader className="px-6 pt-6">
                                   <span className="text-md font-semibold uppercase text-muted-foreground">
                                        Account details
                                   </span>
                              </CardHeader>
                              <Separator className="opacity-50" />
                              <CardContent className="flex flex-col gap-4 px-6 py-6">
                                   <div className="flex items-center justify-between">
                                        <span className="text-sm">Onboarding</span>
                                        <Badge variant={profile.onboardingComplete ? 'default' : 'secondary'}>
                                             {profile.onboardingComplete ? 'Complete' : 'Incomplete'}
                                        </Badge>
                                   </div>
                                   <div className="flex items-center justify-between">
                                        <span className="text-sm">Family</span>
                                        <span className="text-sm font-semibold">{profile.family?.name || '—'}</span>
                                   </div>
                                   <div className="flex items-center justify-between">
                                        <span className="text-sm">Email verified</span>
                                        <span className="text-sm font-semibold">
                                             {user.user.email_verified_at ? 'Yes' : 'No'}
                                        </span>
                                   </div>
                              </CardContent>
                         </Card>
                    </div>
               </div>
          </div>
     );
};