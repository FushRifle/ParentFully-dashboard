import { parseISO, format, addHours } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

/**
 * Get the device's current timezone.
 */
export const getUserTimeZone = (): string => {
     return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Convert backend UTC time (HH:mm or ISO) to user's local Date object.
 * Automatically adds 1 hour if needed to sync with backend.
 */
export const parseBackendTime = (backendTime: string, addExtraHour = false): Date => {
     const userTimeZone = getUserTimeZone();

     try {
          let date: Date;

          if (backendTime.includes('T')) {
               // ISO string from backend
               date = parseISO(backendTime);
          } else {
               // Simple "HH:mm" string
               const [hours, minutes] = backendTime.split(':').map(Number);
               date = new Date();
               date.setUTCHours(hours, minutes, 0, 0);
          }

          let zonedDate = toZonedTime(date, userTimeZone);

          if (addExtraHour) {
               zonedDate = addHours(zonedDate, 1); // adjust automatically
          }

          return zonedDate;
     } catch (err) {
          console.warn('Failed to parse backend time, defaulting to 8:00 AM', err);
          const fallback = toZonedTime(new Date(), userTimeZone);
          fallback.setHours(8, 0, 0, 0);
          return fallback;
     }
};

/**
 * Convert a local user Date object to a backend-ready UTC HH:mm string.
 * Automatically subtracts the extra hour if addExtraHour=true.
 */
export const toBackendTimeString = (date: Date, addExtraHour = false): string => {
     const userTimeZone = getUserTimeZone();
     let adjustedDate = new Date(date);

     if (addExtraHour) {
          adjustedDate = addHours(adjustedDate, 1); // add 1 hour before sending to backend
     }

     const utcDate = fromZonedTime(adjustedDate, userTimeZone);
     const hh = utcDate.getUTCHours().toString().padStart(2, '0');
     const mm = utcDate.getUTCMinutes().toString().padStart(2, '0');
     return `${hh}:${mm}`;
};

/**
 * Format a Date object to a human-readable time string in user's timezone.
 */
export const formatUserTime = (date: Date, pattern = 'h:mm a'): string => {
     const userTimeZone = getUserTimeZone();
     const zonedDate = toZonedTime(date, userTimeZone);
     return format(zonedDate, pattern);
};
