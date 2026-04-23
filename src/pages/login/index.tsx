// Original: /root/code/nuts-cash/src/routes/login.svelte
import { root } from '@lynx-js/react';
import { view, text } from '@lynx-js/react';

import { useState } from 'react';
import { goBack } from '../../lib/navigation.js';

function Page() {
  const [privateKey, setPrivateKey] = useState('');
  const [pubkeyInput, setPubkeyInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [kind, setKind] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!privateKey) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      goBack();
    }, 800);
  };

  const handlePubkeyLogin = () => {
    if (!pubkeyInput) return;
    goBack();
  };

  return (
    <scroll-view className="mobile-height bg-basic">
      <view className="min-h-screen px-4 py-8 flex flex-col">
        <view className="flex items-center justify-between mb-8">
          <text className="text-white text-xl font-bold">Login</text>
          <view bindtap={() => goBack()}>
            <text className="text-white/60 text-lg">✕</text>
          </view>
        </view>

        {kind === 'login' ? (
          <view className="space-y-4 flex-1">
            <view className="w-full rounded-xl bg-accent/10 border border-accent/30 p-4 flex flex-row items-center gap-3">
              <view className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <text className="text-accent text-xl">📷</text>
              </view>
              <view className="flex-1">
                <text className="text-white font-medium">Scan with phone</text>
                <text className="text-white/40 text-sm">Use a Nostr signer app</text>
              </view>
              <text className="text-white/30 text-xl">›</text>
            </view>

            <view className="relative py-2">
              <view className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
              <view className="flex justify-center">
                <text className="bg-[#131716] px-4 text-xs text-white/30 uppercase">or</text>
              </view>
            </view>

            <view className="space-y-3">
              <view className="relative">
                <text className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔑</text>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="nsec or bunker url"
                  value={privateKey}
                  onChange={(e) => setPrivateKey((e.target as any).value)}
                  className="w-full pl-11 pr-20 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none"
                />
                <view
                  className="absolute right-12 top-1/2 -translate-y-1/2 p-2"
                  bindtap={() => setShowPassword(!showPassword)}
                >
                  <text className="text-white/30">{showPassword ? '🙈' : '👁'}</text>
                </view>
                {privateKey && (
                  <view
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
                    bindtap={() => setPrivateKey('')}
                  >
                    <text className="text-white/30">✕</text>
                  </view>
                )}
              </view>

              <view
                className={`w-full py-4 rounded-xl bg-accent flex items-center justify-center gap-2 ${loading || !privateKey ? 'opacity-50' : ''}`}
                bindtap={handleLogin}
              >
                <text className="text-white font-semibold text-lg">
                  {loading ? 'Signing in...' : 'Sign In'}
                </text>
              </view>
            </view>

            <view className="relative py-2">
              <view className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
              <view className="flex justify-center">
                <text className="bg-[#131716] px-4 text-xs text-white/30 uppercase">read-only</text>
              </view>
            </view>

            <view className="space-y-3">
              <view className="relative">
                <text className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">👁</text>
                <input
                  type="text"
                  placeholder="npub or hex pubkey"
                  value={pubkeyInput}
                  onChange={(e) => setPubkeyInput((e.target as any).value)}
                  className="w-full pl-11 pr-10 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none"
                />
                {pubkeyInput && (
                  <view
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
                    bindtap={() => setPubkeyInput('')}
                  >
                    <text className="text-white/30">✕</text>
                  </view>
                )}
              </view>

              <view
                className={`w-full py-3 rounded-xl bg-white/10 flex items-center justify-center gap-2 ${!pubkeyInput ? 'opacity-50' : ''}`}
                bindtap={handlePubkeyLogin}
              >
                <text className="text-white font-medium">Read-Only Access</text>
              </view>
            </view>

            <view className="text-center pt-4">
              <text className="text-sm text-white/40">Not on Nostr yet? </text>
              <text
                className="text-accent font-medium"
                bindtap={() => setKind('signup')}
              >
                Create account
              </text>
            </view>
          </view>
        ) : (
          <view className="space-y-4 flex-1">
            <text className="text-white text-lg font-semibold">Create Account</text>
            <input
              type="text"
              placeholder="yourname"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none"
            />
            <view
              className="w-full py-3 rounded-xl bg-accent flex items-center justify-center"
              bindtap={() => setKind('login')}
            >
              <text className="text-white font-semibold">Create Account</text>
            </view>
            <view className="text-center pt-4">
              <text className="text-sm text-white/40">Already have an account? </text>
              <text
                className="text-accent font-medium"
                bindtap={() => setKind('login')}
              >
                Sign in
              </text>
            </view>
          </view>
        )}
      </view>
    </scroll-view>
  );
}

root.render(<Page />);
