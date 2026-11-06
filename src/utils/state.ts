/**
 * Relationship TV - State Management
 * Tiny pub/sub for current display mode
 */

import { DisplayMode } from './constants';

type Listener = (mode: DisplayMode) => void;

class ModeState {
  private currentMode: DisplayMode = 'full';
  private listeners: Set<Listener> = new Set();

  getMode(): DisplayMode {
    return this.currentMode;
  }

  setMode(mode: DisplayMode): void {
    if (this.currentMode !== mode) {
      this.currentMode = mode;
      this.notify();
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.currentMode));
  }
}

export const modeState = new ModeState();
