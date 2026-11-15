import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ContactAvatarWrapperProps {
     imageUrl?: string | null;
     contactName?: string;
     phoneNumber?: string;
     size?: number;
     backgroundColor?: string;
     textColor?: string;
     borderWidth?: number;
     borderColor?: string;
     variant?: 'primary' | 'secondary' | 'emergency';
}

const ContactAvatarWrapper: React.FC<ContactAvatarWrapperProps> = ({
     imageUrl,
     contactName = 'Contact',
     phoneNumber,
     size = 56,
     backgroundColor,
     textColor = 'white',
     borderWidth = 1,
     borderColor,
     variant = 'primary',
}) => {
     const [hasError, setHasError] = React.useState(false);

     React.useEffect(() => {
          setHasError(false);
     }, [imageUrl]);

     const resolveStorageUrl = (uri?: string | null) => {
          if (!uri) return undefined;
          let cleaned = uri;
          cleaned = cleaned.replace('contacts/contacts/', 'contacts/');
          cleaned = cleaned.replace(/\/(\w+)\/\1\//g, '/$1/');
          if (cleaned.startsWith('http')) return cleaned;
          return `https://production-api.parentfullyapp.com/storage/${cleaned.replace(/^\/+/, '')}`;
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

     const getInitials = () => {
          if (!contactName) {
               if (phoneNumber) return phoneNumber.slice(-2);
               return '?';
          }
          const names = contactName.trim().split(' ');
          if (names.length === 1) return names[0].charAt(0).toUpperCase();
          return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
     };

     const resolvedUrl = resolveStorageUrl(imageUrl);
     const shouldShowImage = !hasError && resolvedUrl;
     const initials = getInitials();
     const bgColor = getBackgroundColor();
     const brdColor = getBorderColor();

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
               }}
          >
               {shouldShowImage ? (
                    <AvatarImage
                         src={resolvedUrl!}
                         alt={contactName}
                         className="object-cover w-full h-full"
                         onError={() => setHasError(true)}
                    />
               ) : (
                    <AvatarFallback
                         style={{ backgroundColor: bgColor, color: textColor, fontSize: size / 3, fontWeight: 'bold' }}
                    >
                         {initials}
                    </AvatarFallback>
               )}
          </Avatar>
     );
};

export default ContactAvatarWrapper;