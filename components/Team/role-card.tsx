// components/team/role-card.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RolePreset } from './data';
import { Users, CheckCircle, Settings } from 'lucide-react';

interface RoleCardProps {
     role: RolePreset;
     isSelected?: boolean;
     onClick?: (role: RolePreset) => void;
     onEdit?: (role: RolePreset) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
     role,
     isSelected = false,
     onClick,
     onEdit,
}) => {
     return (
          <Card
               onClick={() => onClick?.(role)}
               className={`cursor-pointer p-6 ${isSelected ? 'border-2' : 'border'}`}
               style={isSelected ? { borderColor: role.color, background: `${role.color}10` } : undefined}
          >
               <CardContent className="p-0">
                    <div className="flex items-start justify-between">
                         <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-3">
                                   <span
                                        className="rounded px-2 py-0.5 text-xs font-semibold text-white"
                                        style={{ background: role.color }}
                                   >
                                        {role.name}
                                   </span>
                                   <span className="text-xs text-muted-foreground">{role.memberCount} members</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{role.description}</p>
                         </div>

                         {onEdit && (
                              <Button
                                   variant="ghost"
                                   size="icon"
                                   className="h-8 w-8"
                                   onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(role);
                                   }}
                                   aria-label="Edit role"
                              >
                                   <Settings size={16} />
                              </Button>
                         )}
                    </div>

                    <div className="my-4 h-px bg-border" />

                    <div className="flex flex-col gap-4">
                         <span className="text-xs text-muted-foreground">Permissions included:</span>

                         <div className="flex flex-col gap-2">
                              {role.permissions.slice(0, 3).map((permission, index) => (
                                   <div key={index} className="flex items-center gap-2">
                                        <CheckCircle size={14} style={{ color: role.color }} />
                                        <span className="text-xs">{permission.replace(/_/g, ' ')}</span>
                                   </div>
                              ))}
                              {role.permissions.length > 3 && (
                                   <span className="text-xs text-muted-foreground">
                                        +{role.permissions.length - 3} more permissions
                                   </span>
                              )}
                         </div>

                         <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                   className="h-full rounded-full bg-primary transition-all"
                                   style={{ width: `${(role.permissions.length / 10) * 100}%` }}
                              />
                         </div>

                         <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                   <Users size={14} className="text-muted-foreground" />
                                   <span className="text-xs text-muted-foreground">{role.memberCount} members</span>
                              </div>
                              <Button
                                   size="sm"
                                   style={{ background: role.color, color: 'white' }}
                                   onClick={(e) => {
                                        e.stopPropagation();
                                        onClick?.(role);
                                   }}
                              >
                                   Select Role
                              </Button>
                         </div>
                    </div>
               </CardContent>
          </Card>
     );
};