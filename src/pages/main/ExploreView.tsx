// Original: /root/code/nuts-cash/src/routes/explore/index.svelte (Explore tab content)
// Note: See also src/routes/explore/feed.svelte, note.svelte, user.svelte
import { view, text, image } from '@lynx-js/react';
import { go, goSub } from '../../lib/navigation.js';
import { pushModal } from '../../lib/overlay.js';
import { PostCardFromEvent, serializeEvent } from '../../components/PostCard.js';
import { useExploreFeed } from '../../hooks/useExploreFeed.js';
import { useStores } from '../../stores/StoreContext.js';

export function ExploreView() {
  const { events, loading, hasMore } = useExploreFeed();
  const { unreadCount } = useStores();

  return (
    <view className="mobile-height bg-base-100 flex flex-col">
      {/* Sticky Header */}
      <view className="flex justify-between h-16 items-center px-4 pt-4 border-b border-base-200 bg-base-300 bg-opacity-80">
        <view className="flex gap-2 items-center">
          <view className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center" bindtap={() => pushModal('followlists')}>
            <text className="text-lg text-white">∞</text>
          </view>
        </view>
        <view className="flex gap-3 items-center">
          <view className="relative" bindtap={() => pushModal('notifications')}>
            <text className="text-xl text-white/60">🔔</text>
            {unreadCount > 0 && (
              <view className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
            )}
          </view>
          <view bindtap={() => pushModal('profile')}>
            <image
              src="asset:///miss-profile.png"
              className="w-8 h-8 rounded-full border border-white/20"
            />
          </view>
        </view>
      </view>

      {/* Feed Container — matches web explore layout */}
      <view className="flex-1 flex flex-col">
        <view className="flex-1 bg-base-300 rounded-lg pb-1 px-1 shadow-widget-down">
          {loading && events.length === 0 && (
            <view className="py-12 flex flex-col items-center justify-center">
              <text className="text-white/60 text-sm">Loading posts…</text>
            </view>
          )}

          {!loading && events.length === 0 && (
            <view className="py-12 flex flex-col items-center justify-center">
              <text className="text-white/60 text-sm">No posts yet</text>
            </view>
          )}

          {events.map((event) => (
            <PostCardFromEvent
              key={event.id()}
              event={event}
              onPress={() => goSub('note', { event: serializeEvent(event) })}
            />
          ))}

          {loading && hasMore && events.length > 0 && (
            <view className="py-6 flex flex-col items-center justify-center">
              <text className="text-white/40 text-sm">Loading more…</text>
            </view>
          )}

          {!loading && !hasMore && events.length > 0 && (
            <view className="py-6 flex flex-col items-center justify-center">
              <text className="text-white/40 text-sm">No more posts</text>
            </view>
          )}
        </view>
      </view>

      {/* Floating post button — matches web "What's up?" style */}
      <view
        className="absolute bottom-20 right-4 px-4 py-2 rounded-full border border-accent bg-base-300 bg-opacity-80 flex items-center justify-center"
        bindtap={() => pushModal('post')}
      >
        <text className="text-white text-sm">What's up?</text>
      </view>
    </view>
  );
}
