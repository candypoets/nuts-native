import { view, text, image } from '@lynx-js/react';

function parseAspectRatio(dimStr: string | undefined): number | null {
  if (!dimStr) return null;
  const match = dimStr.match(/(\d+)x(\d+)/);
  if (match) {
    const w = parseInt(match[1], 10);
    const h = parseInt(match[2], 10);
    if (h > 0) {
      const ratio = w / h;
      return Math.max(0.5, Math.min(2.0, ratio));
    }
  }
  return null;
}

function extractImageUrlsFromText(text: string): string[] {
  const urls: string[] = [];
  const urlRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|avif|bmp|svg)(?:\?[^\s]*)?)/gi;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

export function PostPicture({
  note,
}: {
  note: { content(): string; tags(): string[][] };
}) {
  const content = note.content();
  const tags = note.tags();

  let title = '';
  let description = '';
  let images: { url: string; dim?: string }[] = [];

  try {
    const parsed = JSON.parse(content);
    if (parsed.title && typeof parsed.title === 'string') {
      title = parsed.title;
    }
    if (parsed.description && typeof parsed.description === 'string') {
      description = parsed.description;
    }
    if (Array.isArray(parsed.images)) {
      images = (parsed.images as unknown[])
        .map((img: unknown): { url: string; dim?: string } | null => {
          if (typeof img === 'string') return { url: img };
          if (img && typeof img === 'object') {
            const imgObj = img as { url?: string; dim?: string };
            if (typeof imgObj.url === 'string') {
              return { url: imgObj.url, dim: imgObj.dim };
            }
          }
          return null;
        })
        .filter((item): item is { url: string; dim?: string } => item !== null);
    }
  } catch {
    description = content;
    images = extractImageUrlsFromText(content).map((url) => ({ url }));
  }

  // Fallback: look for image URLs in tags (imeta or raw url tags)
  if (images.length === 0) {
    for (const tag of tags) {
      if (tag[0] === 'imeta' && tag[1]) {
        const urlMatch = tag[1].match(/^url\s+(.+)$/i);
        if (urlMatch) {
          images.push({ url: urlMatch[1] });
        }
      } else if (tag[0] === 'url' && tag[1]) {
        images.push({ url: tag[1] });
      }
    }
  }

  const hashtags = tags.filter((tag) => tag[0] === 't').map((tag) => tag[1]);

  const firstImage = images[0] || null;
  const aspectRatio = parseAspectRatio(firstImage?.dim) || 4 / 3;

  return (
    <view className="w-full">
      {firstImage ? (
        <view
          className="w-full bg-white/5 overflow-hidden"
          style={{ aspectRatio: `${aspectRatio}` }}
        >
          <image
            src={firstImage.url}
            className="w-full h-full"
            style={{ objectFit: 'contain' }}
          />
        </view>
      ) : null}

      {title ? (
        <text className="text-lg font-semibold text-white mt-2 px-1">{title}</text>
      ) : null}

      {description ? (
        <text className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap px-1 mt-1">
          {description}
        </text>
      ) : null}

      {hashtags.length > 0 ? (
        <view className="flex flex-row flex-wrap gap-2 px-1 mt-2">
          {hashtags.map((tag, idx) => (
            <text key={idx} className="text-sm" style={{ color: 'var(--primary)' }}>
              #{tag}
            </text>
          ))}
        </view>
      ) : null}
    </view>
  );
}
