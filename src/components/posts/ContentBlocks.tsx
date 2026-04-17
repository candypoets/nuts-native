import { useState } from 'react';
import { view, text, image } from '@lynx-js/react';

type Token =
  | { type: 'text'; value: string }
  | { type: 'url'; value: string }
  | { type: 'image'; value: string }
  | { type: 'hashtag'; value: string };

const imageRegex = /https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|avif|bmp|svg)(?:\?[^\s]*)?/i;

function tokenize(input: string): Token[] {
  const regex = /(https?:\/\/[^\s]+)|(#\w+)/g;
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: input.slice(lastIndex, match.index) });
    }
    if (match[1]) {
      const url = match[1];
      tokens.push(imageRegex.test(url) ? { type: 'image', value: url } : { type: 'url', value: url });
    } else if (match[2]) {
      tokens.push({ type: 'hashtag', value: match[2] });
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
}: {
  content: string | (() => string);
  collapsible?: boolean;
  onHashtag?: (tag: string) => void;
  onLink?: (url: string) => void;
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
              return (
                <text
                  key={key}
                  className="text-sm"
                  style={{ color: 'var(--accent)' }}
                  bindtap={() => onLink?.(token.value)}
                >
                  {token.value}
                </text>
              );
            }
            if (token.type === 'image') {
              return (
                <view key={key} className="w-full my-2">
                  <image
                    src={token.value}
                    className="w-full h-48 rounded-lg"
                    style={{ objectFit: 'contain' }}
                  />
                </view>
              );
            }
            if (token.type === 'hashtag') {
              return (
                <text
                  key={key}
                  className="text-sm font-semibold"
                  style={{ color: 'var(--primary)' }}
                  bindtap={() => onHashtag?.(token.value.slice(1))}
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
            bindtap={() => setExpanded(!expanded)}
          >
            {expanded ? 'See less' : 'See more'}
          </text>
        </view>
      ) : null}
    </view>
  );
}
