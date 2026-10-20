import { BackendCollectionPage } from '../components/shared/backend-collection-page';

export default function DisciplinePlansPage() {
   return <BackendCollectionPage path="/discipline-plans" endpoint="/v1/admin/system-plans" resourceName="discipline plan" createLabel="Add plan" allowDelete rowHref={(row) => `/discipline-plans/${row.id}/rules?name=${encodeURIComponent(row.name)}`} formFields={[
      { key: 'name', label: 'Name', required: true }, { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'type', label: 'Type', type: 'select', options: [{ value: 'preset', label: 'Preset' }, { value: 'custom', label: 'Custom' }] },
   ]} columns={[
      { key: 'name', label: 'PLAN' }, { key: 'description', label: 'DESCRIPTION' },
      { key: 'type', label: 'TYPE', type: 'status' }, { key: 'rule_count', label: 'RULES', type: 'number' },
      { key: 'created_at', label: 'CREATED', type: 'date' },
   ]} />;
}
