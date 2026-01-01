import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { AccountDetails } from '../../components/accounts/details';
import { users } from '../../components/table/data';

const AccountDetailsPage = () => {
     const router = useRouter();
     const { id } = router.query;

     const user = useMemo(() => {
          if (!id) return undefined;
          return users.find(u => u.id.toString() === id.toString());
     }, [id]);

     if (!user) return <div>Loading user...</div>;

     return <AccountDetails user={user as any} />;
};

export default AccountDetailsPage;
