import { useState, useCallback, useEffect } from 'react';
import type { ChildData, Contact, User } from '@/types/api';
import { getUser, updateProfile } from '@/services/authService';
import usePhotoUpload from '@/hooks/image';

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

     const fetchAllData = useCallback(async () => {
          setLoading(true)
          setError(null)

          try {
               await fetchUserData();

          } catch (err) {
               console.error('Error fetching all data:', err)
          } finally {
               setLoading(false)
          }
     }, [fetchUserData])

     const handleUpdateProfile = async (updatedData: Partial<User>) => {
          try {
               const updatedUser = await updateProfile(updatedData);
               if (updatedUser) setUser(updatedUser);
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
