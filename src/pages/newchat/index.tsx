// Original: /root/code/nuts-cash/src/routes/modals/newchat.svelte
// Note: Also see src/routes/chat/empty.svelte for empty state
import { root, view, text, input } from '@lynx-js/react';
import { useState, useMemo } from 'react';
import { PageShell } from '../../components/PageShell.js';
import { go } from '../../lib/navigation.js';


const SUGGESTED_CONTACTS = [
  { name: 'Contact 1', pubkey: 'a'.repeat(64) },
  { name: 'Contact 2', pubkey: 'b'.repeat(64) },
  { name: 'Contact 3', pubkey: 'c'.repeat(64) },
];

function Page() {
  const [value, setValue] = useState('');

  const { hex, error, valid } = useMemo(() => {
    const v = value.trim();
    if (!v) {
      return { hex: '', error: '', valid: false };
    }

    // Raw hex
    if (/^[0-9a-fA-F]{64}$/.test(v)) {
      return { hex: v.toLowerCase(), error: '', valid: true };
    }

    if (v.startsWith('npub1') && v.length >= 60) {
      return { hex: v, error: '', valid: true };
    }
    if (v.startsWith('nprofile1') && v.length >= 20) {
      return { hex: v, error: '', valid: true };
    }
    return { hex: '', error: 'Invalid npub or hex pubkey.', valid: false };
  }, [value]);

  const handleSubmit = () => {
    if (!valid || !hex) return;
    go('chat');
  };

  return (
    <PageShell title="New Chat">
      <view className="flex flex-col items-center py-6">
        {/* Start a Blurred Chat card */}
        <view className="w-full bg-white/5 rounded-2xl p-6 border border-white/10">
          <view className="flex flex-col items-center text-center">
            <view className="mb-4 w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <text className="text-3xl">💬</text>
            </view>

            <text className="text-white text-xl font-semibold mb-2">
              Start a Blurred Chat
            </text>
            <text className="text-white/60 text-sm mb-6 max-w-xs">
              End-to-end encrypted DMs on Nostr. Others may see who you're talking to, but never what you say.
            </text>

            <view className="w-full">
              <text className="text-white/40 text-xs mb-2">
                Paste an npub, nprofile, or hex pubkey
              </text>
              <input
                type="text"
                placeholder="npub1..."
                value={value}
                onChange={(e: any) => setValue((e.target as any).value)}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
                autoComplete="off"
                spellCheck={false}
                inputMode="latin"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none"
              />

              {error ? (
                <text className="text-[#ff5861] text-xs mt-2">{error}</text>
              ) : valid ? (
                <text className="text-[#00a96e] text-xs mt-2">Valid pubkey</text>
              ) : null}

              <view
                className={`w-full py-3 rounded-xl mt-4 flex items-center justify-center gap-2 ${valid ? 'bg-[#1fb092]' : 'bg-white/10 opacity-50'}`}
                bindtap={handleSubmit}
              >
                <text className="text-white font-semibold">Start a new chat</text>
              </view>

              <view
                className="w-full py-3 rounded-xl mt-3 flex items-center justify-center border border-white/10"
                bindtap={() => go('explore')}
              >
                <text className="text-white/70 font-medium">Find people to chat with</text>
              </view>
            </view>
          </view>
        </view>

        {/* Suggested contacts */}
        <view className="w-full mt-8">
          <text className="text-white/40 text-xs uppercase mb-3">Suggested contacts</text>
          <view className="space-y-2">
            {SUGGESTED_CONTACTS.map((contact) => (
              <view
                key={contact.pubkey}
                className="w-full flex flex-row items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                bindtap={() => go('chat')}
              >
                <view className="flex flex-row items-center gap-3">
                  <view className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <text className="text-sm">👤</text>
                  </view>
                  <view>
                    <text className="text-white font-medium">{contact.name}</text>
                    <text className="text-white/40 text-xs">
                      {contact.pubkey.slice(0, 8)}...{contact.pubkey.slice(-8)}
                    </text>
                  </view>
                </view>
                <view className="px-3 py-1.5 rounded-lg bg-white/10">
                  <text className="text-white/80 text-sm">Message</text>
                </view>
              </view>
            ))}
          </view>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
