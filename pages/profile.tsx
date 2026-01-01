import React, { useState, useContext } from 'react';
import { Box } from '../components/styles/box';
import { Flex } from '../components/styles/flex';
import { Avatar, Button, Input, Card, Text, Divider, Badge, Switch, Spacer } from '@nextui-org/react';
import { SidebarContext } from '../components/layout/layout-context';
import { defaultProfile, UserProfile } from '../components/profile/data';

export const ProfileDetails = () => {
     const { showToast } = useContext(SidebarContext);
     const [formData, setFormData] = useState<UserProfile>(defaultProfile);

     const updateField = (key: keyof UserProfile, value: string) => {
          setFormData((prev) => ({ ...prev, [key]: value }));
     };

     const handleSave = () => {
          showToast('Profile updated successfully');
          console.log('Updated profile:', formData);
     };

     return (
          <Box css={{ px: '$12', py: '$10', '@xsMax': { px: '$6' } }}>
               {/* Page Header */}
               <Flex justify="between" align="center" css={{ mb: '$10', width: '100%' }}>
                    <Box>
                         <Text h2 css={{ m: 0, fontWeight: '$bold', ls: '-1px' }}>Account Settings</Text>
                         <Badge color="primary" variant="flat" css={{ mt: '$2', border: 'none' }}>ADMIN
                         </Badge>
                    </Box>
                    <Button auto shadow color="primary" onClick={handleSave} css={{ px: '$12', borderRadius: '$pill' }}>
                         Save Changes
                    </Button>
               </Flex>

               {/* Profile Card */}
               <Card variant="flat"
                    css={{
                         p: '$4', bg: '$accents0',
                         border: '1px solid $border', minHeight: '500px'
                    }}>
                    <Card.Body css={{ p: '$8' } as any}>
                         <Flex
                              direction="row"
                              wrap="nowrap"
                              align="stretch"
                              css={{
                                   width: '100%',
                                   gap: '$4',
                                   '@xsMax': { flexDirection: 'column' }
                              }}
                         >
                              {/* --- Left Column: Avatar & Membership --- */}
                              <Flex
                                   direction="column"
                                   align="center"
                                   css={{
                                        width: '250px',
                                        flexShrink: 0, // Prevents left side from squishing
                                        pt: '$8'
                                   }}
                              >
                                   <Box css={{ position: 'relative', mb: '$8' }}>
                                        <Avatar
                                             src={formData.avatar}
                                             css={{ size: '$40', borderRadius: '35%', border: '4px solid $background' }}
                                        />
                                        <Badge color="success" content="" placement="bottom-right" shape="circle" css={{ p: '$3', border: '3px solid $white' }} />
                                   </Box>
                                   <Button size="sm" light color="primary" css={{ borderRadius: '$pill' }} onClick={() => alert('Upload new avatar')}>
                                        Update Photo
                                   </Button>
                                   <Text size="$xs" css={{ color: '$accents6', mt: '$4', textAlign: 'center' }}>
                                        Member since Dec 2023
                                   </Text>
                              </Flex>

                              {/* --- First Vertical Divider --- */}
                              <Box css={{ width: '1px', bg: '$border', mx: '$10', '@xsMax': { display: 'none', my: '$8' } }} />

                              {/* --- Middle Column: Form Section (FULL WIDTH) --- */}
                              <Flex
                                   direction="column"
                                   css={{
                                        flex: 1, // This makes the middle column take up ALL available space
                                        gap: '$8'
                                   }}
                              >
                                   <Text b size="$lg" css={{ mb: '$2' }}>Personal Details</Text>

                                   <Flex css={{ gap: '$10', width: '100%', '@xsMax': { flexDirection: 'column' } }}>
                                        <Input
                                             label="First Name"
                                             value={formData.firstName}
                                             onChange={(e) => updateField('firstName', e.target.value)}
                                             fullWidth
                                             bordered
                                        />
                                        <Input
                                             label="Last Name"
                                             value={formData.lastName}
                                             onChange={(e) => updateField('lastName', e.target.value)}
                                             fullWidth
                                             bordered
                                        />
                                   </Flex>

                                   <Input
                                        label="Email Address"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        fullWidth
                                        bordered
                                        type="email"
                                   />

                                   <Box css={{ mt: '$4' }}>
                                        <Text b size="$md" css={{ mb: '$4', display: 'block' }}>Social Handles</Text>
                                        <Flex direction="column" css={{ gap: '$6' }}>
                                             <Input labelLeft="twitter.com/" placeholder="username" fullWidth bordered />
                                             <Input labelLeft="linkedin.com/in/" placeholder="username" fullWidth bordered />
                                             <Input labelLeft="github.com/" placeholder="username" fullWidth bordered />
                                        </Flex>
                                   </Box>
                              </Flex>

                              {/* --- Second Vertical Divider --- */}
                              <Box css={{ width: '1px', bg: '$border', mx: '$10', '@xsMax': { display: 'none', my: '$8' } }} />

                              {/* --- Right Column: Settings --- */}
                              <Flex
                                   direction="column"
                                   css={{
                                        width: '280px',
                                        flexShrink: 0, // Prevents right side from squishing
                                        gap: '$8'
                                   }}
                              >
                                   <Text b size="$lg" css={{ mb: '$2' }}>Preferences</Text>

                                   <Flex justify="between" align="center">
                                        <Box>
                                             <Text b size="$sm">Two-Factor Auth</Text>
                                             <Text size="$xs" css={{ color: '$accents7' }}>Secure your account</Text>
                                        </Box>
                                        <Switch initialChecked size="sm" />
                                   </Flex>

                                   <Flex justify="between" align="center">
                                        <Box>
                                             <Text b size="$sm">Public Profile</Text>
                                             <Text size="$xs" css={{ color: '$accents7' }}>Visible to everyone</Text>
                                        </Box>
                                        <Switch size="sm" />
                                   </Flex>

                                   <Divider css={{ my: '$2' }} />

                                   <Box>
                                        <Text b size="$sm" color="error">Danger Zone</Text>
                                        <Spacer y={0.3} />
                                        <Button light color="error" size="sm" css={{ width: '100%', justifyContent: 'start', p: 0 }}>
                                             Deactivate Account
                                        </Button>
                                   </Box>
                              </Flex>
                         </Flex>
                    </Card.Body>
               </Card>
          </Box>
     );
};

// Grid container helper
const GridContainer = ({ children }: { children: React.ReactNode }) => (
     <Flex css={{ gap: '$2', width: '100%', '@xsMax': { flexDirection: 'column' } }}>
          {children}
     </Flex>
);

const ProfilePage = () => <ProfileDetails />;

export default ProfilePage;
