// Original: /root/code/nuts-cash/src/routes/explore/user.svelte
import { useState, useEffect, useCallback } from 'react';
import { root, view, text, image } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { PostCardFromEvent } from '../../components/PostCard.js';
import { getItem, setItem } from '../../stores/storage.js';
import { go } from '../../lib/navigation.js';
import { useUserProfile } from '../../hooks/useUserProfile.js';
import { useStores } from '../../stores/StoreContext.js';
import { StoreProvider } from '../../stores/StoreContext.js';
import { subscribeToEvents, isParsedEvent, asKind1, useSignEvent, getKind3, kind3Cache, getFollows, ParsedData, type ParsedEvent, type WorkerMessage } from '../../lib/nipworker.js';

const TABS = ['Posts', 'Replies', 'Media', 'Likes'] as const;
type Tab = (typeof TABS)[number];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <view className="flex flex-col items-center">
      <text className="text-white font-bold text-base">{value}</text>
      <text className="text-white/50 text-xs">{label}</text>
    </view>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <view
      className={`flex-1 py-3 flex items-center justify-center border-b-2 ${
        active ? 'border-white' : 'border-transparent'
      }`}
      bindtap={onPress}
    >
      <text className={`text-sm font-medium ${active ? 'text-white' : 'text-white/50'}`}>
        {label}
      </text>
    </view>
  );
}

function Page() {
  const [pubkey, setPubkey] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('Posts');
  const [userPosts, setUserPosts] = useState<ParsedEvent[]>([]);
  const [signing, setSigning] = useState(false);

  const { follows, key, resolveKind3, kind3Ready } = useStores();
  const isFollowing = follows.includes(pubkey);

  useEffect(() => {
    getItem('__nav_params')
      .then((json) => {
        if (json) {
          try {
            const params = JSON.parse(json);
            if (params.pubkey && typeof params.pubkey === 'string') {
              setPubkey(params.pubkey);
            }
          } catch {
            // ignore parse errors
          }
          setItem('__nav_params', '').catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (key?.pub && !kind3Ready) {
      const k3 = getKind3(key.pub);
      if (k3) {
        resolveKind3(k3);
      }
    }
  }, [key?.pub, kind3Ready, resolveKind3]);

  const { profile, loading } = useUserProfile(pubkey || undefined);

  let parsedProfile: {
    name?: string;
    about?: string;
    picture?: string;
    banner?: string;
    nip05?: string;
    lud16?: string;
    website?: string;
  } = {};
  if (profile) {
    try {
      parsedProfile = JSON.parse(profile.content());
    } catch {
      parsedProfile = {};
    }
  }

  const followerCount = (() => {
    let count = 0;
    kind3Cache.forEach((ev) => {
      const tags = ev.tags();
      if (tags && tags.some((t: string[]) => t[0] === 'p' && t[1] === pubkey)) count++;
    });
    return count;
  })();

  const handleFollowUpdate = useCallback((newFollows: string[]) => {
    const template = {
      kind: 3,
      content: '',
      tags: newFollows.map((p: string) => ['p', p, '']),
      created_at: Math.floor(Date.now() / 1000),
    };
    useSignEvent(template, (signedEvent: any) => {
      const wrapped = {
        id: () => signedEvent.id,
        kind: () => signedEvent.kind,
        pubkey: () => signedEvent.pubkey || key?.pub || 'mock-pubkey',
        content: () => signedEvent.content,
        createdAt: () => signedEvent.created_at,
        tags: () => signedEvent.tags,
        parsedType: () => ParsedData.Kind3Parsed,
      };
      resolveKind3(wrapped);
      const pubkey = signedEvent.pubkey || key?.pub || 'mock-pubkey';
      kind3Cache.set(pubkey, wrapped as unknown as ParsedEvent);
      setSigning(false);
    });
  }, [key, resolveKind3]);

  useEffect(() => {
    if (!pubkey) {
      setUserPosts([]);
      return;
    }
    const subId = `user_posts_${pubkey}`;
    const unsubscribe = subscribeToEvents(subId, [{ kinds: [1], authors: [pubkey] }], (message: WorkerMessage) => {
      const parsed = isParsedEvent(message);
      const kind1 = asKind1(parsed);
      if (!kind1 || !parsed) return;
      setUserPosts((prev) => {
        const exists = prev.some((p) => p.id() === parsed.id());
        if (exists) return prev;
        const next = [...prev, parsed];
        next.sort((a, b) => b.createdAt() - a.createdAt());
        return next;
      });
    });
    return () => unsubscribe();
  }, [pubkey]);

  return (
      <PageShell title="User">
      <view className="flex flex-col -mx-4 -mt-4">
        {/* Banner */}
        <view className="w-full h-32 relative">
          {parsedProfile.banner ? (
            <image
              src={parsedProfile.banner}
              className="w-full h-full"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <view className="w-full h-full bg-black/40" />
          )}
        </view>

        {/* Profile Info */}
        <view className="px-4 pb-4 relative">
          {/* Avatar */}
          <view className="-mt-10 mb-2">
            <image
              src={parsedProfile.picture || 'asset:///miss-profile.png'}
              className="w-20 h-20 rounded-full border-4 border-base-300 object-cover"
            />
          </view>

          {/* Name & NIP-05 */}
          <view className="flex flex-row items-center gap-1">
            <text className="text-2xl font-bold text-white">
              {parsedProfile.name || pubkey.slice(0, 15) + '...'}
            </text>
            {parsedProfile.nip05 ? (
              <text className="text-sm" style={{ color: 'var(--primary)' }}>
                ✓
              </text>
            ) : null}
          </view>

          {/* NIP-05 display */}
          {parsedProfile.nip05 ? (
            <text className="text-xs text-white/50">{parsedProfile.nip05}</text>
          ) : null}

          {/* About */}
          {parsedProfile.about ? (
            <text className="text-sm text-white/70 mt-2">{parsedProfile.about}</text>
          ) : null}

          {/* Links */}
          <view className="flex flex-row flex-wrap gap-3 mt-2">
            {parsedProfile.lud16 ? (
              <view bindtap={() => console.log('open lightning', parsedProfile.lud16)}>
                <text className="text-sm" style={{ color: 'var(--primary)' }}>
                  ⚡ {parsedProfile.lud16}
                </text>
              </view>
            ) : null}
            {parsedProfile.website ? (
              <view bindtap={() => console.log('open website', parsedProfile.website)}>
                <text className="text-sm text-white/70 underline">
                  {parsedProfile.website}
                </text>
              </view>
            ) : null}
          </view>

          {/* Stats */}
          <view className="flex flex-row items-center justify-center gap-8 mt-4">
            <Stat label="Posts" value={String(userPosts.length || 0)} />
            <Stat label="Followers" value={String(followerCount)} />
            <Stat label="Following" value={String(getFollows(pubkey).length)} />
          </view>

          {/* Action Buttons */}
          <view className="flex flex-row gap-3 mt-4 w-full">
            <view
              className={`flex-1 py-2 rounded-full flex items-center justify-center ${
                isFollowing ? 'bg-white/10 border border-white/20' : 'bg-white'
              }`}
              bindtap={() => {
                if (signing || !key?.pub) return;
                setSigning(true);
                if (isFollowing) {
                  handleFollowUpdate(follows.filter((p: string) => p !== pubkey));
                } else {
                  handleFollowUpdate([...follows, pubkey]);
                }
              }}
            >
              <text className={`font-semibold text-sm ${isFollowing ? 'text-white' : 'text-black'}`}>
                {isFollowing ? 'Following' : 'Follow'}
              </text>
            </view>
            <view
              className="flex-1 bg-white/10 py-2 rounded-full flex items-center justify-center"
              bindtap={() => go('newchat')}
            >
              <text className="text-white font-semibold text-sm">Message</text>
            </view>
          </view>
        </view>

        {/* Tab Bar */}
        <view className="flex flex-row border-b border-white/10 mt-2">
          {TABS.map((tab) => (
            <TabButton
              key={tab}
              label={tab}
              active={activeTab === tab}
              onPress={() => setActiveTab(tab)}
            />
          ))}
        </view>

        {/* Tab Content */}
        <view className="px-2 pb-4">
          {activeTab === 'Posts' && (
            <>
              {loading && userPosts.length === 0 && (
                <view className="py-12 flex items-center justify-center">
                  <text className="text-white/40 text-sm">Loading posts…</text>
                </view>
              )}
              {!loading && userPosts.length === 0 && (
                <view className="py-12 flex items-center justify-center">
                  <text className="text-white/40 text-sm">No posts yet</text>
                </view>
              )}
              {userPosts.map((event) => (
                <PostCardFromEvent key={event.id()} event={event} />
              ))}
            </>
          )}

          {activeTab !== 'Posts' && (
            <view className="py-12 flex items-center justify-center">
              <text className="text-white/40 text-sm">No {activeTab.toLowerCase()} yet</text>
            </view>
          )}
        </view>
      </view>
      </PageShell>
  );
}

root.render(<StoreProvider><Page /></StoreProvider>);
