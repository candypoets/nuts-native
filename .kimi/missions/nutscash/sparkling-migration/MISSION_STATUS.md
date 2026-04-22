# Mission Status: harmonize-explore

## Start
- Date: 2026-04-22
- Base commit: bbbdb79 infra: android dev server, sparkle-method fix, cleartext, bundle routing
- Worktree: `.kimi/missions/nuts-native/harmonize-explore/wt`

## Infrastructure Already in Place
- Dev server running on port 3002 (`npx rspeedy dev -c .sparkling/lynx.config.ts`)
- Android APK loads bundles from `http://10.0.2.2:3002/` in DEBUG mode
- Command-line navigation via `adb shell am start -n com.example.sparkling.go/.SplashActivity --es bundle <name>.lynx.bundle`
- Both web (Chrome) and native apps run on emulator-5554 for side-by-side comparison

## Milestones

### M1: Colors, backgrounds, and theme alignment ✅ COMPLETE
**Commit:** aef05b2

**Changes:**
- Darken matteblack theme to match web's `brightness(0.8)` filter effect:
  - `base-100`: #0a0a0a (page background)
  - `base-200`: #111111 (header/secondary background)
  - `base-300`: #1e1e1e (card/container background)
- Update `shadow-widget` to match web box-shadow using CSS variables
- Add `shadow-widget-down` class for feed container
- `ExploreView`: Use `mobile-height bg-base-100` root, `bg-base-300 rounded-lg shadow-widget-down` feed container
- `PostCard`: Use `bg-base-300 bg-opacity-85 mt-1 rounded-lg shadow-widget`
- Remove `px-3` from PostCard to match web note spacing

**Result:** Native explore page now has a dark matteblack theme with card-style posts, matching the web reference's visual density and contrast.

### M2: Post card styling (pending)
- Align post card content spacing with web
- Match header typography and spacing
- Action button styling (replace emojis with styled icons)

### M3: Header and buttons (pending)
- Add relay connection indicator (nostrwine green dot)
- Match header layout and spacing exactly
- Floating post button vs sticky footer

### M4: Icons and typography (pending)
- Replace emoji action buttons with styled text/icons
- Match web iconography

### M5: Final polish (pending)
- Side-by-side screenshot verification
- Any remaining pixel-perfect adjustments
