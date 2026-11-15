import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from '@/components/ui/dialog';

export const AddUser = () => {
   const [visible, setVisible] = React.useState(false);
   const handler = () => setVisible(true);
   const closeHandler = () => setVisible(false);

   return (
      <div>
         <Button onClick={handler}>Add User</Button>
         <Dialog open={visible} onOpenChange={setVisible}>
            <DialogContent className="sm:max-w-[600px]">
               <DialogHeader>
                  <DialogTitle>Add new user</DialogTitle>
               </DialogHeader>

               <div className="flex flex-col gap-6 py-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                     <div className="flex-1 space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="First Name" />
                     </div>
                     <div className="flex-1 space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Last Name" />
                     </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                     <div className="flex-1 space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Email" />
                     </div>
                     <div className="flex-1 space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="Phone Number" />
                     </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                     <div className="flex-1 space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" placeholder="Department" />
                     </div>
                     <div className="flex-1 space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" placeholder="Company" />
                     </div>
                  </div>
               </div>

               <DialogFooter>
                  <Button onClick={closeHandler}>Add User</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
};