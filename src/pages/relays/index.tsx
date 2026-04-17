import { useState } from 'react';
import { root, view, text, input } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { goBack } from '../../lib/navigation.js';

function Page() {
  const [mode, setMode] = useState<'read' | 'write'>('read');
  const [search, setSearch] = useState('');
  const [newRelay, setNewRelay] = useState('');

  return (
    <PageShell title="Relays">
      {/* Mode toggle */}
      <view className="mt-4 flex flex-row gap-2">
        <view
          className={`flex-1 py-2 rounded-lg items-center ${mode === 'read' ? 'bg-accent' : 'bg-white/10'}`}
          bindtap={() => setMode('read')}
        >
          <text className="text-white font-medium text-sm">Read Relays</text>
        </view>
        <view
          className={`flex-1 py-2 rounded-lg items-center ${mode === 'write' ? 'bg-accent' : 'bg-white/10'}`}
          bindtap={() => setMode('write')}
        >
          <text className="text-white font-medium text-sm">Write Relays</text>
        </view>
      </view>

      {/* Search */}
      <view className="mt-4">
        <input
          type="text"
          placeholder="Search relays"
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
          className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
        />
      </view>

      {/* Add relay */}
      <view className="mt-4 flex flex-row gap-2">
        <input
          type="text"
          placeholder="Enter new relay URL"
          value={newRelay}
          onChange={(e: any) => setNewRelay(e.target.value)}
          className="flex-1 px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
        />
        <view className="px-4 py-3 bg-white/10 rounded-lg flex items-center justify-center" bindtap={() => setNewRelay('')}>
          <text className="text-white font-medium">Add</text>
        </view>
      </view>

      {/* Placeholder list */}
      <view className="mt-4 py-8 bg-white/5 rounded-xl items-center">
        <text className="text-white/50 text-sm">Relay management coming soon</text>
      </view>

      <view className="mt-6 mb-8">
        <view className="py-3 bg-accent rounded-xl items-center" bindtap={() => goBack()}>
          <text className="text-white font-semibold">Save Relays</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
