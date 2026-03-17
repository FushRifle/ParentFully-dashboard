import React, { useMemo, useState, useCallback, useEffect } from 'react';
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

const ITEMS_PER_PAGE = 15;
const COLUMNS: { name: string; uid: string }[] = [
   { name: 'AVATAR', uid: 'avatar' },
   { name: 'NAME', uid: 'name' },
   { name: 'EMAIL', uid: 'email' },
   { name: 'ROLE', uid: 'role' },
   { name: 'STATUS', uid: 'status' },
   { name: 'POINTS', uid: 'points' },
   { name: 'ACTIONS', uid: 'actions' },
];
const generateTempId = (user: User, index: number) =>
   `user-${index}-${user.id}`;

const prepareTableItems = (users: User[]) =>
   users.map((user, index) => ({
      ...user,
      key: generateTempId(user, index),
      avatar: typeof user?.user?.profile_image === 'string' ? user.user.profile_image : '',
      role: user.has_child ? 'Parent' : 'User',
      status: user.has_completed_onboarding ? 'Active' : 'Pending',
   }));

export const TableWrapper = () => {
   const [currentPage, setCurrentPage] = useState(1);
   const [allUsers, setAllUsers] = useState<User[]>([]);
   const [loadingMore, setLoadingMore] = useState(false);
   const [currentBatch, setCurrentBatch] = useState(1);
   const [hasMore, setHasMore] = useState(true);

   const {
      users = [],
      loading,
      error,
      refresh,
   } = useUser();

   useEffect(() => {
      if (users.length > 0) {
         setAllUsers(prev => {
            if (prev.length > 0) {
               const existingIds = new Set(prev.map(u => u.id));
               const newIds = users.filter(u => !existingIds.has(u.id));

               if (newIds.length === 0) {
                  setHasMore(false);
                  setLoadingMore(false);
                  return prev;
               }
               return [...prev, ...users];
            }
            return users;
         });

         setLoadingMore(false);
      }
   }, [users, currentBatch]);

   const loadNextBatch = useCallback(async () => {
      if (loading || loadingMore || !hasMore) return;

      setLoadingMore(true);
      setCurrentBatch(prev => prev + 1);
      await refresh();
   }, [loading, loadingMore, hasMore, currentBatch, refresh]);

   // Initial load
   useEffect(() => {
      loadNextBatch();
   }, []);

   const tableUsers = useMemo(() => {
      return prepareTableItems(allUsers);
   }, [allUsers]);

   const paginatedUsers = useMemo(() => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const pageUsers = tableUsers.slice(start, end);

      return pageUsers;
   }, [tableUsers, currentPage]);

   const totalPages = Math.max(1, Math.ceil(tableUsers.length / ITEMS_PER_PAGE));

   const handlePageChange = useCallback(
      (page: number) => {
         setCurrentPage(page);

         if (page >= totalPages && hasMore && !loading && !loadingMore) {
            loadNextBatch();
         }
      },
      [totalPages, hasMore, loading, loadingMore, loadNextBatch]
   );

   const handleRefresh = useCallback(() => {
      setAllUsers([]);
      setCurrentPage(1);
      setCurrentBatch(1);
      setHasMore(true);
      setLoadingMore(false);
      refresh();
   }, [refresh]);

   const isLoading = loading || (loadingMore && allUsers.length === 0);
   const isFetchingMore = loadingMore && allUsers.length > 0;

   return (
      <Box css={{ p: '$8', width: '100%', display: 'flex', flexDirection: 'column', gap: '$4' }}>
         <Grid.Container justify="space-between" alignItems="center">
            <Grid>
               <Text h3 css={{ m: 0 }}>User Management</Text>
               <Text size="$xs" color="$accents7">
                  Manage your ParentFully Users.
               </Text>
            </Grid>
            <Grid>
               <Button
                  auto
                  flat
                  color="primary"
                  onClick={handleRefresh}
                  disabled={loading || loadingMore}
               >
                  {(loading || loadingMore) ? <Loading size="xs" color="currentColor" /> : 'Refresh Data'}
               </Button>
            </Grid>
         </Grid.Container>

         <Spacer y={1} />

         {isLoading ? (
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
                     loadingState={isFetchingMore ? 'loadingMore' : 'idle'}
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
                           Total users loaded: <b>{tableUsers.length}</b>
                        </Text>
                        {hasMore && !isFetchingMore && (
                           <Button
                              size="xs"
                              light
                              auto
                              onClick={loadNextBatch}
                              disabled={loadingMore}
                           >
                              Load More
                           </Button>
                        )}
                        {isFetchingMore && (
                           <Loading size="xs" />
                        )}
                     </Box>
                  </Grid>
               </Grid.Container>
            </>
         )}
      </Box>
   );
};