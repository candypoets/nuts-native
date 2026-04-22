// Original: /root/code/nuts-cash/src/routes/modals/_profile/keys.svelte
import { root } from '@lynx-js/react';
import { view, text, image } from '@lynx-js/react';
import { useState } from 'react';
import { PageShell } from '../../components/PageShell.js';
import { useStores } from '../../stores/StoreContext.js';

function Page() {
  const { key, kind0 } = useStores();
  const [copied, setCopied] = useState('');

  function copyToClipboard(value: string) {
    try {
      if (typeof (globalThis as any).lynxClipboard !== 'undefined') {
        (globalThis as any).lynxClipboard.writeText(value);
      }
    } catch {
      // ignore
    }
    setCopied(value);
    setTimeout(() => setCopied(''), 2000);
  }

  const profilePicture = kind0?.parsed?.picture || 'asset:///miss-profile.png';
  const pubKey = key?.pub || '';
  const privKey = key?.priv || '';
  const nsec = key?.nsec || '';

  return (
    <PageShell title="Keys">
      <view className="flex flex-col">
        <text className="text-white/80 text-sm mb-2">Your public key</text>
        <view className="flex flex-row p-4 bg-white/10 my-2 rounded-xl items-center">
          <view className="w-1/5">
            <image
              src={profilePicture}
              className="w-10 h-10 rounded-full border-2 border-white/20"
            />
          </view>
          <text className="w-4/5 text-xs text-white break-all">{pubKey}</text>
        </view>
        <view
          className="w-full py-3 px-4 rounded-xl flex flex-row items-center justify-center bg-primary"
          bindtap={() => copyToClipboard(pubKey)}
        >
          <text className="text-white font-medium">
            {copied === pubKey ? '✅ Copied' : '📋 Copy public key'}
          </text>
        </view>
        <text className="text-xs mt-4 text-white/60">
          Anyone on Nostr can find you via your public key. Feel free to share it with others.
        </text>

        <text className="text-white/80 text-sm mt-8 mb-2">Your private key</text>
        <view className="flex flex-row p-4 bg-white/10 my-2 rounded-xl items-center">
          <view className="w-1/5">
            <text className="text-4xl">🔑</text>
          </view>
          <text className="w-4/5 text-xs text-white break-all">
            {'•'.repeat(privKey.length || 0)}
          </text>
        </view>
        <view
          className="w-full py-3 px-4 rounded-xl flex flex-row items-center justify-center bg-yellow-600"
          bindtap={() => copyToClipboard(nsec)}
        >
          <text className="text-white font-medium">
            {copied === nsec ? '✅ Copied' : '📋 Copy private key'}
          </text>
        </view>
        <text className="text-xs mt-4 text-yellow-400">
          Warning: Keep your private key secret. Anyone with your private key can access your account.
        </text>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
