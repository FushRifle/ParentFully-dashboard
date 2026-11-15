import React, { useState } from 'react';
import { Mail, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
     Dialog,
     DialogContent,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from '@/components/ui/dialog';
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from '@/components/ui/select';
import { RolePreset, Role } from './data';

interface AddMemberModalProps {
     open: boolean;
     onClose: () => void;
     onAdd: (data: { email: string; role: Role; sendInvitation: boolean }) => void;
     rolePresets: RolePreset[];
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
     open,
     onClose,
     onAdd,
     rolePresets,
}) => {
     const [email, setEmail] = useState('');
     const [role, setRole] = useState<Role>('viewer');
     const [sendInvitation, setSendInvitation] = useState(true);
     const [loading, setLoading] = useState(false);

     const handleSubmit = async () => {
          if (!email || !role) return;
          setLoading(true);
          try {
               await onAdd({ email, role, sendInvitation });
               setEmail('');
               setRole('viewer');
               onClose();
          } finally {
               setLoading(false);
          }
     };

     return (
          <Dialog open={open} onOpenChange={onClose}>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle className="flex items-center gap-3">
                              <UserPlus size={20} />
                              Add Team Member
                         </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-4">
                         <div className="flex flex-col gap-1.5">
                              <Label htmlFor="member-email">Email Address</Label>
                              <div className="relative">
                                   <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                   <Input
                                        id="member-email"
                                        type="email"
                                        placeholder="member@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9"
                                   />
                              </div>
                         </div>

                         <div className="flex flex-col gap-1.5">
                              <Label htmlFor="member-role">Role</Label>
                              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                                   <SelectTrigger id="member-role">
                                        <SelectValue placeholder="Select a role" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        {rolePresets.map((preset) => (
                                             <SelectItem key={preset.id} value={preset.id}>
                                                  <span style={{ color: preset.color }}>{preset.name}</span>
                                             </SelectItem>
                                        ))}
                                   </SelectContent>
                              </Select>
                         </div>

                         <div className="flex items-center gap-2">
                              <Checkbox
                                   id="send-invitation"
                                   checked={sendInvitation}
                                   onCheckedChange={(v) => setSendInvitation(v === true)}
                              />
                              <Label htmlFor="send-invitation" className="font-normal">
                                   Send invitation email
                              </Label>
                         </div>

                         <p className="text-xs text-muted-foreground">
                              An invitation link will be sent to the email address above
                         </p>
                    </div>

                    <DialogFooter>
                         <Button variant="secondary" onClick={onClose}>
                              Cancel
                         </Button>
                         <Button onClick={handleSubmit} disabled={!email || !role || loading}>
                              {sendInvitation ? 'Send Invitation' : 'Add Member'}
                         </Button>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     );
};