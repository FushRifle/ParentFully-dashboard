import * as FileSystem from 'expo-file-system/legacy';

interface ChildData {
     id: number;
     name: string;
     age?: string;
     dob?: string;
     gender: "male" | "female" | "other" | "";
     child_interest: string[];
     allergies: string[];
     photo?: {
          uri: string;
          type?: string;
          fileName?: string;
     } | string;
}

export const getPhotoUri = (profile_picture: ChildData['photo']): string | undefined => {
     if (!profile_picture) return undefined;
     if (typeof profile_picture === 'string') return profile_picture;
     return profile_picture.uri;
};

export const downloadProfileImage = async (url?: string): Promise<string> => {
     try {
          if (!url || typeof url !== 'string') {
               console.warn('No URL provided for downloadProfileImage');
               return ''; // fallback to empty string
          }

          const fileName = url.split('/').pop();
          if (!fileName) return '';

          const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (!fileInfo.exists) {
               await FileSystem.downloadAsync(url, fileUri);
          }

          return fileUri;
     } catch (err) {
          console.error('Failed to download image', err);
          return '';
     }
};

export const getDisplayImageUrl = (image?: string | { uri: string } | null): string | undefined => {
     if (!image) return undefined;

     if (typeof image === 'string') {
          return image.startsWith('http') ? image : undefined;
     }

     if (typeof image === 'object' && 'uri' in image) {
          return image.uri;
     }

     return undefined;
};
