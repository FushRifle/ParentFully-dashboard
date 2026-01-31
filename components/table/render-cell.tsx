import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { IconButton } from './table.styled';
import { EyeIcon } from '../icons/table/eye-icon';
import { EditIcon } from '../icons/table/edit-icon';
import { DeleteIcon } from '../icons/table/delete-icon';
import { Box } from '../styles/box';
import {
   User as NextUser,
   Tooltip,
   Badge,
   Text,
} from '@nextui-org/react';

const getAvatarFallback = (name: string) =>
   name ? name.charAt(0).toUpperCase() : 'U';

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
            <NextUser
               src={avatar || undefined}
               name={undefined}
               size="sm"
               css={{ cursor: 'pointer' }}
               onClick={handleDetails}
            >
               {!avatar && (
                  <Box
                     css={{
                        size: 32,
                        borderRadius: '$full',
                        bg: '$accents2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '$sm',
                        color: '$foreground',
                        userSelect: 'none',
                     }}
                  >
                     {getAvatarFallback(name)}
                  </Box>
               )}
            </NextUser>
         );

      case 'name':
         return (
            <Text
               css={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
               }}
               onClick={handleDetails}
            >
               {name}
               {is_premium && (
                  <Badge
                     color="success"
                     variant="flat"
                     css={{ ml: '$2' }}
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
