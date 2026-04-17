import { view, text, image } from '@lynx-js/react';
import { getKind0 } from '../lib/nipworker-mock.js';
import { go } from '../lib/navigation.js';
import type { ParsedEvent } from '../lib/nipworker-mock.js';

function formatTimeShort(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp * 1000;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 30) return `${days}d`;
  const d = new Date(timestamp * 1000);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

export interface NotificationRowProps {
  event: ParsedEvent;
  type: 'reply' | 'mention' | 'reaction' | 'repost';
}

export function NotificationRow({ event, type }: NotificationRowProps) {
  const authorKind0 = getKind0(event.pubkey());
  let authorName: string | undefined;
  let authorPicture: string | undefined;
  if (authorKind0) {
    try {
      const parsed = JSON.parse(authorKind0.content());
      authorName = parsed.name;
      authorPicture = parsed.picture;
    } catch {
      // ignore parse errors
    }
  }

  const displayName = authorName || event.pubkey().slice(0, 15) + '...';
  const content = event.content();
  const preview = content.length > 80 ? content.slice(0, 80) + '...' : content;
  const time = formatTimeShort(event.createdAt());

  const actionText =
    type === 'reply'
      ? 'replied to your post'
      : type === 'mention'
        ? 'mentioned you'
        : type === 'reaction'
          ? `reacted ${content}`
          : 'reposted your note';

  return (
    <view className="flex flex-row items-start px-4 py-3 border-b border-white/10">
      <view className="mr-3">
        <image
          src={authorPicture || 'asset:///miss-profile.png'}
          className="w-10 h-10 rounded-full border border-white/10 object-cover"
          bindtap={() => go('user', { pubkey: event.pubkey() })}
        />
      </view>
      <view className="flex-1 min-w-0">
        <view className="flex flex-row items-center gap-1 flex-wrap">
          <text
            className="font-semibold text-sm text-white"
            bindtap={() => go('user', { pubkey: event.pubkey() })}
          >
            {displayName}
          </text>
          <text className="text-sm text-white/60">{actionText}</text>
        </view>
        {type !== 'reaction' && (
          <text className="text-sm text-white/80 mt-1">{preview}</text>
        )}
        <text className="text-xs text-white/40 mt-1">{time}</text>
      </view>
    </view>
  );
}
