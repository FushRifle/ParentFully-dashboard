export function eventProperties(value: unknown): Record<string, any> {
   if (typeof value === 'string') {
      try { return eventProperties(JSON.parse(value)); } catch { return {}; }
   }
   return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, any> : {};
}

export function formatEventName(value?: string | null): string {
   const text = (value || '').replace(/^\$+/, '').replace(/([a-z\d])([A-Z])/g, '$1 $2').replace(/[_\-.:/]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
   return text ? text.charAt(0).toUpperCase() + text.slice(1) : 'Unnamed event';
}

export function accountIdForEvent(event: any): number | null {
   const props = eventProperties(event.properties);
   const person = eventProperties(event.person?.properties);
   const candidates = [event.user_id, event.user?.id, props.user_id, props.$user_id, person.user_id, event.distinct_id, props.distinct_id, props.$distinct_id];
   for (const value of candidates) {
      if (/^\d+$/.test(String(value)) && Number.isSafeInteger(Number(value)) && Number(value) > 0) return Number(value);
   }
   return null;
}
