import { Platform } from 'react-native';
import { getUser } from '@/services/authService';
import { getChildren } from '@/services/childService';

// Default images
const DEFAULT_USER_IMAGE = 'https://parentfully.stacksgather.com/storage/defaults/default_user.png';
const DEFAULT_CHILD_IMAGE = 'https://parentfully.stacksgather.com/storage/defaults/default_child.png';

/**
 * Get user profile image URL by fetching from API
 */
export const getUserProfileImageFromApi = async (): Promise<string> => {
     try {
          const userData = await getUser();

          const profileImage =
               userData?.user?.profile_image ??
               userData?.profile_image ??
               null;

          // If the value is an object, extract "uri"
          if (profileImage && typeof profileImage === 'object') {
               return profileImage.uri ?? DEFAULT_USER_IMAGE;
          }

          // If it's already a string URL, return it
          if (typeof profileImage === 'string') {
               return profileImage;
          }

          return DEFAULT_USER_IMAGE;

     } catch (error) {
          console.error('Failed to fetch user profile image:', error);
          return DEFAULT_USER_IMAGE;
     }
};

/**
 * Get child photo URL by fetching from API
 */
export const getChildPhotoFromApi = async (childId: number): Promise<string> => {
     try {
          const childrenData = await getChildren();

          // Find the specific child by ID
          const child = Array.isArray(childrenData)
               ? childrenData.find(c => c.id === childId)
               : childrenData;

          const childPhoto = child?.photo;

          // If photo is an object (React Native file), extract the URI
          if (childPhoto && typeof childPhoto === 'object') {
               return childPhoto.uri ?? DEFAULT_CHILD_IMAGE;
          }

          // If it's a normal URL string
          if (typeof childPhoto === 'string') {
               return childPhoto;
          }

          return DEFAULT_CHILD_IMAGE;

     } catch (error) {
          console.error(`Failed to fetch child ${childId} photo:`, error);
          return DEFAULT_CHILD_IMAGE;
     }
};

/**
 * Get all children photos at once
 */
/**
 * Get all children photos at once
 */
export const getAllChildrenPhotosFromApi = async (): Promise<Map<number, string>> => {
     const photos = new Map<number, string>();

     try {
          const childrenData = await getChildren();

          if (Array.isArray(childrenData)) {
               childrenData.forEach(child => {
                    if (!child.id) return;

                    const pic = child.photo;

                    let photoUrl = DEFAULT_CHILD_IMAGE;

                    if (pic) {
                         if (typeof pic === 'object') {
                              photoUrl = pic.uri ?? DEFAULT_CHILD_IMAGE;
                         } else if (typeof pic === 'string') {
                              photoUrl = pic;
                         }
                    }

                    photos.set(child.id, photoUrl);
               });
          }
     } catch (error) {
          console.error('Failed to fetch children photos:', error);
     }

     return photos;
};

export const getDisplayImage = (image: string | null | undefined, type: 'user' | 'child'): string => {
     if (!image) {
          return type === 'user' ? DEFAULT_USER_IMAGE : DEFAULT_CHILD_IMAGE;
     }

     return image;
};

/**
 * Check if image is a local file URI
 */
export const isLocalImage = (uri: string): boolean => {
     return uri.startsWith('file://') || uri.startsWith('content://');
};

/**
 * Add cache busting to remote URLs
 */
export const addCacheBusting = (uri: string): string => {
     if (uri.startsWith('http://') || uri.startsWith('https://')) {
          const separator = uri.includes('?') ? '&' : '?';
          return `${uri}${separator}t=${Date.now()}`;
     }
     return uri;
};

/**
 * Get optimized image source for Avatar
 * Returns ImageSourcePropType compatible object
 */
export const getAvatarSource = (image: string | null | undefined, type: 'user' | 'child') => {
     const displayImage = getDisplayImage(image, type);
     const finalUri = isLocalImage(displayImage) ? displayImage : addCacheBusting(displayImage);

     // Return a proper ImageSourcePropType object
     return {
          uri: finalUri,
          cache: (Platform.OS === 'ios' ? 'default' : 'reload') as 'default' | 'reload' | 'force-cache' | 'only-if-cached'
     };
};

/**
 * Alternative: Simple version without cache property (letting React Native handle caching)
 */
export const getSimpleAvatarSource = (image: string | null | undefined, type: 'user' | 'child') => {
     const displayImage = getDisplayImage(image, type);
     const finalUri = isLocalImage(displayImage) ? displayImage : addCacheBusting(displayImage);

     // Simple version - React Native will handle caching
     return { uri: finalUri };
};

/**
 * Extract user profile image from user object
 */
export const extractUserProfileImage = (user: any): string | null | undefined => {
     if (!user) return null;

     // Try different possible locations
     return user.profile_image ||
          user.user?.profile_image ||
          user.data?.user?.profile_image;
};

/**
 * Simple helper to get user avatar source directly
 */
export const getUserAvatarSource = (user: any) => {
     const image = extractUserProfileImage(user);
     return getAvatarSource(image, 'user');
};

/**
 * Simple helper to get user avatar source (simple version)
 */
export const getUserAvatarSourceSimple = (user: any) => {
     const image = extractUserProfileImage(user);
     return getSimpleAvatarSource(image, 'user');
};