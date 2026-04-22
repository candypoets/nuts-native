// Original: /root/code/nuts-cash/src/routes/explore/note.svelte
// Note: Also used in src/routes/_kinds/kind1.svelte for kind 1 notes
import { useState, useEffect } from 'react';
import { root, view, text } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { PostCardFromEvent } from '../../components/PostCard.js';
import { getItem, setItem } from '../../stores/storage.js';
import { go } from '../../lib/navigation.js';

function wrapEvent(raw: {
  id: string;
  kind: number;
  pubkey: string;
  content: string;
  createdAt: number;
  tags: string[][];
}) {
  return {
    id: () => raw.id,
    kind: () => raw.kind,
    pubkey: () => raw.pubkey,
    content: () => raw.content,
    createdAt: () => raw.createdAt,
    tags: () => raw.tags,
  };
}

function Page() {
  const [event, setEvent] = useState<ReturnType<typeof wrapEvent> | null>(null);

  useEffect(() => {
    getItem('__nav_params')
      .then((json) => {
        if (json) {
          try {
            const params = JSON.parse(json);
            if (params.event && typeof params.event === 'object') {
              setEvent(wrapEvent(params.event));
            }
          } catch {
            // ignore parse errors
          }
          // Clear after reading to avoid stale data on back-navigation
          setItem('__nav_params', '').catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  if (!event) {
    return (
      <PageShell title="Note">
        <view className="flex items-center justify-center py-20">
          <text className="text-white/50 text-sm">Note not found</text>
        </view>
      </PageShell>
    );
  }

  return (
    <PageShell title="Note">
      <view className="flex flex-col -mx-4 -mt-4">
        <PostCardFromEvent event={event} />

        <view className="px-4 py-4 flex flex-row justify-around border-b border-white/10">
          <view
            className="flex flex-col items-center gap-1"
            bindtap={() => go('reply')}
          >
            <text className="text-white/70 text-lg">💬</text>
            <text className="text-white/50 text-xs">Reply</text>
          </view>
          <view
            className="flex flex-col items-center gap-1"
            bindtap={() => go('repost')}
          >
            <text className="text-white/70 text-lg">🔄</text>
            <text className="text-white/50 text-xs">Repost</text>
          </view>
          <view
            className="flex flex-col items-center gap-1"
            bindtap={() => go('zaps')}
          >
            <text className="text-white/70 text-lg">⚡</text>
            <text className="text-white/50 text-xs">Zap</text>
          </view>
        </view>

        <view className="px-4 py-6">
          <text className="text-white/40 text-sm uppercase tracking-wide">Replies</text>
          <view className="mt-4 py-6 flex items-center justify-center">
            <text className="text-white/40 text-sm">Replies coming soon</text>
          </view>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
