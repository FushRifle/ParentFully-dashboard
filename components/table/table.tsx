// components/TableWrapper.tsx
import React, { useMemo, useState, useCallback } from 'react';
import { Box } from '../styles/box';
import { RenderCell } from './render-cell';
import { usePagedUsers } from '../../hooks/accounts/useAccounts';
import type { User } from '../../types/api';
import {
   Table,
   Loading,
   Text,
   Button,
   Grid,
   Spacer,
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

const prepareTableItems = (users: { user: User }[]) =>
   users.map(({ user }) => ({
      ...user,
      key: String(user.id),
      avatar: typeof user.profile_image === 'string' ? user.profile_image : '',
      role: user.has_child ? 'Parent' : 'User',
      status: user.has_completed_onboarding ? 'Active' : 'Pending',
   }));

export const TableWrapper = () => {
   const [currentPage, setCurrentPage] = useState(1);
   const {
      users: rawUsers = [],
      loading,
      error,
      refresh,
      loadPage,
   } = usePagedUsers();

   const tableUsers = useMemo(() => prepareTableItems(rawUsers as any), [rawUsers]);

   const paginatedUsers = useMemo(() => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return tableUsers.slice(start, start + ITEMS_PER_PAGE);
   }, [tableUsers, currentPage]);

   const loadedPages = Math.max(
      1,
      Math.ceil(tableUsers.length / ITEMS_PER_PAGE)
   );

   const handlePageChange = useCallback(
      (page: number) => {
         setCurrentPage(page);
         loadPage(page);
      },
      [loadPage]
   );

   const handleRefresh = useCallback(() => {
      setCurrentPage(1);
      refresh();
   }, [refresh]);

   return (
      <Box css={{ p: '$8', width: '100%', display: 'flex', flexDirection: 'column', gap: '$4' }}>
         <Grid.Container justify="space-between" alignItems="center">
            <Grid>
               <Text h3 css={{ m: 0 }}>User Management</Text>
               <Text size="$xs" color="$accents7">
                  Manage your organization's members and roles
               </Text>
            </Grid>
            <Grid>
               <Button
                  auto
                  flat
                  color="primary"
                  onClick={handleRefresh}
                  disabled={loading}
                  icon={loading && <Loading size="xs" />}
               >
                  {!loading && 'Refresh Data'}
               </Button>
            </Grid>
         </Grid.Container>

         <Spacer y={1} />

         {loading && tableUsers.length === 0 ? (
            <Box css={{ py: '$20', textAlign: 'center' }}>
               <Loading size="xl">Fetching records...</Loading>
            </Box>
         ) : error ? (
            <Box css={{ py: '$20', textAlign: 'center' }}>
               <Text color="error" b>System Error</Text>
               <Text color="$accents8">{error}</Text>
            </Box>
         ) : (
            <>
               <Table
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
                     items={paginatedUsers}
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
                     total={loadedPages}
                     page={currentPage}
                     onPageChange={handlePageChange}
                  />
               </Table>

               <Grid.Container justify="space-between" css={{ px: '$6', pt: '$4' }}>
                  <Grid>
                     <Text size="$sm" color="$accents6">
                        Showing <b>{paginatedUsers.length}</b> of <b>{tableUsers.length}</b> users
                     </Text>
                  </Grid>
               </Grid.Container>
            </>
         )}
      </Box>
   );
};
