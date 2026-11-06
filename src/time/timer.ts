/**
 * Relationship TV - Timer Logic
 * Calendar-aware time difference calculation
 * 
 * This implementation uses a calendar-aware algorithm rather than naive
 * millisecond division. It correctly handles:
 * - Variable month lengths (28-31 days)
 * - Leap years
 * - Human-meaningful calendar differences
 * 
 * The algorithm works by:
 * 1. Computing year difference, then adjusting if the current date
 *    hasn't reached the anniversary month/day yet
 * 2. Computing month difference within the adjusted years
 * 3. Computing day difference within the adjusted months
 * 4. Computing hours, minutes, seconds from the remaining time
 */

export interface TimeDiff {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  // Total counts for single-mode display
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  totalMonths: number;
}

/**
 * Compute calendar-aware difference between two dates
 * @param start - The relationship start date
 * @param now - Current date/time
 * @returns Detailed time breakdown
 */
export function diffDetailed(start: Date, now: Date): TimeDiff {
  // Handle case where start is in the future
  if (now < start) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      totalMinutes: 0,
      totalHours: 0,
      totalDays: 0,
      totalMonths: 0,
    };
  }

  // Clone dates to avoid mutation
  const startDate = new Date(start);
  const nowDate = new Date(now);

  // Calculate total milliseconds difference for total counts
  const totalMs = nowDate.getTime() - startDate.getTime();
  const totalSeconds = Math.floor(totalMs / 1000);
  const totalMinutes = Math.floor(totalMs / (1000 * 60));
  const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));

  // Calendar-aware breakdown
  let years = nowDate.getFullYear() - startDate.getFullYear();
  let months = nowDate.getMonth() - startDate.getMonth();
  let days = nowDate.getDate() - startDate.getDate();
  let hours = nowDate.getHours() - startDate.getHours();
  let minutes = nowDate.getMinutes() - startDate.getMinutes();
  let seconds = nowDate.getSeconds() - startDate.getSeconds();

  // Normalize seconds
  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }

  // Normalize minutes
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }

  // Normalize hours
  if (hours < 0) {
    hours += 24;
    days--;
  }

  // Normalize days - need to account for variable month lengths
  if (days < 0) {
    // Go back to previous month and add its days
    const prevMonth = new Date(nowDate.getFullYear(), nowDate.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }

  // Normalize months
  if (months < 0) {
    months += 12;
    years--;
  }

  // Calculate total months
  const totalMonths = years * 12 + months;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    totalMinutes,
    totalHours,
    totalDays,
    totalMonths,
  };
}

/**
 * Format a number with leading zeros
 */
export function padZero(num: number, digits: number = 2): string {
  return num.toString().padStart(digits, '0');
}

/**
 * Format the full display mode text
 */
export function formatFullDisplay(diff: TimeDiff): string[] {
  return [
    `${padZero(diff.years)} Years`,
    `${padZero(diff.months)} Months`,
    `${padZero(diff.days)} Days`,
    `${padZero(diff.hours)} Hours`,
    `${padZero(diff.minutes)} Minutes`,
    `${padZero(diff.seconds)} Seconds`,
  ];
}

/**
 * Format single value for focused modes
 */
export function formatSingleValue(diff: TimeDiff, mode: string): string {
  switch (mode) {
    case 'seconds':
      return diff.totalSeconds.toLocaleString();
    case 'minutes':
      return diff.totalMinutes.toLocaleString();
    case 'hours':
      return diff.totalHours.toLocaleString();
    case 'days':
      return diff.totalDays.toLocaleString();
    case 'months':
      return diff.totalMonths.toLocaleString();
    default:
      return '';
  }
}

/**
 * Get the label for a single mode
 */
export function getModeLabel(mode: string): string {
  switch (mode) {
    case 'seconds':
      return 'SECONDS';
    case 'minutes':
      return 'MINUTES';
    case 'hours':
      return 'HOURS';
    case 'days':
      return 'DAYS';
    case 'months':
      return 'MONTHS';
    default:
      return '';
  }
}
