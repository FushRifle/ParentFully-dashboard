import React from 'react';
import { Card, Badge, Text, Button, Progress, Divider } from '@nextui-org/react';
import { Flex } from '../styles/flex';
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
     onEdit
}) => {
     return (
          <Card
               isPressable={!!onClick}
               isHoverable
               variant={isSelected ? 'flat' : 'shadow'}
               css={{
                    p: '$6',
                    border: isSelected ? `2px solid ${role.color}` : '1px solid $border',
                    bg: isSelected ? `${role.color}10` : '$background'
               }}
               onClick={() => onClick?.(role)}
          >
               <Card.Body>
                    <Flex justify="between" align="start">
                         <Flex direction="column" css={{ gap: '$2' }}>
                              <Flex align="center" css={{ gap: '$3' }}>
                                   <Badge
                                        size="sm"
                                        variant="flat"
                                        css={{ bg: role.color, color: '$white' }}
                                   >
                                        {role.name}
                                   </Badge>
                                   <Text size="$xs" color="$accents7">
                                        {role.memberCount} members
                                   </Text>
                              </Flex>

                              <Text size="$sm" color="$accents7">
                                   {role.description}
                              </Text>
                         </Flex>

                         {onEdit && (
                              <Button
                                   auto
                                   light
                                   size="sm"
                                   icon={<Settings size={16} />}
                                   onPress={() => onEdit(role)}
                              />
                         )}
                    </Flex>

                    <Divider y={1.5} />

                    <Flex direction="column" css={{ gap: '$4' }}>
                         <Text size="$xs" color="$accents7">Permissions included:</Text>

                         <Flex direction="column" css={{ gap: '$2' }}>
                              {role.permissions.slice(0, 3).map((permission, index) => (
                                   <Flex key={index} align="center" css={{ gap: '$2' }}>
                                        <CheckCircle size={14} color={role.color} />
                                        <Text size="$xs">
                                             {permission.replace(/_/g, ' ')}
                                        </Text>
                                   </Flex>
                              ))}

                              {role.permissions.length > 3 && (
                                   <Text size="$xs" color="$accents7">
                                        +{role.permissions.length - 3} more permissions
                                   </Text>
                              )}
                         </Flex>

                         <Progress
                              value={(role.permissions.length / 10) * 100}
                              color="primary"
                              size="sm"
                              css={{ mt: '$2' }}
                         />

                         <Flex justify="between" align="center" css={{ mt: '$2' }}>
                              <Flex align="center" css={{ gap: '$2' }}>
                                   <Users size={14} color="$accents7" />
                                   <Text size="$xs" color="$accents7">
                                        {role.memberCount} members
                                   </Text>
                              </Flex>

                              <Button
                                   auto
                                   size="sm"
                                   css={{ bg: role.color }}
                                   onPress={() => onClick?.(role)}
                              >
                                   Select Role
                              </Button>
                         </Flex>
                    </Flex>
               </Card.Body>
          </Card>
     );
};