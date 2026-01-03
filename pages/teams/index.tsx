import React, { useState, useMemo } from 'react';
import {
     Text,
     Button,
     Input,
     Grid,
     Card,
     Badge,
     Divider
} from '@nextui-org/react';

import { Tabs } from '../../components/styles/tabs';
import { Box } from '../../components/styles/box';
import { Flex } from '../../components/styles/flex';
import { Search, Filter, UserPlus, Download, Users } from 'lucide-react';
import { Select } from '../../components/styles/select';

import {
     teamMembers as initialTeamMembers,
     rolePresets,
     permissions,
     invitations,
     TeamMember
} from '../../components/Team/data';

import { TeamCard } from '../../components/Team/team-card';
import { RoleCard } from '../../components/Team/role-card';
import { PermissionItem } from '../../components/Team/permission-item';
import { InvitationList } from '../../components/Team/invitation-list';
import { AddMemberModal } from '../../components/Team/add-member-modal';

const TeamsPage = () => {
     const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
     const [searchQuery, setSearchQuery] = useState('');
     const [roleFilter, setRoleFilter] = useState<string>('all');
     const [statusFilter, setStatusFilter] = useState<string>('all');
     const [selectedRole, setSelectedRole] = useState<string>('admin');
     const [showAddModal, setShowAddModal] = useState(false);
     const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
          new Set(rolePresets.find(r => r.id === 'admin')?.permissions || [])
     );

     // Filter team members
     const filteredMembers = useMemo(() => {
          return teamMembers.filter(member => {
               const matchesSearch =
                    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    member.department?.toLowerCase().includes(searchQuery.toLowerCase());

               const matchesRole = roleFilter === 'all' || member.role === roleFilter;
               const matchesStatus = statusFilter === 'all' || member.status === statusFilter;

               return matchesSearch && matchesRole && matchesStatus;
          });
     }, [teamMembers, searchQuery, roleFilter, statusFilter]);

     const roleStats = useMemo(() => {
          return {
               total: teamMembers.length,
               active: teamMembers.filter(m => m.status === 'active').length,
               admins: teamMembers.filter(m => m.role === 'admin').length,
               pending: teamMembers.filter(m => m.status === 'pending').length
          };
     }, [teamMembers]);

     const roleOptions = [
          { value: 'all', label: 'All Roles' },
          ...rolePresets.map(role => ({
               value: role.id,
               label: role.name
          }))
     ];

     const statusOptions = [
          { value: 'all', label: 'All Status' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'pending', label: 'Pending' }
     ];

     const handleEditMember = (member: any) => {
          console.log('Edit member:', member);
     };

     const handleRemoveMember = (member: any) => {
          if (window.confirm(`Remove ${member.name} from team?`)) {
               setTeamMembers(prev => prev.filter(m => m.id !== member.id));
          }
     };

     const handleChangeStatus = (member: any, newStatus: any) => {
          setTeamMembers(prev =>
               prev.map(m => m.id === member.id ? { ...m, status: newStatus } : m)
          );
     };

     const handleAddMember = async (data: { email: string; role: any; sendInvitation: boolean }) => {
          console.log('Add member:', data);
          const newMember = {
               id: String(teamMembers.length + 1),
               name: data.email.split('@')[0],
               email: data.email,
               avatar: `https://i.pravatar.cc/150?u=${data.email}`,
               role: data.role,
               status: 'pending',
               joinDate: new Date().toISOString().split('T')[0],
               lastActive: 'Just now',
               permissions: rolePresets.find(r => r.id === data.role)?.permissions || [],
               department: 'New Member'
          } as TeamMember;

          setTeamMembers(prev => [...prev, newMember]);
     };

     const handlePermissionToggle = (permissionId: string, checked: boolean) => {
          setSelectedPermissions(prev => {
               const newSet = new Set(prev);
               if (checked) {
                    newSet.add(permissionId);
               } else {
                    newSet.delete(permissionId);
               }
               return newSet;
          });
     };

     return (
          <Box css={{ p: '$10', overflow: 'auto', height: 'calc(100vh - 100px)' }}>
               {/* Header */}
               <Flex justify="between" align="center" css={{ mb: '$8' }}>
                    <Box>
                         <Text h2>Team Management</Text>
                         <Text color="$accents7" css={{ mt: '$2' }}>
                              Manage team members, roles, and permissions
                         </Text>
                    </Box>
                    <Button
                         auto
                         icon={<UserPlus size={16} />}
                         css={{ bg: '#3f3bef' }}
                         onPress={() => setShowAddModal(true)}
                    >
                         Add Member
                    </Button>
               </Flex>

               {/* Stats Cards */}
               <Grid.Container gap={2} css={{ mb: '$8' }}>
                    <Grid xs={12} sm={3}>
                         <Card css={{ p: '$6' }}>
                              <Text size="$sm" color="$accents7" css={{ mb: '$2' }}>Total Members</Text>
                              <Flex align="center" css={{ gap: '$4' }}>
                                   <Users size={24} color="#3f3bef" />
                                   <Text h3>{roleStats.total}</Text>
                              </Flex>
                         </Card>
                    </Grid>
                    <Grid xs={12} sm={3}>
                         <Card css={{ p: '$6' }}>
                              <Text size="$sm" color="$accents7" css={{ mb: '$2' }}>Active</Text>
                              <Flex align="center" css={{ gap: '$4' }}>
                                   <Badge color="success" variant="dot" />
                                   <Text h3>{roleStats.active}</Text>
                              </Flex>
                         </Card>
                    </Grid>
                    <Grid xs={12} sm={3}>
                         <Card css={{ p: '$6' }}>
                              <Text size="$sm" color="$accents7" css={{ mb: '$2' }}>Administrators</Text>
                              <Flex align="center" css={{ gap: '$4' }}>
                                   <Badge color="primary" variant="dot" />
                                   <Text h3>{roleStats.admins}</Text>
                              </Flex>
                         </Card>
                    </Grid>
                    <Grid xs={12} sm={3}>
                         <Card css={{ p: '$6' }}>
                              <Text size="$sm" color="$accents7" css={{ mb: '$2' }}>Pending</Text>
                              <Flex align="center" css={{ gap: '$4' }}>
                                   <Badge color="warning" variant="dot" />
                                   <Text h3>{roleStats.pending}</Text>
                              </Flex>
                         </Card>
                    </Grid>
               </Grid.Container>

               {/* Main Content Tabs */}
               <Tabs
                    items={[
                         {
                              key: 'members',
                              title: 'Team Members',
                              content: (
                                   <Flex direction="column" css={{ gap: '$6' }}>
                                        {/* Filters */}
                                        <Card css={{ p: '$6' }}>
                                             <Flex css={{ gap: '$6' }} wrap="wrap">
                                                  <Input
                                                       placeholder="Search members..."
                                                       value={searchQuery}
                                                       onChange={(e) => setSearchQuery(e.target.value)}
                                                       contentLeft={<Search size={16} />}
                                                       css={{ flex: 1, minWidth: '200px' }}
                                                  />
                                                  <Select
                                                       placeholder="Filter by role"
                                                       value={roleFilter}
                                                       onChange={setRoleFilter}
                                                       options={roleOptions}
                                                       css={{ minWidth: '150px' }}
                                                  />
                                                  <Select
                                                       placeholder="Filter by status"
                                                       value={statusFilter}
                                                       onChange={setStatusFilter}
                                                       options={statusOptions}
                                                       css={{ minWidth: '150px' }}
                                                  />
                                                  <Button auto light icon={<Filter size={16} />}>
                                                       More Filters
                                                  </Button>
                                             </Flex>
                                        </Card>

                                        {/* Team Members Grid */}
                                        <Grid.Container gap={2}>
                                             {filteredMembers.map((member) => (
                                                  <Grid xs={12} key={member.id}>
                                                       <TeamCard
                                                            member={member}
                                                            onEdit={handleEditMember}
                                                            onRemove={handleRemoveMember}
                                                            onChangeStatus={handleChangeStatus}
                                                       />
                                                  </Grid>
                                             ))}
                                        </Grid.Container>

                                        {/* Invitations */}
                                        <InvitationList
                                             invitations={invitations}
                                             onResend={(inv) => console.log('Resend:', inv)}
                                             onRevoke={(inv) => console.log('Revoke:', inv)}
                                        />
                                   </Flex>
                              )
                         },
                         {
                              key: 'roles',
                              title: 'Roles & Permissions',
                              content: (
                                   <Grid.Container gap={2}>
                                        {/* Role Presets */}
                                        <Grid xs={12} md={4}>
                                             <Flex direction="column" css={{ gap: '$6' }}>
                                                  <Text h3>Role Presets</Text>
                                                  <Text color="$accents7">
                                                       Select a role to view and modify its permissions
                                                  </Text>

                                                  <Flex direction="column" css={{ gap: '$4' }}>
                                                       {rolePresets.map((role) => (
                                                            <RoleCard
                                                                 key={role.id}
                                                                 role={role}
                                                                 isSelected={selectedRole === role.id}
                                                                 onClick={(r) => {
                                                                      setSelectedRole(r.id);
                                                                      setSelectedPermissions(new Set(r.permissions));
                                                                 }}
                                                                 onEdit={(r) => console.log('Edit role:', r)}
                                                            />
                                                       ))}
                                                  </Flex>
                                             </Flex>
                                        </Grid>

                                        {/* Permissions Editor */}
                                        <Grid xs={12} md={8}>
                                             <Card css={{ p: '$6', height: '100%' }}>
                                                  <Flex direction="column" css={{ gap: '$6' }}>
                                                       <Flex justify="between" align="center">
                                                            <Box>
                                                                 <Text h3>
                                                                      {rolePresets.find(r => r.id === selectedRole)?.name} Permissions
                                                                 </Text>
                                                                 <Text color="$accents7" css={{ mt: '$2' }}>
                                                                      Manage permissions for this role
                                                                 </Text>
                                                            </Box>
                                                            <Button auto light icon={<Download size={16} />}>
                                                                 Export
                                                            </Button>
                                                       </Flex>

                                                       <Divider />

                                                       {/* Permission Categories */}
                                                       {['team', 'content', 'analytics', 'billing', 'settings'].map((category) => (
                                                            <Box key={category}>
                                                                 <Text h4 css={{ mb: '$4', textTransform: 'capitalize' }}>
                                                                      {category} Permissions
                                                                 </Text>
                                                                 <Flex direction="column" css={{ gap: '$2', mb: '$6' }}>
                                                                      {permissions
                                                                           .filter(p => p.category === category)
                                                                           .map((permission) => (
                                                                                <PermissionItem
                                                                                     key={permission.id}
                                                                                     permission={permission}
                                                                                     checked={selectedPermissions.has(permission.id)}
                                                                                     onChange={handlePermissionToggle}
                                                                                     disabled={permission.id === 'full_access' && selectedRole !== 'admin'}
                                                                                />
                                                                           ))}
                                                                 </Flex>
                                                            </Box>
                                                       ))}
                                                  </Flex>
                                             </Card>
                                        </Grid>
                                   </Grid.Container>
                              )
                         },
                         {
                              key: 'activity',
                              title: 'Activity Log',
                              content: (
                                   <Card css={{ p: '$6' }}>
                                        <Text h3 css={{ mb: '$6' }}>Recent Activity</Text>
                                        <Text color="$accents7" css={{ textAlign: 'center', py: '$12' }}>
                                             Activity log will be displayed here
                                        </Text>
                                   </Card>
                              )
                         }
                    ]}
                    aria-label="Team management tabs"
                    css={{ mb: '$8' }}
                    variant="underlined"
               />

               {/* Add Member Modal */}
               <AddMemberModal
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddMember}
                    rolePresets={rolePresets}
               />
          </Box>
     );
};

export default TeamsPage;