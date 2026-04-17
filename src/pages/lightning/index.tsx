import { useState } from 'react';
import { root, view, text, input } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { goBack } from '../../lib/navigation.js';

function Page() {
  const [invoice, setInvoice] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <PageShell title="Lightning Payment">
      <view className="mt-4">
        <text className="text-white/70 text-sm">Lightning invoice or address</text>
        <input
          type="text"
          placeholder="invoice or address"
          value={invoice}
          onChange={(e: any) => setInvoice(e.target.value)}
          className="w-full mt-2 px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white"
        />
      </view>

      <view className="mt-6">
        <text className="text-white/70 text-sm">Amount (sats)</text>
        <input
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e: any) => setAmount(e.target.value)}
          className="w-full mt-2 px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white"
        />
      </view>

      <view className="mt-4 py-3 bg-white/5 rounded-xl items-center">
        <text className="text-white/50 text-sm">Fee estimate coming soon</text>
      </view>

      <view className="mt-6 mb-8">
        <view className="py-4 rounded-xl bg-accent items-center" bindtap={() => goBack()}>
          <text className="text-white font-semibold text-lg">Pay</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
