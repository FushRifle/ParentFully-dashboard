import { useState, useCallback } from 'react';
import { FamilyMember } from '@/types/profile';
import { getContacts } from '@/services/contactService';

export const useContacts = () => {
     const [coParents, setCoParents] = useState<FamilyMember[]>([]);
     const [thirdParty, setThirdParty] = useState<FamilyMember[]>([]);
     const [loading, setLoading] = useState<boolean>(false);
     const [error, setError] = useState<string | null>(null);

     const fetchContacts = useCallback(async () => {
          try {
               setLoading(true);
               setError(null);

               const contactsData = await getContacts();
               const coParentsData: FamilyMember[] = [];
               const thirdPartyData: FamilyMember[] = [];

               contactsData.forEach((contact: any) => {
                    const familyMember: FamilyMember = {
                         id: contact.id.toString(),
                         name: contact.name,
                         email: contact.email,
                         relationship: contact.category === 'co-parent' ? 'Co-Parent' : 'Third Party',
                         avatar: contact.photo ? { uri: contact.photo } : undefined
                    };

                    if (contact.category === 'co-parent') {
                         coParentsData.push(familyMember);
                    } else if (contact.category === 'third-party') {
                         thirdPartyData.push(familyMember);
                    }
               });

               setCoParents(coParentsData);
               setThirdParty(thirdPartyData);
          } catch (err) {
               console.error('Error fetching contacts:', err);
               setError('Failed to load contacts');
          } finally {
               setLoading(false);
          }
     }, []);

     const addContact = useCallback((contact: FamilyMember, type: 'co-parent' | 'third-party') => {
          if (type === 'co-parent') {
               setCoParents(prev => [...prev, contact]);
          } else {
               setThirdParty(prev => [...prev, contact]);
          }
     }, []);

     const removeContact = useCallback((contactId: string, type: 'co-parent' | 'third-party') => {
          if (type === 'co-parent') {
               setCoParents(prev => prev.filter(contact => contact.id !== contactId));
          } else {
               setThirdParty(prev => prev.filter(contact => contact.id !== contactId));
          }
     }, []);

     return {
          coParents,
          thirdParty,
          loading,
          error,
          fetchContacts,
          addContact,
          removeContact
     };
};