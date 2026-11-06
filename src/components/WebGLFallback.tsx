/**
 * Relationship TV - WebGL Fallback
 * Static HTML fallback when WebGL is not available
 */

import { useEffect, useState } from 'react';
import { START_DATE } from '@/utils/constants';
import { diffDetailed, formatFullDisplay } from '@/time/timer';

export function WebGLFallback() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const update = () => {
      const diff = diffDetailed(START_DATE, new Date());
      setLines(formatFullDisplay(diff));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center space-bg">
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-8 max-w-md mx-4">
        {/* Title */}
        <h1 className="text-primary text-2xl font-mono text-center mb-6 crt-glow">
          Relationship TV
        </h1>

        {/* Timer display */}
        <div className="space-y-2 text-center font-mono">
          {lines.map((line, i) => (
            <p 
              key={i} 
              className="text-lg text-primary crt-glow"
            >
              {line}
            </p>
          ))}
        </div>

        {/* Message */}
        <p className="text-muted-foreground text-sm text-center mt-6">
          For the full interactive 3D experience, please open this site in a modern browser with WebGL support.
        </p>
      </div>
    </div>
  );
}

// Check if WebGL is available
export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl !== null;
  } catch {
    return false;
  }
}
