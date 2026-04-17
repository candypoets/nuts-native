import { root, view, text, image, scrollView } from '@lynx-js/react';
import { useState } from 'react';
import '../../app.css';
import { PageShell } from '../../components/PageShell.js';
import { go } from '../../lib/navigation.js';

type ChatTab = 'messages' | 'requests' | 'groups';

const PLACEHOLDER_CHATS = [
  {
    id: '1',
    name: 'Alice',
    message: 'Hey, are we still on for later?',
    time: '2m',
    avatar: 'asset:///miss-profile.png',
  },
  {
    id: '2',
    name: 'Bob',
    message: 'Sent you the invoice ⚡',
    time: '1h',
    avatar: 'asset:///miss-profile.png',
  },
  {
    id: '3',
    name: 'Nostr Devs',
    message: 'New release is out!',
    time: '3h',
    avatar: 'asset:///miss-profile.png',
  },
];

function Page() {
  const [activeTab, setActiveTab] = useState<ChatTab>('messages');

  const tabs: { key: ChatTab; label: string; count: number }[] = [
    { key: 'messages', label: 'Messages', count: 2 },
    { key: 'requests', label: 'Requests', count: 0 },
    { key: 'groups', label: 'Groups', count: 1 },
  ];

  return (
    <PageShell
      title="Chat"
      rightAction={
        <view bindtap={() => go('newchat')}>
          <text className="text-white text-xl">＋</text>
        </view>
      }
    >
      <view className="flex flex-col flex-1 -mx-4 -mt-4">
        {/* Tabs */}
        <view className="flex flex-row px-4 pt-4 pb-2 border-b border-white/10 bg-basic">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <view
                key={tab.key}
                className={`flex-1 py-2 rounded-lg flex flex-row items-center justify-center ${
                  isActive ? 'bg-white/10' : ''
                }`}
                bindtap={() => setActiveTab(tab.key)}
              >
                <text
                  className={`text-sm font-medium ${
                    isActive ? 'text-white' : 'text-white/60'
                  }`}
                >
                  {tab.label}
                </text>
                <view
                  className={`ml-1 px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-white/10'
                  }`}
                >
                  <text className="text-xs text-white/80">{tab.count}</text>
                </view>
              </view>
            );
          })}
        </view>

        {/* Chat list */}
        <scrollView className="flex-1">
          <view className="px-4 py-2">
            {PLACEHOLDER_CHATS.map((chat) => (
              <view
                key={chat.id}
                className="flex flex-row items-center gap-3 py-3 border-b border-white/5"
                bindtap={() => go('chat')}
              >
                <image
                  src={chat.avatar}
                  className="w-12 h-12 rounded-full border border-white/10"
                />
                <view className="flex-1 min-w-0">
                  <view className="flex flex-row items-center justify-between">
                    <text className="text-white font-semibold text-base">
                      {chat.name}
                    </text>
                    <text className="text-white/40 text-xs">{chat.time}</text>
                  </view>
                  <text className="text-white/60 text-sm mt-0.5 truncate">
                    {chat.message}
                  </text>
                </view>
              </view>
            ))}
          </view>
        </scrollView>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
