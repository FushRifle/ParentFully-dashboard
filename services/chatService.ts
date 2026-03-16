import { api } from '@/lib/api'
import { ApiResponse, Chat, Message } from '@/types/chat';
import { AxiosError, AxiosResponse } from 'axios';

const handleApiCall = async <T>(
     apiCall: Promise<AxiosResponse<ApiResponse<T>>>,
     operation: string
): Promise<T> => {
     try {
          const response = await apiCall
          return response.data.data
     } catch (error) {
          const axiosError = error as AxiosError<ApiResponse<T>>
          console.error(`API Call Failed: ${operation}`, {
               error: axiosError,
               errorMessage: axiosError.message,
               response: axiosError.response
                    ? {
                         status: axiosError.response.status,
                         data: axiosError.response.data
                    }
                    : 'No response'
          })
          throw error
     }
}

class ChatApiService {

     async getConversations(): Promise<Chat[]> {
          try {
               const res = await api.get<ApiResponse<Chat[]>>('/v1/conversations');
               return res.data.data;
          } catch (error) {
               console.error('[ChatAPI] Error fetching conversations:', error);
               throw error;
          }
     }

     async getSingleConversation(id: number): Promise<Chat> {
          const res = await api.get<ApiResponse<Chat>>(`/v1/conversations/${id}`)
          return res.data.data
     }

     async getOrCreateConversation(contact_id: number): Promise<Chat> {
          try {
               const res = await api.get<ApiResponse<Chat>>(`/v1/conversations/user/${contact_id}`);
               return res.data.data;
          } catch (error: any) {
               console.error('Error in getOrCreateConversation:', error.response?.data || error.message || error);
               throw error;
          }
     }

     async deleteConversation(id: number): Promise<void> {
          await api.delete(`/v1/conversations/${id}`)
     }

     async sendMessage(formData: FormData): Promise<Message> {
          try {
               const formDataArray = Array.from((formData as any)._parts || []);
               let fileCount = 0;
               let audioFileCount = 0;

               formDataArray.forEach((part: any) => {
                    const [key, value] = part;

                    if (value && typeof value === 'object' && 'uri' in value) {
                         fileCount++;

                         if (value.type?.includes('audio')) {
                              audioFileCount++;
                         }

                         console.log(`File found: key=${key}, type=${value.type}, uri=${value.uri}`);
                    } else {
                         console.log(`Non-file field: key=${key}, value=${value}`);
                    }
               });

               console.log(`Total files in formData: ${fileCount}, audio files: ${audioFileCount}`);

               const startTime = Date.now();
               const res = await api.post<ApiResponse<Message>>(
                    '/v1/messages/send',
                    formData,
                    {
                         headers: {
                              'Content-Type': 'multipart/form-data',
                              'Accept': 'application/json',
                         },
                         timeout: 30000,
                    }
               );
               const endTime = Date.now();

               console.log(`Message sent in ${endTime - startTime} ms`);
               console.log('Response data:', res.data);

               if (res.data?.data?.attachments) {
                    const audioAttachments = res.data.data.attachments.filter(
                         (att: any) => att.file_type?.includes('audio') || att.type?.includes('audio')
                    );
                    console.log(`Audio attachments in response: ${audioAttachments.length}`);
                    audioAttachments.forEach((att: any, i: number) => {
                         console.log(`Audio attachment ${i}: name=${att.name}, type=${att.type}, size=${att.size}`);
                    });
               }

               return res.data.data;

          } catch (error: any) {
               console.error('=== SEND MESSAGE ERROR ===');
               console.error('1. Error message:', error.message);

               if (error.response) {
                    console.error('2. Response status:', error.response.status);
                    console.error('3. Response headers:', error.response.headers);
                    console.error('4. Response data:', JSON.stringify(error.response.data, null, 2));

                    if (error.response.data?.errors) {
                         console.error('5. Validation errors:', error.response.data.errors);
                    }
               } else if (error.request) {
                    console.error('2. No response received - network error');
                    console.error('3. Request details:', error.request);
               } else {
                    console.error('2. Error details:', error);
               }

               console.error('=== END ERROR ===\n');
               throw error;
          }
     }

     async getConversationMessages(id: number, page: number): Promise<{ data: Message[], meta: any }> {
          const res = await api.get<ApiResponse<Message[]>>(`/v1/conversations/${id}/messages`, {
               params: { page, per_page: 100 }
          });
          return {
               data: res.data.data,
               meta: res.data.meta
          };
     }

     async markMessageAsRead(formData: FormData): Promise<void> {
          await api.post<ApiResponse<void>>('/v1/messages/mark-read', formData, {
               headers: { 'Content-Type': 'multipart/form-data' },
          })
     }

     async downloadAttachment(id: number): Promise<Blob> {
          const res = await api.get(`/v1/messages/attachments/${id}/download`, {
               responseType: 'blob',
          });
          console.log('Attachment downloaded:', res.data);
          return res.data;
     }

     async deleteMessage(id: number): Promise<void> {
          await api.delete(`/v1/messages/${id}`)
     }

     //-----------------------------------------//
     async getMessageAttachments(messageId: number): Promise<any[]> {
          try {
               const response = await api.get(`/v1/messages/${messageId}/attachments`);
               return response.data.attachments || [];
          } catch (error) {
               console.error('Error fetching message attachments:', error);
               return [];
          }
     }

     async getAttachmentUrl(attachmentId: number): Promise<string> {
          const response = await api.get(`/v1/attachments/${attachmentId}/url`);
          return response.data.url;
     }

     async getAttachmentInfo(attachmentId: number): Promise<any> {
          const response = await api.get(`/v1/attachments/${attachmentId}`);
          return response.data;
     }
}

export const chatApi = new ChatApiService()
