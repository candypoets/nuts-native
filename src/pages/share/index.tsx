// Original: /root/code/nuts-cash/src/routes/modals/share.svelte
import { useState } from 'react';
import { root, view, text, input } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { goBack } from '../../lib/navigation.js';

function Page() {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  return (
    <PageShell title="Share">
      <view className="mt-4">
        <input
          type="text"
          placeholder="Search contacts"
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
          className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
        />
      </view>

      <view className="mt-4 flex flex-row justify-around">
        <view className="items-center" bindtap={() => { setCopiedId(true); setTimeout(() => setCopiedId(false), 2000); }}>
          <view className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <text className="text-xl">📋</text>
          </view>
          <text className="text-white text-xs mt-2">{copiedId ? 'Copied!' : 'Copy note ID'}</text>
        </view>
        <view className="items-center" bindtap={() => { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }}>
          <view className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <text className="text-xl">🔗</text>
          </view>
          <text className="text-white text-xs mt-2">{copiedLink ? 'Copied!' : 'Copy web link'}</text>
        </view>
      </view>

      <view className="mt-6">
        <text className="text-white font-semibold">Contacts</text>
        <view className="mt-2 py-8 bg-white/5 rounded-xl items-center">
          <text className="text-white/50 text-sm">Contact sharing coming soon</text>
        </view>
      </view>

      <view className="mt-6 mb-8">
        <view className="py-3 bg-white/10 rounded-xl items-center" bindtap={() => goBack()}>
          <text className="text-white font-medium">Done</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
