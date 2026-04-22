// Original: /root/code/nuts-cash/src/routes/modals/relayinfos.svelte
import { root, view, text } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';

function Page() {
  return (
    <PageShell title="Relay Infos">
      <view className="mt-4 flex flex-col gap-3">
        <text className="text-white/70 text-sm">Connected relay information will appear here.</text>
        <view className="py-3 px-4 bg-white/5 rounded-xl">
          <text className="text-white/50 text-sm">Latency, limits and supported NIPs coming soon</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
