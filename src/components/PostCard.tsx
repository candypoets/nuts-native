import { view } from '@lynx-js/react';
import { PostHeader } from './posts/PostHeader.js';
import { PostFooter } from './posts/PostFooter.js';
import { ContentBlocks } from './posts/ContentBlocks.js';
import { PostPicture } from './posts/PostPicture.js';
import { ImageGrid } from './posts/ImageGrid.js';
import { PollCard } from './posts/PollCard.js';
import { ArticleCard } from './posts/ArticleCard.js';
import { LiveCard } from './posts/LiveCard.js';
import { go } from '../lib/navigation.js';
import { getKind0 } from '../lib/nipworker.js';

const imageRegex = /https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|avif|bmp|svg)(?:\?[^\s]*)?/gi;

function extractImageUrls(text: string): string[] {
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = imageRegex.exec(text)) !== null) {
    urls.push(match[0]);
  }
  return urls;
}

export function serializeEvent(event: {
  id(): string;
  kind(): number;
  pubkey(): string;
  content(): string;
  createdAt(): number;
  tags(): string[][];
}) {
  return {
    id: event.id(),
    kind: event.kind(),
    pubkey: event.pubkey(),
    content: event.content(),
    createdAt: event.createdAt(),
    tags: event.tags(),
  };
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
    <view className="w-full py-2 px-3 mt-1 rounded-lg bg-base-300 bg-opacity-85 shadow-widget">
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
  onPress,
}: {
  event: {
    id(): string;
    kind(): number;
    pubkey(): string;
    content(): string;
    createdAt(): number;
    tags(): string[][];
  };
  onPress?: () => void;
}) {
  const kind = event.kind();
  const isPicture = kind === 20;
  const isPoll = kind === 1068;
  const isArticle = kind === 30023;
  const isLive = kind === 1311;
  const contentText = event.content();
  const images = !isPicture ? extractImageUrls(contentText) : [];

  const authorKind0 = getKind0(event.pubkey());
  let authorName: string | undefined;
  let authorPicture: string | undefined;
  let authorNip05: string | undefined;
  if (authorKind0) {
    try {
      const parsed = JSON.parse(authorKind0.content());
      authorName = parsed.name;
      authorPicture = parsed.picture;
      authorNip05 = parsed.nip05;
    } catch {
      // ignore parse errors
    }
  }

  return (
    <view className="w-full py-2 px-3 mt-1 rounded-lg bg-base-300 bg-opacity-85 shadow-widget">
      <PostHeader
        name={authorName}
        pubkey={() => event.pubkey()}
        picture={authorPicture}
        nip05={authorNip05}
        createdAt={() => event.createdAt()}
      />
      <view className="mt-1 pl-10" bindtap={onPress}>
        {isPicture ? (
          <PostPicture note={event} />
        ) : isPoll ? (
          <PollCard note={event} />
        ) : isArticle ? (
          <ArticleCard note={event} />
        ) : isLive ? (
          <LiveCard note={event} onLink={(url: string) => console.log('open link', url)} />
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
