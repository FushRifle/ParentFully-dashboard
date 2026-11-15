import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UltimateProfileAvatarProps {
     imageUrl?: string | null;
     initials: string;
     size?: number;
}

const UltimateProfileAvatar: React.FC<UltimateProfileAvatarProps> = ({
     imageUrl,
     initials,
     size = 48,
}) => {
     const [hasError, setHasError] = React.useState(false);

     React.useEffect(() => {
          setHasError(false);
     }, [imageUrl]);

     const resolveImageUrl = (uri?: string | null) => {
          if (!uri) return undefined;
          let cleaned = uri;
          cleaned = cleaned.replace('profiles/profile_images/', 'profile_images/');
          cleaned = cleaned.replace(/\/(\w+)\/\1\//g, '/$1/');
          if (cleaned.startsWith('http')) return cleaned;
          return `https://production-api.parentfullyapp.com/storage/${cleaned.replace(/^\/+/, '')}`;
     };

     const resolvedUrl = resolveImageUrl(imageUrl);
     const shouldShowImage = !hasError && resolvedUrl;

     return (
          <Avatar
               style={{
                    width: size,
                    height: size,
                    minWidth: size,
                    minHeight: size,
                    backgroundColor: '#4CAF50',
               }}
          >
               {shouldShowImage ? (
                    <AvatarImage
                         src={resolvedUrl!}
                         alt="Profile"
                         className="object-cover w-full h-full"
                         onError={() => setHasError(true)}
                    />
               ) : (
                    <AvatarFallback
                         style={{ backgroundColor: '#4CAF50', color: 'white', fontSize: size / 3.2, fontWeight: 'bold' }}
                    >
                         {initials.substring(0, 2)}
                    </AvatarFallback>
               )}
          </Avatar>
     );
};

export default UltimateProfileAvatar;