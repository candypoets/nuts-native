import { view, text, scrollView, image } from '@lynx-js/react';
import { go } from '../../lib/navigation.js';
import { PostCardFromEvent } from '../../components/PostCard.js';
import { useExploreFeed } from '../../hooks/useExploreFeed.js';

export function ExploreView() {
  const { events, loading, refreshing, hasMore, onRefresh, onNearBottom } = useExploreFeed();

  return (
    <view className="flex-1 bg-base-300 bg-opacity-85 flex flex-col">
      {/* Sticky Header */}
      <view className="flex justify-between h-16 items-center px-4 pt-4 border-b border-white/10 bg-base-300 bg-opacity-85">
        <view className="flex gap-2 items-center">
          <view className="w-8 h-8 border rounded-full flex items-center justify-center" bindtap={() => go('followlists')}>
            <text className="text-lg">∞</text>
          </view>
        </view>
        <view className="flex gap-3 items-center">
          <view bindtap={() => go('notifications')}>
            <text className="text-2xl">🔔</text>
          </view>
          <view bindtap={() => go('profile')}>
            <image
              src="asset:///miss-profile.png"
              className="w-8 h-8 rounded-full border border-white/20"
            />
          </view>
        </view>
      </view>

      {/* Feed */}
      <scrollView
        className="flex-1"
        bindscrolltolower={onNearBottom}
        refresher-enabled={true}
        bindrefresherrefresh={onRefresh}
        refresher-triggered={refreshing}
      >
        <view className="pb-4">
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
            <PostCardFromEvent key={event.id()} event={event} />
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
      </scrollView>

      {/* Floating post button */}
      <view
        className="absolute bottom-20 right-4 w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg"
        bindtap={() => go('post')}
      >
        <text className="text-white text-xl">✏️</text>
      </view>
    </view>
  );
}
