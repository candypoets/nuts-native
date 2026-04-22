import { useState } from 'react';
import { view, text } from '@lynx-js/react';

type Token =
  | { type: 'text'; value: string }
  | { type: 'url'; value: string }
  | { type: 'image'; value: string }
  | { type: 'hashtag'; value: string }
  | { type: 'youtube'; value: string; videoId: string }
  | { type: 'mention'; value: string; raw: string }
  | { type: 'username'; value: string };

const imageRegex = /https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|avif|bmp|svg)(?:\?[^\s]*)?/i;

function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)/i.test(url);
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] ?? null;
}

function tokenize(input: string): Token[] {
  const regex = /(https?:\/\/[^\s]+)|(nostr:npub1[acdefghijklmnopqrstuvwxyz023456789]+|nostr:nprofile1[acdefghijklmnopqrstuvwxyz023456789]+)|(@\w+)|(#\w+)/g;
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: input.slice(lastIndex, match.index) });
    }
    if (match[1]) {
      const url = match[1];
      if (isYouTubeUrl(url)) {
        const videoId = extractYouTubeId(url);
        if (videoId) {
          tokens.push({ type: 'youtube', value: url, videoId });
        } else {
          tokens.push({ type: 'url', value: url });
        }
      } else if (imageRegex.test(url)) {
        tokens.push({ type: 'image', value: url });
      } else {
        tokens.push({ type: 'url', value: url });
      }
    } else if (match[2]) {
      const raw = match[2];
      const value = raw.replace(/^nostr:/, '');
      tokens.push({ type: 'mention', value, raw });
    } else if (match[3]) {
      const value = match[3].slice(1);
      tokens.push({ type: 'username', value });
    } else if (match[4]) {
      tokens.push({ type: 'hashtag', value: match[4] });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < input.length) {
    tokens.push({ type: 'text', value: input.slice(lastIndex) });
  }

  return tokens;
}

export function ContentBlocks({
  content,
  collapsible = false,
  onHashtag,
  onLink,
  onMention,
}: {
  content: string | (() => string);
  collapsible?: boolean;
  onHashtag?: (tag: string) => void;
  onLink?: (url: string) => void;
  onMention?: (pubkeyOrName: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const rawContent = typeof content === 'function' ? content() : content;
  const shouldCollapse = collapsible && rawContent.length > 280 && !expanded;
  const displayContent = shouldCollapse ? rawContent.slice(0, 280) + '…' : rawContent;
  const lines = displayContent.split('\n');

  return (
    <view className="flex flex-col">
      {lines.map((line, lineIndex) => (
        <view key={lineIndex} className="flex flex-row flex-wrap">
          {tokenize(line).map((token, tokenIndex) => {
            const key = `${lineIndex}-${tokenIndex}`;
            if (token.type === 'url') {
              let hostname = '';
              try {
                hostname = new URL(token.value).hostname;
              } catch {
                hostname = token.value;
              }
              return (
                <view
                  key={key}
                  className="w-full my-1 px-3 py-2 rounded-lg border border-white/10 bg-white/5 flex flex-row items-center gap-2"
                  catchtap={() => onLink?.(token.value)}
                >
                  <text className="text-sm">🌐</text>
                  <text className="text-sm text-white/80">{hostname}</text>
                </view>
              );
            }
            if (token.type === 'image') {
              // Images are rendered in ImageGrid below; skip inline rendering
              return null;
            }
            if (token.type === 'youtube') {
              return (
                <view
                  key={key}
                  className="w-full my-2 rounded-lg flex flex-col items-center justify-center"
                  style={{ aspectRatio: '16/9', backgroundColor: '#0f0f0f' }}
                  catchtap={() => onLink?.(token.value)}
                >
                  <text className="text-3xl">▶️</text>
                  <text className="text-sm text-white/60 mt-2">YouTube video</text>
                </view>
              );
            }
            if (token.type === 'mention') {
              return (
                <text
                  key={key}
                  className="text-sm font-semibold"
                  style={{ color: 'var(--primary)' }}
                  catchtap={() => onMention?.(token.value)}
                >
                  {token.raw}
                </text>
              );
            }
            if (token.type === 'username') {
              return (
                <text
                  key={key}
                  className="text-sm font-semibold"
                  style={{ color: 'var(--primary)' }}
                  catchtap={() => onMention?.(token.value)}
                >
                  @{token.value}
                </text>
              );
            }
            if (token.type === 'hashtag') {
              return (
                <text
                  key={key}
                  className="text-sm font-semibold"
                  style={{ color: 'var(--primary)' }}
                  catchtap={() => onHashtag?.(token.value)}
                >
                  {token.value}
                </text>
              );
            }
            return (
              <text key={key} className="text-sm text-white/90">
                {token.value}
              </text>
            );
          })}
        </view>
      ))}
      {collapsible && rawContent.length > 280 ? (
        <view className="mt-1">
          <text
            className="text-sm font-medium"
            style={{ color: 'var(--primary)' }}
            catchtap={() => setExpanded(!expanded)}
          >
            {expanded ? 'See less' : 'See more'}
          </text>
        </view>
      ) : null}
    </view>
  );
}
