import React, { useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { Switch, useTheme } from '@nextui-org/react';
import { Moon, Sun } from 'lucide-react';

export const DarkModeSwitch = () => {
   const { setTheme } = useNextTheme();
   const { isDark } = useTheme();
   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);

   if (!mounted) return <div className="navbar-theme-switch navbar-theme-switch-loading" aria-hidden="true" />;

   return <div className="navbar-theme-switch" title={isDark ? 'Use light mode' : 'Use dark mode'}>
      <Sun size={13} aria-hidden="true" />
      <Switch aria-label="Toggle dark mode" size="sm" checked={isDark} onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')} />
      <Moon size={13} aria-hidden="true" />
   </div>;
};
