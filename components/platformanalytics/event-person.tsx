import { useQuery } from '@tanstack/react-query';
import { getAppUser } from '@/services/adminService';
import UserAvatar from '@/components/Avatar/UserAvatar';
import { accountIdForEvent } from './event-fields';

export function EventPerson({ event }: { event: any }) {
   const id = accountIdForEvent(event);
   const person = useQuery({ queryKey: ['event-person', id], enabled: !!id, queryFn: () => getAppUser(id!), staleTime: 300000, retry: false });
   const user: any = person.data?.user ?? person.data;
   return <div className="flex items-center gap-2"><UserAvatar profile_image={user?.profile_image} contactName={user?.name} size={30} /><div><strong className="block text-xs">{user?.name || (person.isFetching ? 'Loading person…' : id ? `Account #${id}` : 'Unidentified person')}</strong><small className="block text-[10px] text-muted-foreground">{user?.email || (id ? person.isError ? 'Profile unavailable' : `ID · ${id}` : 'No account ID returned')}</small></div></div>;
}
