# Mission Plan: nutscash/sparkling-migration — Phase 2: Core Post Components & Explore Feed

## Context
The sparkling migration scaffold is complete. All 28 page bundles compile and copy to native projects. The next phase is to port the core post UI from the original Svelte app (`src/routes/explore/_post/`) to React/Lynx components in the sparkling project (`nutscash-sparkling/src/components/posts/`), and wire the Explore feed with mock nipworker data.

## Milestones

### Milestone 1: PostCard Structure — Header & Footer
**Objective:** Port the post header and footer from the original Svelte app to Lynx-compatible React components.

**Success Criteria:**
- PostCard displays avatar, name, nip05 badge, and timestamp
- PostCard has action buttons: Reply, Repost, Like, Share, Zap
- Navigation works via `go()` helper
- Build produces no errors for changed components

**Features:**
1. **PostHeader.tsx** — Port `header.svelte` to React/Lynx. Show avatar, display name, nip05 verify badge, and relative timestamp. Avatar and name are tappable and navigate to user profile.
2. **PostFooter.tsx** — Port `footer.svelte` (simplified). Show reply, repost, like, share, and zap action rows with counts. Use emoji text for like (❤️) instead of complex SVG animations for now.
3. **PostCard.tsx refactor** — Compose PostHeader + PostFooter. Keep the existing simple content text slot. Ensure styling matches the dark theme.

**Dependencies:** None

---

### Milestone 2: Content Blocks
**Objective:** Port content rendering components so posts can display text, images, and kind-specific content.

**Success Criteria:**
- ContentBlocks component handles plain text, URLs, and images
- kind20Content (picture posts) renders in feed
- Posts with media display correctly in Lynx `<image>` elements
- No Svelte-specific logic remains in ported components

**Features:**
1. **ContentBlocks.tsx** — Port `ContentBlocks.svelte` to React/Lynx. Handle text paragraphs, auto-link URLs, and inline images using `<image>`.
2. **PostPicture.tsx** — Port `kind20Content.svelte` as a lightweight picture-post renderer.
3. **PostCard integration** — Update PostCard to use ContentBlocks for text and render picture posts when `kind === 20`.

**Dependencies:** Milestone 1

---

### Milestone 3: Explore Feed Integration
**Objective:** Replace mock posts in ExploreView with a live feed connected to the mock nipworker.

**Success Criteria:**
- ExploreView fetches events via `useSubscription` from the mock nipworker
- Feed renders ParsedEvent objects through PostCard
- Pagination/onNearBottom loads older events
- Pull-to-refresh resets the feed
- Build passes and bundles are generated

**Features:**
1. **useExploreFeed hook** — Manage `rawEvents`, deduplication, sorting, and pagination state. Subscribe to kind 1 events via mock `useSubscription`.
2. **ExploreView.tsx refactor** — Replace `MOCK_POSTS` with `useExploreFeed`. Pass real events to PostCard. Add `onNearBottom` and `onRefresh` handlers.
3. **PostCard event adapter** — Ensure PostCard can accept a `ParsedEvent`-like object from the mock and extract fields directly (zero-copy style where possible).

**Dependencies:** Milestones 1 and 2

## Risks & Dependencies
- Mock nipworker may need enhancements to support the full explore subscription shape.
- Lynx `<image>` has different behavior than HTML `<img>`; some image layouts may need iteration.
- Complex footer animations from Svelte are intentionally deferred to keep this phase mechanical.

## Estimated Runs
~7 feature agents + 3 validation agents + 3 review agents ≈ 13 total agent runs.

---
---

# Mission Plan: nutscash/sparkling-migration — Phase 3: Page Template Migration

## Context
Phase 2 is complete. The goal now is to migrate **all remaining page templates** from the original SvelteKit app into the Sparkling/Lynx project. This means every page in `app.config.ts` that is currently a stub (16-line placeholder) gets replaced with the real UI ported from the corresponding Svelte route or modal.

**New rules for this phase:**
- **Always use `useSubscription`** for any event fetching. The mock already provides it (`src/lib/nipworker-hooks.ts`). Feed-specific wrappers like `useExploreFeed` are acceptable only as thin state managers *around* `useSubscription`.
- **Review is done by normal Kimi subagents**, not Codex CLI. Heavy frontend work benefits from fast, judgment-based peer review inside subagents.

## Milestones

### Milestone 4: Simple Pages — Logout, Keys, Minted, Melted
**Objective:** Port the smallest, lowest-risk pages first to build momentum and validate the migration pattern.

**Success Criteria:**
- `logout` page has a functional logout confirmation UI
- `keys` page displays public/private key info with copy buttons
- `minted` and `melted` pages show success/status templates
- All pages use Lynx elements and the dark theme
- Build passes

**Features:**
1. **logout page** — Port `modals/_profile/logout.svelte` into `src/pages/logout/index.tsx`. Wire clear-key action to the store. Navigate to `explore` after logout.
2. **keys page** — Port `modals/_profile/keys.svelte` into `src/pages/keys/index.tsx`. Use existing stores for key data. Implement copy-to-clipboard with a fallback (e.g., console.log or visual feedback).
3. **minted page** — Port `modals/minted.svelte` into `src/pages/minted/index.tsx`.
4. **melted page** — Port `modals/melted.svelte` into `src/pages/melted/index.tsx`.

**Dependencies:** None

---

### Milestone 5: Chat Tab Templates
**Objective:** Port chat list and new-chat UI from `src/routes/chat/`.

**Success Criteria:**
- `ChatView` displays a chat list (or empty state)
- `chat` page shows conversation UI
- `newchat` page has contact search / start-conversation UI
- Build passes

**Features:**
1. **ChatView list** — Port `chat/index.svelte` and `chat/empty.svelte` into `ChatView.tsx`.
2. **Chat page** — Port `chat/[...void]` or `chat/index.svelte` full conversation view into `src/pages/chat/index.tsx`.
3. **NewChat page** — Port `modals/newchat.svelte` into `src/pages/newchat/index.tsx`.

**Dependencies:** Milestone 4

---

### Milestone 6: Note, Reply & Repost
**Objective:** Port note detail and composer modals from `src/routes/explore/` and `src/routes/modals/`.

**Success Criteria:**
- `note` page renders a single note with replies
- `reply` page is a functional reply composer
- `repost` page is a functional repost composer
- Build passes

**Features:**
1. **Note page** — Port `explore/note.svelte` into `src/pages/note/index.tsx`. Fetch note via `useSubscription` with `cacheFirst: true`.
2. **Reply page** — Port `explore/reply.svelte` / `modals/post.svelte` reply flow into `src/pages/reply/index.tsx`.
3. **Repost page** — Port `explore/repost.svelte` into `src/pages/repost/index.tsx`.

**Dependencies:** Milestones 1–3

---

### Milestone 7: Profile & User
**Objective:** Port profile and user pages.

**Success Criteria:**
- `profile` page shows current user profile
- `user` page shows arbitrary user profiles
- Build passes

**Features:**
1. **Profile page** — Port `modals/_profile/index.svelte` and `modals/_profile/kind0.svelte` into `src/pages/profile/index.tsx`.
2. **User page** — Port `explore/user.svelte` into `src/pages/user/index.tsx`.

**Dependencies:** None

---

### Milestone 8: Settings & Utilities
**Objective:** Port theme, relays, and command palette pages.

**Success Criteria:**
- `theme` page has theme selection UI (built-in themes at minimum)
- `relays` page shows relay management UI
- `cmdk` page has a command palette shell
- Build passes

**Features:**
1. **Theme page** — Port `modals/theme.svelte` into `src/pages/theme/index.tsx`. Wire to the existing theme store.
2. **Relays page** — Port `modals/_profile/relays.svelte` into `src/pages/relays/index.tsx`.
3. **CMD-K page** — Port `modals/cmdk.svelte` into `src/pages/cmdk/index.tsx`.

**Dependencies:** Milestone 4

---

### Milestone 9: Home / Wallet Tab Templates
**Objective:** Port the Home wallet UI and basic wallet pages.

**Success Criteria:**
- `HomeView` shows wallet state (empty, connected, or with mint cards)
- `wallet` page has a functional wallet shell
- Build passes

**Features:**
1. **HomeView wallet feed** — Port `emptyWallet.svelte` into `HomeView.tsx`. Use stores for key state.
2. **Wallet page shell** — Port the UI structure of `modals/_profile/wallet.svelte` into `src/pages/wallet/index.tsx`. Stub deep Cashu logic; wire forms to existing wallet store.

**Dependencies:** Milestones 4, 8

---

### Milestone 10: Wallet Operations
**Objective:** Port send, receive, scan, QR, and mint/melt flow pages.

**Success Criteria:**
- `send`, `receive`, `scan`, `qr` pages match original Svelte UI
- `minting`, `melt` pages have functional templates
- Build passes

**Features:**
1. **Send page** — Port `modals/send.svelte` into `src/pages/send/index.tsx`.
2. **Receive page** — Port `modals/tapcash.svelte` / top-up flow into `src/pages/receive/index.tsx`.
3. **Scan page** — Port `modals/scan.svelte` into `src/pages/scan/index.tsx`.
4. **QR page** — Port `modals/qr.svelte` into `src/pages/qr/index.tsx`.
5. **Minting page** — Port `modals/minting.svelte` into `src/pages/minting/index.tsx`.
6. **Melt page** — Port `modals/melt.svelte` into `src/pages/melt/index.tsx`.

**Dependencies:** Milestone 9

---

### Milestone 11: Composer, Share & Follow Lists
**Objective:** Port post composer, share, and follow-lists modals.

**Success Criteria:**
- `post` page is a functional note composer
- `share` and `followlists` pages are functional
- Build passes

**Features:**
1. **Post page** — Port `modals/post.svelte` into `src/pages/post/index.tsx`.
2. **Share page** — Port `modals/share.svelte` into `src/pages/share/index.tsx`.
3. **FollowLists page** — Port `modals/followlists.svelte` into `src/pages/followlists/index.tsx`.

**Dependencies:** Milestones 6, 7

---

### Milestone 12: Notifications
**Objective:** Port notifications pages.

**Success Criteria:**
- `notifications` page shows notification tabs (mentions, reactions, replies, reposts, zaps)
- Build passes

**Features:**
1. **Notifications shell** — Port `notifications/index.svelte` into `src/pages/notifications/index.tsx`.
2. **Notification tabs** — Port `notifications/mentions.svelte`, `reactions.svelte`, `replies.svelte`, `reposts.svelte`, `zaps.svelte` as sub-views.

**Dependencies:** Milestones 1–3

---

### Milestone 13: Shared Components
**Objective:** Port the remaining reusable components from `src/components/`.

**Success Criteria:**
- Editor, ImageGrid, ImageZoom, VirtualList, EmojiPicker, GIFPicker, LoginForm, RelaysList, SearchInput, Carousel, LiveStream, VideoTile, and icon set are available in the sparkling project
- No Svelte-specific logic remains
- Build passes

**Features:**
1. **Editor & Composer components** — Port `Editor.svelte` and `editor/*` helpers.
2. **Media components** — Port `ImageGrid.svelte`, `ImageZoom.svelte`, `ImageZoomContext.svelte`, `VideoTile.svelte`, `LiveStream.svelte`, `Carousel.svelte`.
3. **Utility components** — Port `VirtualList.svelte`, `VirtualListBottom.svelte`, `EmojiPicker.svelte`, `GIFPicker.svelte`, `LoginForm.svelte`, `RelaysList.svelte`, `SearchInput.svelte`.
4. **Icon library** — Port all `src/components/icons/*.svelte` to TSX or inline SVG strings.

**Dependencies:** Milestones 4–12

## Risks & Dependencies
- Some Svelte components rely on browser APIs (e.g., `IntersectionObserver`, `URL.createObjectURL`, complex CSS) that need Lynx equivalents.
- The mock nipworker will need to be extended with new `kinds` and subscription shapes as more pages come online.
- Editor is the largest single component; it may need to be split into its own mini-milestone if it proves too complex.

## Estimated Runs
~35 feature agents + 13 validation agents + 13 review agents ≈ 61 total agent runs.
