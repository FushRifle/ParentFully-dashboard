import React, { useMemo, useState, useCallback } from 'react';
import { Box } from '../styles/box';
import { RenderCell } from './render-cell';
import type { User } from '../../types/api';
import { useUser } from '@/hooks/auth/useGetUserList';
import {
   Table,
   Loading,
   Text,
   Button,
   Grid,
   Spacer
} from '@nextui-org/react';

const ITEMS_PER_PAGE = 10;
const COLUMNS: { name: string; uid: string }[] = [
   { name: 'AVATAR', uid: 'avatar' },
   { name: 'NAME', uid: 'name' },
   { name: 'EMAIL', uid: 'email' },
   { name: 'ROLE', uid: 'role' },
   { name: 'STATUS', uid: 'status' },
   { name: 'POINTS', uid: 'points' },
   { name: 'ACTIONS', uid: 'actions' },
];

const generateTempId = (user: User, index: number) => {
   return `${user.id}-${user.email || index}-${index}`;
};

const prepareTableItems = (users: User[]) =>
   users.map((user, index) => ({
      ...user,
      key: generateTempId(user, index),
      avatar: typeof user?.user?.profile_image === 'string' ?
         user.user.profile_image : '',
      role: user.has_child ? 'Parent' : 'User',
      status: user.has_completed_onboarding ? 'Active' : 'Pending',
   }));

export const TableWrapper = () => {
   const [currentPage, setCurrentPage] = useState(1);

   const {
      users = [],
      allUsers = [],
      loading,
      error,
      totalPages,
      refresh,
   } = useUser(currentPage, ITEMS_PER_PAGE);

   const handlePageChange = useCallback(
      (page: number) => {
         console.log('Changing to page:', page);
         setCurrentPage(page);
      },
      []
   );

   const handleRefresh = useCallback(() => {
      setCurrentPage(1);
      refresh();
   }, [refresh]);

   const tableUsers = useMemo(() => {
      console.log('Preparing table items for', users.length, 'users');
      return prepareTableItems(users);
   }, [users]);

   const tableKey = useMemo(() => `table-${currentPage}`, [currentPage]);

   return (
      <Box css={{ p: '$8', width: '100%', display: 'flex', flexDirection: 'column', gap: '$4' }}>
         <Grid.Container justify="space-between" alignItems="center">
            <Grid>
               <Text h3 css={{ m: 0 }}>User Management</Text>
               <Text size="$xs" color="$accents7">
                  Manage your ParentFully Users. Showing {ITEMS_PER_PAGE} users per page.
                  {!loading && allUsers.length > 0 && ` Total users: ${allUsers.length}`}
               </Text>
            </Grid>
            <Grid>
               <Button
                  auto
                  flat
                  color="primary"
                  onClick={handleRefresh}
                  disabled={loading}
               >
                  {loading ? <Loading size="xs" color="currentColor" /> : 'Refresh Data'}
               </Button>
            </Grid>
         </Grid.Container>

         <Spacer y={1} />

         {loading && allUsers.length === 0 ? (
            <Box css={{ py: '$20', textAlign: 'center' }}>
               <Loading size="xl">Fetching users...</Loading>
            </Box>
         ) : error ? (
            <Box css={{ py: '$20', textAlign: 'center' }}>
               <Text color="error" b>System Error</Text>
               <Text color="$accents8">{error}</Text>
            </Box>
         ) : (
            <>
               <Table
                  key={tableKey}
                  aria-label="User directory table"
                  selectionMode="none"
                  shadow={false}
                  bordered
               >
                  <Table.Header columns={COLUMNS}>
                     {(column) => (
                        <Table.Column
                           key={column.uid}
                           align={column.uid === 'actions' ? 'center' : 'start'}
                        >
                           {column.name}
                        </Table.Column>
                     )}
                  </Table.Header>

                  <Table.Body
                     items={tableUsers}
                     loadingState={loading ? 'loading' : 'idle'}
                  >
                     {(item) => (
                        <Table.Row key={item.key}>
                           {(columnKey) => (
                              <Table.Cell>
                                 <RenderCell user={item} columnKey={columnKey as string} />
                              </Table.Cell>
                           )}
                        </Table.Row>
                     )}
                  </Table.Body>

                  <Table.Pagination
                     shadow
                     noMargin
                     align="center"
                     rowsPerPage={ITEMS_PER_PAGE}
                     total={totalPages}
                     page={currentPage}
                     onPageChange={handlePageChange}
                  />
               </Table>

               <Grid.Container justify="space-between" css={{ px: '$6', pt: '$4' }}>
                  <Grid>
                     <Text size="$sm" color="$accents6">
                        Page <b>{currentPage}</b> of <b>{totalPages}</b>
                     </Text>
                  </Grid>
                  <Grid>
                     <Box css={{ display: 'flex', alignItems: 'center', gap: '$2' }}>
                        <Text size="$sm" color="$accents6">
                           Showing <b>{users.length}</b> of <b>{allUsers.length}</b> users
                        </Text>
                        {loading && <Loading size="xs" />}
                     </Box>
                  </Grid>
               </Grid.Container>
            </>
         )}
      </Box>
   );
};