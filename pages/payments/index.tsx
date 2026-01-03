import React from 'react';
import { Table, User, Text, Badge, Grid } from '@nextui-org/react';

import { Box } from '../../components/styles/box';
import { Flex } from '../../components/styles/flex';
import { columns, payments } from '../../components/payments/data';

const PaymentHistory = () => {
     const renderCell = (user: any, columnKey: React.Key) => {
          const cellValue = user[columnKey as keyof typeof user];
          switch (columnKey) {
               case 'user':
                    return (
                         <User src={user.avatar} name={cellValue} css={{ p: 0 }}>
                              {user.email}
                         </User>
                    );
               case 'status':
                    return (
                         <Badge
                              variant="flat"
                              color={
                                   user.status === 'paid' ? 'success' :
                                        user.status === 'failed' ? 'error' : 'warning'
                              }
                         >
                              {user.status.toUpperCase()}
                         </Badge>
                    );
               case 'credits':
                    return (
                         <Text b size="$sm" css={{ color: '$blue600' }}>
                              {cellValue}
                         </Text>
                    );
               default:
                    return cellValue;
          }
     };

     return (
          <Box css={{ p: '$10' }}>
               <Flex justify="between" align="center" css={{ mb: '$10' }}>
                    <Text h2>Payment History</Text>
                    <Badge color="primary" variant="bordered" size="lg">
                         Total Revenue: $45,910
                    </Badge>
               </Flex>

               {/* Credit Balances Overview */}
               <Grid.Container gap={2} css={{ mb: '$10' }}>
                    <Grid xs={12} sm={4}>
                         <Box css={{ bg: '$blue50', p: '$8', borderRadius: '$xl', width: '100%' }}>
                              <Text span size="$xs" color="$blue600" weight="bold">TOTAL CREDITS ISSUED</Text>
                              <Text h3 color="$blue800">1.2M pts</Text>
                         </Box>
                    </Grid>
                    <Grid xs={12} sm={4}>
                         <Box css={{ bg: '$green50', p: '$8', borderRadius: '$xl', width: '100%' }}>
                              <Text span size="$xs" color="$green600" weight="bold">ACTIVE PREMIUM</Text>
                              <Text h3 color="$green800">1,502 Users</Text>
                         </Box>
                    </Grid>
                    <Grid xs={12} sm={4}>
                         <Box css={{ bg: '$red50', p: '$8', borderRadius: '$xl', width: '100%' }}>
                              <Text span size="$xs" color="$red600" weight="bold">FAILED PAYMENTS</Text>
                              <Text h3 color="$red800">12 Transactions</Text>
                         </Box>
                    </Grid>
               </Grid.Container>

               {/* Transactions Table */}
               <Table
                    aria-label="Payment history table"
                    css={{ height: 'auto', minWidth: '100%', bg: '$background' }}
                    selectionMode="none"
               >
                    <Table.Header columns={columns}>
                         {(column) => (
                              <Table.Column key={column.uid} hideHeader={column.uid === 'actions'} align={column.uid === 'actions' ? 'center' : 'start'}>
                                   {column.name}
                              </Table.Column>
                         )}
                    </Table.Header>
                    <Table.Body items={payments}>
                         {(item) => (
                              <Table.Row key={item.id}>
                                   {(columnKey) => (
                                        <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                                   )}
                              </Table.Row>
                         )}
                    </Table.Body>
                    <Table.Pagination
                         shadow
                         noMargin
                         align="center"
                         rowsPerPage={5}
                         onPageChange={(page) => console.log({ page })}
                    />
               </Table>
          </Box>
     );
};

export default PaymentHistory;