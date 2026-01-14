import React, { useMemo, useState, useCallback } from 'react';
import {
   Table, Loading, Text, Button,
   Grid, Spacer
} from '@nextui-org/react';
import { Box } from '../styles/box';
import { RenderCell } from './render-cell';
import { useSequentialUsers } from '../../hooks/accounts/useAccounts';
import type { User } from '../../types/api';

const ITEMS_PER_PAGE = 20;

const COLUMNS = [
   { name: 'AVATAR', uid: 'avatar' },
   { name: 'NAME', uid: 'name' },
   { name: 'EMAIL', uid: 'email' },
   { name: 'ROLE', uid: 'role' },
   { name: 'STATUS', uid: 'status' },
   { name: 'POINTS', uid: 'points' },
   { name: 'ACTIONS', uid: 'actions' },
];

const prepareTableItems = (users: { user: User }[]) => {
   return users.map(({ user }) => ({
      ...user,
      key: user.id?.toString() || Math.random().toString(),
      avatar: typeof user.profile_image === 'string' ? user.profile_image : '',
      role: user.has_child ? 'Parent' : 'User',
      status: user.has_completed_onboarding ? 'Active' : 'Pending',
   }));
};

export const TableWrapper = () => {
   const [currentPage, setCurrentPage] = useState(1);
   const { users: rawUsers = [], loading, error, refresh, hasMore, loadMore } = useSequentialUsers();

   const tableUsers = useMemo(() => prepareTableItems(Array.isArray(rawUsers) ? rawUsers : []), [rawUsers]);

   const paginatedUsers = useMemo(() => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return tableUsers.slice(start, start + ITEMS_PER_PAGE);
   }, [tableUsers, currentPage]);

   const totalPages = Math.max(1, Math.ceil(tableUsers.length / ITEMS_PER_PAGE));

   const handlePageChange = useCallback((page: number) => {
      setCurrentPage(page);
   }, []);

   const handleRefresh = useCallback(() => {
      refresh();
      setCurrentPage(1);
   }, [refresh]);

   return (
      <Box css={{ p: '$8', width: '100%', display: 'flex', flexDirection: 'column', gap: '$4' }}>
         {/* Header */}
         <Grid.Container justify="space-between" alignItems="center">
            <Grid>
               <Text h3 css={{ m: 0 }}>User Management</Text>
               <Text size="$xs" color="$accents7">Manage your organization's members and roles</Text>
            </Grid>
            <Grid>
               <Button
                  auto flat color="primary"
                  onClick={handleRefresh} disabled={loading}
                  icon={loading && <Loading color="currentColor" size="xs" />}
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
               <Spacer y={0.5} />
               <Button auto light color="error" onClick={handleRefresh} css={{ margin: '0 auto' }}>Retry Connection</Button>
            </Box>
         ) : tableUsers.length === 0 ? (
            <Box css={{ py: '$20', textAlign: 'center', border: '1px dashed $accents3', borderRadius: '$lg' }}>
               <Text color="$accents6">No user records found in the database.</Text>
            </Box>
         ) : (
            <>
               <Table
                  aria-label="User directory table"
                  containerCss={{ height: 'auto', minWidth: '100%' }}
                  selectionMode="none"
                  shadow={false}
                  bordered
               >
                  <Table.Header columns={COLUMNS}>
                     {(column) => (
                        <Table.Column key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
                           {column.name}
                        </Table.Column>
                     )}
                  </Table.Header>

                  <Table.Body items={paginatedUsers}>
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
                     shadow noMargin align="center"
                     rowsPerPage={ITEMS_PER_PAGE}
                     onPageChange={handlePageChange}
                     total={totalPages}
                  />
               </Table>

               <Grid.Container justify="space-between" css={{ px: '$6', pt: '$4' }}>
                  <Grid>
                     <Text size="$sm" color="$accents6">
                        Showing <b>{paginatedUsers.length}</b> of <b>{tableUsers.length}</b> users
                     </Text>
                  </Grid>
                  <Grid>
                     {hasMore && (
                        <Button light size="sm" onClick={loadMore} disabled={loading}>
                           {loading ? <Loading size="xs" /> : 'Fetch More Results'}
                        </Button>
                     )}
                  </Grid>
               </Grid.Container>
            </>
         )}
      </Box>
   );
};
