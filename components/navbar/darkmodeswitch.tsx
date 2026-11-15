import React, { useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export const DarkModeSwitch = () => {
   const { theme, setTheme } = useNextTheme();
   const [mounted, setMounted] = useState(false);

   useEffect(() => setMounted(true), []);

   if (!mounted) {
      return <div className="navbar-theme-switch navbar-theme-switch-loading" aria-hidden="true" />;
   }

   const isDark = theme === 'dark';

   return (
      <div className="navbar-theme-switch flex items-center gap-2" title={isDark ? 'Use light mode' : 'Use dark mode'}>
         <Sun size={13} aria-hidden="true" className="text-foreground" />
         <Switch
            aria-label="Toggle dark mode"
            checked={isDark}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
         />
         <Moon size={13} aria-hidden="true" className="text-foreground" />
      </div>
   );
};