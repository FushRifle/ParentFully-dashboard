import { BackendCollectionPage } from '../components/shared/backend-collection-page';

export default function GoalCategoriesPage() {
   return <BackendCollectionPage path="/goal-categories" endpoint="/v1/admin/goal-categories" resourceName="goal category" createLabel="Add category" allowDelete rowHref={(row) => `/goal-categories/${row.id}?name=${encodeURIComponent(row.name)}`} formFields={[
      { key: 'name', label: 'Name', required: true },
      { key: 'age_group', label: 'Age group', type: 'select', required: true, options: ['0-2','3-5','6-8','9-12','13-17'].map((value) => ({ value, label: value })) },
      { key: 'description', label: 'Description', type: 'textarea' },
   ]} columns={[
      { key: 'name', label: 'CATEGORY' }, { key: 'age_group', label: 'AGE GROUP' },
      { key: 'goals_count', label: 'GOALS', type: 'number' }, { key: 'is_active', label: 'ACTIVE', type: 'boolean' },
      { key: 'created_at', label: 'CREATED', type: 'date' },
   ]} />;
}
