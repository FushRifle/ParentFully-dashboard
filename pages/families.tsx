import { BackendCollectionPage } from '../components/shared/backend-collection-page';
import { House, UsersRound } from 'lucide-react';

export default function FamiliesPage() {
   return <BackendCollectionPage path="/families" endpoint="/v1/admin/families" rowHref={(row) => `/families/${row.id}`} summaryMetrics={[
      { key: 'total', label: 'Total families', color: '#10b981', icon: <House size={15} />, description: 'All registered family groups' },
      { key: 'visible', label: 'Families shown', color: '#3b82f6', icon: <UsersRound size={15} />, description: 'Families in the current result set' },
   ]} columns={[
      { key: 'name', label: 'FAMILY' }, { key: 'owner.name', label: 'OWNER' }, { key: 'owner.email', label: 'OWNER EMAIL' },
      { key: 'members_count', label: 'MEMBERS', type: 'number' }, { key: 'children_count', label: 'CHILDREN', type: 'number' },
      { key: 'created_at', label: 'CREATED', type: 'date' },
   ]} />;
}
