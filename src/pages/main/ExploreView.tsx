// Original: /root/code/nuts-cash/src/routes/explore/index.svelte (Explore tab content)
// Note: See also src/routes/explore/feed.svelte, note.svelte, user.svelte
import { view, text, image, list } from '@lynx-js/react';
import { go, goSub } from '../../lib/navigation.js';
import { pushModal } from '../../lib/overlay.js';
import { PostCardFromEvent, serializeEvent } from '../../components/PostCard.js';
import { useExploreFeed } from '../../hooks/useExploreFeed.js';
import { useStores } from '../../stores/StoreContext.js';

export function ExploreView() {
  const { events, loading, refreshing, hasMore, onRefresh, onNearBottom } = useExploreFeed();
  const { unreadCount } = useStores();

  return (
    <view className="flex-1 bg-base-300 bg-opacity-85 flex flex-col">
      {/* Sticky Header */}
      <view className="flex justify-between h-16 items-center px-4 pt-4 border-b border-white/10 bg-base-300 bg-opacity-85">
        <view className="flex gap-2 items-center">
          <view className="w-8 h-8 border rounded-full flex items-center justify-center" bindtap={() => pushModal('followlists')}>
            <text className="text-lg">∞</text>
          </view>
        </view>
        <view className="flex gap-3 items-center">
          <view className="relative" bindtap={() => pushModal('notifications')}>
            <text className="text-2xl">🔔</text>
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

      {/* Feed */}
      <list
        className="flex-1"
        bindscrolltolower={onNearBottom}
        refresher-enabled={true}
        bindrefresherrefresh={onRefresh}
        refresher-triggered={refreshing}
      >
        {loading && events.length === 0 && (
          <list-item key="loading" item-key="loading" estimated-main-axis-size-px={100}>
            <view className="py-12 flex flex-col items-center justify-center">
              <text className="text-white/60 text-sm">Loading posts…</text>
            </view>
          </list-item>
        )}

        {!loading && events.length === 0 && (
          <list-item key="empty" item-key="empty" estimated-main-axis-size-px={100}>
            <view className="py-12 flex flex-col items-center justify-center">
              <text className="text-white/60 text-sm">No posts yet</text>
            </view>
          </list-item>
        )}

        {events.map((event) => (
          <list-item key={event.id()} item-key={event.id()} estimated-main-axis-size-px={300}>
            <PostCardFromEvent
              event={event}
              onPress={() => goSub('note', { event: serializeEvent(event) })}
            />
          </list-item>
        ))}

        {loading && hasMore && events.length > 0 && (
          <list-item key="loading-more" item-key="loading-more" estimated-main-axis-size-px={50}>
            <view className="py-6 flex flex-col items-center justify-center">
              <text className="text-white/40 text-sm">Loading more…</text>
            </view>
          </list-item>
        )}

        {!loading && !hasMore && events.length > 0 && (
          <list-item key="no-more" item-key="no-more" estimated-main-axis-size-px={50}>
            <view className="py-6 flex flex-col items-center justify-center">
              <text className="text-white/40 text-sm">No more posts</text>
            </view>
          </list-item>
        )}
      </list>

      {/* Floating post button */}
      <view
        className="absolute bottom-20 right-4 w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg"
        bindtap={() => openModal('post')}
      >
        <text className="text-white text-xl">✏️</text>
      </view>
    </view>
  );
}
