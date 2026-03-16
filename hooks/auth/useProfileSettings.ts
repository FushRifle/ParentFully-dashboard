import { useState, useCallback } from 'react';
import { useTheme } from '@/styles/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Alert } from 'react-native';

export const useProfileSettings = () => {
     const { colors, toggleTheme, isDark } = useTheme();
     const { logoutUser } = useAuth();
     const { t, i18n } = useTranslation();
     const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
     const [confirmModal, setConfirmModal] = useState({
          visible: false,
          type: '',
     });

     const handleLanguageChange = async (lang: string) => {
          setSelectedLanguage(lang);
          await i18n.changeLanguage(lang);
     };

     const handleLogout = () => {
          Alert.alert(
               'Confirm Logout',
               'Are you sure you want to logout?',
               [
                    { text: 'Cancel', style: 'cancel' },
                    {
                         text: 'Logout',
                         style: 'destructive',
                         onPress: async () => {
                              try {
                                   await logoutUser();
                              } catch (err) {
                                   console.error('Logout failed:', err);
                                   Alert.alert('Logout Error', 'Failed to logout. Please try again.');
                              }
                         },
                    },
               ]
          );
     };

     const handleDeleteAccountConfirm = async () => {
          // Implement delete account logic
          setConfirmModal({ visible: false, type: '' });
     };

     const showConfirmModal = (type: string) => {
          setConfirmModal({ visible: true, type });
     };

     const hideConfirmModal = () => {
          setConfirmModal({ visible: false, type: '' });
     };

     return {
          colors,
          isDark,
          selectedLanguage,
          confirmModal,
          toggleTheme,
          handleLanguageChange,
          handleLogout,
          handleDeleteAccountConfirm,
          showConfirmModal,
          hideConfirmModal
     };
};