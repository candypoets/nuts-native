// Original: /root/code/nuts-cash/src/routes/modals/minting.svelte
// Note: Also see src/routes/modals/topup.svelte for topup flow
import { useState } from 'react';
import { root, view, text, input } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { go } from '../../lib/navigation.js';

function Page() {
  const [amount, setAmount] = useState('');

  return (
    <PageShell title="Topup">
      <view className="mt-4 items-center">
        <text className="text-white/70 text-sm">Amount to mint (sats)</text>
        <input
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e: any) => setAmount(e.target.value)}
          className="w-full mt-2 px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl"
        />
      </view>
      <view className="mt-6 mb-8">
        <view
          className={`py-4 rounded-xl bg-accent items-center ${!amount ? 'opacity-50' : ''}`}
          bindtap={() => amount && go('minted')}
        >
          <text className="text-white font-semibold text-lg">Create Lightning Invoice</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
