import type { GetServerSideProps } from 'next';

export default function CustomerDetailRedirect() {
   return null;
}

export const getServerSideProps: GetServerSideProps = async () => ({
   redirect: { destination: '/families', permanent: false },
});
