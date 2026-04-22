// Original: /root/code/nuts-cash/src/routes/chat/index.svelte (Chat tab content)
// Note: See also src/routes/chat/empty.svelte for empty state
import { view, text, scrollView, image, input } from '@lynx-js/react';
import { useState } from 'react';
import { go, goSub, goModal } from '../../lib/navigation.js';


type ChatListTab = 'messages' | 'requests' | 'groups';

const MOCK_CHATS = [
  { id: '1', name: 'Alice', preview: 'Hey, are we still on for later?', time: '2m' },
  { id: '2', name: 'Bob', preview: 'Sent you the invoice ⚡', time: '1h' },
  { id: '3', name: 'Carol', preview: 'Thanks for the zap!', time: '3h' },
];

function EmptyState() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [valid, setValid] = useState(false);

  function validate(v: string) {
    const trimmed = v.trim();
    setError('');
    setValid(false);

    if (!trimmed) return;

    if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
      setValid(true);
      return;
    }

    if (trimmed.startsWith('npub1') && trimmed.length >= 60) {
      setValid(true);
      return;
    }
    if (trimmed.startsWith('nprofile1') && trimmed.length >= 20) {
      setValid(true);
      return;
    }
    setError('Invalid npub or hex pubkey.');
  }

  function submit() {
    if (!valid) return;
    go('newchat');
  }

  return (
    <view className="mx-4 bg-base-300 bg-opacity-85 rounded-xl p-6 shadow-widget">
      <view className="flex flex-col items-center text-center">
        <view className="mb-3">
          <view className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-base-200 text-primary">
            <text className="text-3xl">💬</text>
          </view>
        </view>

        <text className="text-2xl font-semibold mb-2 text-white">Start a Blurred Chat</text>
        <text className="text-white/70 max-w-prose mb-4 text-sm">
          End‑to‑end encrypted DMs on Nostr. Others may see who you're talking to, but never what you say.
        </text>

        <view className="w-full max-w-xl">
          <text className="text-white/80 text-sm">Paste an npub, nprofile, or hex pubkey</text>
          <input
            className="w-full mt-1 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 outline-none"
            placeholder="npub1..."
            value={value}
            onChange={(e: any) => {
              const v = (e.target as any).value ?? '';
              setValue(v);
              validate(v);
            }}
            onKeyDown={(e: any) => (e as any).key === 'Enter' && submit()}
            autoComplete="off"
            spellCheck={false}
            inputMode="latin"
          />

          {error && (
            <text className="text-error text-sm mt-2">{error}</text>
          )}

          <view
            className={`w-full mt-3 py-3 rounded-xl flex items-center justify-center ${valid ? 'bg-primary' : 'bg-white/20'}`}
            bindtap={submit}
          >
            <text className="text-lg mr-2">＋</text>
            <text className="text-white font-medium">Start a new chat</text>
          </view>

          <view
            className="w-full mt-2 py-3 rounded-xl flex items-center justify-center"
            bindtap={() => go('followlists')}
          >
            <text className="text-white/80 text-sm">Find people to chat with</text>
          </view>
        </view>
      </view>
    </view>
  );
}

function ChatRow({ name, preview, time }: { name: string; preview: string; time: string }) {
  return (
    <view
      className="flex gap-3 h-20 overflow-hidden py-3 px-4 bg-base-300 bg-opacity-85 rounded-lg mt-2"
      bindtap={() => go('chat')}
    >
      <view className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
        <text className="text-xl">👤</text>
      </view>
      <view className="flex-1 min-w-0">
        <view className="flex justify-between items-center">
          <text className="text-white font-medium truncate">{name}</text>
          <text className="text-xs text-white/50 flex-shrink-0 ml-2">{time}</text>
        </view>
        <text className="text-sm text-white/60 truncate mt-1">{preview}</text>
      </view>
    </view>
  );
}

export function ChatView() {
  const [activeTab, setActiveTab] = useState<ChatListTab>('messages');

  const hasItems = activeTab === 'messages'; // mock: only messages tab has items

  return (
    <view className="flex-1 bg-base-300 bg-opacity-85 flex flex-col">
      {/* Header */}
      <view className="flex justify-between h-16 items-center px-4 pt-4 border-b border-white/10">
        <text className="text-2xl font-semibold text-white">Chat</text>
        <view className="flex gap-3 items-center">
          <view bindtap={() => go('newchat')}>
            <text className="text-2xl">＋</text>
          </view>
          <view bindtap={() => go('profile')}>
            <image
              src="asset:///miss-profile.png"
              className="w-8 h-8 rounded-full border border-white/20"
            />
          </view>
        </view>
      </view>

      {/* Tabs */}
      <view className="px-4 py-2">
        <view className="flex rounded-xl bg-base-200 bg-opacity-70 p-1">
          {(['messages', 'requests', 'groups'] as ChatListTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <view
                key={tab}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center ${isActive ? 'bg-base-100' : ''}`}
                bindtap={() => setActiveTab(tab)}
              >
                <text className={`text-sm capitalize ${isActive ? 'text-white font-medium' : 'text-white/70'}`}>
                  {tab}
                </text>
                {tab === 'messages' && (
                  <text className={`text-xs ml-1 px-1.5 py-0.5 rounded-full ${isActive ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}>
                    {MOCK_CHATS.length}
                  </text>
                )}
                {tab === 'requests' && (
                  <text className={`text-xs ml-1 px-1.5 py-0.5 rounded-full ${isActive ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}>
                    0
                  </text>
                )}
                {tab === 'groups' && (
                  <text className={`text-xs ml-1 px-1.5 py-0.5 rounded-full ${isActive ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}>
                    0
                  </text>
                )}
              </view>
            );
          })}
        </view>
      </view>

      {/* Content */}
      <scrollView className="flex-1 px-4 pb-4">
        {!hasItems ? (
          <view className="pt-8">
            <EmptyState />
          </view>
        ) : (
          <view className="pt-2">
            {MOCK_CHATS.map((chat) => (
              <ChatRow key={chat.id} name={chat.name} preview={chat.preview} time={chat.time} />
            ))}
          </view>
        )}
      </scrollView>
    </view>
  );
}
