/**
 * Relationship TV - Footer Bar
 * Displays date and credits at the bottom
 */

import { START_DATE } from '@/utils/constants';

export function DateLabel() {
  const formattedDate = START_DATE.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 pointer-events-none">
      <div className="flex items-center justify-center gap-3 px-3 py-2 bg-background/80 backdrop-blur-sm border-t border-primary/20">
        <p className="text-primary/70 text-[8px] sm:text-[10px] font-mono tracking-wider uppercase">
          Since {formattedDate}
        </p>
        <span className="text-primary/30 text-[8px]">•</span>
        <p className="text-primary/50 text-[8px] sm:text-[10px] font-mono tracking-wide">
          Created by Karthik for Akshaya with all his love ♥
        </p>
      </div>
    </div>
  );
}
