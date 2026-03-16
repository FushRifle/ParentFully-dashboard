import { useState } from 'react';

type UploadType = 'user' | 'child' | 'contact';

interface UsePhotoUploadProps {
     uploadType: UploadType;
     childId?: number;
     contactId?: number;
     onPhotoUpdate?: (photoUri: string) => void;
}

export default function usePhotoUpload({
     uploadType = 'user',
     childId,
     contactId,
     onPhotoUpdate,
}: UsePhotoUploadProps) {
     const [isUploading, setIsUploading] = useState(false);
     const [uploadError, setUploadError] = useState<string | null>(null);
     const [selectedImage, setSelectedImage] = useState<string | null>(null);

     const compressImage = async (file: File): Promise<File> => {
          return new Promise((resolve, reject) => {
               try {
                    console.log('Compressing image...');

                    const reader = new FileReader();
                    reader.readAsDataURL(file);

                    reader.onload = (event) => {
                         const img = new Image();
                         img.src = event.target?.result as string;

                         img.onload = () => {
                              // Create canvas for compression
                              const canvas = document.createElement('canvas');
                              const ctx = canvas.getContext('2d');

                              // Calculate new dimensions (max width 800px)
                              let width = img.width;
                              let height = img.height;

                              if (width > 800) {
                                   height = (height * 800) / width;
                                   width = 800;
                              }

                              canvas.width = width;
                              canvas.height = height;

                              // Draw and compress
                              ctx?.drawImage(img, 0, 0, width, height);

                              // Convert to blob
                              canvas.toBlob(
                                   (blob) => {
                                        if (blob) {
                                             const compressedFile = new File(
                                                  [blob],
                                                  file.name.replace(/\.[^/.]+$/, '.jpg'),
                                                  { type: 'image/jpeg' }
                                             );
                                             console.log('Image compressed successfully');
                                             resolve(compressedFile);
                                        } else {
                                             reject(new Error('Failed to compress image'));
                                        }
                                   },
                                   'image/jpeg',
                                   0.7 // 70% quality
                              );
                         };

                         img.onerror = () => {
                              reject(new Error('Failed to load image'));
                         };
                    };

                    reader.onerror = () => {
                         reject(new Error('Failed to read file'));
                    };
               } catch (error) {
                    console.error('Image compression failed:', error);
                    reject(error);
               }
          });
     };

     const pickImage = async (): Promise<string | null> => {
          setIsUploading(true);
          setUploadError(null);

          try {
               // Create file input element
               const input = document.createElement('input');
               input.type = 'file';
               input.accept = 'image/*';

               // Return a promise that resolves with the file
               const file = await new Promise<File | null>((resolve) => {
                    input.onchange = (e) => {
                         const target = e.target as HTMLInputElement;
                         const file = target.files?.[0] || null;
                         resolve(file);
                    };

                    input.oncancel = () => resolve(null);
                    input.click();
               });

               if (!file) {
                    setIsUploading(false);
                    return null;
               }

               console.log('Original image selected:', file.name);

               // Compress the image
               const compressedFile = await compressImage(file);
               console.log('Compressed image ready:', compressedFile.name);

               // Convert to data URL for preview
               const reader = new FileReader();
               const dataUrl = await new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = () => reject(new Error('Failed to read file'));
                    reader.readAsDataURL(compressedFile);
               });

               // Update local state
               setSelectedImage(dataUrl);
               onPhotoUpdate?.(dataUrl);
               setIsUploading(false);
               return dataUrl;

          } catch (error) {
               console.error('Image picking error:', error);
               setUploadError('Failed to pick image');
               setIsUploading(false);
               return null;
          }
     };

     const takePhoto = async (): Promise<string | null> => {
          setIsUploading(true);
          setUploadError(null);

          try {
               // Check if device has camera
               if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    setUploadError('Camera is not supported on this device');
                    setIsUploading(false);
                    return null;
               }

               // Create file input with camera capture
               const input = document.createElement('input');
               input.type = 'file';
               input.accept = 'image/*';
               input.capture = 'environment'; // Use rear camera

               const file = await new Promise<File | null>((resolve) => {
                    input.onchange = (e) => {
                         const target = e.target as HTMLInputElement;
                         const file = target.files?.[0] || null;
                         resolve(file);
                    };

                    input.oncancel = () => resolve(null);
                    input.click();
               });

               if (!file) {
                    setIsUploading(false);
                    return null;
               }

               console.log('Photo captured:', file.name);

               // Compress the image
               const compressedFile = await compressImage(file);
               console.log('Compressed photo ready:', compressedFile.name);

               // Convert to data URL
               const reader = new FileReader();
               const dataUrl = await new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = () => reject(new Error('Failed to read file'));
                    reader.readAsDataURL(compressedFile);
               });

               // Update local state
               setSelectedImage(dataUrl);
               onPhotoUpdate?.(dataUrl);
               setIsUploading(false);
               return dataUrl;

          } catch (error) {
               console.error('Camera error:', error);
               setUploadError('Failed to take photo');
               setIsUploading(false);
               return null;
          }
     };

     const preparePhotoForUpload = (imageUri: string) => {
          let fileName = '';

          switch (uploadType) {
               case 'user':
                    fileName = `user_profile_${Date.now()}.jpg`;
                    break;
               case 'child':
                    fileName = `child_profile_${childId}_${Date.now()}.jpg`;
                    break;
               case 'contact':
                    fileName = `contact_profile_${contactId}_${Date.now()}.jpg`;
                    break;
               default:
                    fileName = `profile_${Date.now()}.jpg`;
          }

          // Convert data URL to File object if needed
          if (imageUri.startsWith('data:')) {
               const byteString = atob(imageUri.split(',')[1]);
               const mimeString = imageUri.split(',')[0].split(':')[1].split(';')[0];
               const ab = new ArrayBuffer(byteString.length);
               const ia = new Uint8Array(ab);

               for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
               }

               const blob = new Blob([ab], { type: mimeString });
               return new File([blob], fileName, { type: mimeString });
          }

          // If it's a URL, return as is
          return {
               uri: imageUri,
               type: 'image/jpeg',
               name: fileName,
          };
     };

     const clearImage = async (): Promise<boolean> => {
          try {
               setSelectedImage(null);
               setUploadError(null);
               onPhotoUpdate?.('');
               return true;
          } catch (error) {
               console.error('Error clearing image:', error);
               setUploadError('Failed to clear image');
               return false;
          }
     };

     const getPickerTitle = (): string => {
          switch (uploadType) {
               case 'user':
                    return 'Select Profile Photo';
               case 'child':
                    return 'Select Child Photo';
               case 'contact':
                    return 'Select Contact Photo';
               default:
                    return 'Select Photo';
          }
     };

     const getRemoveButtonText = (): string => {
          switch (uploadType) {
               case 'user':
                    return 'Remove Profile Photo';
               case 'child':
                    return 'Remove Child Photo';
               case 'contact':
                    return 'Remove Contact Photo';
               default:
                    return 'Remove Current Photo';
          }
     };

     const showImagePickerOptions = (): Promise<string | null> => {
          // For web, we can show a custom modal or just use the browser's native picker
          // This is a simplified version - you might want to use a proper modal component
          return pickImage();
     };

     return {
          // State
          selectedImage,
          isUploading,
          uploadError,

          // Actions
          pickImage,
          takePhoto,
          showImagePickerOptions,
          preparePhotoForUpload,
          clearImage,
          compressImage,
          getPickerTitle,
          getRemoveButtonText,
     };
}