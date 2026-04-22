// Original: /root/code/nuts-cash/src/routes/modals/_profile/index.svelte
// Note: Full profile page, also see _profile/wallet.svelte and _profile/relays.svelte
import { root } from '@lynx-js/react';
import { view, text, image, input } from '@lynx-js/react';
import { useState, useEffect } from 'react';
import { PageShell } from '../../components/PageShell.js';
import { go } from '../../lib/navigation.js';
import { useKeyStore } from '../../stores/useKeyStore.js';
import { useNostrStore } from '../../stores/useNostrStore.js';
import { getKind0, getKind3 } from '../../lib/nipworker-mock.js';

function Page() {
  const [search, setSearch] = useState('');
  const { key } = useKeyStore();
  const { parsedKind0, resolveKind0, resolveKind3, kind3Ready } = useNostrStore();

  useEffect(() => {
    if (key.pub && !parsedKind0) {
      const k0 = getKind0(key.pub);
      if (k0) {
        resolveKind0(k0);
      }
    }
  }, [key.pub, parsedKind0, resolveKind0]);

  useEffect(() => {
    if (key.pub && !kind3Ready) {
      const k3 = getKind3(key.pub);
      if (k3) {
        resolveKind3(k3);
      }
    }
  }, [key.pub, kind3Ready, resolveKind3]);

  const displayName = parsedKind0?.name || key.npub?.slice(0, 12) + '...' || 'Profile';
  const picture = parsedKind0?.picture;

  return (
    <PageShell title="Profile">
      <view className="flex flex-col">
        {/* Account switching row */}
        <view className="flex items-center gap-3 px-2 py-4">
          <image
            src={picture || 'asset:///miss-profile.png'}
            className="w-12 h-12 rounded-full border border-white/20"
          />
          <view className="flex flex-col">
            <text className="text-white font-medium text-sm">{displayName}</text>
            <text className="text-white/40 text-xs">{key.npub?.slice(0, 20)}...</text>
          </view>
          <view
            className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center ml-auto"
            bindtap={() => go('login')}
          >
            <text className="text-white text-xl">＋</text>
          </view>
        </view>

        {/* Search bar */}
        <view className="mt-2 mb-4 flex flex-row items-center bg-white/5 border border-white/10 rounded-xl px-3 py-3">
          <text className="text-white/40 mr-2">🔍</text>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e: { target?: { value?: string } }) => setSearch(e.target?.value ?? '')}
            className="flex-1 bg-transparent text-white placeholder:text-white/30 outline-none"
          />
        </view>

        {/* Actions section */}
        <view className="mb-6 rounded-xl border border-white/10 overflow-hidden">
          <view
            className="py-4 px-4 bg-white/5 flex flex-row items-center border-b border-white/10 last:border-b-0"
            bindtap={() => go('logout')}
          >
            <text className="w-10 text-white/60">🚪</text>
            <text className="flex-1 text-red-400 font-medium">Logout</text>
            <text className="text-white/40">›</text>
          </view>
        </view>

        {/* Profile section */}
        <text className="text-white font-bold mb-3 px-1">Profile</text>
        <view className="rounded-xl border border-white/10 overflow-hidden">
          <view
            className="py-4 px-4 bg-white/5 flex flex-row items-center border-b border-white/10"
            bindtap={() => go('main')}
          >
            <text className="w-10 text-white/60">👤</text>
            <text className="flex-1 text-white font-medium">My Profile</text>
            <text className="text-white/40">›</text>
          </view>
          <view
            className="py-4 px-4 bg-white/5 flex flex-row items-center border-b border-white/10"
            bindtap={() => go('kind0')}
          >
            <text className="w-10 text-white/60">✏️</text>
            <text className="flex-1 text-white font-medium">Edit Profile</text>
            <text className="text-white/40">›</text>
          </view>
          <view
            className="py-4 px-4 bg-white/5 flex flex-row items-center border-b border-white/10"
            bindtap={() => go('keys')}
          >
            <text className="w-10 text-white/60">🔑</text>
            <text className="flex-1 text-white font-medium">Keys</text>
            <text className="text-white/40">›</text>
          </view>
          <view
            className="py-4 px-4 bg-white/5 flex flex-row items-center border-b border-white/10"
            bindtap={() => go('relays')}
          >
            <text className="w-10 text-white/60">🐦</text>
            <view className="flex-1 flex flex-col">
              <text className="text-white font-medium">Relays</text>
              <text className="text-white/40 text-xs">Your relay of choice</text>
            </view>
            <text className="text-white/40">›</text>
          </view>
          <view
            className="py-4 px-4 bg-white/5 flex flex-row items-center border-b border-white/10"
            bindtap={() => go('wallet')}
          >
            <text className="w-10 text-white/60">🏦</text>
            <view className="flex-1 flex flex-col">
              <text className="text-white font-medium">Wallet</text>
              <text className="text-white/40 text-xs">Your wallet preferences</text>
            </view>
            <text className="text-white/40">›</text>
          </view>
          <view
            className="py-4 px-4 bg-white/5 flex flex-row items-center"
            bindtap={() => go('theme')}
          >
            <text className="w-10 text-white/60">🎨</text>
            <view className="flex-1 flex flex-col">
              <text className="text-white font-medium">Theme</text>
              <text className="text-white/40 text-xs">Customize your appearance</text>
            </view>
            <text className="text-white/40">›</text>
          </view>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
