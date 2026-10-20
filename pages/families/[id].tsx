import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, Loading, Text } from '@nextui-org/react';
import { api } from '../../lib';
import { Box } from '../../components/styles/box';
import { Flex } from '../../components/styles/flex';

export default function FamilyDetailPage() {
   const router = useRouter();
   const id = Number(router.query.id);
   const [family, setFamily] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const load = useCallback(async () => {
      if (!id) return;
      setLoading(true);
      try { setFamily((await api.get(`/v1/admin/families/${id}`)).data); }
      catch (err: any) { setError(err?.response?.data?.message ?? 'Unable to load family.'); }
      finally { setLoading(false); }
   }, [id]);
   useEffect(() => { load(); }, [load]);

   const updateRole = async (memberId: number, role: string) => {
      await api.put(`/v1/admin/families/${id}/members/${memberId}`, { role });
      await load();
   };
   const removeMember = async (member: any) => {
      if (!window.confirm(`Remove ${member.user?.name ?? 'this member'} from the family?`)) return;
      try { await api.delete(`/v1/admin/families/${id}/members/${member.id}`); await load(); }
      catch (err: any) { setError(err?.response?.data?.message ?? 'Unable to remove member.'); }
   };

   if (loading) return <Loading size="sm">Loading family…</Loading>;
   if (error) return <Text color="error">{error}</Text>;
   if (!family) return null;
   return <Box css={{ maxW: '1100px', mx: 'auto' }}>
      <Flex justify="between" align="center" css={{ mb: '$6' }}><Box><Text h2 css={{ m: 0, fontSize: '1.35rem' }}>{family.name}</Text><Text size="$sm" css={{ color: '$accents7' }}>Owner: {family.owner?.name ?? '—'} · {family.owner?.email ?? '—'}</Text></Box><Button auto flat onPress={() => router.push('/families')}>Back</Button></Flex>
      <Flex direction="column" css={{ gap: '$5' }}>
         <Card variant="bordered"><Card.Header><Text b>Members ({family.members_count ?? family.members?.length ?? 0})</Text></Card.Header><Card.Body css={{ gap: '$4' } as any}>
            {(family.members ?? []).map((member: any) => <Flex key={member.id} justify="between" align="center" css={{ gap: '$4', borderBottom: '1px solid $border', pb: '$3' }}><Box><Text b size="$sm">{member.user?.name ?? 'Unknown'}</Text><Text size="$xs" css={{ color: '$accents7' }}>{member.user?.email ?? '—'} · {member.status ?? '—'}</Text></Box><Flex css={{ gap: '$3' }}><select value={member.role ?? ''} onChange={(event) => updateRole(member.id, event.target.value)}><option value="co_parent">Co-parent</option><option value="third_party">Third party</option></select><Button auto light color="error" onPress={() => removeMember(member)}>Remove</Button></Flex></Flex>)}
            {!family.members?.length && <Text size="$sm" css={{ color: '$accents7' }}>No members found.</Text>}
         </Card.Body></Card>
         <Card variant="bordered"><Card.Header><Text b>Children ({family.children_count ?? family.children?.length ?? 0})</Text></Card.Header><Card.Body css={{ gap: '$3' } as any}>{(family.children ?? []).map((child: any) => <Flex key={child.id} justify="between"><Text size="$sm">{child.name}</Text><Text size="$xs" css={{ color: '$accents7' }}>{child.dob ?? '—'}</Text></Flex>)}{!family.children?.length && <Text size="$sm" css={{ color: '$accents7' }}>No children found.</Text>}</Card.Body></Card>
      </Flex>
   </Box>;
}
