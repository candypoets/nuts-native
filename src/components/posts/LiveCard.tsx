import { view, text } from '@lynx-js/react';

export function LiveCard({
  note,
  onLink,
}: {
  note: { content(): string; tags(): string[][] };
  onLink?: (url: string) => void;
}) {
  const content = note.content();
  const tags = note.tags();

  const title = tags.find((t) => t[0] === 'title')?.[1] || content;
  const streaming = tags.find((t) => t[0] === 'streaming')?.[1] || '';
  const status = tags.find((t) => t[0] === 'status')?.[1] || '';
  const starts = tags.find((t) => t[0] === 'starts')?.[1] || '';

  const isLive = status === 'live';

  const handleTap = () => {
    if (streaming) {
      onLink?.(streaming);
    }
  };

  let startText = '';
  if (starts) {
    const ts = parseInt(starts, 10);
    if (!isNaN(ts)) {
      startText = new Date(ts * 1000).toLocaleString();
    }
  }

  return (
    <view className="w-full flex flex-col gap-2 py-2">
      <view className="flex flex-row items-center gap-2">
        {isLive ? (
          <view className="flex flex-row items-center gap-1">
            <view
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#ef4444' }}
            />
            <text className="text-sm font-bold uppercase" style={{ color: '#ef4444' }}>
              LIVE
            </text>
          </view>
        ) : (
          <text className="text-white/40 text-sm font-bold uppercase">ENDED</text>
        )}
      </view>
      <text className="text-white text-base font-medium">{title}</text>
      {startText ? (
        <text className="text-white/40 text-xs">Starts: {startText}</text>
      ) : null}
      {streaming ? (
        <view className="mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <text className="text-white/60 text-xs truncate">{streaming}</text>
        </view>
      ) : null}
      <view
        className="mt-2 px-4 py-2 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: 'var(--primary)' }}
        catchtap={handleTap}
      >
        <text className="text-white text-sm font-medium">Watch</text>
      </view>
    </view>
  );
}
