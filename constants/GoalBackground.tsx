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
        <div className="relative isolate min-h-screen w-full overflow-hidden">
            <div
                className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${isDark ? GOAL_BACKGROUND_DARK : GOAL_BACKGROUND})`,
                    opacity: isDark ? 0.05 : 0.075,
                    filter: 'blur(7px)',
                    transform: 'scale(1.025)',
                }}
            />
            <div className="relative z-10 min-h-screen w-full">{children}</div>
        </div>
    );
};
