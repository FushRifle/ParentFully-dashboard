import React, { useState } from 'react';
import {
     Modal,
     Input,
     Text,
     Button,
     Checkbox,
} from '@nextui-org/react';

import { Select } from '../styles/select';
import { Flex } from '../styles/flex';
import { RolePreset, Role } from './data';
import { Mail, UserPlus } from 'lucide-react';

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
     rolePresets
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
          <Modal
               open={open}
               onClose={onClose}
               closeButton
               aria-labelledby="add-member-modal"
          >
               <Modal.Header>
                    <Flex align="center" css={{ gap: '$4' }}>
                         <UserPlus size={24} />
                         <Text h3>Add Team Member</Text>
                    </Flex>
               </Modal.Header>

               <Modal.Body>
                    <Input
                         fullWidth
                         label="Email Address"
                         placeholder="member@company.com"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         contentLeft={<Mail size={16} />}
                         css={{ mb: '$4' }}
                    />


                    <Select
                         fullWidth
                         placeholder="Select a role"
                         value={role}
                         onChange={(value) => setRole(value as Role)}
                         css={{ mb: '$4' }}
                         options={rolePresets.map(rolePreset => ({
                              value: rolePreset.id,
                              label: (
                                   <Text size="$sm" css={{ color: rolePreset.color }}>
                                        {rolePreset.name}
                                   </Text>
                              ),
                         }))}
                    />


                    <Checkbox
                         isSelected={sendInvitation}
                         onChange={setSendInvitation}
                         css={{ mt: '$2' }}
                    >
                         Send invitation email
                    </Checkbox>

                    <Text size="$xs" color="$accents7" css={{ mt: '$2' }}>
                         An invitation link will be sent to the email address above
                    </Text>
               </Modal.Body>

               <Modal.Footer>
                    <Button auto flat onPress={onClose}>
                         Cancel
                    </Button>
                    <Button
                         auto
                         onPress={handleSubmit}
                         disabled={!email || !role || loading}
                         css={{ bg: '#3f3bef' }}
                    >
                         {sendInvitation ? 'Send Invitation' : 'Add Member'}
                    </Button>
               </Modal.Footer>
          </Modal>
     );
};