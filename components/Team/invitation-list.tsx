import React from 'react';
import { Card, Badge, Text, Button } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Invitation } from './data';
import { Mail, Clock, User, X } from 'lucide-react';

interface InvitationListProps {
     invitations: Invitation[];
     onResend?: (invitation: Invitation) => void;
     onRevoke?: (invitation: Invitation) => void;
}

export const InvitationList: React.FC<InvitationListProps> = ({
     invitations,
     onResend,
     onRevoke
}) => {
     const getStatusColor = (status: Invitation['status']) => {
          switch (status) {
               case 'pending': return 'warning';
               case 'accepted': return 'success';
               case 'expired': return 'error';
               default: return 'default';
          }
     };

     return (
          <Card css={{ p: '$6' }}>
               <Card.Header>
                    <Flex justify="between" align="center" css={{ width: '100%' }}>
                         <Text h4>Pending Invitations</Text>
                         <Text size="$sm" color="$accents7">
                              {invitations.length} pending
                         </Text>
                    </Flex>
               </Card.Header>

               <Card.Body css={{ py: '$4' } as any}>
                    {invitations.length === 0 ? (
                         <Flex justify="center" align="center" css={{ p: '$8' }}>
                              <Text color="$accents7">No pending invitations</Text>
                         </Flex>
                    ) : (
                         <Flex direction="column" css={{ gap: '$4' }}>
                              {invitations.map((invitation) => (
                                   <Card key={invitation.id} variant="flat" css={{ p: '$4' }}>
                                        <Flex justify="between" align="center">
                                             <Flex align="center" css={{ gap: '$4' }}>
                                                  <Mail size={20} color="$accents7" />
                                                  <Flex direction="column" css={{ gap: '$1' }}>
                                                       <Text b size="$sm">{invitation.email}</Text>
                                                       <Flex align="center" css={{ gap: '$2' }}>
                                                            <Badge size="xs" variant="flat" color="primary">
                                                                 {invitation.role}
                                                            </Badge>
                                                            <Text size="$xs" color="$accents7">
                                                                 Invited by {invitation.invitedBy}
                                                            </Text>
                                                       </Flex>
                                                  </Flex>
                                             </Flex>

                                             <Flex align="center" css={{ gap: '$4' }}>
                                                  <Flex align="center" css={{ gap: '$2' }}>
                                                       <Clock size={14} color="$accents7" />
                                                       <Text size="$xs" color="$accents7">
                                                            {invitation.expiresIn}
                                                       </Text>
                                                  </Flex>

                                                  <Badge
                                                       size="sm"
                                                       variant="flat"
                                                       color={getStatusColor(invitation.status)}
                                                  >
                                                       {invitation.status}
                                                  </Badge>

                                                  <Flex css={{ gap: '$2' }}>
                                                       {invitation.status === 'pending' && (
                                                            <Button
                                                                 auto
                                                                 size="sm"
                                                                 light
                                                                 onPress={() => onResend?.(invitation)}
                                                            >
                                                                 Resend
                                                            </Button>
                                                       )}
                                                       <Button
                                                            auto
                                                            size="sm"
                                                            light
                                                            color="error"
                                                            icon={<X size={16} />}
                                                            onPress={() => onRevoke?.(invitation)}
                                                       />
                                                  </Flex>
                                             </Flex>
                                        </Flex>
                                   </Card>
                              ))}
                         </Flex>
                    )}
               </Card.Body>
          </Card>
     );
};