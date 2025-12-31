import React from 'react';
import { useTheme } from '@nextui-org/react';

export const GOAL_BACKGROUND = "/backgrounds/bg_main3.png";
export const GOAL_BACKGROUND_DARK = "/backgrounds/bg_main4.png";

export const GoalBackground = ({ children }: { children: React.ReactNode }) => {
    const { isDark } = useTheme();

    return (
        <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -1,
                    backgroundImage: `url(${isDark ? GOAL_BACKGROUND_DARK : GOAL_BACKGROUND})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.09,
                    pointerEvents: 'none',
                }}
            />
            {/* Content Layer */}
            <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
                {children}
            </div>
        </div>
    );
};