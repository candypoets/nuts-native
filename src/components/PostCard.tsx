import { view } from '@lynx-js/react';
import { PostHeader } from './posts/PostHeader';
import { PostFooter } from './posts/PostFooter';
import { ContentBlocks } from './posts/ContentBlocks';
import { PostPicture } from './posts/PostPicture';
import { go } from '../lib/navigation.js';

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
  return (
    <view className="w-feed px-2 py-3 border-b border-white/10">
      <PostHeader name={name} pubkey={pubkey} picture={picture} createdAt={createdAt} />
      <view className="mt-1 pl-10">
        <ContentBlocks
          content={content}
          collapsible={true}
          onHashtag={() => go('explore')}
          onLink={(url: string) => console.log('open link', url)}
        />
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

  return (
    <view className="w-feed px-2 py-3 border-b border-white/10">
      <PostHeader pubkey={() => event.pubkey()} createdAt={() => event.createdAt()} />
      <view className="mt-1 pl-10">
        {isPicture ? (
          <PostPicture note={event} />
        ) : (
          <ContentBlocks
            content={() => event.content()}
            collapsible={true}
            onHashtag={() => go('explore')}
            onLink={(url: string) => console.log('open link', url)}
          />
        )}
      </view>
      <view className="pl-10">
        <PostFooter />
      </view>
    </view>
  );
}
