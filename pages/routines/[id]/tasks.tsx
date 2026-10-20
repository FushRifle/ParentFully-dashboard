import { useRouter } from 'next/router';
import { BackendCollectionPage } from '../../../components/shared/backend-collection-page';

export default function RoutineTasksPage() {
   const router = useRouter();
   const id = Number(router.query.id);
   if (!router.isReady || !id) return null;
   const endpoint = `/v1/admin/system-routines/${id}/tasks`;
   return <BackendCollectionPage path="/routines" endpoint={endpoint} mutationEndpoint={endpoint} searchable={false} resourceName="task" createLabel="Add task" allowDelete formFields={[
      { key: 'title', label: 'Title', required: true }, { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'order', label: 'Order', type: 'number' }, { key: 'duration', label: 'Duration' },
   ]} columns={[
      { key: 'title', label: 'TASK' }, { key: 'description', label: 'DESCRIPTION' },
      { key: 'duration', label: 'DURATION' }, { key: 'order', label: 'ORDER', type: 'number' },
   ]} />;
}
