import { useState, useEffect } from 'react';

export const useRoutineCelebrations = (routinesWithCompletion) => {
     const [celebratedRoutines, setCelebratedRoutines] = useState(new Set());
     const [celebrationData, setCelebrationData] = useState(null);

     useEffect(() => {
          routinesWithCompletion.forEach((routine: { totalTasks: number; completedCount: number; id: unknown; title: any; }) => {
               const isCompleted = routine.totalTasks > 0 &&
                    routine.completedCount === routine.totalTasks &&
                    routine.completedCount !== 0;

               const alreadyCelebrated = celebratedRoutines.has(routine.id);

               if (isCompleted && !alreadyCelebrated) {
                    setCelebrationData({
                         visible: true,
                         taskTitle: routine.title,
                         routineId: routine.id
                    });

                    // Mark as celebrated
                    setCelebratedRoutines(prev => new Set(prev).add(routine.id));
               }
          });
     }, [routinesWithCompletion, celebratedRoutines]);

     const resetCelebration = () => {
          setCelebrationData(null);
     };

     const resetAllCelebrations = () => {
          setCelebratedRoutines(new Set());
          setCelebrationData(null);
     };

     return {
          celebrationData,
          resetCelebration,
          resetAllCelebrations
     };
};