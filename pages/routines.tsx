import { BackendCollectionPage } from '../components/shared/backend-collection-page';

export default function RoutinesPage() {
   return <BackendCollectionPage path="/routines" endpoint="/v1/admin/system-routines" resourceName="routine" createLabel="Add routine" allowDelete rowHref={(row) => `/routines/${row.id}/tasks?name=${encodeURIComponent(row.title)}`} formFields={[
      { key: 'title', label: 'Title', required: true }, { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'order', label: 'Order', type: 'number' },
   ]} columns={[
      { key: 'title', label: 'ROUTINE' }, { key: 'description', label: 'DESCRIPTION' },
      { key: 'task_count', label: 'TASKS', type: 'number' }, { key: 'order', label: 'ORDER', type: 'number' },
      { key: 'created_at', label: 'CREATED', type: 'date' },
   ]} />;
}
