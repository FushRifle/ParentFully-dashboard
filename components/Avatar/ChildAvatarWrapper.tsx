import React from 'react';
import { Avatar, H4, YStack } from 'tamagui';
import { Image } from 'tamagui';
import { useTheme } from '@/styles/ThemeContext';

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
     const { colors } = useTheme();
     const [hasError, setHasError] = React.useState(false);

     React.useEffect(() => {
          setHasError(false);
     }, [imageUrl]);

     const handleImageError = () => {
          setHasError(true);
     };

     const handleImageLoad = () => {
          setHasError(false);
     };

     const getInitials = () => {
          if (!childName) return 'C';

          const names = childName.trim().split(' ');
          if (names.length === 1) return names[0].charAt(0).toUpperCase();

          return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
     };

     const getBackgroundColor = () => {
          if (backgroundColor) return backgroundColor;
          if (useThemeColors) return colors.secondaryContainer || '#4CAF50';
          return '#4CAF50';
     };

     const getTextColor = () => {
          if (textColor) return textColor;
          if (useThemeColors) return colors.onSecondaryContainer || 'white';
          return 'white';
     };

     const getBorderColor = () => {
          if (borderColor) return borderColor;
          if (useThemeColors) return colors.accent || '#388E3C';
          return '#388E3C';
     };

     const resolveImageUrl = (uri?: string | null) => {
          if (!uri) return null;
          let cleaned = uri;
          cleaned = cleaned.replace(/\/(\w+)\/\1\//g, '/$1/');
          if (cleaned.startsWith('http')) {
               return cleaned;
          }
          const finalUrl = `https://parentfully.stacksgather.com/storage/${cleaned.replace(/^\/+/, '')}`;
          return finalUrl;
     };

     const initials = getInitials();
     const bgColor = getBackgroundColor();
     const txtColor = getTextColor();
     const brdColor = getBorderColor();

     const resolvedUrl = resolveImageUrl(imageUrl);
     const source = !hasError && resolvedUrl ? { uri: resolvedUrl } : undefined;
     const shouldShowImage = !!source;

     return (
          <Avatar
               size={size}
               br={size / 2}
               borderWidth={borderWidth}
               borderColor={brdColor}
               overflow="hidden"
               jc="center"
               ai="center"
               backgroundColor={bgColor}
          >
               {shouldShowImage ? (
                    <Image
                         source={source}
                         style={{ width: size, height: size, borderRadius: size / 2 }}
                         onError={handleImageError}
                         onLoad={handleImageLoad}
                         resizeMode="cover"
                    />
               ) : (
                    <YStack jc="center" ai="center" width={size} height={size} backgroundColor={bgColor}>
                         <H4
                              color={txtColor}
                              fontSize={size / 3}
                              fontWeight="bold"
                              textAlign="center"
                              lineHeight={size * 0.4}
                         >
                              {initials}
                         </H4>
                    </YStack>
               )}
          </Avatar>
     );
};

export default ChildAvatarWrapper;