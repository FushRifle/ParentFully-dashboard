import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TeamMember } from './data';
import { MoreVertical, Mail, Phone, UserCheck, UserX, Edit } from 'lucide-react';

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
     onChangeStatus,
}) => {
     const getStatusVariant = (status: TeamMember['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
          switch (status) {
               case 'active':
                    return 'default';
               case 'inactive':
                    return 'destructive';
               case 'pending':
                    return 'secondary';
               default:
                    return 'outline';
          }
     };

     const getRoleVariant = (role: TeamMember['role']): 'default' | 'secondary' | 'destructive' | 'outline' => {
          switch (role) {
               case 'admin':
                    return 'default';
               case 'editor':
                    return 'secondary';
               case 'viewer':
                    return 'outline';
               case 'support':
                    return 'secondary';
               case 'billing':
                    return 'destructive';
               default:
                    return 'outline';
          }
     };

     return (
          <Card className="p-6">
               <CardContent className="p-0">
                    <div className="flex items-start justify-between">
                         <div className="flex gap-6">
                              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-muted">
                                   {member.avatar ? (
                                        <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                                   ) : (
                                        <span className="text-lg font-semibold text-muted-foreground">
                                             {member.name.charAt(0)}
                                        </span>
                                   )}
                              </div>
                              <div className="flex flex-col gap-2">
                                   <div className="flex items-center gap-3">
                                        <span className="font-semibold">{member.name}</span>
                                        <Badge variant={getStatusVariant(member.status)}>{member.status}</Badge>
                                   </div>

                                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail size={14} />
                                        {member.email}
                                   </div>

                                   {member.phone && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                             <Phone size={14} />
                                             {member.phone}
                                        </div>
                                   )}

                                   {member.department && (
                                        <Badge variant="secondary" className="w-fit text-xs">
                                             {member.department}
                                        </Badge>
                                   )}
                              </div>
                         </div>

                         <DropdownMenu>
                              <DropdownMenuTrigger className="rounded-md p-2 hover:bg-muted">
                                   <MoreVertical size={20} />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                   <DropdownMenuItem onClick={() => onEdit?.(member)}>
                                        <Edit size={16} className="mr-2" />
                                        Edit Member
                                   </DropdownMenuItem>
                                   <DropdownMenuItem
                                        onClick={() =>
                                             onChangeStatus?.(member, member.status === 'active' ? 'inactive' : 'active')
                                        }
                                   >
                                        {member.status !== 'active' ? (
                                             <UserCheck size={16} className="mr-2" />
                                        ) : (
                                             <UserX size={16} className="mr-2" />
                                        )}
                                        {member.status === 'active' ? 'Deactivate' : 'Activate'}
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => onRemove?.(member)} className="text-red-500">
                                        <UserX size={16} className="mr-2" />
                                        Remove from Team
                                   </DropdownMenuItem>
                              </DropdownMenuContent>
                         </DropdownMenu>
                    </div>

                    <div className="my-4 h-px bg-border" />

                    <div className="flex items-center justify-between">
                         <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground">Role</span>
                              <Badge variant={getRoleVariant(member.role)}>
                                   {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                              </Badge>
                         </div>

                         <div className="flex flex-col items-end gap-1">
                              <span className="text-xs text-muted-foreground">Joined</span>
                              <span className="text-sm">{member.joinDate}</span>
                         </div>

                         <div className="flex flex-col items-end gap-1">
                              <span className="text-xs text-muted-foreground">Last Active</span>
                              <span className="text-sm text-muted-foreground">{member.lastActive}</span>
                         </div>
                    </div>

                    {member.permissions && member.permissions.length > 0 && (
                         <>
                              <div className="my-4 h-px bg-border" />
                              <span className="mb-2 block text-xs text-muted-foreground">Permissions</span>
                              <div className="flex flex-wrap gap-2">
                                   {member.permissions.slice(0, 3).map((permission, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                             {permission.replace(/_/g, ' ')}
                                        </Badge>
                                   ))}
                                   {member.permissions.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                             +{member.permissions.length - 3} more
                                        </Badge>
                                   )}
                              </div>
                         </>
                    )}
               </CardContent>
          </Card>
     );
};