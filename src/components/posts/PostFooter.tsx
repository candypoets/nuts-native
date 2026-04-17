import { view, text } from '@lynx-js/react';
import { go } from '../../lib/navigation.js';

export function PostFooter({
  replyCount = 0,
  repostCount = 0,
  reactionCount = 0,
  liked = false,
  onReply,
  onRepost,
  onLike,
  onShare,
  onZap,
}: {
  replyCount?: number;
  repostCount?: number;
  reactionCount?: number;
  liked?: boolean;
  onReply?: () => void;
  onRepost?: () => void;
  onLike?: () => void;
  onShare?: () => void;
  onZap?: () => void;
}) {
  return (
    <view className="flex flex-row gap-6 mt-3">
      <view
        className="flex flex-row items-center gap-1"
        bindtap={() => {
          go('reply');
          onReply?.();
        }}
      >
        <text className="text-white/50">💬</text>
        {replyCount > 0 ? (
          <text className="text-xs text-white/50">{replyCount}</text>
        ) : null}
      </view>

      <view
        className="flex flex-row items-center gap-1"
        bindtap={() => {
          go('repost');
          onRepost?.();
        }}
      >
        <text className="text-white/50">🔄</text>
        {repostCount > 0 ? (
          <text className="text-xs text-white/50">{repostCount}</text>
        ) : null}
      </view>

      <view
        className="flex flex-row items-center gap-1"
        bindtap={() => {
          onLike?.();
        }}
      >
        <text className={liked ? 'text-accent' : 'text-white/50'}>❤️</text>
        {reactionCount > 0 ? (
          <text className={liked ? 'text-xs text-accent' : 'text-xs text-white/50'}>
            {reactionCount}
          </text>
        ) : null}
      </view>

      <view
        className="flex flex-row items-center gap-1"
        bindtap={() => {
          go('share');
          onShare?.();
        }}
      >
        <text className="text-white/50">↗️</text>
      </view>

      <view
        className="flex flex-row items-center gap-1"
        bindtap={() => {
          go('wallet');
          onZap?.();
        }}
      >
        <text className="text-white/50">⚡</text>
      </view>
    </view>
  );
}
