import { root, view, text } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';

function Page() {
  return (
    <PageShell title="Profile Metadata">
      <view className="mt-4 flex flex-col gap-3">
        <text className="text-white/70 text-sm">Edit your Kind 0 profile metadata.</text>
        <view className="py-3 px-4 bg-white/5 rounded-xl">
          <text className="text-white/50 text-sm">Name, about, picture and nip-05 fields coming soon</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
