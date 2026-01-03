import React from 'react';
import { Checkbox, Text, Tooltip, Badge } from '@nextui-org/react';
import { Flex } from '../styles/flex';
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
     disabled = false
}) => {
     const getCategoryIcon = (category: Permission['category']) => {
          switch (category) {
               case 'team': return <Users size={16} />;
               case 'billing': return <CreditCard size={16} />;
               case 'content': return <Shield size={16} />;
               case 'analytics': return <BarChart3 size={16} />;
               case 'settings': return <Settings size={16} />;
               default: return <Shield size={16} />;
          }
     };

     const getCategoryColor = (category: Permission['category']) => {
          switch (category) {
               case 'team': return 'primary';
               case 'billing': return 'error';
               case 'content': return 'success';
               case 'analytics': return 'warning';
               case 'settings': return 'secondary';
               default: return 'default';
          }
     };

     return (
          <Flex
               align="center"
               css={{
                    p: '$4',
                    border: '1px solid $border',
                    borderRadius: '$lg',
                    bg: '$background',
                    gap: '$4',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                         borderColor: '$primary'
                    }
               }}
          >
               <Badge
                    size="sm"
                    variant="flat"
                    color={getCategoryColor(permission.category)}
                    css={{ minWidth: 'auto' }}
               >
                    {getCategoryIcon(permission.category)}
               </Badge>

               <Flex direction="column" css={{ flex: 1, gap: '$1' }}>
                    <Flex align="center" css={{ gap: '$2' }}>
                         <Text size="$sm" css={{ fontWeight: 500 }}>
                              {permission.name}
                         </Text>
                         <Tooltip content={permission.description}>
                              <Info size={14} color="$accents7" />
                         </Tooltip>
                    </Flex>
                    <Text size="$xs" color="$accents7">
                         {permission.description}
                    </Text>
               </Flex>

               <Checkbox
                    size="sm"
                    isSelected={checked}
                    isDisabled={disabled}
                    onChange={(checked) => onChange(permission.id, checked)}
                    aria-label={`Toggle ${permission.name}`}
               />
          </Flex>
     );
};