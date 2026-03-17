import { BASE_URL } from "@/config";

// utils/mime.ts
export function getMimeType(filename: string | undefined): string {
     if (!filename) return 'application/octet-stream';
     const ext = filename.split('.').pop()?.toLowerCase();
     switch (ext) {
          case 'jpg':
          case 'jpeg':
               return 'image/jpeg';
          case 'png':
               return 'image/png';
          case 'gif':
               return 'image/gif';
          case 'mp4':
               return 'video/mp4';
          case 'mov':
               return 'video/quicktime';
          case 'pdf':
               return 'application/pdf';
          case 'doc':
               return 'application/msword';
          case 'docx':
               return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          case 'txt':
               return 'text/plain';
          default:
               return 'application/octet-stream';
     }
}

// utils/attachments.ts

/**
 * Returns the full download URL for an attachment
 * @param attachmentId - The ID of the attachment
 */
export const getAttachmentDownloadUrl = (attachmentId: string | number) =>
     `${BASE_URL}/v1/messages/attachments/${attachmentId}/download`;