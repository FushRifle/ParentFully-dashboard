import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatAvatarWrapperProps {
     photo?: string | null;
     profile_image?: string | null;
     contactName?: string;
     phoneNumber?: string;
     size?: number;
     backgroundColor?: string;
     textColor?: string;
     borderWidth?: number;
     borderColor?: string;
     variant?: 'primary' | 'secondary' | 'emergency';
}

const ChatAvatarWrapper: React.FC<ChatAvatarWrapperProps> = ({
     photo,
     profile_image,
     contactName = 'Contact',
     phoneNumber,
     size = 56,
     backgroundColor,
     textColor = 'white',
     borderWidth = 1,
     borderColor = 'rgba(255,255,255,0.5)',
     variant = 'primary',
}) => {
     const [hasError, setHasError] = React.useState(false);
     const [currentUrl, setCurrentUrl] = React.useState<string | undefined>();

     const resolveStorageUrl = (uri?: string | null) => {
          if (!uri) return undefined;
          let cleaned = uri;
          cleaned = cleaned.replace('contacts/contacts/', 'contacts/');
          cleaned = cleaned.replace('profiles/profile_images/', 'profile_images/');
          cleaned = cleaned.replace(/\/(\w+)\/\1\//g, '/$1/');
          if (cleaned.startsWith('http')) return cleaned;
          return `https://production-api.parentfullyapp.com/storage/${cleaned.replace(/^\/+/, '')}`;
     };

     React.useEffect(() => {
          setHasError(false);
          const contactUrl = resolveStorageUrl(photo);
          const userUrl = resolveStorageUrl(profile_image);
          setCurrentUrl(contactUrl || userUrl);
     }, [photo, profile_image]);

     const getInitials = () => {
          if (!contactName) {
               if (phoneNumber) return phoneNumber.slice(-2);
               return '?';
          }
          const names = contactName.trim().split(' ');
          if (names.length === 1) return names[0].charAt(0).toUpperCase();
          return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
     };

     const getBackgroundColor = () => {
          if (backgroundColor) return backgroundColor;
          switch (variant) {
               case 'secondary':
                    return '#607D8B';
               case 'emergency':
                    return '#F44336';
               default:
                    return '#9FCC16';
          }
     };

     const getBorderColor = () => {
          if (borderColor) return borderColor;
          switch (variant) {
               case 'secondary':
                    return '#455A64';
               case 'emergency':
                    return '#D32F2F';
               default:
                    return '#1976D2';
          }
     };

     const initials = getInitials();
     const bgColor = getBackgroundColor();
     const brdColor = getBorderColor();
     const shouldShowImage = !hasError && currentUrl;

     const style = {
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          borderWidth,
          borderColor: brdColor,
          borderStyle: 'solid' as const,
     };

     if (shouldShowImage) {
          return (
               <Avatar style={style}>
                    <AvatarImage
                         src={currentUrl}
                         alt={contactName}
                         className="object-cover w-full h-full"
                         onError={() => setHasError(true)}
                    />
                    <AvatarFallback style={{ backgroundColor: bgColor, color: textColor }}>
                         {initials}
                    </AvatarFallback>
               </Avatar>
          );
     }

     if (hasError && profile_image && !currentUrl?.includes(profile_image)) {
          const userUrl = resolveStorageUrl(profile_image);
          if (userUrl) {
               return (
                    <Avatar style={style}>
                         <AvatarImage
                              src={userUrl}
                              alt={contactName}
                              className="object-cover w-full h-full"
                              onError={() => setHasError(true)}
                         />
                         <AvatarFallback style={{ backgroundColor: bgColor, color: textColor }}>
                              {initials}
                         </AvatarFallback>
                    </Avatar>
               );
          }
     }

     return (
          <Avatar style={{ ...style, backgroundColor: bgColor }}>
               <AvatarFallback
                    style={{ backgroundColor: bgColor, color: textColor, fontSize: size / 3, fontWeight: 'bold' }}
               >
                    {initials}
               </AvatarFallback>
          </Avatar>
     );
};

export default ChatAvatarWrapper;