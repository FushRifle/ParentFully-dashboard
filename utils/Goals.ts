import { add, format } from "date-fns";

type TimeUnit = "days" | "weeks" | "months" | "years";

const VALID_UNITS: TimeUnit[] = ["days", "weeks", "months", "years"];


export const formatTime = (timeString?: string): string => {
     if (!timeString) return "—";

     const [hours = "0", minutes = "00"] = timeString.split(":");
     const h = parseInt(hours, 10);

     const suffix = h >= 12 ? "PM" : "AM";
     const hour12 = ((h + 11) % 12) + 1;

     return `${hour12}:${minutes.padStart(2, "0")} ${suffix}`;
};

export const parseTimeBound = (timeBound?: string) => {
     if (!timeBound) {
          return { count: 0, duration: 1, unit: "weeks" as TimeUnit };
     }

     const match = timeBound.match(
          /(\d+)\s*times?\s*in\s*(\d+)\s*(days|weeks|months|years)/i
     );

     if (!match) {
          console.log("No regex match for:", timeBound);
          return { count: 0, duration: 1, unit: "weeks" as TimeUnit };
     }

     return {
          count: parseInt(match[1], 10) || 0,
          duration: parseInt(match[2], 10) || 1,
          unit: match[3].toLowerCase() as TimeUnit,
     };
};

type UIFrequency = "daily" | "weekly" | "monthly" | "yearly";
type DateFnsUnit = "days" | "weeks" | "months" | "years";

const UNIT_MAP: Record<UIFrequency, DateFnsUnit> = {
     daily: "days",
     weekly: "weeks",
     monthly: "months",
     yearly: "years",
};

export const calculateTargetDate = (
     duration: number,
     unit: UIFrequency
): Date => {
     const now = new Date();
     const mappedUnit = UNIT_MAP[unit] ?? "weeks";

     return add(now, { [mappedUnit]: duration });
};

export const formatTargetDate = (
     duration: number,
     unit: UIFrequency
): string => {
     return format(calculateTargetDate(duration, unit), "MMM dd, yyyy");
};

export const getTargetDateISO = (
     duration: number,
     unit: UIFrequency
): string => {
     return calculateTargetDate(duration, unit).toISOString();
};

type FrequencyUnit = 'daily' | 'weekly' | 'monthly' | 'yearly'
export const normalizeFrequencyUnit = (unit?: string): FrequencyUnit => {
     switch (unit) {
          case 'day':
          case 'days':
          case 'daily':
               return 'daily'

          case 'week':
          case 'weeks':
          case 'weekly':
               return 'weekly'

          case 'month':
          case 'months':
          case 'monthly':
               return 'monthly'

          case 'year':
          case 'years':
          case 'yearly':
               return 'yearly'

          default:
               return 'weekly'
     }
}