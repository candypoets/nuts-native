// Original: /root/code/nuts-cash/src/routes/modals/send.svelte
import { useState } from 'react';
import { root, view, text, input } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { go } from '../../lib/navigation.js';

function Page() {
  const [search, setSearch] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <PageShell title="Send Money">
      <view className="mt-4">
        <input
          type="text"
          placeholder="Search contacts"
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
          className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
        />
      </view>

      {/* Payment options */}
      <view className="mt-4 space-y-2">
        <view className="py-3 px-4 bg-white/5 rounded-xl flex flex-row items-center justify-between" bindtap={() => go('tapcash')}>
          <view className="flex flex-row items-center gap-3">
            <text className="text-xl">⚡</text>
            <view>
              <text className="text-white font-medium">Tap cash</text>
              <text className="text-white/50 text-xs">Offline instant payment</text>
            </view>
          </view>
          <text className="text-white/40">›</text>
        </view>
        <view className="py-3 px-4 bg-white/5 rounded-xl flex flex-row items-center justify-between" bindtap={() => go('lightning')}>
          <view className="flex flex-row items-center gap-3">
            <text className="text-xl">⚡</text>
            <view>
              <text className="text-white font-medium">Pay an invoice</text>
              <text className="text-white/50 text-xs">Pay out with lightning</text>
            </view>
          </view>
          <text className="text-white/40">›</text>
        </view>
      </view>

      {/* Amount */}
      <view className="mt-6">
        <text className="text-white/70 text-sm">Enter amount to send</text>
        <input
          type="number"
          placeholder="Amount in sats"
          value={amount}
          onChange={(e: any) => setAmount(e.target.value)}
          className="w-full mt-2 px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white"
        />
      </view>

      {/* Contacts */}
      <view className="mt-6">
        <text className="text-white font-semibold">Contacts</text>
        <view className="mt-2 py-6 bg-white/5 rounded-xl items-center">
          <text className="text-white/50 text-sm">Contact list coming soon</text>
        </view>
      </view>

      <view className="mt-6 mb-8">
        <view className="py-4 rounded-xl bg-accent items-center" bindtap={() => go('minted')}>
          <text className="text-white font-semibold text-lg">Send</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
