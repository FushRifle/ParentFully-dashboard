import { FileCacheManager, useFileCacheStore } from '@/store/FileCache';
import { BASE_URL } from '@/config';
import { useCallback, useMemo } from 'react';


export const getFileUrl = (filePath: string): string => {
     if (!filePath) return '';

     if (filePath.startsWith('http://') || filePath.startsWith('https://') || filePath.startsWith('file://')) {
          return filePath;
     }

     const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
     return `${BASE_URL}${cleanPath}`;
};

export const getCachedFileUrl = async (
     filePath: string,
     fileName: string = 'file',
     onProgress?: (progress: number) => void
): Promise<string> => {
     const remoteUrl = getFileUrl(filePath);

     if (!remoteUrl.startsWith('http')) {
          return remoteUrl;
     }

     try {
          const fileCache = FileCacheManager.getInstance();

          const cachedUri = await fileCache.getCachedFileUrl(remoteUrl);
          if (cachedUri) {
               console.log('Using cached file:', fileName);
               return cachedUri;
          }

          console.log('Downloading file:', fileName);
          const localUri = await fileCache.downloadAndCacheFile(remoteUrl, fileName, onProgress);
          return localUri;

     } catch (error) {
          console.error('Failed to get cached file URL:', error);
          return remoteUrl;
     }
};

export const useImagePreloader = () => {
     const preloadImages = useCallback(async (imageUrls: string[]) => {
          const fileCache = FileCacheManager.getInstance();
          await fileCache.preloadFiles(imageUrls);
     }, []);

     return { preloadImages };
};

export const useFileCacheManager = () => {
     const clearExpiredFiles = useCallback(async () => {
          const store = useFileCacheStore.getState();
          await store.clearExpiredFiles();
     }, []);

     const clearAllFiles = useCallback(async () => {
          const store = useFileCacheStore.getState();
          await store.clearAllFiles();
     }, []);

     const getCacheStats = useCallback(() => {
          const fileCache = FileCacheManager.getInstance();
          return fileCache.getCacheStats();
     }, []);

     const getDownloadQueue = useCallback(() => {
          const fileCache = FileCacheManager.getInstance();
          return fileCache.getDownloadQueue();
     }, []);

     return {
          clearExpiredFiles,
          clearAllFiles,
          getCacheStats,
          getDownloadQueue,
     };
};

export const IOS_IMAGE_HEADERS = {
     Accept: 'image/*',
     'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
     Origin: 'https://parentfully.stacksgather.com',
     Referer: 'https://parentfully.stacksgather.com/',
} as const;

export const getMessageItemKey = (item: any, index: number): string => {
     return `message-${item.id}-${index}-${item.updated_at || item.created_at}`;
};

export const useOptimizedMessages = (messages: any[]) => {
     return useMemo(() => {
          const batchSize = 10;
          const processedMessages = [];

          for (let i = 0; i < messages.length; i += batchSize) {
               const batch = messages.slice(i, i + batchSize);
               processedMessages.push(...batch);
          }

          return processedMessages;
     }, [messages]);
};


import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

const CACHE_DIR = `${FileSystem.cacheDirectory}share_cache/`;

export const ensureCacheDirectory = async () => {
     const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
     if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
     }
};

export const copyToCache = async (uri: string, filename: string): Promise<string> => {
     await ensureCacheDirectory();

     // Create a unique filename
     const extension = filename.split('.').pop() || 'jpg';
     const cacheFilename = `${Date.now()}_${Math.random().toString(36)}.${extension}`;
     const cacheUri = `${CACHE_DIR}${cacheFilename}`;

     // Copy the file
     await FileSystem.copyAsync({
          from: uri,
          to: cacheUri
     });

     return cacheUri;
};

export const shareFile = async (uri: string, filename: string, mimeType: string): Promise<void> => {
     try {
          console.log('Original URI:', uri);

          if (uri.startsWith('file://')) {
               console.log('File URI detected, using directly');
               await Sharing.shareAsync(uri, {
                    mimeType,
                    dialogTitle: `Share ${filename}`,
                    UTI: 'public.item'
               });
               return;
          }

          // For content URIs, copy to cache first
          console.log('Content URI detected, copying to cache...');
          const cachedUri = await copyToCache(uri, filename);
          console.log('Cached URI:', cachedUri);

          // Share from cache
          if (Platform.OS === 'android') {
               const contentUri = await FileSystem.getContentUriAsync(cachedUri);
               await Sharing.shareAsync(contentUri, {
                    mimeType,
                    dialogTitle: `Share ${filename}`
               });
          } else {
               await Sharing.shareAsync(cachedUri, {
                    mimeType,
                    dialogTitle: `Share ${filename}`,
                    UTI: 'public.item'
               });
          }

          // Clean up after sharing (wait a bit to ensure share is complete)
          setTimeout(async () => {
               try {
                    await FileSystem.deleteAsync(cachedUri, { idempotent: true });
                    console.log('🧹 Cache file cleaned up');
               } catch (e) {
                    console.log('Cleanup error:', e);
               }
          }, 5000);

     } catch (error) {
          console.error('Share error:', error);
          throw error;
     }
};