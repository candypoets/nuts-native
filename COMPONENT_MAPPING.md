# Component Mapping: nuts-native ↔ nuts-cash

This document maps each page/component in the native Lynx app (`nuts-native`) to its original implementation in the Svelte web app (`nuts-cash`).

## Pages (`src/pages/`)

### Core Navigation
| nuts-native | nuts-cash | Notes |
|-------------|-----------|-------|
| `main/index.tsx` | `routes/+page.svelte` | Main entry with tab navigation |
| `main/App.tsx` | `routes/+page.svelte` | Tab container component |
| `main/HomeView.tsx` | `routes/home/[...void]/+page.svelte` | Home tab content |
| `main/ExploreView.tsx` | `routes/explore/index.svelte` | Explore tab content |
| `main/ChatView.tsx` | `routes/chat/index.svelte` | Chat tab content |

### Auth & Profile
| nuts-native | nuts-cash | Notes |
|-------------|-----------|-------|
| `login/index.tsx` | `routes/login.svelte` | Full login page |
| `logout/index.tsx` | `routes/modals/_profile/logout.svelte` | Logout confirmation |
| `profile/index.tsx` | `routes/modals/_profile/index.svelte` | Full profile page |
| `keys/index.tsx` | `routes/modals/_profile/keys.svelte` | Key management |
| `kind0/index.tsx` | `routes/modals/_profile/kind0.svelte` | Edit profile (Kind 0) |
| `wallet/index.tsx` | `routes/modals/_profile/wallet.svelte` | Wallet preferences |
| `relays/index.tsx` | `routes/modals/_profile/relays.svelte` | Relay preferences |
| `qr/index.tsx` | `routes/modals/qr.svelte` | QR code display |

### Chat & Messaging
| nuts-native | nuts-cash | Notes |
|-------------|-----------|-------|
| `chat/index.tsx` | `routes/chat/index.svelte` | Chat list (standalone page) |
| `newchat/index.tsx` | `routes/modals/newchat.svelte` | Start new chat |
| `explore/index.tsx` | `routes/explore/index.svelte` | Standalone explore page |
| `followlists/index.tsx` | `routes/modals/followlists.svelte` | Feed builder/follow lists |

### Nostr Social
| nuts-native | nuts-cash | Notes |
|-------------|-----------|-------|
| `post/index.tsx` | `routes/modals/post.svelte` | Create new post |
| `reply/index.tsx` | `routes/explore/reply.svelte` | Reply to note |
| `repost/index.tsx` | `routes/modals/post.svelte` | Repost functionality |
| `note/index.tsx` | `routes/explore/note.svelte` | Note detail view |
| `user/index.tsx` | `routes/explore/user.svelte` | User profile view |
| `notifications/index.tsx` | `routes/explore/notifications.svelte` | Notifications feed |
| `tags/index.tsx` | `routes/_kinds/tags.svelte` | Hashtag/tag feed |
| `kind1111/index.tsx` | `routes/modals/kind1111.svelte` | Highlights (Kind 1111) |
| `zaps/index.tsx` | `routes/kinds/kind9735.svelte` | Zap events |
| `share/index.tsx` | `routes/modals/share.svelte` | Share options |

### Cashu Wallet
| nuts-native | nuts-cash | Notes |
|-------------|-----------|-------|
| `send/index.tsx` | `routes/modals/send.svelte` | Send payment |
| `receive/index.tsx` | `routes/modals/_profile/login.svelte` | Receive/tokens |
| `minting/index.tsx` | `routes/modals/minting.svelte` | Mint tokens |
| `minted/index.tsx` | `routes/modals/minted.svelte` | Mint success |
| `melt/index.tsx` | `routes/modals/melt.svelte` | Melt tokens |
| `melted/index.tsx` | `routes/modals/melted.svelte` | Melt success |
| `tapcash/index.tsx` | `routes/modals/tapcash.svelte` | NFC tap-to-pay |
| `ecash/index.tsx` | `routes/modals/ecash.svelte` | eCash management |
| `lightning/index.tsx` | `routes/modals/lightning.svelte` | Lightning payment |

### Utilities
| nuts-native | nuts-cash | Notes |
|-------------|-----------|-------|
| `scan/index.tsx` | `routes/modals/scan.svelte` | QR scanner |
| `cmdk/index.tsx` | *(new feature)* | Command palette (native only) |
| `theme/index.tsx` | `routes/modals/theme.svelte` | Theme selector |
| `zoom/index.tsx` | `components/ImageZoom.svelte` | Image zoom/lightbox |
| `relayinfos/index.tsx` | `routes/modals/relayinfos.svelte` | Relay information |

### Templates
| nuts-native | nuts-cash | Notes |
|-------------|-----------|-------|
| `second/index.tsx` | *(template)* | Example secondary page |
| `second/App.tsx` | *(template)* | Template page content |

## Key Directory Structure

```
/root/code/nuts-cash/src/routes/
├── +page.svelte              # Main entry (tabs)
├── login.svelte              # Login page
├── explore/
│   ├── index.svelte          # Explore tab
│   ├── note.svelte           # Note detail
│   ├── reply.svelte          # Reply composer
│   ├── user.svelte           # User profile
│   ├── notifications.svelte # Notifications
│   └── _post/                # Post components
├── home/
│   ├── [...void]/+page.svelte # Home tab
│   ├── emptyWallet.svelte    # Empty state
│   └── components/
│       └── mintcard.svelte   # Mint card UI
├── chat/
│   ├── index.svelte          # Chat tab
│   └── empty.svelte          # Empty state
├── modals/
│   ├── ecash.svelte
│   ├── followlists.svelte
│   ├── kind1111.svelte
│   ├── lightning.svelte
│   ├── melted.svelte
│   ├── melt.svelte
│   ├── minted.svelte
│   ├── minting.svelte
│   ├── newchat.svelte
│   ├── post.svelte
│   ├── qr.svelte
│   ├── scan.svelte
│   ├── send.svelte
│   ├── share.svelte
│   ├── tapcash.svelte
│   ├── theme.svelte
│   ├── relayinfos.svelte
│   └── _profile/
│       ├── index.svelte      # Profile
│       ├── keys.svelte
│       ├── kind0.svelte      # Edit profile
│       ├── login.svelte      # Receive
│       ├── logout.svelte
│       ├── relays.svelte
│       └── wallet.svelte
├── _kinds/
│   ├── kind0.svelte          # Profile metadata
│   ├── kind1.svelte          # Text note
│   ├── kind4.svelte          # Encrypted DM
│   ├── kind30023.svelte      # Long-form
│   ├── kind9321.svelte       # Web-of-trust
│   └── tags.svelte           # Hashtag feed
└── kinds/
    └── kind9735.svelte       # Zap receipt
```

## Migration Notes

1. **Modal System**: nuts-cash uses a modal routing system (`/home/send`, `/home/profile`, etc.) while nuts-native uses standalone pages with `go()` navigation.

2. **State Management**: 
   - nuts-cash uses Svelte stores in `src/controller/`
   - nuts-native uses React stores in `src/stores/`

3. **Components**:
   - nuts-cash: `src/components/` (Svelte)
   - nuts-native: `src/components/` (React/Lynx)

4. **Hooks**:
   - nuts-cash: `src/routes/queries/` for data fetching
   - nuts-native: `src/hooks/` for data fetching

## Cross-Reference Comments

Each file in `src/pages/` now contains a comment at the top indicating:
- The original nuts-cash source file
- Any additional related files worth checking

Example:
```typescript
// Original: /root/code/nuts-cash/src/routes/modals/send.svelte
import { useState } from 'react';
```
