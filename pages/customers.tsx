import type { GetServerSideProps } from 'next';

export default function CustomersRedirect() {
   return null;
}

export const getServerSideProps: GetServerSideProps = async () => ({
   redirect: { destination: '/families', permanent: false },
});
