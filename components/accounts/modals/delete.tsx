import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogCancel,
     AlertDialogContent,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../../ui/button";

interface DeleteUserModalProps {
     visible: boolean;
     closeHandler: () => void;
     userName: string;
     onConfirm: () => void;
}

export const DeleteUserModal = ({
     visible,
     closeHandler,
     userName,
     onConfirm,
}: DeleteUserModalProps) => {
     return (
          <AlertDialog open={visible} onOpenChange={(open) => !open && closeHandler()}>
               <AlertDialogContent>
                    <AlertDialogHeader>
                         <AlertDialogTitle>Confirm Suspension</AlertDialogTitle>
                         <AlertDialogDescription>
                              Are you sure you want to suspend <strong>{userName}</strong>? They
                              will be unable to use their account until reactivated.
                         </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                         <AlertDialogCancel onClick={closeHandler}>
                              Cancel
                         </AlertDialogCancel>
                         <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={onConfirm}
                         >
                              Suspend User
                         </AlertDialogAction>
                    </AlertDialogFooter>
               </AlertDialogContent>
          </AlertDialog>
     );
};