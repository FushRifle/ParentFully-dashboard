export { default } from '../subscriptions';

export const getServerSideProps = async () => ({
   redirect: {
      destination: '/subscriptions?category=manual',
      permanent: false,
   },
});
