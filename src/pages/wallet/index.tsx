// Original: /root/code/nuts-cash/src/routes/modals/_profile/wallet.svelte
import { useState } from 'react';
import { root, view, text, input } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { goBack } from '../../lib/navigation.js';

function Page() {
  const [search, setSearch] = useState('');

  return (
    <PageShell title="Cashu Wallet">
      {/* Wallet Address */}
      <view className="mt-4">
        <text className="text-white font-semibold">Wallet Address</text>
        <view className="mt-2">
          <text className="text-white/60 text-sm">npub (shareable)</text>
          <view className="flex flex-row items-center gap-2 mt-1">
            <input
              type="text"
              readOnly
              value="npub1..."
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
            <view className="px-3 py-2 bg-white/10 rounded-lg" bindtap={() => {}}>
              <text className="text-white">📋</text>
            </view>
          </view>
        </view>
        <view className="mt-3">
          <text className="text-white/60 text-sm">nsec (private)</text>
          <view className="flex flex-row items-center gap-2 mt-1">
            <input
              type="text"
              readOnly
              value="nsec1..."
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
            <view className="px-3 py-2 bg-white/10 rounded-lg" bindtap={() => {}}>
              <text className="text-white">📋</text>
            </view>
          </view>
        </view>
      </view>

      {/* Mints */}
      <view className="mt-6">
        <text className="text-white font-semibold">Mints</text>
        <view className="mt-2">
          <input
            type="text"
            placeholder="Search mints to add..."
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          />
        </view>
        <view className="mt-4 py-6 bg-white/5 rounded-xl items-center">
          <text className="text-white/50 text-sm">No mints selected. Search above to add.</text>
        </view>
      </view>

      {/* Save */}
      <view className="mt-6 mb-8">
        <view className="py-3 bg-accent rounded-xl items-center" bindtap={() => goBack()}>
          <text className="text-white font-semibold">Save Wallet</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
