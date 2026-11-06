/**
 * Relationship TV - Timer Hook
 * Provides real-time timer updates with increment detection
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { START_DATE, DisplayMode } from '@/utils/constants';
import { diffDetailed, TimeDiff } from '@/time/timer';
import { modeState } from '@/utils/state';

interface IncrementAnimation {
  id: number;
  value: string;
  x: number;
  y: number;
  startTime: number;
}

export function useTimer() {
  const [diff, setDiff] = useState<TimeDiff>(() => diffDetailed(START_DATE, new Date()));
  const [mode, setMode] = useState<DisplayMode>('full');
  const [increments, setIncrements] = useState<IncrementAnimation[]>([]);
  
  const prevDiffRef = useRef<TimeDiff>(diff);
  const incrementIdRef = useRef(0);

  // Subscribe to mode changes
  useEffect(() => {
    const unsubscribe = modeState.subscribe((newMode) => {
      setMode(newMode);
    });
    return unsubscribe;
  }, []);

  // Spawn increment animation
  const spawnIncrement = useCallback((value: string) => {
    const id = incrementIdRef.current++;
    const newIncrement: IncrementAnimation = {
      id,
      value,
      x: 55, // Percentage from left
      y: 50, // Percentage from top
      startTime: Date.now(),
    };
    
    setIncrements(prev => [...prev, newIncrement]);

    // Remove after animation completes
    setTimeout(() => {
      setIncrements(prev => prev.filter(inc => inc.id !== id));
    }, 1000);
  }, []);

  // Update timer every second
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const newDiff = diffDetailed(START_DATE, now);
      const prevDiff = prevDiffRef.current;

      // Check for increments based on current mode
      if (mode === 'minutes' && newDiff.totalMinutes > prevDiff.totalMinutes) {
        spawnIncrement('+1');
      } else if (mode === 'hours' && newDiff.totalHours > prevDiff.totalHours) {
        spawnIncrement('+1');
      } else if (mode === 'days' && newDiff.totalDays > prevDiff.totalDays) {
        spawnIncrement('+1');
      } else if (mode === 'months' && newDiff.totalMonths > prevDiff.totalMonths) {
        spawnIncrement('+1');
      }

      prevDiffRef.current = newDiff;
      setDiff(newDiff);
    };

    // Initial update
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [mode, spawnIncrement]);

  return {
    diff,
    mode,
    increments,
  };
}
