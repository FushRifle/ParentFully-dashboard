import React, { useState, useContext } from 'react';
import { Box } from '../components/styles/box';
import { Flex } from '../components/styles/flex';
import {
     Card, Text, Input, Button, Switch,
     Spacer, Divider, Dropdown
} from '@nextui-org/react';
import { SidebarContext } from '../components/layout/layout-context';
import { DarkModeSwitch } from '../components/navbar/darkmodeswitch';

export const SettingsDetails = () => {
     const { showToast } = useContext(SidebarContext);
     const [activeTab, setActiveTab] = useState<'security' | 'localization' | 'api'>('security');

     const [formData, setFormData] = useState({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          darkMode: false,
          twoFactor: true,
          language: 'English (US)',
          timezone: '(GMT-08:00) Pacific Time',
          apiKey: '',
          apiKeyVisible: false,
     });

     const updateField = (key: keyof typeof formData, value: string | boolean) => {
          setFormData((prev) => ({ ...prev, [key]: value }));
     };

     const handleSave = () => showToast('Settings saved successfully');

     const languages = ['English (US)', 'Spanish (ES)', 'French (FR)'];
     const timezones = [
          '(GMT-08:00) Pacific Time',
          '(GMT-05:00) Eastern Time',
          '(GMT+01:00) Central European Time',
     ];

     return (
          <Box css={{ px: '$12', py: '$10', '@xsMax': { px: '$6' } }}>
               {/* --- Header --- */}
               <Flex justify="between" align="center" css={{ mb: '$10', width: '100%' }}>
                    <Box>
                         <Text h2 css={{ m: 0, fontWeight: '$bold', ls: '-1px' }}>Settings</Text>
                         <Text span css={{ color: '$accents7' }}>Configure your account and platform preferences</Text>
                    </Box>
                    <Button auto shadow onClick={handleSave} css={{ borderRadius: '$pill', px: '$12' }}>
                         Save Changes
                    </Button>
               </Flex>

               <Card variant="flat" css={{ p: '$2', bg: '$accents0', border: '1px solid $border', minHeight: '550px' }}>
                    <Card.Body>
                         <Flex direction="row" align="stretch" css={{ width: '100%', '@xsMax': { flexDirection: 'column' } }}>

                              {/* --- LEFT COLUMN: NAVIGATION TABS --- */}
                              <Flex direction="column" css={{ width: '220px', flexShrink: 0, gap: '$2', p: '$4' }}>
                                   {[
                                        { id: 'security', label: 'Security', icon: '🔒' },
                                        { id: 'localization', label: 'Localization', icon: '🌍' },
                                        { id: 'api', label: 'API Access', icon: '⚡' },
                                   ].map((tab) => (
                                        <Button
                                             key={tab.id}
                                             light
                                             color={activeTab === tab.id ? 'primary' : 'default'}
                                             onClick={() => setActiveTab(tab.id as any)}
                                             css={{
                                                  justifyContent: 'flex-start',
                                                  bg: activeTab === tab.id ? '$primaryLight' : 'transparent',
                                                  borderRadius: '$lg',
                                                  fontWeight: activeTab === tab.id ? '$bold' : '$medium',
                                             }}
                                        >
                                             {tab.label}
                                        </Button>
                                   ))}
                              </Flex>

                              {/* Vertical Divider */}
                              <Box css={{ width: '1px', bg: '$border', mx: '$4', '@xsMax': { display: 'none' } }} />

                              {/* --- MIDDLE COLUMN: DYNAMIC CONTENT --- */}
                              <Flex direction="column" css={{ flex: 1, px: '$8', py: '$4', gap: '$8' }}>
                                   {activeTab === 'security' && (
                                        <>
                                             <Text b size="$lg">Password Management</Text>
                                             <Input
                                                  label="Current Password"
                                                  type="password"
                                                  placeholder="****"
                                                  bordered
                                                  fullWidth
                                                  value={formData.currentPassword}
                                                  onChange={(e) => updateField('currentPassword', e.target.value)}
                                             />
                                             <Flex css={{ gap: '$8', '@xsMax': { flexDirection: 'column' } }}>
                                                  <Input
                                                       label="New Password"
                                                       type="password"
                                                       bordered
                                                       fullWidth
                                                       value={formData.newPassword}
                                                       onChange={(e) => updateField('newPassword', e.target.value)}
                                                  />
                                                  <Input
                                                       label="Confirm Password"
                                                       type="password"
                                                       bordered
                                                       fullWidth
                                                       value={formData.confirmPassword}
                                                       onChange={(e) => updateField('confirmPassword', e.target.value)}
                                                  />
                                             </Flex>
                                        </>
                                   )}

                                   {activeTab === 'localization' && (
                                        <>
                                             <Text b size="$lg">Region & Language</Text>

                                             <Dropdown>
                                                  <Dropdown.Button flat css={{ mb: '$4' }}>{formData.language}</Dropdown.Button>
                                                  <Dropdown.Menu
                                                       aria-label="Select Language"
                                                       onAction={(key) => updateField('language', key as string)}
                                                  >
                                                       {languages.map((lang) => (
                                                            <Dropdown.Item key={lang}>{lang}</Dropdown.Item>
                                                       ))}
                                                  </Dropdown.Menu>
                                             </Dropdown>

                                             <Dropdown>
                                                  <Dropdown.Button flat css={{ mb: '$4' }}>{formData.timezone}</Dropdown.Button>
                                                  <Dropdown.Menu
                                                       aria-label="Select Timezone"
                                                       onAction={(key) => updateField('timezone', key as string)}
                                                  >
                                                       {timezones.map((tz) => (
                                                            <Dropdown.Item key={tz}>{tz}</Dropdown.Item>
                                                       ))}
                                                  </Dropdown.Menu>
                                             </Dropdown>
                                        </>
                                   )}

                                   {activeTab === 'api' && (
                                        <>
                                             <Text b size="$lg">API Access</Text>
                                             <Text size="$sm" css={{ color: '$accents7', mb: '$4' }}>
                                                  Manage API keys and access for integrations.
                                             </Text>

                                             <Box css={{ mt: '$4' }}>
                                                  <Input
                                                       label="Primary API Key"
                                                       type={formData.apiKeyVisible ? 'text' : 'password'}
                                                       placeholder="••••••••••••••••"
                                                       bordered
                                                       fullWidth
                                                       value={formData.apiKey || 'sk_live_51MzS2GLfRYp9vWlpk8v9'}
                                                       onChange={(e) => updateField('apiKey', e.target.value)}
                                                       contentRightStyling={false} // Crucial: removes default padding to allow internal placement
                                                       contentRight={
                                                            <Flex css={{ pr: '$3', gap: '$2' }} align="center">
                                                                 <Button
                                                                      light
                                                                      auto
                                                                      size="xs"
                                                                      css={{
                                                                           minWidth: 'auto',
                                                                           color: '$accents7',
                                                                           '&:hover': { color: '$primary' }
                                                                      }}
                                                                      onClick={() => updateField('apiKeyVisible', !formData.apiKeyVisible)}
                                                                 >
                                                                      {formData.apiKeyVisible ? 'Hide' : 'Show'}
                                                                 </Button>
                                                                 <Divider css={{ height: '16px', mx: '$2' }} />
                                                                 <Button
                                                                      light
                                                                      auto
                                                                      size="xs"
                                                                      css={{
                                                                           minWidth: 'auto',
                                                                           color: '$accents7'
                                                                      }}
                                                                      onClick={() => {
                                                                           navigator.clipboard.writeText(formData.apiKey);
                                                                           showToast('Key copied to clipboard');
                                                                      }}
                                                                 >
                                                                      Copy
                                                                 </Button>
                                                            </Flex>
                                                       }
                                                       css={{
                                                            '& .nextui-input-content--right': {
                                                                 h: '100%',
                                                                 dflex: 'center',
                                                            },
                                                            '& input': {
                                                                 fontFamily: formData.apiKeyVisible ? 'monospace' : 'inherit',
                                                                 letterSpacing: formData.apiKeyVisible ? '0px' : '2px',
                                                            }
                                                       }}
                                                  />
                                             </Box>

                                             <Divider css={{ my: '$10' }} />

                                             <Box>
                                                  <Text b size="$sm" color="error">Danger Zone</Text>
                                                  <Text size="$xs" css={{ color: '$accents6', mb: '$4' }}>
                                                       Revoking this key will immediately disable any active integrations.
                                                  </Text>
                                                  <Button auto flat color="error" size="sm">
                                                       Revoke Secret Key
                                                  </Button>
                                             </Box>
                                        </>
                                   )}
                              </Flex>

                              {/* Vertical Divider */}
                              <Box css={{ width: '1px', bg: '$border', mx: '$4', '@xsMax': { display: 'none' } }} />

                              {/* --- RIGHT COLUMN: QUICK TOGGLES --- */}
                              <Flex direction="column" css={{ width: '280px', flexShrink: 0, gap: '$8', p: '$4' }}>
                                   <Text b size="$lg">Quick Actions</Text>

                                   <Flex justify="between" align="center">
                                        <Box>
                                             <Text b size="$sm">Dark Mode</Text>
                                             <Text size="$xs" css={{ color: '$accents7' }}>System wide theme</Text>
                                        </Box>
                                        <DarkModeSwitch />
                                   </Flex>

                                   <Flex justify="between" align="center">
                                        <Box>
                                             <Text b size="$sm">2FA Security</Text>
                                             <Text size="$xs" css={{ color: '$accents7' }}>Require login codes</Text>
                                        </Box>
                                        <Switch checked={formData.twoFactor} onChange={(e) => updateField('twoFactor', e.target.checked)} />
                                   </Flex>

                                   <Divider css={{ my: '$2' }} />

                                   <Box>
                                        <Text b size="$sm" color="error">Session Control</Text>
                                        <Spacer y={0.3} />
                                        <Button light color="error" size="sm" css={{ width: '100%', justifyContent: 'start', p: 0 }}>
                                             Sign out of all devices
                                        </Button>
                                   </Box>
                              </Flex>

                         </Flex>
                    </Card.Body>
               </Card>
          </Box>
     );
};

const SettingsPage = () => <SettingsDetails />;
export default SettingsPage;
