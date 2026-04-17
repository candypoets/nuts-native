import { root } from '@lynx-js/react';
import { view, text } from '@lynx-js/react';
import '../../app.css';
import { PageShell } from '../../components/PageShell.js';

function Page() {
  const amount = '';
  const mint = '';

  return (
    <PageShell title="Minted">
      <view className="h-full flex items-end py-8">
        <view className="w-full flex flex-col items-center justify-center p-8 bg-white/10 rounded-xl shadow-xl text-center border border-white/10">
          <view className="p-3 bg-green-500/20 rounded-full mb-4 animate-bounce">
            <text className="text-4xl">💰</text>
          </view>

          <text className="text-2xl font-bold text-white mb-2">Mint Successful!</text>

          <view className="flex flex-row flex-wrap justify-center">
            <text className="text-lg font-semibold text-green-400">{amount || '0'}</text>
            <text className="text-lg text-white/80"> sats fresh off </text>
            <text className="text-lg font-semibold text-blue-400">{mint || 'Unknown'}</text>
            <text className="text-lg text-white/80">!</text>
          </view>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
