import * as FileSystem from 'expo-file-system/legacy';
import { api } from '@/lib/api';

export async function downloadFile(
     remotePath: string,
     filename: string,
     folder: string
): Promise<string> {
     const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
     const dir = `${FileSystem.documentDirectory}${folder}/`;
     const localUri = `${dir}${safeFilename}`;

     // Ensure directory exists
     await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(
          () => { }
     );

     // Skip if already downloaded
     const info = await FileSystem.getInfoAsync(localUri);
     if (info.exists) {
          return localUri;
     }

     /**
      * STEP 1 — HEAD request via Axios
      * This ensures:
      * - token is valid
      * - no HTML / JSON is returned
      * - interceptors handle 401 logout
      */
     const headRes = await api.head(remotePath);

     const contentType =
          headRes.headers['content-type'] ||
          headRes.headers['Content-Type'];

     if (!contentType || !contentType.startsWith('image/')) {
          throw new Error(
               `downloadFile: Backend did not return an image (Content-Type: ${contentType})`
          );
     }

     /**
      * STEP 2 — Actual download via Expo FS
      * (Axios cannot write to disk in Expo)
      */
     const result = await FileSystem.downloadAsync(
          remotePath,
          localUri,
          {
               headers: {
                    // Authorization header already validated by Axios HEAD
                    Accept: 'image/*',
               },
          }
     );

     return result.uri;
}
