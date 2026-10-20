import { useRouter } from 'next/router';
import { BackendCollectionPage } from '../../components/shared/backend-collection-page';

export default function RewardClaimsPage() {
   const router = useRouter(); const id = Number(router.query.id);
   if (!router.isReady || !id) return null;
   return <BackendCollectionPage path="/rewards" endpoint={`/v1/admin/rewards/${id}/claims`} searchable={false} columns={[
      { key: 'child.name', label: 'CHILD' }, { key: 'family.name', label: 'FAMILY' },
      { key: 'points_spent', label: 'POINTS SPENT', type: 'number' }, { key: 'created_at', label: 'CLAIMED', type: 'date' },
   ]} />;
}
