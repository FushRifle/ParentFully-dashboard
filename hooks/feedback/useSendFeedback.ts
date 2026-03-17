import { useState } from 'react';
import { useProfileData } from '@/hooks/auth/useProfileData';
import { supabase } from '@/supabase/client';

type FeedbackData = {
     type?: 'bug' | 'idea' | 'feedback' | 'feature';
     message: string;
     email?: string;
     name?: string;
     attachments?: string[];
};

export const useSendFeedback = () => {
     const { user } = useProfileData();
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [success, setSuccess] = useState(false);

     // Next.js compatible upload function (handles base64 or blob data)
     const uploadAttachment = async (fileData: string | File, fileName: string) => {
          try {
               // Handle File object from browser
               if (fileData instanceof File) {
                    const arrayBuffer = await fileData.arrayBuffer();

                    const { data, error } = await supabase.storage
                         .from('feedback_attachments')
                         .upload(fileName, arrayBuffer, {
                              upsert: true,
                              contentType: fileData.type || 'image/jpeg',
                         });

                    if (error) {
                         console.error('Supabase upload error:', error);
                         throw error;
                    }

                    const { data: urlData } = supabase.storage
                         .from('feedback_attachments')
                         .getPublicUrl(fileName);

                    return urlData.publicUrl;
               }

               // Handle base64 string
               if (typeof fileData === 'string' && fileData.startsWith('data:')) {
                    // Convert base64 to blob
                    const response = await fetch(fileData);
                    const blob = await response.blob();

                    const { data, error } = await supabase.storage
                         .from('feedback_attachments')
                         .upload(fileName, blob, {
                              upsert: true,
                              contentType: blob.type || 'image/jpeg',
                         });

                    if (error) {
                         console.error('Supabase upload error:', error);
                         throw error;
                    }

                    const { data: urlData } = supabase.storage
                         .from('feedback_attachments')
                         .getPublicUrl(fileName);

                    return urlData.publicUrl;
               }

               // If it's already a URL, return as is
               return fileData as string;
          } catch (err) {
               console.error('Upload failed:', fileName, err);
               throw err;
          }
     };

     const sendFeedback = async (data: FeedbackData) => {
          setLoading(true);
          setError(null);
          setSuccess(false);

          try {
               let attachmentUrls: string[] = [];

               if (data.attachments?.length) {
                    // Filter out non-URL attachments (files or base64)
                    const filesToUpload = data.attachments.filter(
                         attachment => attachment.startsWith('data:') || attachment.startsWith('blob:')
                    );

                    const existingUrls = data.attachments.filter(
                         attachment => !attachment.startsWith('data:') && !attachment.startsWith('blob:')
                    );

                    // Upload new files
                    if (filesToUpload.length > 0) {
                         const uploadedUrls = await Promise.all(
                              filesToUpload.map(async (fileData, index) => {
                                   const fileName = `feedback_${Date.now()}_${index}.jpg`;
                                   return await uploadAttachment(fileData, fileName);
                              })
                         );
                         attachmentUrls = [...existingUrls, ...uploadedUrls];
                    } else {
                         attachmentUrls = data.attachments;
                    }
               }

               const { data: insertedData, error: supabaseError } = await supabase
                    .from('feedbacks')
                    .insert([
                         {
                              type: data.type || 'feedback',
                              message: data.message,
                              name: data.name || user?.user?.name || 'Anonymous',
                              email: data.email || user?.user?.email || '',
                              attachments: attachmentUrls,
                         },
                    ])
                    .select();

               if (supabaseError) {
                    console.error('[Supabase Insert Error]', supabaseError);
                    setError(supabaseError.message);
                    return;
               }

               console.log('[Feedback Inserted]', insertedData);
               setSuccess(true);
          } catch (err: any) {
               console.error('[Send Feedback Error]', err);
               setError(err?.message || 'Failed to send feedback');
          } finally {
               setLoading(false);
          }
     };

     return {
          sendFeedback,
          uploadAttachment,
          loading,
          error,
          success,
          setError,
          setLoading,
          setSuccess
     };
};