export interface FileObject {
     uri: string;
     name: string;
     type: string;
     size?: number;
}

export interface SelectedFile extends FileObject {
     isVoice?: boolean;
     duration?: number;
     progress?: number;
     uploaded?: boolean;
}

export interface Attachment {
     id?: number;
     uri: string;
     name: string;
     type: string;
     size?: number;
     uploaded?: boolean;
     caption?: string;
     file_path?: string;
     file_name?: string;
     file_type?: string;
     file_size?: number;
     file_extension?: string;
}

export interface MessageSender {
     id: number;
     name: string;
     profile_picture?: string;
     photo?: string;
}

export interface Message {
     id: number;
     content: string;
     message_text?: string;
     message?: string;
     sender_id: number;
     created_at: string | undefined;
     sent_at?: string;
     read: boolean;
     is_read?: boolean;
     read_at?: string;
     attachments: Attachment[];
     reply_to?: number | null;
     replied_message?: Message | null;
     sender?: MessageSender;
     sender_name?: string;
     conversation_id?: number;
}

export interface SelectedFile {
     uri: string;
     name: string;
     type: string;
     caption: string;
     size?: number;
     isVoice?: boolean;
     duration?: number;
     progress?: number;
     uploaded?: boolean;
}

export interface VoiceRecording {
     uri: string;
     duration: number;
     name: string;
     size?: number;
}

export interface MessageReply {
     id: number;
     content: string;
     sender_id: number;
     sender_name?: string;
}

export interface ApiResponse<T> {
     success: boolean;
     data: T;
     message?: string;
     meta?: {
          current_page: number;
          last_page: number;
          per_page: number;
          total: number;
     };
}

export interface ConversationParticipant {
     id: number;
     name: string;
     profile_picture?: string;
     photo?: string;
}

export interface Chat {
     id: number;
     user1_id: number;
     user2_id: number;
     name?: string;
     avatar?: string;
     last_message?: string;
     last_message_at?: string;
     updatedAt?: string;
     created_at?: string;
     unread_count: number;
     other_participant?: ConversationParticipant;
     participants?: ConversationParticipant[];
     contact_id?: number;
     user_id?: number;
     isGroup?: boolean;
     type?: string;
     lastMessage: string
     unreadCount: number
}

export interface Contact {
     id: number;
     user_id: number;
     registered_user_id?: number;
     name: string;
     profile_picture?: string;
     photo?: {
          uri: string;
          type?: string;
          fileName?: string;
     } | string;
     phone?: string;
     email?: string;
     country_code?: string;
     category: string;
     permissions: string;
     notify_me: boolean;
     notify_contact: boolean;
     data?: any;
}

export interface Group {
     id: number;
     name: string;
     photo?: string;
     description?: string;
     created_at?: string;
     updated_at?: string;
     participants_count?: number;
     unread_count?: number;
}

export interface SharedDocument {
     id: number;
     uri: string;
     name: string;
     type: string;
     size: number;
     uploaded: boolean;
     progress?: number;
}

export interface Picture {
     uri: string;
     name: string;
     type?: string;
     size?: number;
     width?: number;
     height?: number;
}

// API Request Types
export interface SendMessageRequest {
     conversation_id?: number;
     recipient_id?: number;
     message_text: string;
     reply_to?: number;
     attachments?: File[];
}

export interface MarkAsReadRequest {
     message_id?: number;
     conversation_id?: number;
}

// API Response Types for Messages
export interface ApiMessage {
     id: number;
     conversation_id: number;
     sender_id: number;
     message_text: string;
     is_read: boolean;
     sent_at: string;
     read_at?: string;
     sender: MessageSender;
     attachments: ApiAttachment[];
     reply_to?: number;
     replied_message?: ApiMessage;
}

export interface ApiAttachment {
     id: number;
     message_id: number;
     file_path: string;
     file_name: string;
     file_size: number;
     file_type: string;
     file_extension: string;
     caption?: string;
}

/* -------------------------- Chat Comp -------------------------- */
export interface DocumentViewerProps {
     uri: string;
     name: string;
     type: string;
     onClose: () => void;
     onDelete?: () => void;
     attachmentId?: number;
};

export interface ImageDisplayProps {
     path: string;
     width?: number | string;
     height?: number | string;
     borderRadius?: number;
     resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
     onPress?: () => void;
     onDelete?: () => Promise<void>;
     showDelete?: boolean;
     onDownload?: (attachmentId: number, fileName?: string) => Promise<void>;
     attachmentId?: number;
     fileName?: string;
     filePath?: string;
}

export interface VideoViewerProps {
     uri: string;
     name: string;
     onClose: () => void;
     onDownload?: (uri: string) => Promise<void>;
     onShare?: (uri: string) => Promise<void>;
     attachmentId?: number;
};


/* -------------------------- Chat Items -------------------------- */
export interface MessageItemProps {
     msg: any;
     isCurrentUser: boolean;
     onReply: (message: any) => void;
     onEdit?: (message: any) => void;
     onDelete?: (message: any) => void;
     user: any;
     currentContact: any;
     onLongPress: (event: any, messageId: string) => void;
     onPressDocument?: (doc: any) => void;
     onPressVideo?: (videoUri: string) => void;
}

export interface DocumentPreviewProps {
     doc: SharedDocument;
     onRemove: () => void;
     onPress?: () => void;
}

export interface PicturePreviewProps {
     pic: Picture;
     onRemove: () => void;
     onPress?: () => void;
}

export interface UseChatItemsProps {
     actionMenu?: {
          visible: boolean;
          position: { x: number; y: number };
          messageId: string | null;
     };
     setActionMenu?: (menu: { visible: boolean; position: { x: number; y: number }; messageId: string | null }) => void;
     viewingDoc?: any | null;
     setViewingDoc?: (doc: any | null) => void;
     viewingVideo?: string | null;
     setViewingVideo?: (video: string | null) => void;
}