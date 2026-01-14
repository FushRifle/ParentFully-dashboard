import { api } from '@/lib/api'
import { ApiResponse, Chat, Message } from '@/types/chat';

class ChatApiService {

     async getConversations(): Promise<Chat[]> {
          const res = await api.get<ApiResponse<Chat[]>>('/v1/conversations')
          return res.data.data
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
               formDataArray.forEach((part: any) => {
                    const [key, value] = part;
                    if (value && typeof value === 'object' && 'uri' in value) {
                    } else {
                         console.log(`  ${key}:`, value);
                    }
               });

               const res = await api.post<ApiResponse<Message>>(
                    '/v1/messages/send',
                    formData,
                    {
                         headers: {
                              'Content-Type': 'multipart/form-data',
                              'Accept': 'application/json'
                         }
                    }
               );

               return res.data.data;
          } catch (error: any) {
               if (error.response?.data?.errors) {
               }

               throw error;
          }
     }

     async getConversationMessages(id: number, nextPage: number): Promise<Message[]> {
          const res = await api.get<ApiResponse<Message[]>>(`/v1/conversations/${id}/messages`);

          const messagesWithAttachments = res.data.data.filter(
               msg => msg.attachments && msg.attachments.length > 0
          );

          if (messagesWithAttachments.length > 0) {
          }

          return res.data.data;
     }

     async markMessageAsRead(formData: FormData): Promise<void> {
          await api.post<ApiResponse<void>>('/v1/messages/mark-read', formData, {
               headers: { 'Content-Type': 'multipart/form-data' },
          })
     }

     async downloadAttachment(id: number): Promise<Blob> {
          console.log(`Downloading attachment with id: ${id}`);
          const res = await api.get<Blob>(`/v1/messages/attachments/${id}/download`, {
               responseType: 'blob',
          });
          console.log('Attachment downloaded:', res.data);
          return res.data;
     }


     async deleteMessage(id: number): Promise<void> {
          await api.delete(`/v1/messages/${id}`)
     }



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
