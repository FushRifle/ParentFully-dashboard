import React, { memo, useCallback } from 'react';
import { Box } from '../styles/box';
import { useRouter } from 'next/router';
import { IconButton } from './table.styled';
import { EyeIcon } from '../icons/table/eye-icon';
import { EditIcon } from '../icons/table/edit-icon';
import { DeleteIcon } from '../icons/table/delete-icon';
import ChatAvatarWrapper from '../Avatar/ChatAvatarWrapper';
import {
   User as NextUser,
   Tooltip,
   Badge,
   Text,
} from '@nextui-org/react';

const getStatusColor = (
   status: string
): 'success' | 'error' | 'warning' | 'default' => {
   if (!status) return 'default';

   const s = status.toLowerCase();
   if (s.includes('active') || s.includes('enabled')) return 'success';
   if (s.includes('inactive') || s.includes('disabled') || s.includes('suspended')) return 'error';
   if (s.includes('pending') || s.includes('waiting')) return 'warning';
   return 'default';
};

interface RenderCellProps {
   user: any;
   columnKey: string;
}

const RenderCellComponent = ({ user, columnKey }: RenderCellProps) => {
   const router = useRouter();
   const u = user.user ?? user;
   const profile_image = u.profile_image;
   const userPhoto = user.user?.profile_image || u.photo;

   const {
      avatar = '',
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
      if (resolvedUserId) {
         router.push(`/accounts/${resolvedUserId}`);
      }
   }, [router, resolvedUserId]);

   switch (columnKey) {
      case 'avatar':
         return (
            <Box
               css={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
               }}
               onClick={handleDetails}
            >
               <ChatAvatarWrapper
                  photo={userPhoto}
                  profile_image={profile_image}
                  contactName={name}
                  phoneNumber={u.phoneNumber || u.phone}
                  size={40}
                  variant={is_premium ? 'primary' : 'secondary'}
                  borderWidth={is_premium ? 2 : 1}
               />
            </Box>
         );

      case 'name':
         return (
            <Text
               css={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                  display: 'flex',
                  alignItems: 'center',
                  gap: '$2',
               }}
               onClick={handleDetails}
            >
               {name}
               {is_premium && (
                  <Badge
                     color="success"
                     variant="flat"
                     size="sm"
                  >
                     Premium
                  </Badge>
               )}
            </Text>
         );

      case 'email':
         return <Text size="sm">{email}</Text>;

      case 'role':
         return (
            <Badge variant="flat" color="primary" size="sm">
               {role}
            </Badge>
         );

      case 'status':
         return (
            <Badge
               variant="flat"
               color={getStatusColor(status)}
               size="sm"
            >
               {status}
            </Badge>
         );

      case 'points':
         return <Text size="sm">{points}</Text>;

      case 'actions':
         return (
            <Box css={{ display: 'flex', gap: 12 }}>
               <Tooltip content="Details" color="primary">
                  <IconButton onClick={handleDetails}>
                     <EyeIcon size={20} fill="#0072F5" />
                  </IconButton>
               </Tooltip>

               <Tooltip content="Edit user" color="secondary">
                  <IconButton onClick={() => console.log('Edit', resolvedUserId)}>
                     <EditIcon size={20} fill="#7828C8" />
                  </IconButton>
               </Tooltip>

               <Tooltip content="Delete user" color="error">
                  <IconButton onClick={() => console.log('Delete', resolvedUserId)}>
                     <DeleteIcon size={20} fill="#FF0080" />
                  </IconButton>
               </Tooltip>
            </Box>
         );

      default:
         return <Text size="sm">{u[columnKey] ?? 'N/A'}</Text>;
   }
};

export const RenderCell = memo(
   RenderCellComponent,
   (prev, next) =>
      prev.columnKey === next.columnKey &&
      prev.user === next.user
);