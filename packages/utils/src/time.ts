import { DateTime } from 'luxon';

export const DEFAULT_TIME_ZONE = 'UTC';

export function now(timezone: string = DEFAULT_TIME_ZONE): DateTime {
  return DateTime.now().setZone(timezone);
}
