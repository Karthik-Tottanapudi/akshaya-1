# Relationship TV

An emotional keepsake: a floating retro CRT television in a calm space background that displays the time passed since a specific relationship start date.

## Features

- **3D Interactive TV**: Drag/swipe to rotate the TV between front and back views
- **Real-time Timer**: Calendar-aware time calculation showing years, months, days, hours, minutes, seconds
- **Back Panel Buttons**: 6 interactive 3D buttons to switch display modes (seconds, minutes, hours, days, months, reset)
- **CRT Visual Effects**: Scanlines, vignette, glow, and subtle curvature
- **Starfield Background**: Subtle animated stars in deep space
- **Accessibility**: ARIA live regions for screen readers, keyboard navigation

## How It Works

### Timer Logic (Calendar-Aware)

The `diffDetailed()` function in `src/time/timer.ts` computes human-meaningful calendar differences rather than naive millisecond division. It:

1. Computes year difference, then adjusts if the current date hasn't reached the anniversary month/day yet
2. Computes month difference within the adjusted years
3. Computes day difference within the adjusted months, accounting for variable month lengths
4. Computes hours, minutes, seconds from the remaining time
5. Also calculates total counts (totalSeconds, totalMinutes, etc.) for single-mode displays

This ensures that "5 months" means 5 actual calendar months, handling leap years and variable month lengths correctly.

## Configuration

### Changing the Start Date

Edit `src/utils/constants.ts`:

```typescript
// Note: JavaScript months are 0-indexed (9 = October)
export const START_DATE = new Date(2026, 9, 4, 0, 0, 0);
```

## Controls

### Touch/Mouse
- **Drag left-to-right**: Rotate TV to show left side
- **Drag right-to-left**: Rotate TV to show right side/back
- **Click buttons**: Press mode buttons when back is visible

### Keyboard
- **Arrow Left/Right**: Rotate the TV
- **Tab**: Navigate buttons when back is visible
- **Enter**: Press focused button
- **Escape**: Reset to full display mode

## Technology Stack

- **React 18** + **TypeScript**
- **Three.js** via **@react-three/fiber**
- **@react-three/drei** for 3D helpers
- **Tailwind CSS** for styling
- **Vite** for development

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Or use any static server:
- VS Code Live Server
- `python -m http.server` (after building)
- `npx serve dist`

## Building for Production

```bash
npm run build
```

## Deploying to Vercel

1. Connect your GitHub repository to Vercel
2. Vercel auto-detects Vite and configures build settings
3. Deploy!

## Test Checklist

1. ✅ Open the app - TV appears floating in space
2. ✅ Timer displays correct elapsed time since October 4, 2026
3. ✅ Drag left-to-right rotates TV left
4. ✅ Drag right-to-left rotates TV right (shows back)
5. ✅ Releasing mid-rotation snaps to nearest view (front or back)
6. ✅ Back panel shows 6 buttons (SEC, MIN, HRS, DAY, MON, RST)
7. ✅ Clicking a button changes display mode
8. ✅ Reset button returns to full display
9. ✅ Seconds update every second
10. ✅ Stars gently animate in background

## Assumptions Made

- **Font**: Share Tech Mono (Google Fonts) for monospace CRT aesthetic
- **TV Proportions**: 1.6:1.0:0.6 aspect ratio (width:height:depth)
- **Screen Bulge**: 0.06 units at center for subtle CRT curvature
- **Snap Duration**: 420ms with easeOutCubic easing
- **Rotation**: Clamped between 0 (front) and π (180° back)
- **Click Threshold**: Buttons only clickable when rotation > 0.6π

## Possible Future Improvements

- **Bloom Effect**: Add post-processing bloom for enhanced CRT glow
- **HDRI Environment**: Reflective environment map for more realistic materials
- **Sound Effects**: Button click sounds, ambient hum
- **GLTF Model**: Replace procedural TV with detailed 3D model
- **Multiple Date Modes**: Anniversary countdown, next milestone display
- **Customizable Colors**: Theme picker for different CRT phosphor colors

## License

MIT License - feel free to use and modify for your own relationship keepsake!
