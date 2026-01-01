import { User, Tooltip, Badge } from '@nextui-org/react';
import React from 'react';
import { useRouter } from 'next/router';
import { IconButton } from './table.styled';
import { EyeIcon } from '../icons/table/eye-icon';
import { EditIcon } from '../icons/table/edit-icon';
import { DeleteIcon } from '../icons/table/delete-icon';

export const RenderCell = ({ user, columnKey }: { user: any; columnKey: string }) => {
   const router = useRouter()

   const handleDetailsNavigation = () => {
      if (!user?.id) return
      router.push(`/accounts/${user.id}`)
   }

   switch (columnKey) {
      case 'name':
         return (
            <User
               src={user.avatar}
               name={user.name}
               css={{ p: 0, cursor: 'pointer' }}
               onClick={handleDetailsNavigation}
            >
               {user.email}
            </User>
         )

      case 'status':
         return (
            <Badge
               variant="flat"
               color={user.status === 'active' ? 'success' : 'error'}
            >
               {user.status}
            </Badge>
         )

      case 'actions':
         return (
            <div style={{ display: 'flex', gap: '15px' }}>
               <Tooltip content="Details">
                  <IconButton onClick={handleDetailsNavigation}>
                     <EyeIcon size={20} fill="#979797" />
                  </IconButton>
               </Tooltip>

               <Tooltip content="Edit user">
                  <IconButton onClick={() => console.log('Edit user', user.id)}>
                     <EditIcon size={20} fill="#979797" />
                  </IconButton>
               </Tooltip>

               <Tooltip content="Delete user" color="error">
                  <IconButton onClick={() => console.log('Delete user', user.id)}>
                     <DeleteIcon size={20} fill="#FF0080" />
                  </IconButton>
               </Tooltip>
            </div>
         )

      default:
         return user[columnKey]
   }
}
