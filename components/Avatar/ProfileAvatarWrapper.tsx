import React from 'react';
import { Avatar, H4, YStack } from 'tamagui';
import { Image } from 'expo-image';
import { Platform } from 'react-native';
import { useTheme } from '@/styles/ThemeContext';

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
     const { colors } = useTheme();
     const [hasError, setHasError] = React.useState(false);

     React.useEffect(() => {
          setHasError(false);
     }, [imageUrl]);

     const resolveImageUrl = (uri?: string | null) => {
          if (!uri) return undefined;

          let cleaned = uri;
          cleaned = cleaned.replace('profiles/profile_images/', 'profile_images/');
          cleaned = cleaned.replace(/\/(\w+)\/\1\//g, '/$1/');
          if (cleaned.startsWith('http')) {
               return cleaned;
          }

          const finalUrl = `https://parentfully.stacksgather.com/storage/${cleaned.replace(/^\/+/, '')}`;
          return finalUrl;
     };

     const resolvedUrl = resolveImageUrl(imageUrl);
     const source = !hasError && resolvedUrl ? { uri: resolvedUrl } : undefined;

     const shouldShowImage = !!source;

     return (
          <Avatar
               size={size}
               br={size / 2}
               overflow="hidden"
               jc="center"
               ai="center"
               backgroundColor={colors.secondaryContainer}
               bw={0}
               borderColor={colors.onPrimary}
          >
               {shouldShowImage ? (
                    <Image
                         source={source}
                         style={{ width: size, height: size, borderRadius: size / 2 }}
                         contentFit="cover"
                         cachePolicy="memory-disk"
                    />
               ) : (
                    <YStack jc="center" ai="center" width={size} height={size}>
                         <H4
                              color="white"
                              fontSize={size / 3.2}
                              fontWeight="bold"
                              textAlign="center"
                         >
                              {initials.substring(0, 2)}
                         </H4>
                    </YStack>
               )}
          </Avatar>
     );
};

export default UltimateProfileAvatar;