import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
     getSupportData,
     startSupportChat,
     getSupportConversation,
     updateSupportConversationStatus,
     SupportData,
     StartChatResponse,
     SupportConversationResponse,
} from '@/services/supportService/supportService';
import type {
     ChatMessage,
     FAQItem,
     ResourceItem,
     ContactMethod,
} from '@/types/support';

export const useSupport = () => {
     // Support data states
     const [faqs, setFaqs] = useState<FAQItem[]>([]);
     const [resources, setResources] = useState<ResourceItem[]>([]);
     const [contacts, setContacts] = useState<ContactMethod[]>([]);

     const [messages, setMessages] = useState<ChatMessage[]>([]);
     const [conversationId, setConversationId] = useState<string | null>(null);
     const [conversationStatus, setConversationStatus] = useState<'open' | 'closed' | 'resolved'>('closed');
     const [supportUserId, setSupportUserId] = useState<number | null>(null);

     // UI states
     const [loading, setLoading] = useState({
          supportData: false,
          chat: false,
          conversation: false,
          statusUpdate: false,
     });
     const [error, setError] = useState<string | null>(null);

     // Load support data (FAQs, resources, contacts)
     const loadSupportData = useCallback(async () => {
          setLoading(prev => ({ ...prev, supportData: true }));
          setError(null);

          try {
               const data = await getSupportData();

               setFaqs(data.faqs || []);
               setResources(data.resources || []);
               setContacts(data.contacts || []);

               // Cache the support data
               await AsyncStorage.setItem('support_data', JSON.stringify(data));
          } catch (e: any) {
               setError(e?.message ?? 'Failed to load support data');

               // Try to load from cache
               try {
                    const cached = await AsyncStorage.getItem('support_data');
                    if (cached) {
                         const data = JSON.parse(cached) as SupportData;
                         setFaqs(data.faqs || []);
                         setResources(data.resources || []);
                         setContacts(data.contacts || []);
                    }
               } catch (cacheError) {
                    console.error('Failed to load cached support data:', cacheError);
               }
          } finally {
               setLoading(prev => ({ ...prev, supportData: false }));
          }
     }, []);

     // Start a new chat
     const startChat = useCallback(async (): Promise<StartChatResponse | null> => {
          setLoading(prev => ({ ...prev, chat: true }));
          setError(null);

          try {
               const response = await startSupportChat();

               setSupportUserId(response.support_user_id);

               // Transform initial messages to match ChatMessage type
               const initialMessages: ChatMessage[] = (response.initial_messages || []).map((msg: any) => ({
                    id: msg.id || `msg-${Date.now()}-${Math.random()}`,
                    text: msg.text || msg.content || '',
                    sender: msg.sender || 'support',
                    createdAt: msg.created_at || msg.createdAt || new Date().toISOString(),
               }));

               setMessages(initialMessages);
               setConversationStatus('open');

               // Clear any previous conversation ID since this is a new chat
               setConversationId(null);

               return response;
          } catch (e: any) {
               setError(e?.message ?? 'Failed to start chat');
               return null;
          } finally {
               setLoading(prev => ({ ...prev, chat: false }));
          }
     }, []);

     const loadConversation = useCallback(async (perPage: number = 15): Promise<SupportConversationResponse | null> => {
          setLoading(prev => ({ ...prev, conversation: true }));
          setError(null);

          try {
               const response = await getSupportConversation(perPage);
               const transformedMessages: ChatMessage[] = (response.messages || []).map((msg: any) => ({
                    id: msg.id || `msg-${Date.now()}-${Math.random()}`,
                    text: msg.text || msg.content || '',
                    sender: msg.sender || (msg.sender_id === supportUserId ? 'support' : 'user'),
                    createdAt: msg.created_at || msg.createdAt || new Date().toISOString(),
               }));

               setMessages(transformedMessages);
               setConversationId(response.conversation_id);
               setConversationStatus(response.status);

               return response;
          } catch (e: any) {
               setError(e?.message ?? 'Failed to load conversation');
               return null;
          } finally {
               setLoading(prev => ({ ...prev, conversation: false }));
          }
     }, [supportUserId]);

     const updateStatus = useCallback(async (status: 'open' | 'resolved'): Promise<boolean> => {
          if (!conversationId) {
               setError('No active conversation');
               return false;
          }

          setLoading(prev => ({ ...prev, statusUpdate: true }));
          setError(null);

          try {
               const success = await updateSupportConversationStatus(conversationId, status);

               if (success) {
                    setConversationStatus(status === 'resolved' ? 'resolved' : 'open');
               }

               return success;
          } catch (e: any) {
               setError(e?.message ?? 'Failed to update conversation status');
               return false;
          } finally {
               setLoading(prev => ({ ...prev, statusUpdate: false }));
          }
     }, [conversationId]);

     const sendMessage = useCallback(async (text: string): Promise<void> => {
          if (!text.trim()) return;

          const tempMessage: ChatMessage = {
               id: `temp-${Date.now()}`,
               text: text,
               sender: 'user',
               createdAt: new Date().toISOString(),
          };

          setMessages(prev => [...prev, tempMessage]);

          try {
               setTimeout(() => {
                    const supportResponse: ChatMessage = {
                         id: `support-${Date.now()}`,
                         text: "Thanks for your message. Our support team will get back to you shortly.",
                         sender: 'support',
                         createdAt: new Date().toISOString(),
                    };
                    setMessages(prev => [...prev, supportResponse]);
               }, 1000);

          } catch (error) {
               // If message fails, mark it as failed or remove it
               console.error('Failed to send message:', error);
               setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
               setError('Failed to send message. Please try again.');
          }
     }, [conversationId]);

     // Clear chat state
     const clearChat = useCallback((): void => {
          setMessages([]);
          setConversationId(null);
          setConversationStatus('closed');
          setSupportUserId(null);
     }, []);

     const refresh = useCallback(async (): Promise<void> => {
          await loadSupportData();
          if (conversationId) {
               await loadConversation();
          }
     }, [loadSupportData, loadConversation, conversationId]);

     useEffect(() => {
          loadSupportData();
     }, [loadSupportData]);

     return {
          // Data
          faqs,
          resources,
          contacts,
          messages,
          conversationId,
          conversationStatus,
          supportUserId,

          // Loading states
          loading,
          error,

          // Actions
          startChat,
          loadConversation,
          updateStatus,
          sendMessage,
          clearChat,
          refresh,

          setMessages,
          setConversationStatus,
     };
};