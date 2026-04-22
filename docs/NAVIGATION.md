# Navigation System

The app supports **two navigation patterns**:

1. **Native Navigation** (`sparkling-navigation`) - Full page transitions (push right)
2. **JS Overlay System** (`lib/overlay.ts`) - Stacked modal/sub overlays with background animation

## Quick Comparison

| Feature | Native Nav | JS Overlay |
|---------|-----------|------------|
| Animation | Push right only | Modal (slide up) or Sub (push right) |
| Background | Hidden | Visible with progressive animation |
| Stacking | ❌ No (replaces page) | ✅ Yes (multiple overlays) |
| Speed | Slower (page load) | Faster (CSS transition) |
| Depth effect | ❌ No | ✅ Progressive scale/dim |

## Stacked Overlays

The overlay system supports **multiple overlays on screen**:

```
┌─────────────────────────────────────┐  ← Background (scale 0.85, dimmed)
│  ┌───────────────────────────────┐  │  ← Overlay 1 (partially visible)
│  │  ┌─────────────────────────┐  │  │  ← Overlay 2 (partially visible)
│  │  │  ┌───────────────────┐ │  │  │  ← Overlay 3 (active, fully visible)
│  │  │  │                   │ │  │  │
│  │  │  │   SEND PAYMENT    │ │  │  │
│  │  │  │   (from composer) │ │  │  │
│  │  │  │                   │ │  │  │
│  │  │  └───────────────────┘ │  │  │
│  │  │     OVERLAY 2          │  │  │
│  │  └─────────────────────────┘  │  │
│  │        OVERLAY 1              │  │
│  └───────────────────────────────┘  │
│            MAIN CONTENT             │
└─────────────────────────────────────┘
```

### API

```typescript
import { 
  pushModal,    // Add modal on top of stack
  pushSub,      // Add sub on top of stack  
  popOverlay,   // Close top overlay
  closeAllOverlays, // Close entire stack
  useOverlayStack   // Hook to get stack info
} from '../lib/overlay.js';

// Open first overlay
pushModal('post');                    // Stack: [post]

// Open second overlay on top
pushModal('send', { amount: 100 });   // Stack: [post, send]

// Or mix types
pushModal('post');                    // Stack: [post]
pushSub('note', { event });          // Stack: [post, note]

// Close top (returns to previous)
popOverlay();                         // Stack: [post]

// Close all
closeAllOverlays();                   // Stack: []
```

### Progressive Background Animation

As the overlay stack grows, the background animates progressively:

| Depth | Scale | Opacity | Border Radius | Effect |
|-------|-------|---------|---------------|--------|
| 0 (none) | 1.0 | 1.0 | 0 | Normal |
| 1 | 0.95 | 0.65 | 8px | Slight recess |
| 2 | 0.90 | 0.30 | 16px | Deep recess |
| 3 | 0.85 | 0.15 | 24px | Very deep |
| 4+ | 0.80 | 0.15 | 32px | Maximum |

### Overlay Visual Stacking

When multiple modals are stacked, they show slight offset to indicate depth:

```typescript
pushModal('post');     // Bottom: full height, rounded top
pushModal('send');     // Middle: 10px offset, visible edges
pushModal('scan');     // Top: active, full interaction
```

## Usage Examples

### Payment Flow (Stacked Modals)

```typescript
// 1. Open composer
pushModal('post');

// 2. User adds payment tag, opens send
pushModal('send', { amount: 1000 });

// 3. User needs to scan, opens scanner
pushModal('scan');

// 4. Close scanner → back to send
// 5. Close send → back to composer
// 6. Close composer → back to feed
```

### Deep Content Navigation (Mixed Stack)

```typescript
// 1. From feed, open note detail
pushSub('note', { event });

// 2. From note, open user profile (as modal)
pushModal('profile', { pubkey });

// 3. From profile, open follow lists
pushModal('followlists');

// Each pop() returns to previous layer
```

## Page Type Classification

| Page | Recommended | Type | Reason |
|------|-------------|------|--------|
| `send` | **Overlay** | `modal` | Quick payment action |
| `receive` | **Overlay** | `modal` | Quick payment action |
| `post` | **Overlay** | `modal` | Composer overlay |
| `profile` | **Overlay** | `modal` | Settings overlay |
| `scan` | **Overlay** | `modal` | Utility overlay |
| `note` | **Overlay** | `sub` | Content detail (push) |
| `user` | **Overlay** | `sub` | Content detail (push) |
| `login` | Native | `sub` | Auth flow |

## Hook: useOverlayStack

```typescript
function MyComponent() {
  const { 
    stack,        // Array of all overlays
    depth,        // Number of overlays (0 = none)
    topOverlay,   // Top overlay item
    hasOverlays,  // Boolean
    pushOverlay,  // Function to push
    popOverlay,   // Function to pop
    closeAllOverlays 
  } = useOverlayStack();

  // Show depth indicator
  if (depth > 0) {
    return <text>Stack depth: {depth}</text>;
  }
}
```

## Migration from nuts-cash

### nuts-cash (Svelte)
```svelte
<!-- Modal - data-kind="modal" -->
<button on:click={() => go('send')}>Send</button>

<!-- Sub - data-kind="sub" -->
<a href="/explore/user:npub1..." data-kind="sub">User</a>

<!-- Modal on modal -->
<button on:click={() => go('scan')}>Open Scanner</button>
```

### nuts-native (React/Lynx)
```tsx
// Single modal
import { pushModal } from '../lib/overlay.js';
<view bindtap={() => pushModal('send')}><text>Send</text></view>

// Single sub (content)
import { pushSub } from '../lib/overlay.js';
<view bindtap={() => pushSub('note', { event })}><text>Note</text></view>

// Stacked modals - just call again!
<view bindtap={() => {
  pushModal('post');      // First overlay
  pushModal('send');     // Second on top
}}>Post with Send</view>
```

## Implementation Details

### State Management
- Global singleton stack (overlayStack)
- Subscribers notified on every change
- Each overlay has unique ID
- Stack persists across component mounts

### Animation System
- CSS transitions for 60fps performance
- will-change hints for GPU acceleration
- Progressive calculations based on depth
- Z-index layering (50 + index)

### Event Handling
- Backdrop tap closes top overlay only
- Overlay content click stops propagation
- Each overlay manages its own close button
