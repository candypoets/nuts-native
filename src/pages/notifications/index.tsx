import { useState } from 'react';
import { root, view, text } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { go } from '../../lib/navigation.js';

const TABS = ['All', 'Replies', 'Mentions', 'Reactions', 'Reposts'] as const;
type Tab = (typeof TABS)[number];

function Page() {
  const [activeTab, setActiveTab] = useState<Tab>('All');

  return (
    <PageShell title="Notifications">
      {/* Tabs */}
      <view className="flex flex-row border-b border-white/10">
        {TABS.map((t) => (
          <view
            key={t}
            className={`flex-1 py-3 items-center ${activeTab === t ? 'border-b-2 border-accent' : ''}`}
            bindtap={() => setActiveTab(t)}
          >
            <text className={`text-sm ${activeTab === t ? 'text-white font-medium' : 'text-white/50'}`}>{t}</text>
          </view>
        ))}
      </view>

      {/* Empty state */}
      <view className="py-12 items-center">
        <text className="text-4xl mb-4">🔔</text>
        <text className="text-white/60 text-sm">No {activeTab.toLowerCase()} yet</text>
      </view>

      {/* Sign-in hint */}
      <view className="px-4 mt-4">
        <view className="py-3 bg-white/5 rounded-xl items-center" bindtap={() => go('login')}>
          <text className="text-white/70 text-sm">Sign in to view your notifications</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
