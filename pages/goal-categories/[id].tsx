import { useRouter } from 'next/router';
import { BackendCollectionPage } from '../../components/shared/backend-collection-page';

export default function CategoryGoalsPage() {
   const router = useRouter();
   const id = Number(router.query.id);
   if (!router.isReady || !id) return null;
   return <BackendCollectionPage path="/goal-categories" endpoint="/v1/admin/goals" mutationEndpoint="/v1/admin/goals" listParams={{ category_id: id, per_page: 200 }} createPayload={{ goal_category_id: id }} resourceName="goal" createLabel="Add goal" allowDelete formFields={[
      { key: 'title', label: 'Title', required: true }, { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'select', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
      { key: 'smart_specific', label: 'Specific', type: 'textarea' }, { key: 'smart_measurable', label: 'Measurable', type: 'textarea' },
      { key: 'smart_achievable', label: 'Achievable', type: 'textarea' }, { key: 'smart_relevant', label: 'Relevant', type: 'textarea' },
      { key: 'time_bound_count', label: 'Times', type: 'number' }, { key: 'time_bound_value', label: 'Duration', type: 'number' },
      { key: 'time_bound_period', label: 'Period', type: 'select', options: ['days','weeks','months'].map((value) => ({ value, label: value })) },
      { key: 'reward_name', label: 'Reward name' }, { key: 'notes', label: 'Reward notes', type: 'textarea' },
   ]} columns={[
      { key: 'title', label: 'GOAL' }, { key: 'status', label: 'STATUS', type: 'status' },
      { key: 'time_bound_period', label: 'PERIOD' }, { key: 'reward_name', label: 'REWARD' }, { key: 'created_at', label: 'CREATED', type: 'date' },
   ]} />;
}
