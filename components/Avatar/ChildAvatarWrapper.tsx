import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChildAvatarWrapperProps {
     imageUrl?: string | null;
     childName?: string;
     size?: number;
     backgroundColor?: string;
     textColor?: string;
     borderWidth?: number;
     borderColor?: string;
     useThemeColors?: boolean;
}

const ChildAvatarWrapper: React.FC<ChildAvatarWrapperProps> = ({
     imageUrl,
     childName = 'Child',
     size = 64,
     backgroundColor,
     textColor,
     borderWidth = 2,
     borderColor,
     useThemeColors = false,
}) => {
     const [hasError, setHasError] = React.useState(false);

     React.useEffect(() => {
          setHasError(false);
     }, [imageUrl]);

     const getInitials = () => {
          if (!childName) return 'C';
          const names = childName.trim().split(' ');
          if (names.length === 1) return names[0].charAt(0).toUpperCase();
          return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
     };

     const resolveImageUrl = (uri?: string | null) => {
          if (!uri) return null;
          let cleaned = uri;
          cleaned = cleaned.replace(/\/(\w+)\/\1\//g, '/$1/');
          if (cleaned.startsWith('http')) return cleaned;
          return `https://production-api.parentfullyapp.com/storage/${cleaned.replace(/^\/+/, '')}`;
     };

     const initials = getInitials();
     const bgColor = backgroundColor || (useThemeColors ? '#4CAF50' : '#4CAF50');
     const txtColor = textColor || (useThemeColors ? 'white' : 'white');
     const brdColor = borderColor || (useThemeColors ? '#388E3C' : '#388E3C');
     const resolvedUrl = resolveImageUrl(imageUrl);
     const shouldShowImage = !hasError && resolvedUrl;

     return (
          <Avatar
               style={{
                    width: size,
                    height: size,
                    minWidth: size,
                    minHeight: size,
                    borderWidth,
                    borderColor: brdColor,
                    borderStyle: 'solid',
                    backgroundColor: bgColor,
               }}
          >
               {shouldShowImage ? (
                    <AvatarImage
                         src={resolvedUrl!}
                         alt={childName}
                         className="object-cover w-full h-full"
                         onError={() => setHasError(true)}
                    />
               ) : (
                    <AvatarFallback
                         style={{ backgroundColor: bgColor, color: txtColor, fontSize: size / 3, fontWeight: 'bold' }}
                    >
                         {initials}
                    </AvatarFallback>
               )}
          </Avatar>
     );
};

export default ChildAvatarWrapper;