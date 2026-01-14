// types/chat.ts
export interface Attachment {
    id?: number;
    uri: string;
    name: string;
    type: string;
    size?: number;
    uploaded?: boolean;
}

export interface Message {
    id: number;
    content: string;
    sender_id: number;
    sender_name?: string;
    created_at: string;
    read: boolean;
    attachments: Attachment[];
    reply_to?: number | null;
    replied_message?: Message | null;
    // Additional fields that might be coming from API
    conversation_id?: number;
    updated_at?: string;
    message?: string; // Some APIs use 'message' instead of 'content'
}

export interface SelectedFile {
    uri: string;
    name: string;
    type: string;
    size?: number;
    isVoice?: boolean;
}