import React from 'react';
import { API_ORIGIN } from '@/config';

export interface UserAvatarProps {
   imageUrl?: string | null;
   photo?: string | null;
   profile_image?: string | null;
   initials?: string;
   contactName?: string;
   childName?: string;
   phoneNumber?: string;
   size?: number;
   backgroundColor?: string;
   textColor?: string;
   borderWidth?: number;
   borderColor?: string;
   variant?: 'primary' | 'secondary' | 'emergency';
   useThemeColors?: boolean;
}

export function resolveAvatarUrl(
   input?: string | { uri?: string; url?: string; path?: string } | null
): string | undefined {
   const uri =
      typeof input === 'string' ? input : input?.uri || input?.url || input?.path;
   if (!uri?.trim()) return undefined;
   let path = uri.trim();
   if (/^(data:|blob:)/i.test(path)) return path;
   if (/^https?:/i.test(path)) {
      return path
         .replace('profiles/profile_images/', 'profile_images/')
         .replace('contacts/contacts/', 'contacts/');
   }
   // Device-local image picker URIs cannot be loaded in the dashboard browser.
   if (/^(file:|content:)/i.test(path)) return undefined;
   path = path
      .replace(/^\/+/, '')
      .replace(/^storage\//, '')
      .replace('profiles/profile_images/', 'profile_images/')
      .replace('contacts/contacts/', 'contacts/')
      .replace(/\/(\w+)\/\1\//g, '/$1/');
   return `${API_ORIGIN}/storage/${path}`;
}

export default function UserAvatar({
   imageUrl,
   photo,
   profile_image,
   initials,
   contactName,
   childName,
   phoneNumber,
   size = 48,
   backgroundColor,
   textColor = 'white',
   borderWidth = 1,
   borderColor = 'transparent',
   variant = 'primary',
}: UserAvatarProps) {
   const candidates = [
      ...new Set(
         [photo, imageUrl, profile_image].map(resolveAvatarUrl).filter(Boolean)
      ),
   ] as string[];
   const key = candidates.join('|');
   const [failed, setFailed] = React.useState<string[]>([]);
   React.useEffect(() => setFailed([]), [key]);
   const source = candidates.find((url) => !failed.includes(url));
   const name = contactName || childName || '';
   const parts = name.trim().split(/\s+/).filter(Boolean);
   const fallback =
      initials?.slice(0, 2) ||
      (parts.length
         ? `${parts[0][0]}${parts.length > 1 ? parts[parts.length - 1][0] : ''
            }`.toUpperCase()
         : phoneNumber?.slice(-2) || '?');
   return (
      <span
         className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full align-middle"
         style={{
            width: size,
            height: size,
            minWidth: size,
            backgroundColor:
               backgroundColor ||
               (variant === 'emergency'
                  ? '#dc2626'
                  : variant === 'secondary'
                     ? '#607d8b'
                     : '#819c26'),
            color: textColor,
            border: `${borderWidth}px solid ${borderColor}`,
            fontSize: size / 3,
            fontWeight: 700,
         }}
      >
         {source ? (
            <img
               key={source}
               src={source}
               alt={name}
               width={size}
               height={size}
               className="block h-full w-full object-cover"
               onError={() => setFailed((previous) => [...previous, source])}
            />
         ) : (
            <span aria-label={name || 'User avatar'}>{fallback}</span>
         )}
      </span>
   );
}