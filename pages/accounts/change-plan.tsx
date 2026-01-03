import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import {
     Grid,
     Card,
     Button,
     Text,
     Divider,
     Badge,
     Spacer,
} from '@nextui-org/react'

import { Flex } from '../../components/styles/flex'
import { Box } from '../../components/styles/box'

const PLANS = [
     {
          name: 'Free',
          price: '0',
          features: ['Basic Analytics', '5 Projects', 'Community Support'],
          highlight: false,
     },
     {
          name: 'Pro',
          price: '19',
          features: ['Advanced Stats', 'Unlimited Projects', 'Priority Support'],
          highlight: true,
     },
     {
          name: 'Enterprise',
          price: '99',
          features: ['Custom Branding', 'Dedicated Manager', 'API Access'],
          highlight: false,
     },
]

const ChangePlan = () => {
     const router = useRouter()

     const userId = useMemo(() => {
          if (!router.isReady) return null
          return router.query.id as string
     }, [router.isReady, router.query.id])

     return (
          <Box css={{ p: '$10', '@sm': { p: '$20' } }}>
               <Button light color="primary" auto onClick={() => router.back()}>
                    Back to User
               </Button>

               <Spacer y={1} />

               <Text h2>Subscription Plans</Text>

               <Text css={{ color: '$accents7', mb: '$12' }}>
                    Updating plan for User ID:{' '}
                    <Badge variant="flat">#{userId ?? '—'}</Badge>
               </Text>

               <Grid.Container gap={3} justify="center">
                    {PLANS.map((plan) => (
                         <Grid xs={12} sm={4} key={plan.name}>
                              <Card
                                   isHoverable
                                   css={{
                                        p: '$4',
                                        border: plan.highlight ? '2px solid $blue600' : 'none',
                                   }}
                              >
                                   <Card.Header>
                                        <Flex direction="column">
                                             <Text h3>{plan.name}</Text>
                                             <Text h4 color="primary">
                                                  ${plan.price}
                                                  <Text span size="$xs">
                                                       /mo
                                                  </Text>
                                             </Text>
                                        </Flex>
                                   </Card.Header>

                                   <Divider />

                                   <Card.Body css={{ py: '$8' } as any}>
                                        {plan.features.map((feat) => (
                                             <Text key={feat} size="$sm" css={{ mb: '$3' }}>
                                                  • {feat}
                                             </Text>
                                        ))}
                                   </Card.Body>

                                   <Card.Footer>
                                        <Button
                                             shadow={plan.highlight}
                                             flat={!plan.highlight}
                                             onClick={() => {
                                                  alert(`Plan changed to ${plan.name}`)
                                                  router.push('/accounts')
                                             }}
                                        >
                                             Select {plan.name}
                                        </Button>
                                   </Card.Footer>
                              </Card>
                         </Grid>
                    ))}
               </Grid.Container>
          </Box>
     )
}

export default ChangePlan
