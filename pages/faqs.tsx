import { BackendCollectionPage } from '../components/shared/backend-collection-page';

export default function FaqsPage() {
   return <BackendCollectionPage path="/faqs" endpoint="/v1/admin/faqs" resourceName="FAQ" createLabel="Add FAQ" allowDelete formFields={[
      { key: 'question', label: 'Question', required: true }, { key: 'answer', label: 'Answer', type: 'textarea', required: true },
      { key: 'category', label: 'Category' },
   ]} columns={[
      { key: 'question', label: 'QUESTION' }, { key: 'category', label: 'CATEGORY' },
      { key: 'is_active', label: 'ACTIVE', type: 'boolean' }, { key: 'order', label: 'ORDER', type: 'number' },
      { key: 'created_at', label: 'CREATED', type: 'date' },
   ]} />;
}
