/**
 * Relationship TV - Accessibility Screen Reader Support
 * Hidden ARIA live region for timer updates
 */

import { useEffect, useState } from 'react';
import { START_DATE } from '@/utils/constants';
import { diffDetailed, TimeDiff } from '@/time/timer';

export function AccessibilityAnnouncer() {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const update = () => {
      const diff = diffDetailed(START_DATE, new Date());
      const text = formatForScreenReader(diff);
      setAnnouncement(text);
    };

    update();
    // Update every minute for screen readers (less frequent than visual)
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

function formatForScreenReader(diff: TimeDiff): string {
  const parts: string[] = [];
  
  if (diff.years > 0) {
    parts.push(`${diff.years} year${diff.years !== 1 ? 's' : ''}`);
  }
  if (diff.months > 0) {
    parts.push(`${diff.months} month${diff.months !== 1 ? 's' : ''}`);
  }
  if (diff.days > 0) {
    parts.push(`${diff.days} day${diff.days !== 1 ? 's' : ''}`);
  }
  if (diff.hours > 0) {
    parts.push(`${diff.hours} hour${diff.hours !== 1 ? 's' : ''}`);
  }
  if (diff.minutes > 0) {
    parts.push(`${diff.minutes} minute${diff.minutes !== 1 ? 's' : ''}`);
  }

  return `Time together: ${parts.join(', ')}`;
}
