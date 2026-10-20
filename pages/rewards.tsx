import { BackendCollectionPage } from '../components/shared/backend-collection-page';

export default function RewardsPage() {
   return <BackendCollectionPage path="/rewards" endpoint="/v1/admin/rewards" rowHref={(row) => `/rewards/${row.id}?name=${encodeURIComponent(row.title)}`} columns={[
      { key: 'title', label: 'REWARD' }, { key: 'type', label: 'TYPE', type: 'status' }, { key: 'user.name', label: 'USER' },
      { key: 'family.name', label: 'FAMILY' }, { key: 'points_value', label: 'POINTS', type: 'number' },
      { key: 'claimed_at', label: 'CLAIMED', type: 'date' }, { key: 'created_at', label: 'CREATED', type: 'date' },
   ]} />;
}
