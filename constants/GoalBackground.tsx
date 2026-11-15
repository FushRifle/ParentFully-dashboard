import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export const GOAL_BACKGROUND = '/backgrounds/bg_main3.png';
export const GOAL_BACKGROUND_DARK = '/backgrounds/bg_main4.png';

export const GoalBackground = ({ children }: { children: React.ReactNode }) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const isDark = mounted && resolvedTheme === 'dark';

    return (
        <div className="relative min-h-screen w-full">
            <div
                className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${isDark ? GOAL_BACKGROUND_DARK : GOAL_BACKGROUND})`,
                    opacity: isDark ? 0.09 : 0.14,
                }}
            />
            <div className="relative z-10 h-full">{children}</div>
        </div>
    );
};