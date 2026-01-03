import React from 'react';
import { Card, Avatar, Badge, Text, Button, Divider } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { TeamMember } from './data';
import { MoreVertical, Mail, Phone, UserCheck, UserX, Edit } from 'lucide-react';
import { Dropdown } from '../styles/dropdown';

interface TeamCardProps {
     member: TeamMember;
     onEdit?: (member: TeamMember) => void;
     onRemove?: (member: TeamMember) => void;
     onChangeRole?: (member: TeamMember, newRole: TeamMember['role']) => void;
     onChangeStatus?: (member: TeamMember, newStatus: TeamMember['status']) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
     member,
     onEdit,
     onRemove,
     onChangeRole,
     onChangeStatus
}) => {
     const getStatusColor = (status: TeamMember['status']) => {
          switch (status) {
               case 'active': return 'success';
               case 'inactive': return 'error';
               case 'pending': return 'warning';
               default: return 'default';
          }
     };

     const getRoleColor = (role: TeamMember['role']) => {
          switch (role) {
               case 'admin': return 'primary';
               case 'editor': return 'secondary';
               case 'viewer': return 'warning';
               case 'support': return 'gradient';
               case 'billing': return 'error';
               default: return 'default';
          }
     };

     // Dropdown items configuration
     const dropdownItems = [
          {
               key: 'edit',
               label: 'Edit Member',
               icon: <Edit size={16} />,
               onClick: () => onEdit?.(member)
          },
          {
               key: 'status',
               label: member.status === 'active' ? 'Deactivate' : 'Activate',
               icon: member.status !== 'active' ? <UserCheck size={16} /> : <UserX size={16} />,
               color: member.status === 'active' ? 'warning' : 'success' as const,
               onClick: () => onChangeStatus?.(member, member.status === 'active' ? 'inactive' : 'active')
          },
          {
               key: 'remove',
               label: 'Remove from Team',
               icon: <UserX size={16} />,
               color: 'error' as const,
               onClick: () => onRemove?.(member)
          }
     ];

     return (
          <Card css={{ p: '$6', mw: '100%' }} variant="flat">
               <Card.Body>
                    <Flex justify="between" align="start">
                         <Flex css={{ gap: '$6' }}>
                              <Avatar
                                   src={member.avatar}
                                   size="lg"
                                   bordered
                                   color={getStatusColor(member.status) as any}
                              />
                              <Flex direction="column" css={{ gap: '$2' }}>
                                   <Flex align="center" css={{ gap: '$3' }}>
                                        <Text b>{member.name}</Text>
                                        <Badge
                                             size="sm"
                                             variant="flat"
                                             color={getStatusColor(member.status)}
                                        >
                                             {member.status}
                                        </Badge>
                                   </Flex>

                                   <Flex align="center" css={{ gap: '$2' }}>
                                        <Mail size={14} />
                                        <Text size="$sm" color="$accents7">
                                             {member.email}
                                        </Text>
                                   </Flex>

                                   {member.phone && (
                                        <Flex align="center" css={{ gap: '$2' }}>
                                             <Phone size={14} />
                                             <Text size="$sm" color="$accents7">
                                                  {member.phone}
                                             </Text>
                                        </Flex>
                                   )}

                                   {member.department && (
                                        <Badge size="xs" variant="flat" css={{ alignSelf: 'flex-start' }}>
                                             {member.department}
                                        </Badge>
                                   )}
                              </Flex>
                         </Flex>

                         {/* Custom Dropdown */}
                         <Dropdown
                              items={dropdownItems as any}
                              placement="bottom-right"
                              trigger="click"
                         >
                              <Button
                                   auto
                                   light
                                   css={{
                                        minWidth: 'auto',
                                        px: '$2',
                                        '&:hover': {
                                             bg: '$accents0'
                                        }
                                   }}
                              >
                                   <MoreVertical size={20} />
                              </Button>
                         </Dropdown>
                    </Flex>

                    <Divider y={1.5} />

                    <Flex justify="between" align="center">
                         <Flex direction="column" css={{ gap: '$1' }}>
                              <Text size="$xs" color="$accents7">Role</Text>
                              <Badge
                                   size="sm"
                                   variant="flat"
                                   color={getRoleColor(member.role) as any}
                              >
                                   {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                              </Badge>
                         </Flex>

                         <Flex direction="column" css={{ gap: '$1', alignItems: 'flex-end' }}>
                              <Text size="$xs" color="$accents7">Joined</Text>
                              <Text size="$sm">{member.joinDate}</Text>
                         </Flex>

                         <Flex direction="column" css={{ gap: '$1', alignItems: 'flex-end' }}>
                              <Text size="$xs" color="$accents7">Last Active</Text>
                              <Text size="$sm" color="$accents7">{member.lastActive}</Text>
                         </Flex>
                    </Flex>

                    {member.permissions && member.permissions.length > 0 && (
                         <>
                              <Divider y={1.5} />
                              <Text size="$xs" color="$accents7" css={{ mb: '$2' }}>
                                   Permissions
                              </Text>
                              <Flex wrap="wrap" css={{ gap: '$2' }}>
                                   {member.permissions.slice(0, 3).map((permission, index) => (
                                        <Badge key={index} size="xs" variant="flat" color="default">
                                             {permission.replace(/_/g, ' ')}
                                        </Badge>
                                   ))}
                                   {member.permissions.length > 3 && (
                                        <Badge size="xs" variant="flat" color="default">
                                             +{member.permissions.length - 3} more
                                        </Badge>
                                   )}
                              </Flex>
                         </>
                    )}
               </Card.Body>
          </Card>
     );
};