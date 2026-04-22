import { view, text } from '@lynx-js/react';

function markdownToPlaintext(md: string): string {
  try {
    // Simple markdown stripping (headings, bold, italic, links, images, code, blockquotes)
    return md
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`[^`]+`/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
      .replace(/\[[^\]]*\]\([^)]+\)/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/^#{1,6}\s+/gm, ' ')
      .replace(/[*_]{1,2}/g, ' ')
      .replace(/>\s?/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch {
    return md;
  }
}

export function ArticleCard({
  note,
}: {
  note: { content(): string; tags(): string[][] };
}) {
  const content = note.content();
  const tags = note.tags();

  const title = tags.find((t) => t[0] === 'title')?.[1] || '';
  const summary = tags.find((t) => t[0] === 'summary')?.[1] || '';
  const publishedAt = tags.find((t) => t[0] === 'published_at')?.[1] || '';

  const excerpt = summary || markdownToPlaintext(content).slice(0, 200);

  let dateText = '';
  if (publishedAt) {
    const ts = parseInt(publishedAt, 10);
    if (!isNaN(ts)) {
      dateText = new Date(ts * 1000).toLocaleDateString();
    }
  }

  return (
    <view className="w-full flex flex-col gap-2 py-2">
      {title ? (
        <text className="text-white text-lg font-bold">{title}</text>
      ) : null}
      {excerpt ? (
        <text className="text-white/60 text-sm leading-relaxed">{excerpt}</text>
      ) : null}
      {dateText ? (
        <text className="text-white/40 text-xs">Published {dateText}</text>
      ) : null}
      <view className="mt-2 flex flex-row items-center gap-1">
        <text className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
          Read article →
        </text>
      </view>
    </view>
  );
}
