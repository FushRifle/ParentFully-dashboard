import React, { useMemo, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from '@/components/ui/pagination';
import { RenderCell } from '@/components/table/render-cell';
import type { User } from '@/types/api';
import { useUser } from '@/hooks/auth/useGetUserList';
import { Search } from 'lucide-react';
import { TableExport } from '@/components/shared/table-export';

const ITEMS_PER_PAGE = 10;
const COLUMNS = [
   { name: 'AVATAR', uid: 'avatar' },
   { name: 'NAME', uid: 'name' },
   { name: 'EMAIL', uid: 'email' },
   { name: 'ROLE', uid: 'role' },
   { name: 'STATUS', uid: 'status' },
   { name: 'POINTS', uid: 'points' },
   { name: 'ACTIONS', uid: 'actions' },
];

const generateTempId = (user: User, index: number) =>
   `${user.id}-${user.email || index}-${index}`;

const prepareTableItems = (users: User[]) =>
   users.map((user, index) => ({
      ...user,
      key: generateTempId(user, index),
      avatar:
         typeof user?.user?.profile_image === 'string' ? user.user.profile_image : '',
      role: user.has_child ? 'Parent' : 'User',
      status: user.has_completed_onboarding ? 'Active' : 'Pending',
   }));

export const TableWrapper = () => {
   const [currentPage, setCurrentPage] = useState(1);
   const [query, setQuery] = useState('');

   const { users = [], allUsers = [], loading, error, totalPages } = useUser(
      currentPage,
      ITEMS_PER_PAGE,
   );

   const handlePageChange = useCallback((page: number) => {
      setCurrentPage(page);
   }, []);

   const tableUsers = useMemo(() => {
      const search = query.trim().toLowerCase();
      return prepareTableItems(users).filter(
         (user) =>
            !search ||
            [user.name, user.email].some((value) =>
               String(value ?? '').toLowerCase().includes(search),
            ),
      );
   }, [query, users]);

   return (
      <div className="flex w-full flex-col gap-4 p-8">
         <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
               <h3 className="m-0 text-2xl font-semibold">User Management</h3>
               <p className="text-xs text-muted-foreground">
                  Manage your ParentFully Users. Showing {ITEMS_PER_PAGE} users per page.
                  {!loading && allUsers.length > 0 && ` Total users: ${allUsers.length}`}
               </p>
            </div>
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                     aria-label="Search users"
                     placeholder="Search name or email…"
                     value={query}
                     onChange={(event) => setQuery(event.target.value)}
                     className="w-64 pl-9"
                  />
               </div>
               <TableExport
                  rows={tableUsers}
                  filename="users"
                  title="Users report"
                  columns={[
                     { key: 'name', label: 'Name' },
                     { key: 'email', label: 'Email' },
                     { key: 'role', label: 'Role' },
                     { key: 'status', label: 'Status' },
                     { key: 'points', label: 'Points' },
                  ]}
               />
            </div>
         </div>

         {loading && allUsers.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">Fetching users...</div>
         ) : error ? (
            <div className="py-20 text-center">
               <p className="font-semibold text-red-500">System Error</p>
               <p className="text-muted-foreground">{error}</p>
            </div>
         ) : (
            <>
               <div className="rounded-xl border">
                  <Table>
                     <TableHeader>
                        <TableRow>
                           {COLUMNS.map((column) => (
                              <TableHead
                                 key={column.uid}
                                 className={column.uid === 'actions' ? 'text-center' : undefined}
                              >
                                 {column.name}
                              </TableHead>
                           ))}
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {tableUsers.map((item) => (
                           <TableRow key={item.key}>
                              {COLUMNS.map((column) => (
                                 <TableCell
                                    key={column.uid}
                                    className={column.uid === 'actions' ? 'text-center' : undefined}
                                 >
                                    <RenderCell user={item} columnKey={column.uid} />
                                 </TableCell>
                              ))}
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </div>

               <div className="flex flex-wrap items-center justify-between gap-4 px-2 pt-4">
                  <p className="text-sm text-muted-foreground">
                     Page <b>{currentPage}</b> of <b>{totalPages}</b>
                  </p>
                  <div className="flex items-center gap-4">
                     <p className="text-sm text-muted-foreground">
                        Showing <b>{users.length}</b> of <b>{allUsers.length}</b> users
                        {loading && <span className="ml-2 text-xs">(loading…)</span>}
                     </p>
                     <Pagination>
                        <PaginationContent>
                           <PaginationItem>
                              <PaginationPrevious
                                 onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                 className={
                                    currentPage === 1
                                       ? 'pointer-events-none opacity-50'
                                       : 'cursor-pointer'
                                 }
                              />
                           </PaginationItem>
                           <PaginationItem>
                              <PaginationLink isActive>{currentPage}</PaginationLink>
                           </PaginationItem>
                           <PaginationItem>
                              <PaginationNext
                                 onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                 className={
                                    currentPage === totalPages
                                       ? 'pointer-events-none opacity-50'
                                       : 'cursor-pointer'
                                 }
                              />
                           </PaginationItem>
                        </PaginationContent>
                     </Pagination>
                  </div>
               </div>
            </>
         )}
      </div>
   );
};