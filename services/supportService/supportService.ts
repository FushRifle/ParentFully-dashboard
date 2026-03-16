import { api } from '@/lib/api';
import axios from 'axios';
import type {
     ChatMessage,
     FAQItem,
     ResourceItem,
     ContactMethod,
} from '@/types/support';

export interface SupportData {
     faqs: FAQItem[];
     resources: ResourceItem[];
     contacts: ContactMethod[];
}

export const getSupportData = async (): Promise<SupportData> => {
     console.debug('[SupportService] getSupportData → /v1/support');

     const res = await api.get<{
          success: boolean;
          data: SupportData;
     }>('/v1/support');

     console.debug('[SupportService] getSupportData ←', res.data);

     return res.data.data;
};

export interface StartChatResponse {
     support_user_id: number;
     initial_messages: ChatMessage[];
}

export const startSupportChat = async (): Promise<StartChatResponse> => {
     console.debug('[SupportService] startSupportChat → /v1/support/start-chat');

     const res = await api.post<{
          success: boolean;
          data: StartChatResponse;
     }>('/v1/support/start-chat');

     console.debug('[SupportService] startSupportChat ←', res.data);

     return res.data.data;
};

export interface SupportConversationResponse {
     messages: ChatMessage[];
     conversation_id: string;
     status: 'open' | 'closed';
}

export const getSupportConversation = async (
     perPage: number = 15
): Promise<SupportConversationResponse> => {
     try {
          const res = await api.get<{
               success: boolean;
               data: SupportConversationResponse
          }>(`/v1/support/conversations?per_page=${perPage}`);

          return res.data.data;
     } catch (error) {
          if (axios.isAxiosError(error)) {
               console.log('[SupportConversation][AxiosError]', {
                    status: error.response?.status,
                    message: error.message,
                    data: error.response?.data,
                    url: error.config?.url,
                    method: error.config?.method,
               });
          } else {
               console.log('[SupportConversation][UnknownError]', error);
          }

          throw error;
     }
};


export const updateSupportConversationStatus = async (
     conversationId: string,
     status: 'open' | 'resolved'
): Promise<boolean> => {
     console.debug(
          '[SupportService] updateSupportConversationStatus →',
          { conversationId, status }
     );

     const res = await api.put<{
          success: boolean;
     }>(
          `/v1/support/conversations/${conversationId}/status`,
          { status }
     );

     console.debug(
          '[SupportService] updateSupportConversationStatus ←',
          res.data
     );

     return res.data.success;
};
