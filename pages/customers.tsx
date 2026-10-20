import { BackendCollectionPage } from '../components/shared/backend-collection-page';

export default function CustomersPage() {
   return <BackendCollectionPage
      path="/customers"
      endpoint="/v1/admin/app-users"
      mutationEndpoint="/v1/admin/app-users"
      rowHref={(customer) => `/customers/${customer.id}`}
      resourceName="customer"
      allowCreate={false}
      allowDelete
      formFields={[{ key: 'name', label: 'Name', required: true }, { key: 'email', label: 'Email', type: 'email', required: true }]}
      columns={[
         { key: 'name', label: 'CUSTOMER' }, { key: 'email', label: 'EMAIL' }, { key: 'country', label: 'COUNTRY' },
         { key: 'family.name', label: 'FAMILY' }, { key: 'active_subscription.plan_type', label: 'PLAN' },
         { key: 'status', label: 'STATUS', type: 'status' },
         { key: 'has_completed_onboarding', label: 'ONBOARDED', type: 'boolean' },
         { key: 'created_at', label: 'REGISTERED', type: 'date' },
      ]}
   />;
}
