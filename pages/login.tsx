import React, { useState } from 'react'
import { Input, Button, Text, Link, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/router'

import { Mail } from '../components/icons/auth/mail'
import { Password } from '../components/icons/auth/password'
import { Box } from '../components/styles/box'
import { Flex } from '../components/styles/flex'

const DEFAULT_EMAIL = 'admin@parentfully.app'
const DEFAULT_PASSWORD = 'Admin231!'

const LoginPage = () => {
     const router = useRouter()

     const [email, setEmail] = useState(DEFAULT_EMAIL)
     const [password, setPassword] = useState(DEFAULT_PASSWORD)
     const [error, setError] = useState('')

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault()
          setError('')

          if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
               router.push('/dashboard')
          } else {
               setError('Invalid email or password')
          }
     }

     return (
          <Flex
               direction="row"
               css={{
                    minHeight: '100vh',
                    width: '100%',
                    bg: '$background',
               }}
          >
               {/* ---------- LEFT / BRAND ---------- */}
               <Flex
                    direction="column"
                    justify="center"
                    css={{
                         flex: '1 1 55%',
                         px: '$20',
                         background:
                              'radial-gradient(circle at top left, #5a58ff 0%, #2b2aa0 40%, #15144f 100%)',
                         display: 'none',
                         '@md': { display: 'flex' },
                    }}
               >
                    <Text
                         h1
                         css={{
                              color: 'white',
                              fontWeight: '$bold',
                              fontSize: '3.2rem',
                              lineHeight: '1.05',
                              maxWidth: 520,
                              mb: '$8',
                         }}
                    >
                         Where families
                         <br />
                         manage life together.
                    </Text>

                    <Text
                         css={{
                              color: 'rgba(255,255,255,0.75)',
                              maxWidth: 480,
                              fontSize: '$lg',
                         }}
                    >
                         Secure dashboards, shared planning, and real collaboration for modern
                         parenting.
                    </Text>
               </Flex>

               {/* ---------- RIGHT / FORM ---------- */}
               <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    css={{
                         flex: '1 1 45%',
                         px: '$12',
                         '@mdMax': { flex: '1 1 100%' },
                    }}
               >
                    <Box css={{ width: '100%', maxWidth: 380 }}>
                         <Text h2 css={{ fontWeight: '$bold', mb: '$2' }}>
                              Welcome back
                         </Text>

                         <Text css={{ color: '$accents7', mb: '$10' }}>
                              Sign in to continue to your dashboard
                         </Text>

                         <form onSubmit={handleSubmit}>
                              <Input
                                   fullWidth
                                   size="lg"
                                   bordered
                                   label="Email address"
                                   contentLeft={<Mail fill="currentColor" />}
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                              />

                              <Spacer y={1.25} />

                              <Input.Password
                                   fullWidth
                                   size="lg"
                                   bordered
                                   label="Password"
                                   contentLeft={<Password fill="currentColor" />}
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                              />

                              {error && (
                                   <>
                                        <Spacer y={0.75} />
                                        <Text color="error" size="$sm">
                                             {error}
                                        </Text>
                                   </>
                              )}

                              <Button
                                   type="submit"
                                   shadow
                                   size="lg"
                                   css={{
                                        mt: '$10',
                                        width: '100%',
                                        borderRadius: '$pill',
                                        fontWeight: '$bold',
                                        bg: '#3f3bef',
                                   }}
                              >
                                   Sign in
                              </Button>
                         </form>

                         <Spacer y={2} />

                         <Text size="$sm" css={{ color: '$accents7', textAlign: 'center' }}>
                              Demo credentials are pre-filled
                         </Text>
                    </Box>
               </Flex>
          </Flex>
     )
}

export default LoginPage
