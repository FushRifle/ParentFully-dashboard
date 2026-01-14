import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box } from '../../components/styles/box';
import { Loading, } from '@nextui-org/react';

import { AccountDetails } from '../../components/accounts/details';
import type { User } from '../../types/api';
import { getUserByID } from '../../lib/services/authServices';

const AccountDetailsPage = () => {
     const router = useRouter();
     const { id } = router.query;

     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          if (!id) return;

          const fetchUser = async () => {
               setLoading(true);
               try {
                    const fetchedUser = await getUserByID(Number(id));
                    setUser(fetchedUser);
               } catch (err) {
                    console.error('Failed to fetch user:', err);
                    setUser(null);
               } finally {
                    setLoading(false);
               }
          };

          fetchUser();
     }, [id]);

     if (loading) return
     <Box css={{ py: '$20', textAlign: 'center' }}>
          <Loading size="xl">Fetching user details...</Loading>
     </Box>;
     if (!user) return <div>User not found</div>;

     return <AccountDetails user={user} />;
};

export default AccountDetailsPage;
