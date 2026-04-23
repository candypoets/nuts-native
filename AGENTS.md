# Agent Guide for nuts-native (Sparkling/Lynx)

This is a **brownfield iOS app** built with [Sparkling](https://sparkling.sh) (v2.0.1) and [Lynx](https://lynxjs.org) (v3.6.0), using ReactLynx for the JS layer. The original app was a Svelte web app (`nuts-cash`); this is the native migration.

## Architecture

- **iOS Native Layer**: Swift/SwiftUI host app in `ios/SparklingGo/`
- **JS Layer**: ReactLynx components in `src/`, bundled to `.lynx.bundle` files
- **Navigation**: Hybrid — native page routing via `sparkling-navigation` + JS overlay stack (see `docs/NAVIGATION.md`)
- **Styling**: Tailwind CSS (components + utilities layers only, no base layer)

## Prerequisites

- macOS with Xcode 26.4+
- Node.js 22.x
- Ruby 3.3+ (for CocoaPods) — system Ruby (2.6) is too old
- iOS Simulator (iPhone 17 Pro is the default target)

## Build & Run Workflow

### Quick Start (DEBUG — recommended for development)

In DEBUG builds, the app loads bundles directly from the dev server. No rebuild needed for JS changes.

**Terminal 1** — start the dev server (keep running):
```bash
npx rspeedy dev -c .sparkling/lynx.config.ts
```

**Terminal 2** — build and launch the iOS app:
```bash
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
npm run run:ios
```

This runs autolink → pod install → build → install → launch automatically.

### Production Build (manual)

For RELEASE builds or when the dev server is not running:

```bash
# 1. Build JS bundles
npm run build

# 2. Build iOS app
cd ios
xcodebuild -workspace SparklingGo.xcworkspace \
  -scheme SparklingGo \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
  build

# 3. Install to booted simulator
xcrun simctl install booted \
  ~/Library/Developer/Xcode/DerivedData/SparklingGo-*/Build/Products/Debug-iphonesimulator/SparklingGo.app

# 4. Launch
xcrun simctl launch booted com.nutscash.sparkling
```

**Pro tip**: If `xcodebuild` fails with Ruby errors, ensure Ruby 3.3 is in PATH:
```bash
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
```

## Known Issues & Workarounds

### 1. `sparkling-app-cli` Autolinker Bug
The CLI generates `pod 'ios'` instead of `pod 'Sparkling-Media'` in the Podfile.

**Fix**: After running any CLI command that regenerates the iOS project, manually edit `ios/Podfile`:
```ruby
# WRONG (generated)
pod 'ios', :path => '...'

# CORRECT (manual fix)
pod 'Sparkling-Media', :path => '...'
```

### 2. Swift 6 / Xcode 26 Compilation
The `@_section("__DATA, SPK_PRE_SVC")` + `@_used` pattern used for service registration fails in Swift 6.

**Fix**: Manual registration in `SparklingGoApp.swift`:
- `SPKLynxService.swift` — removed `@_used`/`@_section`, made `executePrepareServiceTask()` public static
- `SPKResourceLoaderImpl.swift` — same cleanup
- `SparklingGoApp.swift` — calls `SPKLynxService.executePrepareServiceTask()` manually

### 3. URL Scheme
The bundle URL must use `lynxview_page` (not `lynxview`):
```swift
// CORRECT
"hybrid://lynxview_page?bundle=main.lynx.bundle&hide_status_bar=1&hide_nav_bar=1"

// WRONG
"hybrid://lynxview?bundle=.%2Fmain.lynx.bundle"
```

Files: `ios/SparklingGo/SparklingGo/SparklingSwiftVC.swift` and `SparklingSwiftUIView.swift`

### 4. Lynx `scrollView` Doesn't Work in Flex Containers
`scrollView` from `@lynx-js/react` fails to render children when nested inside flex containers (even with `flex-1`, `h-full`, or `scroll-y`).

**Workaround**: Use a plain `<view>` instead:
```tsx
// ❌ Broken — scrollView collapses to 0 height
<scrollView className="flex-1">
  {items.map(...)}
</scrollView>

// ✅ Working — plain view renders correctly
<view className="flex-1 flex flex-col">
  <view className="flex-1">
    {items.map(...)}
  </view>
</view>
```

> Note: This loses scrollability. For long lists, you may need to use Lynx `<list>` with explicit parent dimensions or find another workaround.

### 5. `list` Component Height Requirement
Lynx `<list>` requires an **explicit non-percentage height** on its parent. `flex-1` alone is insufficient.

### 6. Tailwind CSS — No Base Layer
`@import 'tailwindcss'` (which includes the base/preflight layer) causes Lynx CSS parser errors.

**Fix**: Only import components and utilities:
```css
@tailwind components;
@tailwind utilities;
```

Do NOT use `@tailwind base` or `@import 'tailwindcss'`.

### 7. Asset Images Not Copied to App Bundle
Files in `resource/*.jpg` are NOT automatically copied into the iOS app bundle. `asset:///touchgrass.jpg` URLs fail silently.

**Workarounds**:
- Copy needed assets to `src/assets/` (they get bundled via the build process)
- Add a CSS `background-color` fallback for `.bg-basic` (e.g., `#1a1a1a`)
- Configure Xcode to copy `resource/` files into the app bundle

### 8. Dark Theme Colors
The original `:root` CSS variables had light colors (`--base-100: #f9fafb`) which made white text invisible without the background image.

**Fix**: Default colors are now dark (from the `nightsky` theme):
```css
:root {
  --base-100: #131716;
  --base-200: #1a1a1a;
  --base-300: #1f2937;
}
```

## Lynx Layout Constraints

Lynx's layout engine differs from standard CSS flexbox in several ways:

| CSS Pattern | Lynx Behavior | Workaround |
|-------------|---------------|------------|
| `scrollView` with `flex-1` | Collapses to 0 height | Use plain `view` instead |
| `scrollView` with `h-full` | May not resolve | Use `view` wrapper with `flex-1` + child `flex-1` |
| `list` with `flex-1` parent | "invalid list container's size" | Give parent explicit pixel height |
| `view` with only `flex-1` | Works as flex item | Add `flex flex-col` if it has flex children |
| `position: fixed` | Not supported | Avoid or use absolute positioning |
| `isolation`, `filter` | Not supported | Remove from CSS |

## Project Structure

```
src/
  pages/main/          # Main tab views (App.tsx, HomeView, ExploreView, ChatView)
  components/          # Shared components (PostCard, OverlayContainer, etc.)
  hooks/               # React hooks (useExploreFeed, etc.)
  stores/              # State management (StoreContext)
  lib/                 # Utilities (navigation, overlay, nipworker adapter)
  app.css              # Global CSS (Tailwind imports + custom properties)
ios/SparklingGo/       # iOS native project
  SparklingGo/         # Swift source files
  Resources/Assets/    # .lynx.bundle files (auto-copied on build)
```

## Navigation

See `docs/NAVIGATION.md` for the full overlay stack system.

Quick API:
```typescript
import { pushModal, pushSub, popOverlay } from './lib/overlay.js';

pushModal('send', { amount: 100 });   // Modal overlay (slides up)
pushSub('note', { event });           // Sub overlay (pushes right)
popOverlay();                         // Close top overlay
```

## Dev Server Workflow (DEBUG builds)

In DEBUG mode, the app loads `http://<your-ip>:3000/main.lynx.bundle` directly from the rspeedy dev server:

```swift
// ios/SparklingGo/SparklingGo/SparklingSwiftVC.swift
#if DEBUG
let url = "hybrid://lynxview_page?bundle=http://192.168.178.132:3000/main.lynx.bundle&hide_status_bar=1&hide_nav_bar=1"
#else
let url = "hybrid://lynxview_page?bundle=main.lynx.bundle&hide_status_bar=1&hide_nav_bar=1"
#endif
```

### Reloading After Code Changes

The dev server rebuilds bundles on file change (~3s), but the app does **not** auto-refresh. Use one of these methods:

| Method | Command / Action | Time |
|--------|-----------------|------|
| **Shake to Reload** | `Cmd+Ctrl+Z` in Simulator (or Device → Shake) | ~1s |
| **Quick Restart** | `./scripts/reload-ios.sh` | ~2s |
| **Full Rebuild** | `npm run run:ios` | ~30s |

**Shake-to-reload** is the fastest — it calls `container.reload(nil)` on the Sparkling view controller, which re-fetches the bundle from the dev server without restarting the app.

### Lynx DevTool (DEBUG only)

DevTool is enabled in DEBUG builds for element inspection and JS debugging:

```swift
// SparklingGoApp.swift
#if DEBUG
let lynxEnv = LynxEnv.sharedInstance()
lynxEnv.lynxDebugEnabled = true
lynxEnv.devtoolEnabled = true
lynxEnv.logBoxEnabled = true
#endif
```

Connect with [Lynx DevTool Desktop](https://github.com/lynx-family/lynx-devtool) for deep debugging.

## Testing Changes (Production / Release)

When NOT using the dev server:
1. `npm run build` — builds bundles and copies them to `ios/SparklingGo/Resources/Assets/`
2. `cd ios && xcodebuild ...` — build the iOS app
3. `xcrun simctl install booted ... && xcrun simctl launch booted ...`
