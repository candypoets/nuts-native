import { useState, useEffect } from 'react';
import { root, view, text, scrollView } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { NotificationRow } from '../../components/NotificationRow.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import { useNotificationStore } from '../../stores/useNotificationStore.js';
import { go } from '../../lib/navigation.js';

const TABS = ['All', 'Replies', 'Mentions', 'Reactions', 'Reposts'] as const;
type Tab = (typeof TABS)[number];

function Page() {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const { events, replies, mentions, reactions, reposts, loading } = useNotifications();
  const { markAllRead } = useNotificationStore();

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  const activeEvents =
    activeTab === 'All'
      ? events
      : activeTab === 'Replies'
        ? replies
        : activeTab === 'Mentions'
          ? mentions
          : activeTab === 'Reactions'
            ? reactions
            : reposts;

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

      <scrollView className="flex-1">
        {loading && activeEvents.length === 0 && (
          <view className="py-12 items-center">
            <text className="text-white/60 text-sm">Loading notifications…</text>
          </view>
        )}

        {!loading && activeEvents.length === 0 && (
          <view className="py-12 items-center">
            <text className="text-4xl mb-4">🔔</text>
            <text className="text-white/60 text-sm">No {activeTab.toLowerCase()} yet</text>
          </view>
        )}

        {activeEvents.map((event) => {
          const kind = event.kind();
          const tags = event.tags();
          const hasETag = tags.some((tag) => tag[0] === 'e');
          let type: 'reply' | 'mention' | 'reaction' | 'repost';
          if (kind === 7) type = 'reaction';
          else if (kind === 6) type = 'repost';
          else if (hasETag) type = 'reply';
          else type = 'mention';

          return <NotificationRow key={event.id()} event={event} type={type} />;
        })}

        {/* Sign-in hint */}
        <view className="px-4 mt-4 mb-8">
          <view className="py-3 bg-white/5 rounded-xl items-center" bindtap={() => go('login')}>
            <text className="text-white/70 text-sm">Sign in to view your notifications</text>
          </view>
        </view>
      </scrollView>
    </PageShell>
  );
}

root.render(<Page />);
