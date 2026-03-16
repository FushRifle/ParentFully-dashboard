import { useState } from 'react';
import { updateProfile } from '@/services/authService';
import usePhotoUpload from '@/hooks/image';

interface AuthUser {
     id: number;
     name: string;
     email: string;
     phone_number: string;
     profile_image?: string;
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
     profile_image?: string | { uri: string; type?: string; fileName?: string };
}

interface UseUpdateOptions {
     onSuccess?: (updatedUser: User) => void;
     onError?: (error: any) => void;
     uploadType?: 'user' | 'child';
}

export const useUpdate = (options: UseUpdateOptions = {}) => {
     const [isUpdating, setIsUpdating] = useState(false);
     const [updateError, setUpdateError] = useState<string | null>(null);
     const [updateSuccess, setUpdateSuccess] = useState(false);
     const [selectedImage, setSelectedImage] = useState<{ uri: string; type?: string; fileName?: string } | null>(null);

     const {
          selectedImage: userPhoto,
          isUploading: photoUploading,
          uploadError: photoError,
          showImagePickerOptions: showUserPhotoPicker,
          preparePhotoForUpload,
          clearImage: clearUserPhoto,
          pickImage: pickUserPhoto,
          takePhoto: takeUserPhoto,
     } = usePhotoUpload({
          uploadType: options.uploadType || 'user',
          onPhotoUpdate: (photoUri) => {
               if (photoUri) setSelectedImage({ uri: photoUri });
          }
     });

     const updateProfileData = async (updatedData: Partial<User>) => {
          setIsUpdating(true);
          setUpdateError(null);
          setUpdateSuccess(false);

          try {
               const formData = new FormData();

               if (updatedData.name) formData.append('name', updatedData.name);
               if (updatedData.email) formData.append('email', updatedData.email);
               if (updatedData.phone_number) formData.append('phone_number', updatedData.phone_number);

               if (updatedData.profile_image) {
                    if (typeof updatedData.profile_image === 'object' && updatedData.profile_image.uri) {
                         const preparedPhoto = preparePhotoForUpload(updatedData.profile_image.uri);
                         const file = {
                              uri: preparedPhoto.uri,
                              type: preparedPhoto.type || 'image/jpeg',
                              name: preparedPhoto.name || `profile-${Date.now()}.jpg`,
                         };
                         formData.append('profile_image', file as any);
                    } else if (typeof updatedData.profile_image === 'string' && updatedData.profile_image === '') {
                         formData.append('profile_image', '');
                    }
               } else {
                    formData.append('profile_image', '');
               }

               const response = await updateProfile(formData);
               const updatedUser = response?.user || response;

               setUpdateSuccess(true);
               setSelectedImage(null);

               return updatedUser;
          } catch (err: any) {
               console.error('Error updating profile:', err);

               const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
               setUpdateError(errorMessage);
               options.onError?.(err);

               throw err;
          } finally {
               setIsUpdating(false);
          }
     };

     const resetUpdateState = () => {
          setUpdateError(null);
          setUpdateSuccess(false);
     };

     const clearSelectedImage = () => {
          setSelectedImage(null);
          clearUserPhoto();
     };

     return {
          isUpdating,
          updateError,
          updateSuccess,
          selectedImage,

          updateProfileData,
          resetUpdateState,

          userPhoto: selectedImage || userPhoto,
          photoUploading,
          photoError,
          pickUserPhoto,
          takeUserPhoto,
          showUserPhotoPicker,
          clearUserPhoto: clearSelectedImage,
          preparePhotoForUpload,
     };
};

export const useUpdateProfile = (options?: UseUpdateOptions) => {
     return useUpdate({ ...options, uploadType: 'user' });
};