// Original: /root/code/nuts-cash/src/routes/modals/tapcash.svelte
import { root, view, text } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { goBack } from '../../lib/navigation.js';

function Page() {
  return (
    <PageShell title="Tap Cash">
      <view className="py-12 flex flex-col items-center justify-center">
        <text className="text-4xl mb-4">📡</text>
        <text className="text-white/60 text-sm text-center px-6">
          Tap-to-pay via Bluetooth/NFC will be implemented with native methods
        </text>
      </view>
      <view className="px-4 mt-4">
        <view className="py-3 bg-white/10 rounded-xl items-center" bindtap={() => goBack()}>
          <text className="text-white font-medium">Close</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
