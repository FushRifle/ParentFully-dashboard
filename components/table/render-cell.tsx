import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EyeIcon } from '@/components/icons/table/eye-icon';
import { EditIcon } from '@/components/icons/table/edit-icon';
import { DeleteIcon } from '@/components/icons/table/delete-icon';
import ChatAvatarWrapper from '@/components/Avatar/ChatAvatarWrapper';

const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
   if (!status) return 'outline';
   const s = status.toLowerCase();
   if (s.includes('active') || s.includes('enabled')) return 'default';
   if (s.includes('inactive') || s.includes('disabled') || s.includes('suspended')) return 'destructive';
   if (s.includes('pending') || s.includes('waiting')) return 'secondary';
   return 'outline';
};

interface RenderCellProps {
   user: any;
   columnKey: string;
}

const RenderCellComponent = ({ user, columnKey }: RenderCellProps) => {
   const router = useRouter();
   const u = { ...user, ...(user.user ?? {}) };
   const profile_image = u.profile_image;
   const userPhoto = user.user?.profile_image || u.photo;

   const {
      name = 'Unknown',
      email = 'N/A',
      role = 'N/A',
      status = 'unknown',
      points = 0,
      is_premium = false,
      id,
      userId,
      _id,
   } = u;

   const resolvedUserId = id ?? userId ?? _id;

   const handleDetails = useCallback(() => {
      if (resolvedUserId) router.push(`/customers/${resolvedUserId}`);
   }, [router, resolvedUserId]);

   switch (columnKey) {
      case 'avatar':
         return (
            <div className="flex cursor-pointer items-center justify-center" onClick={handleDetails}>
               <ChatAvatarWrapper
                  photo={userPhoto}
                  profile_image={profile_image}
                  contactName={name}
                  phoneNumber={u.phoneNumber || u.phone}
                  size={40}
                  variant={is_premium ? 'primary' : 'secondary'}
                  borderWidth={is_premium ? 2 : 1}
               />
            </div>
         );

      case 'name':
         return (
            <button
               onClick={handleDetails}
               className="flex cursor-pointer items-center gap-2 font-semibold hover:underline"
            >
               {name}
               {is_premium && <Badge variant="default">Premium</Badge>}
            </button>
         );

      case 'email':
         return <span className="text-sm">{email}</span>;

      case 'role':
         return <Badge variant="default">{role}</Badge>;

      case 'status':
         return <Badge variant={getStatusVariant(status)}>{status}</Badge>;

      case 'points':
         return <span className="text-sm">{points}</span>;

      case 'actions':
         return (
            <div className="flex gap-3">
               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDetails} aria-label="Details">
                  <EyeIcon size={20} fill="#0072F5" />
               </Button>
               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => console.log('Edit', resolvedUserId)} aria-label="Edit">
                  <EditIcon size={20} fill="#7828C8" />
               </Button>
               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => console.log('Delete', resolvedUserId)} aria-label="Delete">
                  <DeleteIcon size={20} fill="#FF0080" />
               </Button>
            </div>
         );

      default:
         return <span className="text-sm">{u[columnKey] ?? 'N/A'}</span>;
   }
};

export const RenderCell = memo(
   RenderCellComponent,
   (prev, next) => prev.columnKey === next.columnKey && prev.user === next.user,
);