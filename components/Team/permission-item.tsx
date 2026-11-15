import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Permission } from './data';
import { Info, Shield, CreditCard, BarChart3, Settings, Users } from 'lucide-react';

interface PermissionItemProps {
     permission: Permission;
     checked: boolean;
     onChange: (permissionId: string, checked: boolean) => void;
     disabled?: boolean;
}

export const PermissionItem: React.FC<PermissionItemProps> = ({
     permission,
     checked,
     onChange,
     disabled = false,
}) => {
     const getCategoryIcon = (category: Permission['category']) => {
          switch (category) {
               case 'team':
                    return <Users size={16} />;
               case 'billing':
                    return <CreditCard size={16} />;
               case 'content':
                    return <Shield size={16} />;
               case 'analytics':
                    return <BarChart3 size={16} />;
               case 'settings':
                    return <Settings size={16} />;
               default:
                    return <Shield size={16} />;
          }
     };

     const getCategoryVariant = (category: Permission['category']): 'default' | 'secondary' | 'destructive' | 'outline' => {
          switch (category) {
               case 'team':
                    return 'default';
               case 'billing':
                    return 'destructive';
               case 'content':
                    return 'secondary';
               case 'analytics':
                    return 'outline';
               case 'settings':
                    return 'secondary';
               default:
                    return 'outline';
          }
     };

     return (
          <div className="flex items-center gap-4 rounded-lg border bg-background p-4 transition-all hover:border-primary">
               <Badge variant={getCategoryVariant(permission.category)} className="min-w-auto">
                    {getCategoryIcon(permission.category)}
               </Badge>

               <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                         <span className="text-sm font-medium">{permission.name}</span>
                         <Tooltip>
                              <TooltipTrigger className="text-muted-foreground">
                                   <Info size={14} />
                              </TooltipTrigger>
                              <TooltipContent>{permission.description}</TooltipContent>
                         </Tooltip>
                    </div>
                    <span className="text-xs text-muted-foreground">{permission.description}</span>
               </div>

               <Checkbox
                    checked={checked}
                    disabled={disabled}
                    onCheckedChange={(v) => onChange(permission.id, v === true)}
                    aria-label={`Toggle ${permission.name}`}
               />
          </div>
     );
};