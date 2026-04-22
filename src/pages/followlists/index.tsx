// Original: /root/code/nuts-cash/src/routes/modals/followlists.svelte
import { useState, useEffect } from 'react';
import { root, view, text, input, image } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { goBack } from '../../lib/navigation.js';
import { useStores } from '../../stores/StoreContext.js';
import { StoreProvider } from '../../stores/StoreContext.js';
import { getKind0, getKind3 } from '../../lib/nipworker-mock.js';

function Page() {
  const [activeTab, setActiveTab] = useState<'packs' | 'content'>('packs');
  const [search, setSearch] = useState('');
  const { follows, key, resolveKind3, kind3Ready } = useStores();

  useEffect(() => {
    if (key?.pub && !kind3Ready) {
      const k3 = getKind3(key.pub);
      if (k3) {
        resolveKind3(k3);
      }
    }
  }, [key?.pub, kind3Ready, resolveKind3]);

  return (
      <PageShell title="Feed Builder">
      {/* Tabs */}
      <view className="mt-4 flex flex-row gap-2">
        <view
          className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'packs' ? 'bg-accent' : 'bg-white/10'}`}
          bindtap={() => setActiveTab('packs')}
        >
          <text className="text-white font-medium text-sm">Follow Packs</text>
        </view>
        <view
          className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'content' ? 'bg-accent' : 'bg-white/10'}`}
          bindtap={() => setActiveTab('content')}
        >
          <text className="text-white font-medium text-sm">Content Types</text>
        </view>
      </view>

      {/* Search */}
      <view className="mt-4">
        <input
          type="text"
          placeholder={activeTab === 'packs' ? 'Search follow packs...' : 'Search content types...'}
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
          className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
        />
      </view>

      {/* Placeholder */}
      <view className="mt-4 py-10 bg-white/5 rounded-xl items-center">
        <text className="text-white/50 text-sm">
          {activeTab === 'packs' ? 'Follow pack curation coming soon' : 'Content filtering coming soon'}
        </text>
      </view>

      <view className="mt-6 mb-8">
        <view className="py-3 bg-accent rounded-xl items-center" bindtap={() => goBack()}>
          <text className="text-white font-semibold">Save Feed Builder</text>
        </view>
      </view>

      {/* Following List */}
      <view className="mt-4">
        <text className="text-white font-semibold text-base mb-3">Following</text>
        {follows.length === 0 && (
          <view className="py-8 items-center">
            <text className="text-white/40 text-sm">Not following anyone yet</text>
          </view>
        )}
        {follows.map((pubkey: string) => {
          const k0 = getKind0(pubkey);
          let name = '';
          let picture = '';
          if (k0) {
            try {
              const parsed = JSON.parse(k0.content());
              name = parsed.name || '';
              picture = parsed.picture || '';
            } catch {
              // ignore
            }
          }
          const displayName = name || pubkey.slice(0, 12) + '...';
          return (
            <view
              key={pubkey}
              className="flex flex-row items-center gap-3 py-3 border-b border-white/10"
            >
              <image
                src={picture || 'asset:///miss-profile.png'}
                className="w-10 h-10 rounded-full object-cover"
              />
              <view className="flex flex-col">
                <text className="text-white text-sm font-medium">{displayName}</text>
                <text className="text-white/40 text-xs">{pubkey.slice(0, 16)}...</text>
              </view>
            </view>
          );
        })}
      </view>
      </PageShell>
  );
}

root.render(<StoreProvider><Page /></StoreProvider>);
