import { BackendCollectionPage } from '../components/shared/backend-collection-page';

export default function FamiliesPage() {
   return <BackendCollectionPage path="/families" endpoint="/v1/admin/families" rowHref={(row) => `/families/${row.id}`} columns={[
      { key: 'name', label: 'FAMILY' }, { key: 'owner.name', label: 'OWNER' }, { key: 'owner.email', label: 'OWNER EMAIL' },
      { key: 'members_count', label: 'MEMBERS', type: 'number' }, { key: 'children_count', label: 'CHILDREN', type: 'number' },
      { key: 'created_at', label: 'CREATED', type: 'date' },
   ]} />;
}
