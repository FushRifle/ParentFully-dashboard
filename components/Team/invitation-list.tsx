import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Invitation } from './data';
import { Mail, Clock, X } from 'lucide-react';

interface InvitationListProps {
     invitations: Invitation[];
     onResend?: (invitation: Invitation) => void;
     onRevoke?: (invitation: Invitation) => void;
}

export const InvitationList: React.FC<InvitationListProps> = ({
     invitations,
     onResend,
     onRevoke,
}) => {
     const getStatusVariant = (status: Invitation['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
          switch (status) {
               case 'pending':
                    return 'secondary';
               case 'accepted':
                    return 'default';
               case 'expired':
                    return 'destructive';
               default:
                    return 'outline';
          }
     };

     return (
          <Card className="p-6">
               <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
                    <h4 className="text-lg font-semibold">Pending Invitations</h4>
                    <span className="text-sm text-muted-foreground">{invitations.length} pending</span>
               </CardHeader>

               <CardContent className="p-0 py-4">
                    {invitations.length === 0 ? (
                         <div className="flex items-center justify-center p-8 text-muted-foreground">
                              No pending invitations
                         </div>
                    ) : (
                         <div className="flex flex-col gap-4">
                              {invitations.map((invitation) => (
                                   <div key={invitation.id} className="rounded-lg border bg-muted/30 p-4">
                                        <div className="flex items-center justify-between">
                                             <div className="flex items-center gap-4">
                                                  <Mail size={20} className="text-muted-foreground" />
                                                  <div className="flex flex-col gap-1">
                                                       <span className="text-sm font-semibold">{invitation.email}</span>
                                                       <div className="flex items-center gap-2">
                                                            <Badge variant="default" className="text-xs">
                                                                 {invitation.role}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">
                                                                 Invited by {invitation.invitedBy}
                                                            </span>
                                                       </div>
                                                  </div>
                                             </div>

                                             <div className="flex items-center gap-4">
                                                  <div className="flex items-center gap-2">
                                                       <Clock size={14} className="text-muted-foreground" />
                                                       <span className="text-xs text-muted-foreground">{invitation.expiresIn}</span>
                                                  </div>

                                                  <Badge variant={getStatusVariant(invitation.status)}>
                                                       {invitation.status}
                                                  </Badge>

                                                  <div className="flex gap-2">
                                                       {invitation.status === 'pending' && (
                                                            <Button
                                                                 variant="ghost"
                                                                 size="sm"
                                                                 onClick={() => onResend?.(invitation)}
                                                            >
                                                                 Resend
                                                            </Button>
                                                       )}
                                                       <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-500 hover:text-red-500"
                                                            onClick={() => onRevoke?.(invitation)}
                                                            aria-label="Revoke invitation"
                                                       >
                                                            <X size={16} />
                                                       </Button>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </CardContent>
          </Card>
     );
};