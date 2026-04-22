// Original: /root/code/nuts-cash/src/routes/modals/kind1111.svelte
import { root, view, text } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';

function Page() {
  return (
    <PageShell title="Highlights">
      <view className="mt-4 flex flex-col gap-3">
        <text className="text-white/70 text-sm">Kind 1111 highlights feed.</text>
        <view className="py-3 px-4 bg-white/5 rounded-xl">
          <text className="text-white/50 text-sm">Curated highlights coming soon</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
