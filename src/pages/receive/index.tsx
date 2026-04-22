// Original: /root/code/nuts-cash/src/routes/modals/_profile/login.svelte
import { useState } from 'react';
import { root, view, text, input } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { goBack } from '../../lib/navigation.js';

function Page() {
  const [value, setValue] = useState('');

  return (
    <PageShell title="Receive">
      <view className="mt-4">
        <text className="text-white/70 text-sm">Paste eCash token or Lightning invoice</text>
        <input
          type="text"
          placeholder="token or invoice"
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
          className="w-full mt-2 px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white"
        />
      </view>
      <view className="mt-6 mb-8">
        <view className="w-full py-4 rounded-xl bg-accent items-center" bindtap={() => goBack()}>
          <text className="text-white font-semibold text-lg">Receive</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
