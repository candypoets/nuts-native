import { root, view, text } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';

function Page() {
  return (
    <PageShell title="eCash">
      <view className="mt-4 flex flex-col gap-3">
        <text className="text-white/70 text-sm">Manage your eCash tokens.</text>
        <view className="py-3 px-4 bg-white/5 rounded-xl">
          <text className="text-white/50 text-sm">Mint, melt and send tokens coming soon</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
