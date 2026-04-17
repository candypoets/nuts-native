import { useState } from 'react';
import { root } from '@lynx-js/react';
import { view, text, image } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { PostCard } from '../../components/PostCard.js';
import { go } from '../../lib/navigation.js';

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
  const [activeTab, setActiveTab] = useState<Tab>('Posts');

  const mockUser = {
    name: 'Satoshi',
    displayName: 'Satoshi',
    npub: 'npub1sat0sh1...',
    picture: undefined as string | undefined,
  };

  const mockPosts = [
    {
      id: '1',
      name: mockUser.name,
      pubkey: 'npub1sat0sh1...',
      content: 'Mock post for the user profile page.',
      createdAt: Math.floor(Date.now() / 1000) - 3600,
      picture: undefined,
    },
  ];

  return (
    <PageShell title="User">
      <view className="flex flex-col -mx-4 -mt-4">
        {/* Profile Header */}
        <view className="flex flex-col items-center pt-6 pb-4 px-4">
          <image
            src="asset:///miss-profile.png"
            className="w-24 h-24 rounded-full border-2 border-white/20"
          />
          <text className="text-2xl font-bold text-white mt-4">{mockUser.displayName}</text>
          <text className="text-white/50 text-sm mt-1">{mockUser.npub}</text>

          <view className="flex flex-row items-center justify-center gap-8 mt-4">
            <Stat label="Posts" value="1.2K" />
            <Stat label="Followers" value="4.5K" />
            <Stat label="Following" value="342" />
          </view>

          <view className="flex flex-row gap-3 mt-4 w-full px-4">
            <view className="flex-1 bg-white py-2 rounded-full flex items-center justify-center">
              <text className="text-black font-semibold text-sm">Follow</text>
            </view>
            <view className="flex-1 bg-white/10 py-2 rounded-full flex items-center justify-center" bindtap={() => go('newchat')}>
              <text className="text-white font-semibold text-sm">Message</text>
            </view>
          </view>
        </view>

        {/* Tab Bar */}
        <view className="flex flex-row border-b border-white/10">
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
          {activeTab === 'Posts' &&
            mockPosts.map((post) => (
              <PostCard
                key={post.id}
                name={post.name}
                pubkey={post.pubkey}
                content={post.content}
                createdAt={post.createdAt}
                picture={post.picture}
              />
            ))}

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

root.render(<Page />);
