import { BackendCollectionPage } from '../components/shared/backend-collection-page';

export default function AdminUsersPage() {
   return <BackendCollectionPage path="/admin-users" endpoint="/v1/admin/users" resourceName="admin user" createLabel="Add admin" allowDelete formFields={[
      { key: 'name', label: 'Name', required: true }, { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'password', label: 'Password', type: 'password', required: true },
      { key: 'password_confirmation', label: 'Confirm password', type: 'password', required: true, createOnly: true },
   ]} columns={[
      { key: 'name', label: 'NAME' }, { key: 'email', label: 'EMAIL' },
      { key: 'role', label: 'ROLE', type: 'status' }, { key: 'last_login_at', label: 'LAST LOGIN', type: 'date' },
      { key: 'created_at', label: 'CREATED', type: 'date' },
   ]} />;
}
