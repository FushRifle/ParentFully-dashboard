export const calculateAge = (dob?: string) => {
     if (!dob) return 'Unknown age';

     try {
          const birthDate = new Date(dob);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
               age--;
          }

          return `${age} years old`;
     } catch (error) {
          return 'Unknown age';
     }
};

export const getInitials = (name: string): string => {
     if (!name || typeof name !== 'string') {
          return '';
     }

     const names = name.trim().split(' ');
     if (names.length === 0) return '';

     if (names.length === 1) {
          return names[0].charAt(0).toUpperCase();
     }

     return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};
