import { view, text, image } from '@lynx-js/react';
import { go } from '../../lib/navigation.js';

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

export function PostHeader({
  name,
  pubkey,
  picture,
  nip05,
  createdAt,
  oneline = true,
}: {
  name?: string | (() => string | undefined);
  pubkey: string | (() => string);
  picture?: string | (() => string | undefined);
  nip05?: string | (() => string | undefined);
  createdAt: number | (() => number);
  oneline?: boolean;
}) {
  const nameValue = typeof name === 'function' ? name() : name;
  const pubkeyValue = typeof pubkey === 'function' ? pubkey() : pubkey;
  const pictureValue = typeof picture === 'function' ? picture() : picture;
  const nip05Value = typeof nip05 === 'function' ? nip05() : nip05;
  const createdAtValue = typeof createdAt === 'function' ? createdAt() : createdAt;

  const displayName =
    nameValue && nameValue.length > 25 ? nameValue.slice(0, 25) + '...' : nameValue || pubkeyValue.slice(0, 15) + '...';
  const time = formatTimeShort(createdAtValue);

  return (
    <view className="flex gap-2 relative">
      <view className="w-8 min-w-8">
        <view bindtap={() => go('user', { pubkey: pubkeyValue })}>
          <image
            src={pictureValue || 'asset:///miss-profile.png'}
            className="w-8 h-8 rounded-full border border-white/10 object-cover"
          />
        </view>
      </view>
      <view className="flex-1 min-w-0">
        <view className="flex justify-between items-start">
          {oneline ? (
            <view className="flex flex-row items-center gap-1 flex-1 min-w-0">
              <text
                className="font-semibold text-sm text-white truncate"
                bindtap={() => go('user', { pubkey: pubkeyValue })}
              >
                {displayName}
              </text>
              {nip05Value ? (
                <>
                  <text className="text-sm" style={{ color: 'var(--primary)' }}>
                    ✓
                  </text>
                  <text className="text-xs text-white/50 truncate hidden">
                    {nip05Value}
                  </text>
                </>
              ) : null}
            </view>
          ) : (
            <view className="flex-1 min-w-0">
              <view className="flex flex-row items-center gap-1">
                <text
                  className="font-semibold text-sm text-white truncate"
                  bindtap={() => go('user', { pubkey: pubkeyValue })}
                >
                  {displayName}
                </text>
                {nip05Value ? (
                  <text className="text-sm" style={{ color: 'var(--primary)' }}>
                    ✓
                  </text>
                ) : null}
                <text className="text-xs text-white/50 ml-2 shrink-0">{time}</text>
              </view>
              {nip05Value ? (
                <text className="text-xs text-white/50 truncate">{nip05Value}</text>
              ) : null}
            </view>
          )}
          {oneline ? (
            <text className="text-xs text-white/50 ml-2 shrink-0">{time}</text>
          ) : null}
        </view>
      </view>
    </view>
  );
}
