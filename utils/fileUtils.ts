// utils/fileUtils.js or utils/mimeTypes.js

/**
 * Comprehensive MIME type mapping
 */
const MIME_TYPES: Record<string, string> = {
     // Images
     'jpg': 'image/jpeg',
     'jpeg': 'image/jpeg',
     'png': 'image/png',
     'gif': 'image/gif',
     'webp': 'image/webp',
     'bmp': 'image/bmp',
     'svg': 'image/svg+xml',
     'ico': 'image/x-icon',
     'tiff': 'image/tiff',
     'tif': 'image/tiff',
     'heic': 'image/heic',
     'heif': 'image/heif',

     // Videos
     'mp4': 'video/mp4',
     'mov': 'video/quicktime',
     'avi': 'video/x-msvideo',
     'mkv': 'video/x-matroska',
     'webm': 'video/webm',
     'flv': 'video/x-flv',
     'wmv': 'video/x-ms-wmv',
     'm4v': 'video/x-m4v',
     '3gp': 'video/3gpp',
     '3g2': 'video/3gpp2',

     // Audio
     'mp3': 'audio/mpeg',
     'wav': 'audio/wav',
     'm4a': 'audio/mp4',
     'aac': 'audio/aac',
     'ogg': 'audio/ogg',
     'flac': 'audio/flac',
     'aiff': 'audio/aiff',
     'wma': 'audio/x-ms-wma',
     'opus': 'audio/opus',
     'amr': 'audio/amr',

     // Documents
     'pdf': 'application/pdf',
     'doc': 'application/msword',
     'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
     'xls': 'application/vnd.ms-excel',
     'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
     'ppt': 'application/vnd.ms-powerpoint',
     'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
     'txt': 'text/plain',
     'rtf': 'application/rtf',
     'csv': 'text/csv',
     'md': 'text/markdown',

     // Archives
     'zip': 'application/zip',
     'rar': 'application/x-rar-compressed',
     '7z': 'application/x-7z-compressed',
     'tar': 'application/x-tar',
     'gz': 'application/gzip',
     'bz2': 'application/x-bzip2',

     // Code
     'js': 'application/javascript',
     'json': 'application/json',
     'xml': 'application/xml',
     'html': 'text/html',
     'css': 'text/css',
     'php': 'application/x-httpd-php',
     'py': 'text/x-python',
     'java': 'text/x-java-source',

     // Fonts
     'ttf': 'font/ttf',
     'otf': 'font/otf',
     'woff': 'font/woff',
     'woff2': 'font/woff2',
     'eot': 'application/vnd.ms-fontobject',

     // Others
     'epub': 'application/epub+zip',
     'ics': 'text/calendar',
     'vcf': 'text/vcard',
};

/**
 * Default MIME type for unknown files
 */
const DEFAULT_MIME_TYPE = 'application/octet-stream';

/**
 * Get file extension from filename or URI
 */
export const getFileExtension = (filename: string): string => {
     if (!filename) return '';

     // Remove query parameters if it's a URI
     const cleanName = filename.split('?')[0];

     // Extract extension
     const match = cleanName.match(/\.([^.]+)$/);
     return match ? match[1].toLowerCase() : '';
};

/**
 * Get MIME type from filename
 */
export const getMimeTypeFromFilename = (filename: string): string => {
     if (!filename) return DEFAULT_MIME_TYPE;

     const ext = getFileExtension(filename);
     return MIME_TYPES[ext] || DEFAULT_MIME_TYPE;
};

/**
 * Get MIME type from file object
 */
export const getMimeTypeFromFile = (file: {
     name?: string;
     type?: string;
     uri?: string;
     mimeType?: string;
}): string => {
     // If mimeType is directly provided, use it
     if (file.mimeType) return file.mimeType;

     // If type is provided (from picker), use it
     if (file.type) return file.type;

     // Try to get from name
     if (file.name) {
          const fromName = getMimeTypeFromFilename(file.name);
          if (fromName !== DEFAULT_MIME_TYPE) return fromName;
     }

     // Try to get from URI
     if (file.uri) {
          const fromUri = getMimeTypeFromFilename(file.uri);
          if (fromUri !== DEFAULT_MIME_TYPE) return fromUri;
     }

     return DEFAULT_MIME_TYPE;
};

/**
 * Get MIME type from data URL
 */
export const getMimeTypeFromDataUrl = (dataUrl: string): string | null => {
     const match = dataUrl.match(/^data:([^;]+);/);
     return match ? match[1] : null;
};

/**
 * Get file type category
 */
export const getFileCategory = (mimeType: string): 'image' | 'video' | 'audio' | 'document' | 'other' => {
     if (mimeType.startsWith('image/')) return 'image';
     if (mimeType.startsWith('video/')) return 'video';
     if (mimeType.startsWith('audio/')) return 'audio';
     if (mimeType.includes('pdf') || mimeType.includes('document') ||
          mimeType.includes('spreadsheet') || mimeType.includes('presentation') ||
          mimeType === 'text/plain') {
          return 'document';
     }
     return 'other';
};

/**
 * Check if file is an image
 */
export const isImageFile = (file: { type?: string; name?: string; mimeType?: string }): boolean => {
     const mime = getMimeTypeFromFile(file);
     return mime.startsWith('image/');
};

/**
 * Check if file is a video
 */
export const isVideoFile = (file: { type?: string; name?: string; mimeType?: string }): boolean => {
     const mime = getMimeTypeFromFile(file);
     return mime.startsWith('video/');
};

/**
 * Check if file is audio
 */
export const isAudioFile = (file: { type?: string; name?: string; mimeType?: string }): boolean => {
     const mime = getMimeTypeFromFile(file);
     return mime.startsWith('audio/');
};

/**
 * Check if file is a document
 */
export const isDocumentFile = (file: { type?: string; name?: string; mimeType?: string }): boolean => {
     const mime = getMimeTypeFromFile(file);
     return !mime.startsWith('image/') &&
          !mime.startsWith('video/') &&
          !mime.startsWith('audio/');
};

/**
 * Get appropriate icon name for file type
 */
export const getFileIcon = (mimeType: string): string => {
     if (mimeType.startsWith('image/')) return 'image';
     if (mimeType.startsWith('video/')) return 'video';
     if (mimeType.startsWith('audio/')) return 'audio';
     if (mimeType.includes('pdf')) return 'pdf';
     if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
     if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'xls';
     if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'ppt';
     if (mimeType === 'text/plain') return 'txt';
     if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'zip';
     return 'file';
};

/**
 * Get file size in human readable format
 */
export const formatFileSize = (bytes?: number): string => {
     if (!bytes || bytes === 0) return '0 B';

     const units = ['B', 'KB', 'MB', 'GB', 'TB'];
     const k = 1024;
     const i = Math.floor(Math.log(bytes) / Math.log(k));

     return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
};

/**
 * Validate file size against limit
 */
export const isValidFileSize = (fileSize: number, maxSizeMB: number = 10): boolean => {
     const maxSizeBytes = maxSizeMB * 1024 * 1024;
     return fileSize <= maxSizeBytes;
};

/**
 * Get file info object
 */
export const getFileInfo = (file: {
     uri: string;
     name?: string;
     type?: string;
     size?: number;
}) => {
     const mimeType = getMimeTypeFromFile(file);
     const category = getFileCategory(mimeType);
     const extension = getFileExtension(file.name || file.uri);

     return {
          ...file,
          mimeType,
          category,
          extension,
          isImage: category === 'image',
          isVideo: category === 'video',
          isAudio: category === 'audio',
          isDocument: category === 'document',
          formattedSize: formatFileSize(file.size),
     };
};

// Export everything
export default {
     getMimeTypeFromFilename,
     getMimeTypeFromFile,
     getFileExtension,
     getFileCategory,
     isImageFile,
     isVideoFile,
     isAudioFile,
     isDocumentFile,
     getFileIcon,
     formatFileSize,
     isValidFileSize,
     getFileInfo,
     MIME_TYPES,
     DEFAULT_MIME_TYPE,
};