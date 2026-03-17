import { BASE_URL } from '@/config';

export const getFileUrl = (filePath: string): string => {
     if (!filePath) return '';
     if (filePath.startsWith('https')) return filePath;
     return `${BASE_URL}/storage/${filePath}`;
};

export const formatTime = (dateString: string | Date): string => {
     const date = new Date(dateString);
     let hours = date.getHours();
     const minutes = date.getMinutes();
     const ampm = hours >= 12 ? 'PM' : 'AM';
     hours = hours % 12;
     hours = hours === 0 ? 12 : hours;
     const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
     return `${hours}:${minutesStr} ${ampm}`;
};

export const formatDate = (dateString: string | Date): string => {
     const date = new Date(dateString);
     const today = new Date();

     const formatTimeWithAmPm = (d: Date) => {
          let hours = d.getHours();
          const minutes = d.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours === 0 ? 12 : hours;
          const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
          return `${hours}:${minutesStr} ${ampm}`;
     };

     return date.toDateString() === today.toDateString()
          ? formatTimeWithAmPm(date)
          : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const formatDuration = (millis: number): string => {
     const minutes = Math.floor(millis / 60000);
     const seconds = ((millis % 60000) / 1000).toFixed(0);
     return `${minutes}:${seconds.padStart(2, '0')}`;
};

const IMAGE_EXTENSIONS = [
     'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif',
     'arw', 'cr2', 'cr3', 'crw', 'dng', 'erf', 'kdc', 'mrw', 'nef',
     'nrw', 'orf', 'pef', 'raf', 'raw', 'rw2', 'rwl', 'srf', 'srw',
     'avif', 'heic', 'heif', 'jxl',
     'svg', 'svgz',
     'ico', 'icns', 'jp2', 'jpf', 'jpx', 'j2k', 'j2c', 'fpx', 'pcd',
     'pcx', 'pict', 'pct', 'pxr', 'sct', 'tga', 'wbmp', 'xbm', 'xpm'
];

const AUDIO_EXTENSIONS = [
     'mp3', 'aac', 'ogg', 'oga', 'm4a', 'wma', 'ra', 'ram',
     'wav', 'flac', 'alac', 'aiff', 'aif', 'aifc', 'ape', 'shn',
     'amr', 'au', 'snd', 'mid', 'midi', 'kar', 'rmi', 'mp2', 'mpa',
     'mpc', 'voc', 'vox', '8svx', 'cda', 'dsd', 'dsf', 'dff', 'mka',
     'opus', 'spx', 'tta', 'weba', 'ac3', 'dts', 'thd', 'm4b', 'm4p',
     'm4r', 'mmf', 'msv', 'oga', 'ogx', 'qcp', 'sln', 'vqf'
];

const VIDEO_EXTENSIONS = [
     'mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'm4v',
     'mpeg', 'mpg', 'mpe', 'm1v', 'm2v', 'mpv', 'ogv', 'qt',
     '3g2', '3gp', 'asf', 'avchd', 'drc', 'f4v', 'f4p', 'f4a', 'f4b',
     'h264', 'h265', 'hevc', 'm2ts', 'mts', 'mxf', 'nsv', 'ogm', 'rm',
     'rmvb', 'roq', 'svi', 'ts', 'vob', 'webm', 'wtv', 'yuv'
];

const DOCUMENT_EXTENSIONS = [
     'pdf',
     'doc', 'docx', 'dot', 'dotx', 'docm', 'dotm',
     'xls', 'xlsx', 'xlt', 'xltx', 'xlsm', 'xltm', 'xlam', 'xlsb',
     'ppt', 'pptx', 'pot', 'potx', 'pps', 'ppsx', 'pptm', 'potm', 'ppsm',
     'odt', 'ott', 'oth', 'odm', 'ods', 'ots', 'odg', 'otg', 'odp', 'otp',
     'odf', 'odb',
     'txt', 'rtf', 'md', 'markdown', 'text', 'me', 'nfo', 'log',
     'epub', 'mobi', 'azw', 'azw3', 'kfx', 'fb2', 'ibooks',
     'pages', 'numbers', 'key', 'abw', 'zabw', 'csv', 'tsv', 'tex', 'latex',
     'wpd', 'wps', 'xlr', 'dif', 'slk', 'sxc', 'sxi', 'sxw', 'stw', 'sxg',
     'sxm', 'uof', 'uot', 'uos', 'uop'
];

const ARCHIVE_EXTENSIONS = [
     'zip', 'rar', '7z', 'tar', 'gz', 'gzip', 'bz2', 'bzip2', 'xz', 'lz',
     'lzma', 'lzh', 'lha', 'arj', 'cab', 'dmg', 'iso', 'jar', 'msi',
     'pkg', 'rpm', 'deb', 'tgz', 'tbz2', 'txz', 'tlz', 'apk', 'crx',
     'xpi', 'war', 'ear', 'sar', 'cpio', 'shar', 'ace', 'z', 'zz',
     'arc', 'wim', 'swm', 'esd', 'zipx'
];

export const isAudioFile = (fileNameOrType: string): boolean => {
     if (!fileNameOrType) return false;
     const lower = fileNameOrType.toLowerCase();
     if (lower.startsWith('audio/')) return true;
     const extension = lower.split('.').pop() || '';
     return AUDIO_EXTENSIONS.includes(extension);
};

export const isImageFile = (fileNameOrType: string): boolean => {
     if (!fileNameOrType) return false;
     const lower = fileNameOrType.toLowerCase();
     if (lower.startsWith('image/')) return true;
     const extension = lower.split('.').pop() || '';
     return IMAGE_EXTENSIONS.includes(extension);
};

export const isDocumentFile = (fileNameOrType: string): boolean => {
     if (!fileNameOrType) return false;
     const lower = fileNameOrType.toLowerCase();
     if (lower.startsWith('application/') &&
          !lower.includes('audio') &&
          !lower.includes('video') &&
          !lower.includes('image')) {
          return true;
     }
     const extension = lower.split('.').pop() || '';
     return DOCUMENT_EXTENSIONS.includes(extension) || ARCHIVE_EXTENSIONS.includes(extension);
};

export const isVideoFile = (fileNameOrType: string): boolean => {
     if (!fileNameOrType) return false;
     const lower = fileNameOrType.toLowerCase();
     if (lower.startsWith('video/')) return true;
     const extension = lower.split('.').pop() || '';
     return VIDEO_EXTENSIONS.includes(extension);
};

export const isArchiveFile = (fileNameOrType: string): boolean => {
     if (!fileNameOrType) return false;
     const lower = fileNameOrType.toLowerCase();
     const extension = lower.split('.').pop() || '';
     return ARCHIVE_EXTENSIONS.includes(extension);
};

export const parseMessageContent = (message_text: any): {
     isReply: boolean; repliedContent: string | null;
     actualContent: string
} => {
     const content = message_text.content || '';

     if (content.startsWith('↪ ')) {
          const firstNewline = content.indexOf('\n');
          if (firstNewline !== -1) {
               const repliedContent = content.substring(2, firstNewline).trim();
               const actualContent = content.substring(firstNewline + 1).trim();
               return {
                    isReply: true,
                    repliedContent,
                    actualContent
               };
          }
     }

     return {
          isReply: false,
          repliedContent: null,
          actualContent: content
     };
};

export const getMessageDisplayContent = (message: any): string => {
     if (message.attachments && message.attachments.length > 0) {
          const firstAttachment = message.attachments[0];
          if (isImageFile(firstAttachment.name || firstAttachment.type)) {
               return 'Image';
          } else if (isVideoFile(firstAttachment.name || firstAttachment.type)) {
               return 'Video';
          } else if (isAudioFile(firstAttachment.name || firstAttachment.type)) {
               return 'Audio';
          } else if (isDocumentFile(firstAttachment.name || firstAttachment.type)) {
               return 'Document';
          } else if (isArchiveFile(firstAttachment.name || firstAttachment.type)) {
               return 'Archive';
          }
          return 'Attachment';
     }
     return message.content || '';
};

export const getFileIcon = (fileName: string, mimeType: string) => {
     const extension = fileName.split('.').pop()?.toLowerCase() || '';
     if (isImageFile(fileName)) return 'image';
     if (isAudioFile(fileName)) return 'audiotrack';
     if (isVideoFile(fileName)) return 'videocam';
     if (extension === 'pdf') return 'picture-as-pdf';
     if (['doc', 'docx', 'odt', 'rtf', 'txt'].includes(extension)) return 'description';
     if (['xls', 'xlsx', 'ods', 'csv'].includes(extension)) return 'grid-on';
     if (['ppt', 'pptx', 'odp'].includes(extension)) return 'slideshow';
     if (isArchiveFile(fileName)) return 'folder-zip';
     return 'insert-drive-file';
}

export const getFileColor = (mimeType: string) => {
     const lowerMime = mimeType.toLowerCase();

     if (lowerMime.includes('pdf')) return '#F40F02';
     if (lowerMime.includes('word') || lowerMime.includes('document')) return '#2B579A';
     if (lowerMime.includes('excel') || lowerMime.includes('spreadsheet')) return '#217346';
     if (lowerMime.includes('powerpoint') || lowerMime.includes('presentation')) return '#D24726';
     if (lowerMime.includes('zip') || lowerMime.includes('compressed')) return '#808080';
     if (lowerMime.includes('image')) return '#4CAF50';
     if (lowerMime.includes('audio')) return '#FF9800';
     if (lowerMime.includes('video')) return '#E91E63';

     return '#666';
}

export const getMimeType = (filename: string) => {
     const extension = filename.split('.').pop()?.toLowerCase() || '';
     if (isImageFile(filename)) {
          switch (extension) {
               case 'jpg': case 'jpeg': return 'image/jpeg';
               case 'png': return 'image/png';
               case 'gif': return 'image/gif';
               case 'webp': return 'image/webp';
               case 'svg': return 'image/svg+xml';
               case 'bmp': return 'image/bmp';
               case 'tiff': case 'tif': return 'image/tiff';
               case 'avif': return 'image/avif';
               case 'heic': return 'image/heic';
               default: return 'image/*';
          }
     }
     if (isAudioFile(filename)) {
          switch (extension) {
               case 'mp3': return 'audio/mpeg';
               case 'wav': return 'audio/wav';
               case 'ogg': return 'audio/ogg';
               case 'm4a': return 'audio/mp4';
               case 'flac': return 'audio/flac';
               default: return 'audio/*';
          }
     }
     if (isVideoFile(filename)) {
          switch (extension) {
               case 'mp4': return 'video/mp4';
               case 'mov': return 'video/quicktime';
               case 'avi': return 'video/x-msvideo';
               case 'mkv': return 'video/x-matroska';
               case 'webm': return 'video/webm';
               default: return 'video/*';
          }
     }
     switch (extension) {
          case 'pdf': return 'application/pdf';
          case 'doc': return 'application/msword';
          case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          case 'xls': return 'application/vnd.ms-excel';
          case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          case 'ppt': return 'application/vnd.ms-powerpoint';
          case 'pptx': return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
          case 'txt': return 'text/plain';
          case 'zip': return 'application/zip';
          case 'rar': return 'application/x-rar-compressed';
          default: return 'application/octet-stream';
     }
}

export const formatFileSize = (bytes: number) => {
     if (bytes === 0) return '0 Bytes';
     const k = 1024;
     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
     const i = Math.floor(Math.log(bytes) / Math.log(k));
     return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export type FileType =
     | 'image'
     | 'audio'
     | 'video'
     | 'pdf'
     | 'word'
     | 'excel'
     | 'powerpoint'
     | 'text'
     | 'csv'
     | 'archive'
     | 'javascript'
     | 'html'
     | 'css'
     | 'json'
     | 'xml'
     | 'unknown';

export const getFileType = (filename: string, mimeType?: string): FileType => {
     if (isImageFile(filename)) return 'image';
     if (isAudioFile(filename)) return 'audio';
     if (isVideoFile(filename)) return 'video';
     if (isArchiveFile(filename)) return 'archive';

     const extension = filename.split('.').pop()?.toLowerCase() || '';

     switch (extension) {
          case 'pdf': return 'pdf';
          case 'doc': case 'docx': return 'word';
          case 'xls': case 'xlsx': return 'excel';
          case 'ppt': case 'pptx': return 'powerpoint';
          case 'txt': case 'rtf': case 'md': return 'text';
          case 'csv': return 'csv';
          case 'js': case 'jsx': case 'ts': case 'tsx': return 'javascript';
          case 'html': case 'htm': return 'html';
          case 'css': return 'css';
          case 'json': return 'json';
          case 'xml': return 'xml';
          default: return 'unknown';
     }
};

export const getVideoThumbnail = (videoUri: string) => {
     return 'https://placehold.co/250x250?text=Video+Thumbnail';
};