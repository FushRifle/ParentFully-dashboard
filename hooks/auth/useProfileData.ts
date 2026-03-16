import { useState, useCallback, useEffect } from 'react';
import { ChildData, Contact } from '@/types/api';
import { getUser, updateProfile } from '@/services/authService';
import { getChildren } from '@/services/childService';
import { getContacts } from '@/services/contactService';
import usePhotoUpload from '@/hooks/image';

interface AuthUser {
     id: number;
     name: string;
     email: string;
     phone_number: string;
     profile_image?: {
          uri: string;
          type: string;
          fileName?: string;
     };
     email_verified_at: string | null;
     referral_code: string;
     has_seen_intro: boolean;
     has_child: boolean;
     has_completed_onboarding: boolean;
     has_sent_invite: boolean;
     has_seen_success: boolean;
     created_at: string;
     updated_at: string;
     deleted_at: string | null;
}

interface User {
     contact_id: number;
     id: number;
     user: AuthUser;
     name: string;
     email: string;
     role?: string;
     phone_number: string;
     has_seen_intro: boolean;
     has_child: boolean;
     has_completed_onboarding: boolean;
     has_sent_invite: boolean;
     has_seen_success: boolean;
     children: any[];
     profile_image?: {
          uri: string;
          type: string;
          fileName?: string;
     };
     photo?: {
          uri: string;
          type: string;
          fileName?: string;
     };

     two_factor_enabled?: boolean;
     created_at?: string;
     is_premium?: boolean;
}

export const useProfileData = () => {
     const [user, setUser] = useState<User | null>(null);
     const [unreadCount, setUnreadCount] = useState(0)
     const [children, setChildren] = useState<ChildData[]>([]);
     const [contacts, setContacts] = useState<Contact[]>([]);
     const [loading, setLoading] = useState(true);
     const [refreshing, setRefreshing] = useState(false);
     const [error, setError] = useState<string | null>(null);

     const {
          selectedImage: userPhoto,
          isUploading: photoUploading,
          uploadError: photoError,
          showImagePickerOptions: showUserPhotoPicker,
          preparePhotoForUpload,
          clearImage: clearUserPhoto,
          pickImage: pickUserPhoto,
          takePhoto: takeUserPhoto,
     } = usePhotoUpload({ uploadType: 'user' });

     const fetchUserData = useCallback(async () => {
          try {
               const userData = await getUser();
               setUser(userData);
          } catch (err) {
               console.error('Error fetching user:', err);
               setError('Failed to load user data');
          }
     }, []);

     const fetchChildrenData = useCallback(async () => {
          try {
               const childrenData = await getChildren();
               setChildren(childrenData as ChildData[]);
          } catch (err) {
               console.error('Error fetching children:', err);
               setError('Failed to load children data');
          }
     }, []);

     const fetchContactsData = useCallback(async () => {
          try {
               const contactsData = await getContacts();
               setContacts(contactsData);
          } catch (err) {
               console.error('Network Error, Please Reload', err);
               setError('Failed to load contacts data');
          }
     }, []);

     const fetchAllData = useCallback(async () => {
          setLoading(true)
          setError(null)

          try {
               await Promise.all([
                    fetchUserData(),
                    fetchChildrenData(),
                    fetchContactsData(),
               ])

          } catch (err) {
               console.error('Error fetching all data:', err)
          } finally {
               setLoading(false)
          }
     }, [
          fetchUserData,
          fetchChildrenData,
          fetchContactsData,
     ])

     const handleUpdateProfile = async (updatedData: Partial<User>) => {
          try {
               const payload: any = { ...updatedData };
               if (updatedData.profile_image && 'uri' in updatedData.profile_image) {
                    const prepared = preparePhotoForUpload(updatedData.profile_image.uri);
                    payload.photo = prepared.uri;
               } else if (typeof updatedData.profile_image === 'string') {
                    payload.photo = updatedData.profile_image;
               } else {
                    payload.photo = null;
               }

               const updatedUser = await updateProfile(payload);
               console.log('Profile updated successfully:', updatedUser);
          } catch (err) {
               console.error('Error updating profile:', err);
          }
     };

     const onRefresh = useCallback(async () => {
          setRefreshing(true);
          await fetchAllData();
          setRefreshing(false);
     }, [fetchAllData]);

     useEffect(() => {
          fetchAllData();
     }, [fetchAllData]);

     const coParents = contacts.filter(contact => contact.category === 'co-parent');
     const thirdParty = contacts.filter(contact => contact.category === 'third-party');

     return {
          user,
          children,
          contacts,
          coParents,
          thirdParty,
          unreadCount,
          loading,
          refreshing,
          error,
          fetchAllData,
          handleUpdateProfile,
          onRefresh,
          refetch: fetchAllData,
          // Photo hook
          userPhoto,
          photoUploading,
          photoError,
          pickUserPhoto,
          takeUserPhoto,
          showUserPhotoPicker,
          clearUserPhoto,
          preparePhotoForUpload,
     };
};
