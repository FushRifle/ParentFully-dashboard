import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { Card, Text, Divider, Button, Badge, Grid, Spacer } from '@nextui-org/react';
import { Flex } from '../../components/styles/flex';
import { Box } from '../../components/styles/box';
import { SidebarContext } from '../../components/layout/layout-context';

const PlanDetails = () => {
     const router = useRouter();
     const { showToast } = useContext(SidebarContext);

     const subscription = {
          planName: 'Professional Plan',
          price: '$19.00/mo',
          status: 'Active',
          startDate: 'Jan 12, 2025',
          nextBilling: 'Feb 12, 2026',
          paymentMethod: 'Visa ending in 4242',
          usage: '85%',
     };

     const handleRevoke = () => {
          showToast('Subscription has been successfully revoked');
          router.back();
     };

     return (
          <Box css={{ p: '$10', '@sm': { p: '$20' }, maxW: '800px', margin: '0 auto' }}>
               <Button
                    light
                    color="primary"
                    auto
                    onClick={() => router.back()}
                    css={{ p: 0, mb: '$8' }}
               >
                    ← Back to Account Details
               </Button>

               <Card variant="bordered" css={{ p: '$8', borderRadius: '$xl' }}>
                    <Card.Header>
                         <Flex justify="between" align="center" css={{ width: '100%' }}>
                              <Box>
                                   <Text h3 css={{ m: 0 }}>{subscription.planName}</Text>
                                   <Text size="$sm" css={{ color: '$accents7' }}>Current Subscription Details</Text>
                              </Box>
                              <Badge color="success" variant="flat" css={{ px: '$5' }}>{subscription.status}</Badge>
                         </Flex>
                    </Card.Header>

                    <Spacer y={1.5} />
                    <Divider />

                    <Card.Body css={{ py: '$10' } as any}>
                         <Grid.Container gap={3}>
                              <Grid xs={6} sm={4}>
                                   <Flex direction="column">
                                        <Text size="$xs" weight="bold" css={{ color: '$accents8', tt: 'uppercase' }}>Monthly Price</Text>
                                        <Text b size="$lg">{subscription.price}</Text>
                                   </Flex>
                              </Grid>
                              <Grid xs={6} sm={4}>
                                   <Flex direction="column">
                                        <Text size="$xs" weight="bold" css={{ color: '$accents8', tt: 'uppercase' }}>Payment Method</Text>
                                        <Text b size="$md">{subscription.paymentMethod}</Text>
                                   </Flex>
                              </Grid>
                              <Grid xs={6} sm={4}>
                                   <Flex direction="column">
                                        <Text size="$xs" weight="bold" css={{ color: '$accents8', tt: 'uppercase' }}>Usage Limit</Text>
                                        <Text b size="$md" color="warning">{subscription.usage}</Text>
                                   </Flex>
                              </Grid>
                              <Grid xs={6} sm={4}>
                                   <Flex direction="column">
                                        <Text size="$xs" weight="bold" css={{ color: '$accents8', tt: 'uppercase' }}>Member Since</Text>
                                        <Text size="$md">{subscription.startDate}</Text>
                                   </Flex>
                              </Grid>
                              <Grid xs={6} sm={4}>
                                   <Flex direction="column">
                                        <Text size="$xs" weight="bold" css={{ color: '$accents8', tt: 'uppercase' }}>Next Renewal</Text>
                                        <Text size="$md">{subscription.nextBilling}</Text>
                                   </Flex>
                              </Grid>
                         </Grid.Container>

                         <Spacer y={2} />

                         <Box css={{
                              bg: '$accents0',
                              p: '$8',
                              borderRadius: '$lg',
                              border: '1px solid $border'
                         }}>
                              <Text h5>Danger Zone</Text>
                              <Text size="$sm" css={{ color: '$accents7', mb: '$6' }}>
                                   Revoking the plan will immediately terminate user access to premium features. This action is recorded in the audit logs.
                              </Text>
                              <Button
                                   auto
                                   color="error"
                                   shadow
                                   onClick={handleRevoke}
                              >
                                   Revoke Plan
                              </Button>
                         </Box>
                    </Card.Body>
               </Card>
          </Box>
     );
};

export default PlanDetails;