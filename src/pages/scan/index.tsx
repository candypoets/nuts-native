import { root, view, text } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { goBack } from '../../lib/navigation.js';

function Page() {
  return (
    <PageShell title="Scan">
      <view className="py-8 flex flex-col items-center justify-center">
        <text className="text-white/60 text-center">Camera/QR scanning will be implemented with native methods</text>
      </view>
      <view className="px-4 mt-4">
        <view className="py-3 bg-white/10 rounded-xl items-center" bindtap={() => goBack()}>
          <text className="text-white font-medium">Close Scanner</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
