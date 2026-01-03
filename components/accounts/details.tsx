import React, {
     useCallback, useMemo,
     useState, useContext, useEffect
} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
     Button, Card, Divider, Input,
     Text, Badge, User, Grid, Spacer
} from '@nextui-org/react'

import { Breadcrumbs, Crumb, CrumbLink } from '../breadcrumb/breadcrumb.styled'
import { HouseIcon } from '../icons/breadcrumb/house-icon'
import { UsersIcon } from '../icons/breadcrumb/users-icon'
import { Flex } from '../styles/flex'
import { Box } from '../styles/box'
import { DeleteUserModal } from './modals/delete'
import { SidebarContext } from '../layout/layout-context'

type AccountUser = {
     id: string
     name: string
     email: string
     avatar?: string
}

type Props = {
     user: AccountUser | null
}

const SECURITY_LOGS = [
     { event: 'New Login', device: 'iPhone 15 Pro', time: '14:20 PM' },
     { event: 'Password Change', device: 'Desktop Chrome', time: 'Yesterday' },
     { event: 'API Key Created', device: 'Internal', time: 'Oct 12' },
]

export const AccountDetails = ({ user }: Props) => {
     const router = useRouter()
     const { showToast } = useContext(SidebarContext)
     const [deleteVisible, setDeleteVisible] = useState(false)

     useEffect(() => {
          if (!user) router.replace('/accounts')
     }, [user, router])

     const profile = useMemo(() => {
          if (!user) return null
          const [firstName = '', ...lastNameParts] = user.name.split(' ')
          return {
               id: user.id,
               firstName,
               lastName: lastNameParts.join(' '),
               fullName: user.name,
               email: user.email,
               avatar: user.avatar,
          }
     }, [user])

     const [formData, setFormData] = useState({
          firstName: profile?.firstName ?? '',
          lastName: profile?.lastName ?? '',
          email: profile?.email ?? '',
     })

     const updateField = useCallback((key: keyof typeof formData, value: string) => {
          setFormData((prev) => ({ ...prev, [key]: value }))
     }, [])

     const handleUpdate = useCallback(() => {
          showToast(`Profile updated successfully`)
     }, [showToast])

     const handleRevokePlan = useCallback(() => {
          showToast(`Subscription revoked for ${profile?.firstName}`)
     }, [profile, showToast])

     if (!user || !profile) return null

     return (
          <Flex css={{ mt: '$5', px: '$6', '@sm': { mt: '$10', px: '$16' } }} direction="column">
               <DeleteUserModal
                    visible={deleteVisible}
                    closeHandler={() => setDeleteVisible(false)}
                    userName={profile.fullName}
                    onConfirm={() => {
                         setDeleteVisible(false)
                         router.push('/accounts')
                    }}
               />

               <Breadcrumbs>
                    <Crumb>
                         <HouseIcon />
                         <Link href="/dashboard"><CrumbLink>Home</CrumbLink></Link>
                         <Text>/</Text>
                    </Crumb>
                    <Crumb>
                         <UsersIcon />
                         <Link href="/accounts"><CrumbLink>Accounts</CrumbLink></Link>
                         <Text>/</Text>
                    </Crumb>
                    <Crumb><CrumbLink>{profile.fullName}</CrumbLink></Crumb>
               </Breadcrumbs>

               <Box css={{ mt: '$8', mb: '$10' }}>
                    <Flex justify="between" align="center" wrap="wrap" css={{ gap: '$8' }}>
                         <Flex align="center" css={{ gap: '$8' }}>
                              <User
                                   src={profile.avatar}
                                   name={<Text h3 css={{ m: 0, fontWeight: '$bold' }}>{profile.fullName}</Text>}
                                   description={profile.email}
                                   size="xl"
                              />
                              <Badge color="success" variant="flat" css={{ height: '$10', px: '$5' }}>Active Account</Badge>
                         </Flex>
                         <Flex css={{ gap: '$6' }}>
                              <Button auto flat color="error" onClick={() => setDeleteVisible(true)}>
                                   Disable Account
                              </Button>
                              <Button auto shadow color="primary" onClick={handleUpdate}>
                                   Save Changes
                              </Button>
                         </Flex>
                    </Flex>
               </Box>

               <Grid.Container gap={2}>
                    {/* Left Column: Forms */}
                    <Grid xs={12} md={8}>
                         <Flex direction="column" css={{ gap: '$8', width: '100%' }}>
                              <Card variant="bordered" css={{ borderRadius: '$xl' }}>
                                   <Card.Header css={{ px: '$8', pt: '$8' }}>
                                        <Text h4>Profile Information</Text>
                                   </Card.Header>
                                   <Card.Body css={{ p: '$8' }}>
                                        <Grid.Container gap={2}>
                                             <Grid xs={12} sm={6}>
                                                  <Input
                                                       label="First Name"
                                                       fullWidth
                                                       bordered
                                                       value={formData.firstName}
                                                       onChange={(e) => updateField('firstName', e.target.value)}
                                                  />
                                             </Grid>
                                             <Grid xs={12} sm={6}>
                                                  <Input
                                                       label="Last Name"
                                                       fullWidth
                                                       bordered
                                                       value={formData.lastName}
                                                       onChange={(e) => updateField('lastName', e.target.value)}
                                                  />
                                             </Grid>
                                             <Grid xs={12}>
                                                  <Input
                                                       label="Email Address"
                                                       fullWidth
                                                       bordered
                                                       value={formData.email}
                                                       onChange={(e) => updateField('email', e.target.value)}
                                                  />
                                             </Grid>
                                        </Grid.Container>
                                   </Card.Body>
                              </Card>

                              {/* New Action Panel */}
                              <Card variant="bordered" css={{ borderRadius: '$xl', borderStyle: 'dashed' }}>
                                   <Card.Body css={{ py: '$8' }}>
                                        <Flex justify="between" align="center" wrap="wrap" css={{ gap: '$6' }}>
                                             <Box>
                                                  <Text h5 css={{ m: 0 }}>Subscription Management</Text>
                                                  <Text size="$sm" css={{ color: '$accents7' }}>View details or terminate the current user plan</Text>
                                             </Box>
                                             <Flex css={{ gap: '$4' }}>
                                                  <Button
                                                       auto
                                                       bordered
                                                       color="primary"
                                                       onClick={() =>
                                                            router.push(`/plans/${profile.id}`)}>
                                                       Plan Details
                                                  </Button>
                                                  <Button auto flat color="error" onClick={handleRevokePlan}>
                                                       Revoke Plan
                                                  </Button>
                                             </Flex>
                                        </Flex>
                                   </Card.Body>
                              </Card>
                         </Flex>
                    </Grid>

                    {/* Right Column: Sidebar */}
                    <Grid xs={12} md={4}>
                         <Flex direction="column" css={{ gap: '$8', width: '100%' }}>
                              <Card variant="bordered" css={{ borderRadius: '$xl' }}>
                                   <Card.Header css={{ px: '$8', pt: '$8' }}>
                                        <Text h4>Security Logs</Text>
                                   </Card.Header>
                                   <Divider />
                                   <Card.Body css={{ px: '$8' }}>
                                        <Flex direction="column" css={{ gap: '$6' }}>
                                             {SECURITY_LOGS.map((log) => (
                                                  <Flex key={log.event} justify="between" align="center">
                                                       <Box>
                                                            <Text size="$sm" weight="semibold">{log.event}</Text>
                                                            <Text size="$xs" css={{ color: '$accents7' }}>{log.device}</Text>
                                                       </Box>
                                                       <Text size="$xs" css={{ color: '$accents6' }}>{log.time}</Text>
                                                  </Flex>
                                             ))}
                                        </Flex>
                                        <Spacer y={1} />
                                        <Button light color="primary" auto size="sm" css={{ p: 0 }}>
                                             View full audit log
                                        </Button>
                                   </Card.Body>
                              </Card>
                         </Flex>
                    </Grid>
               </Grid.Container>
          </Flex>
     )
}