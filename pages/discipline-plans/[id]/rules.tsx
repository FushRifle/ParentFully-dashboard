import { useRouter } from 'next/router';
import { BackendCollectionPage } from '../../../components/shared/backend-collection-page';

export default function PlanRulesPage() {
   const router = useRouter();
   const id = Number(router.query.id);
   if (!router.isReady || !id) return null;
   const endpoint = `/v1/admin/system-plans/${id}/rules`;
   return <BackendCollectionPage path="/discipline-plans" endpoint={endpoint} mutationEndpoint={endpoint} searchable={false} resourceName="rule" createLabel="Add rule" allowDelete formFields={[
      { key: 'name', label: 'Name', required: true }, { key: 'consequences', label: 'Consequences', type: 'textarea' },
      { key: 'notes', label: 'Notes', type: 'textarea' }, { key: 'color', label: 'Color' },
   ]} columns={[
      { key: 'name', label: 'RULE' }, { key: 'consequences', label: 'CONSEQUENCES' },
      { key: 'notes', label: 'NOTES' }, { key: 'color', label: 'COLOR' },
   ]} />;
}
