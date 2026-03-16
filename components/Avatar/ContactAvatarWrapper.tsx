import React from 'react';
import { Avatar, Text, Image } from '@nextui-org/react';

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

          if (cleaned.startsWith('http')) {
               return cleaned;
          }

          const finalUrl = `https://parentfully.stacksgather.com/storage/${cleaned.replace(/^\/+/, '')}`;
          return finalUrl;
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

          if (names.length === 1) {
               return names[0].charAt(0).toUpperCase();
          }

          return (
               names[0].charAt(0) +
               names[names.length - 1].charAt(0)
          ).toUpperCase();
     };

     const resolvedUrl = resolveStorageUrl(imageUrl);
     const shouldShowImage = !hasError && resolvedUrl;
     const initials = getInitials();
     const bgColor = getBackgroundColor();
     const brdColor = getBorderColor();

     // If we have an image and no error, show the image avatar
     if (shouldShowImage) {
          return (
               <Avatar
                    size={size as any}
                    css={{
                         width: size,
                         height: size,
                         minWidth: size,
                         minHeight: size,
                         borderWidth: borderWidth,
                         borderColor: brdColor,
                         borderStyle: 'solid',
                         '& img': {
                              objectFit: 'cover',
                              width: '100%',
                              height: '100%',
                         },
                    }}
                    src={resolvedUrl}
                    alt={contactName}
                    onError={() => setHasError(true)}
               />
          );
     }

     // Show initials avatar
     return (
          <Avatar
               size={size as any}
               css={{
                    width: size,
                    height: size,
                    minWidth: size,
                    minHeight: size,
                    backgroundColor: bgColor,
                    borderWidth: borderWidth,
                    borderColor: brdColor,
                    borderStyle: 'solid',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: size / 3,
                    color: textColor,
                    fontWeight: '$bold',
               }}
               text={initials}
               color="default"
          />
     );
};

export default ContactAvatarWrapper;