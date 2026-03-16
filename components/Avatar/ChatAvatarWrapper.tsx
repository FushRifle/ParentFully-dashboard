import React from 'react';
import { Avatar } from '@nextui-org/react';

interface ChatAvatarWrapperProps {
     photo?: string | null; // contact image
     profile_image?: string | null; // user image fallback
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

     React.useEffect(() => {
          setHasError(false);

          // Reset and determine which URL to use
          const contactUrl = resolveStorageUrl(photo);
          const userUrl = resolveStorageUrl(profile_image);

          // Try contact photo first, then fallback to profile image
          const url = contactUrl || userUrl;
          setCurrentUrl(url);
     }, [photo, profile_image]);

     const resolveStorageUrl = (uri?: string | null) => {
          if (!uri) return undefined;

          let cleaned = uri;

          cleaned = cleaned.replace('contacts/contacts/', 'contacts/');
          cleaned = cleaned.replace('profiles/profile_images/', 'profile_images/');
          cleaned = cleaned.replace(/\/(\w+)\/\1\//g, '/$1/');

          if (cleaned.startsWith('http')) {
               return cleaned;
          }

          return `https://parentfully.stacksgather.com/storage/${cleaned.replace(/^\/+/, '')}`;
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
                    src={currentUrl}
                    alt={contactName}
                    onError={() => setHasError(true)}
               />
          );
     }

     if (hasError && profile_image && !currentUrl?.includes(profile_image)) {
          const userUrl = resolveStorageUrl(profile_image);
          if (userUrl) {
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
                         src={userUrl}
                         alt={contactName}
                         onError={() => setHasError(true)}
                    />
               );
          }
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

export default ChatAvatarWrapper;