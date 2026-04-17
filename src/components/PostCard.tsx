import { view } from '@lynx-js/react';
import { PostHeader } from './posts/PostHeader.js';
import { PostFooter } from './posts/PostFooter.js';
import { ContentBlocks } from './posts/ContentBlocks.js';
import { PostPicture } from './posts/PostPicture.js';
import { ImageGrid } from './posts/ImageGrid.js';
import { go } from '../lib/navigation.js';

const imageRegex = /https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|avif|bmp|svg)(?:\?[^\s]*)?/gi;

function extractImageUrls(text: string): string[] {
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = imageRegex.exec(text)) !== null) {
    urls.push(match[0]);
  }
  return urls;
}

export function PostCard({
  name,
  pubkey,
  content,
  createdAt,
  picture,
}: {
  name?: string;
  pubkey: string;
  content: string;
  createdAt: number;
  picture?: string;
}) {
  const images = extractImageUrls(content);
  return (
    <view className="w-feed px-2 py-3 border-b border-white/10">
      <PostHeader name={name} pubkey={pubkey} picture={picture} createdAt={createdAt} />
      <view className="mt-1 pl-10">
        <ContentBlocks
          content={content}
          collapsible={true}
          onHashtag={(tag) => go('tags', { tag: tag.slice(1) })}
          onLink={(url: string) => console.log('open link', url)}
          onMention={(mention) => go('user', { pubkey: mention })}
        />
        {images.length > 0 && (
          <ImageGrid
            urls={images}
            onImageTap={(idx) => go('zoom', { url: images[idx], urls: images, index: idx })}
          />
        )}
      </view>
      <view className="pl-10">
        <PostFooter />
      </view>
    </view>
  );
}

export function PostCardFromEvent({
  event,
}: {
  event: {
    id(): string;
    kind(): number;
    pubkey(): string;
    content(): string;
    createdAt(): number;
    tags(): string[][];
  };
}) {
  const isPicture = event.kind() === 20;
  const contentText = event.content();
  const images = !isPicture ? extractImageUrls(contentText) : [];

  return (
    <view className="w-feed px-2 py-3 border-b border-white/10">
      <PostHeader pubkey={() => event.pubkey()} createdAt={() => event.createdAt()} />
      <view className="mt-1 pl-10">
        {isPicture ? (
          <PostPicture note={event} />
        ) : (
          <>
            <ContentBlocks
              content={() => event.content()}
              collapsible={true}
              onHashtag={(tag) => go('tags', { tag: tag.slice(1) })}
              onLink={(url: string) => console.log('open link', url)}
              onMention={(mention) => go('user', { pubkey: mention })}
            />
            {images.length > 0 && (
              <ImageGrid
                urls={images}
                onImageTap={(idx) => go('zoom', { url: images[idx], urls: images, index: idx })}
              />
            )}
          </>
        )}
      </view>
      <view className="pl-10">
        <PostFooter />
      </view>
    </view>
  );
}
