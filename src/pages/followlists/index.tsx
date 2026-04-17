import { useState } from 'react';
import { root, view, text, input } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { goBack } from '../../lib/navigation.js';

function Page() {
  const [activeTab, setActiveTab] = useState<'packs' | 'content'>('packs');
  const [search, setSearch] = useState('');

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
    </PageShell>
  );
}

root.render(<Page />);
