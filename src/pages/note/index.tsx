import { root } from '@lynx-js/react';
import { view, text } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { PostCard } from '../../components/PostCard.js';
import { go } from '../../lib/navigation.js';

function Page() {
  const mockNote = {
    name: 'Alice',
    pubkey: 'npub1alice...',
    content: 'This is a mock note for the detail page. In the full app, this will display the actual Nostr note content loaded from relays.',
    createdAt: Math.floor(Date.now() / 1000) - 3600,
    picture: undefined,
  };

  return (
    <PageShell
      title="Note"
      rightAction={
        <view bindtap={() => go('explore')}>
          <text className="text-white/70 text-sm">✕</text>
        </view>
      }
    >
      <view className="flex flex-col -mx-4 -mt-4">
        <PostCard
          name={mockNote.name}
          pubkey={mockNote.pubkey}
          content={mockNote.content}
          createdAt={mockNote.createdAt}
          picture={mockNote.picture}
        />

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
            bindtap={() => go('wallet')}
          >
            <text className="text-white/70 text-lg">⚡</text>
            <text className="text-white/50 text-xs">Zap</text>
          </view>
        </view>

        <view className="px-4 py-6">
          <text className="text-white/40 text-sm uppercase tracking-wide">Replies</text>
          <view className="mt-4 py-6 flex items-center justify-center">
            <text className="text-white/40 text-sm">No replies yet</text>
          </view>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
